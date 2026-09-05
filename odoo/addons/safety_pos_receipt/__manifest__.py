# -*- coding: utf-8 -*-
{
    "name": "Safety POS Receipt",
    "summary": "Manada Safety POS receipt tweaks (no logo).",
    "description": """
Safety POS Receipt
==================
Customises the Point of Sale receipt for Manada Safety:
- Removes the company logo from the printed/preview receipt.
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
            "safety_pos_receipt/static/src/receipt_header.xml",
        ],
    },
    "installable": True,
    "application": False,
    "auto_install": False,
}
