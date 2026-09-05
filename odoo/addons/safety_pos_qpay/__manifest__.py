# -*- coding: utf-8 -*-
{
    "name": "Safety POS QPay",
    "summary": "QPay QR payment method for Odoo Point of Sale (dynamic amount).",
    "description": """
Safety POS QPay
===============
Adds a 'QPay (QR)' payment method to the Point of Sale. When the cashier
selects it, a QR code for the exact order amount is generated via the QPay v2
API and shown on screen; the POS polls QPay until the payment is confirmed.

Reuses the QPay merchant credentials configured in System Parameters
(qpay.username / qpay.password / qpay.invoice_code / qpay.base_url).
""",
    "version": "19.0.1.0.0",
    "category": "Point of Sale",
    "author": "safety_shop",
    "website": "https://manada.mn",
    "license": "LGPL-3",
    "depends": ["point_of_sale"],
    "data": [],
    "assets": {
        "point_of_sale._assets_pos": [
            "safety_pos_qpay/static/src/app/payment_qpay.js",
            "safety_pos_qpay/static/src/app/qpay_qr_dialog.js",
            "safety_pos_qpay/static/src/app/qpay_qr_dialog.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
