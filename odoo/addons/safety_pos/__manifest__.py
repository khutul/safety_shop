# -*- coding: utf-8 -*-
{
    "name": "Safety POS",
    "summary": "Point of Sale integration for the Manada storefront catalog.",
    "description": """
Safety POS
==========
Connects the storefront catalog to Odoo Point of Sale:
* storefront products are made available in POS,
* storefront categories are mirrored to POS categories,
so the shop (offline) and the website sell from the same products and stock.
""",
    "version": "19.0.1.0.0",
    "category": "Sales/Point of Sale",
    "author": "safety_shop",
    "license": "LGPL-3",
    "depends": ["point_of_sale", "safety_catalog"],
    "data": [
        "data/safety_pos_actions.xml",
    ],
    "installable": True,
    "application": False,
    "auto_install": False,
}
