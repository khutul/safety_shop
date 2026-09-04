# -*- coding: utf-8 -*-
{
    "name": "Safety Catalog",
    "summary": "Foundation module for the safety_shop PPE product catalog.",
    "description": """
Safety Catalog
==============
Foundation module for the safety_shop PPE platform.

Provides the storefront product taxonomy (Storefront Category) and product
brands used by the headless Next.js frontend, and links them to products.
Future catalog extensions (product gallery, documents, features) will build
on this module.
""",
    "version": "19.0.1.1.0",
    "category": "Inventory/Inventory",
    "author": "safety_shop",
    "website": "https://manada.mn",
    "license": "LGPL-3",
    "depends": ["product", "stock"],
    "data": [
        "security/ir.model.access.csv",
        "views/safety_catalog_category_views.xml",
        "views/safety_catalog_brand_views.xml",
        "views/product_template_views.xml",
        "data/safety_catalog_category_data.xml",
        "data/safety_site_data.xml",
        "data/safety_site_industry_data.xml",
        "views/safety_site_views.xml",
        "views/safety_site_industry_views.xml",
        "views/safety_partner_request_views.xml",
        "views/safety_stock_count_views.xml",
        "data/safety_catalog_sync.xml",
    ],
    "installable": True,
    "application": False,
    "auto_install": False,
}
