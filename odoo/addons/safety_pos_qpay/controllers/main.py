# -*- coding: utf-8 -*-
"""POS-side QPay endpoints.

The cashier's browser (logged-in user) calls these JSON-RPC routes from the
POS payment screen. They wrap the QPay v2 merchant API using the same
credentials as the storefront (System Parameters qpay.*).

    POST /pos/qpay/invoice  {amount, reference}  -> {ok, invoice_id, qr_image, qr_text}
    POST /pos/qpay/check    {invoice_id, amount} -> {ok, paid, paid_amount}
"""
import logging
import time

import requests

from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)
TIMEOUT = 20


def _param(key, default=""):
    return request.env["ir.config_parameter"].sudo().get_param(key, default) or default


def _conf():
    return {
        "base": _param("qpay.base_url", "https://merchant.qpay.mn/v2").rstrip("/"),
        "username": _param("qpay.username"),
        "password": _param("qpay.password"),
        "invoice_code": _param("qpay.invoice_code"),
        "callback_base": _param("qpay.callback_base").rstrip("/"),
    }


def _enabled(c):
    return bool(c["username"] and c["password"] and c["invoice_code"])


def _token(c):
    r = requests.post(
        c["base"] + "/auth/token",
        auth=(c["username"], c["password"]),
        timeout=TIMEOUT,
    )
    r.raise_for_status()
    return r.json().get("access_token")


class PosQpayController(http.Controller):

    @http.route("/pos/qpay/status", type="json", auth="user")
    def status(self, **kw):
        return {"enabled": _enabled(_conf())}

    @http.route("/pos/qpay/invoice", type="json", auth="user")
    def invoice(self, amount=0, reference=None, **kw):
        c = _conf()
        if not _enabled(c):
            return {"ok": False, "error": "QPay тохируулагдаагүй байна."}
        try:
            amount = int(round(float(amount)))
        except (ValueError, TypeError):
            return {"ok": False, "error": "Дүн буруу."}
        if amount <= 0:
            return {"ok": False, "error": "Дүн 0-ээс их байх ёстой."}

        # Unique sender invoice number so each POS attempt is distinct.
        sender = (reference or "POS") + "-" + str(int(time.time()))
        payload = {
            "invoice_code": c["invoice_code"],
            "sender_invoice_no": sender,
            "invoice_receiver_code": "pos",
            "invoice_description": "Manada Safety POS %s" % sender,
            "amount": amount,
        }
        if c["callback_base"]:
            payload["callback_url"] = "%s/pos/qpay/callback?ref=%s" % (c["callback_base"], sender)
        try:
            token = _token(c)
            r = requests.post(
                c["base"] + "/invoice",
                json=payload,
                headers={"Authorization": "Bearer %s" % token},
                timeout=TIMEOUT,
            )
            if r.status_code >= 400:
                _logger.warning("POS QPay invoice HTTP %s: %s", r.status_code, r.text[:400])
                return {"ok": False, "error": "QPay холболт амжилтгүй."}
            inv = r.json()
        except requests.RequestException as e:
            _logger.warning("POS QPay invoice failed: %s", e)
            return {"ok": False, "error": "QPay холболт амжилтгүй."}

        qr_image = inv.get("qr_image") or ""
        # QPay returns base64 without a data-URI prefix; make it <img>-ready.
        if qr_image and not qr_image.startswith("data:"):
            qr_image = "data:image/png;base64," + qr_image
        return {
            "ok": True,
            "invoice_id": inv.get("invoice_id") or "",
            "qr_image": qr_image,
            "qr_text": inv.get("qr_text") or "",
            "short_url": inv.get("qPay_shortUrl") or "",
            "amount": amount,
        }

    @http.route("/pos/qpay/check", type="json", auth="user")
    def check(self, invoice_id=None, amount=0, **kw):
        c = _conf()
        if not _enabled(c):
            return {"ok": False, "error": "QPay тохируулагдаагүй."}
        if not invoice_id:
            return {"ok": False, "error": "invoice_id дутуу."}
        try:
            token = _token(c)
            r = requests.post(
                c["base"] + "/payment/check",
                json={
                    "object_type": "INVOICE",
                    "object_id": invoice_id,
                    "offset": {"page_number": 1, "page_limit": 100},
                },
                headers={"Authorization": "Bearer %s" % token},
                timeout=TIMEOUT,
            )
            r.raise_for_status()
            res = r.json()
        except requests.RequestException as e:
            _logger.warning("POS QPay check failed: %s", e)
            return {"ok": False, "error": "QPay холболт амжилтгүй."}

        paid_amount = float(res.get("paid_amount") or 0)
        paid = paid_amount >= float(amount or 0) - 0.01
        return {"ok": True, "paid": paid, "paid_amount": int(paid_amount)}

    @http.route("/pos/qpay/callback", type="http", auth="public", csrf=False)
    def callback(self, **kw):
        # QPay hits this when paid; POS polling is the source of truth, so just ACK.
        return request.make_response("SUCCESS", headers=[("Content-Type", "text/plain")])
