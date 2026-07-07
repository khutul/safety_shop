# -*- coding: utf-8 -*-
"""
Mark every storefront product as inventory-tracked (storable).

Run via:  set_storable.cmd
"""

Prod = env["product.template"].with_context(active_test=False)  # noqa: F821
products = Prod.search([])

# Odoo 17.4+ uses the `is_storable` boolean; older versions use type='product'.
use_is_storable = "is_storable" in Prod._fields

changed = 0
for p in products:
    if use_is_storable:
        if not p.is_storable:
            p.is_storable = True
            changed += 1
    else:
        if p.type != "product":
            p.type = "product"
            changed += 1

env.cr.commit()  # noqa: F821
print("Нийт бараа: %s, Track Inventory болгосон: %s" % (len(products), changed))
