# -*- coding: utf-8 -*-
"""QPay v2 payment endpoints for the storefront.

Configuration (Settings > Technical > System Parameters):
    qpay.username       - merchant username from QPay contract
    qpay.password       - merchant password
    qpay.invoice_code   - invoice code (e.g. MANADA_INVOICE)
    qpay.base_url       - optional, defaults to https://merchant.qpay.mn/v2
                          (sandbox: https://merchant-sandbox.qpay.mn/v2)
    qpay.callback_base  - optional, public https URL of this Odoo for callbacks

While the parameters are empty the /status endpoint reports disabled and
the storefront hides the QPay payment option entirely.
"""
import json
import logging

import requests

from odoo import http
from odoo.http import request

_logger = logging.getLogger(__name__)

TIMEOUT = 20


def _param(key, default=""):
    return request.env["ir.config_parameter"].sudo().get_param(key, default) or default


def _norm_phone(s):
    return "".join(ch for ch in (s or "") if ch.isdigit())[-8:]


def _json_body():
    try:
        return json.loads(request.httprequest.data or b"{}")
    except (ValueError, TypeError):
        return None


class SafetyPaymentsAPI(http.Controller):

    # ---------------- helpers ----------------
    def _conf(self):
        return {
            "base": _param("qpay.base_url", "https://merchant.qpay.mn/v2").rstrip("/"),
            "username": _param("qpay.username"),
            "password": _param("qpay.password"),
            "invoice_code": _param("qpay.invoice_code"),
            "callback_base": _param("qpay.callback_base").rstrip("/"),
        }

    def _enabled(self, c):
        return bool(c["username"] and c["password"] and c["invoice_code"])

    def _token(self, c):
        r = requests.post(
            c["base"] + "/auth/token",
            auth=(c["username"], c["password"]),
            timeout=TIMEOUT,
        )
        r.raise_for_status()
        return r.json().get("access_token")

    def _find_order(self, data):
        """Return (order, error_response). Verifies phone ownership."""
        phone = _norm_phone((data or {}).get("phone"))
        order_name = ((data or {}).get("order_name") or "").strip()
        if not phone or not order_name:
            return None, request.make_json_response(
                {"error": {"code": "missing_fields",
                           "message": "phone, order_name are required"}}, status=400)
        order = request.env["sale.order"].sudo().search(
            [("name", "=ilike", order_name)], limit=1)
        if not order or _norm_phone(order.partner_id.phone) != phone:
            return None, request.make_json_response(
                {"error": {"code": "not_found", "message": "Order not found"}},
                status=404)
        return order, None

    # ---------------- endpoints ----------------
    @http.route("/api/v1/payments/qpay/status", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def qpay_status(self, **kw):
        return request.make_json_response({"enabled": self._enabled(self._conf())})

    @http.route("/api/v1/payments/qpay/invoice", type="http", auth="public",
                methods=["POST", "OPTIONS"], csrf=False, cors="*")
    def qpay_invoice(self, **kw):
        if request.httprequest.method == "OPTIONS":
            return request.make_json_response({})
        c = self._conf()
        if not self._enabled(c):
            return request.make_json_response(
                {"error": {"code": "disabled",
                           "message": "QPay is not configured"}}, status=503)
        data = _json_body()
        order, err = self._find_order(data)
        if err:
            return err
        if order.state == "cancel":
            return request.make_json_response(
                {"error": {"code": "cancelled", "message": "Order is cancelled"}},
                status=400)

        try:
            token = self._token(c)
            payload = {
                "invoice_code": c["invoice_code"],
                "sender_invoice_no": order.name,
                "invoice_receiver_code": _norm_phone(order.partner_id.phone) or "storefront",
                "invoice_description": "Manada Safety %s" % order.name,
                "amount": float(order.amount_total),
            }
            if c["callback_base"]:
                payload["callback_url"] = (
                    "%s/api/v1/payments/qpay/callback?order=%s"
                    % (c["callback_base"], order.name))
            r = requests.post(
                c["base"] + "/invoice",
                json=payload,
                headers={"Authorization": "Bearer %s" % token},
                timeout=TIMEOUT,
            )
            r.raise_for_status()
            inv = r.json()
        except requests.RequestException as e:
            _logger.warning("QPay invoice failed for %s: %s", order.name, e)
            return request.make_json_response(
                {"error": {"code": "qpay_error",
                           "message": "QPay холболт амжилтгүй. Дараа дахин оролдоно уу."}},
                status=502)

        order.qpay_invoice_id = inv.get("invoice_id") or ""
        return request.make_json_response({
            "ok": True,
            "invoice_id": inv.get("invoice_id"),
            "qr_text": inv.get("qr_text") or "",
            "qr_image": inv.get("qr_image") or "",
            "short_url": inv.get("qPay_shortUrl") or "",
            "urls": inv.get("urls") or [],
            "amount": int(order.amount_total),
        })

    @http.route("/api/v1/payments/qpay/check", type="http", auth="public",
                methods=["POST", "OPTIONS"], csrf=False, cors="*")
    def qpay_check(self, **kw):
        if request.httprequest.method == "OPTIONS":
            return request.make_json_response({})
        c = self._conf()
        if not self._enabled(c):
            return request.make_json_response(
                {"error": {"code": "disabled",
                           "message": "QPay is not configured"}}, status=503)
        data = _json_body()
        order, err = self._find_order(data)
        if err:
            return err
        if not order.qpay_invoice_id:
            return request.make_json_response(
                {"error": {"code": "no_invoice",
                           "message": "No QPay invoice for this order"}}, status=400)
        if order.storefront_paid:
            return request.make_json_response({"ok": True, "paid": True})

        try:
            token = self._token(c)
            r = requests.post(
                c["base"] + "/payment/check",
                json={
                    "object_type": "INVOICE",
                    "object_id": order.qpay_invoice_id,
                    "offset": {"page_number": 1, "page_limit": 100},
                },
                headers={"Authorization": "Bearer %s" % token},
                timeout=TIMEOUT,
            )
            r.raise_for_status()
            res = r.json()
        except requests.RequestException as e:
            _logger.warning("QPay check failed for %s: %s", order.name, e)
            return request.make_json_response(
                {"error": {"code": "qpay_error",
                           "message": "QPay холболт амжилтгүй."}}, status=502)

        paid_amount = float(res.get("paid_amount") or 0)
        paid = paid_amount >= float(order.amount_total) - 0.01
        if paid:
            self._mark_paid(order)
        return request.make_json_response({"ok": True, "paid": paid, "paid_amount": int(paid_amount)})

    @http.route("/api/v1/payments/qpay/callback", type="http", auth="public",
                methods=["GET", "POST"], csrf=False, cors="*")
    def qpay_callback(self, **kw):
        """Called by QPay when an invoice is paid (requires public URL)."""
        order_name = (kw.get("order") or "").strip()
        if order_name:
            order = request.env["sale.order"].sudo().search(
                [("name", "=ilike", order_name)], limit=1)
            if order and order.qpay_invoice_id and not order.storefront_paid:
                # Verify with QPay before trusting the callback.
                c = self._conf()
                try:
                    token = self._token(c)
                    r = requests.post(
                        c["base"] + "/payment/check",
                        json={"object_type": "INVOICE",
                              "object_id": order.qpay_invoice_id,
                              "offset": {"page_number": 1, "page_limit": 100}},
                        headers={"Authorization": "Bearer %s" % token},
                        timeout=TIMEOUT,
                    )
                    r.raise_for_status()
                    paid_amount = float(r.json().get("paid_amount") or 0)
                    if paid_amount >= float(order.amount_total) - 0.01:
                        self._mark_paid(order)
                except requests.RequestException as e:
                    _logger.warning("QPay callback verify failed %s: %s", order_name, e)
        return request.make_response("SUCCESS", headers=[("Content-Type", "text/plain")])

    def _mark_paid(self, order):
        order.storefront_paid = True
        if order.state in ("draft", "sent"):
            try:
                order.action_confirm()
            except Exception as e:  # noqa: BLE001
                _logger.warning("Order %s confirm failed after payment: %s", order.name, e)
        order.message_post(body="QPay төлбөр төлөгдсөн (storefront).")
