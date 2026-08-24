# -*- coding: utf-8 -*-
"""
Archive legacy root categories that have no subcategories and no products.

These are leftovers from the first import (e.g. "Толгойн хамгаалалт",
"Хөлийн хамгаалалт") that now duplicate the proper tree under
"Хамгаалах хэрэгсэл" etc. Archiving (active=False) hides them from the
storefront API but keeps them recoverable in Odoo (Filters -> Archived).

Run via:  archive_empty_categories.cmd
"""

Cat = env["safety.catalog.category"]
Product = env["product.template"]

roots = Cat.search([("parent_id", "=", False)])
archived = []
kept = []

for c in roots:
    if c.child_ids:
        kept.append(c.name)
        continue
    n = Product.search_count([("storefront_categ_ids", "child_of", c.id)])
    if n == 0:
        c.active = False
        archived.append(c.name)
    else:
        kept.append("%s (%s бараатай)" % (c.name, n))

print("=== Архивласан (%s) ===" % len(archived))
for name in archived:
    print("  -", name)
print("=== Үлдээсэн (%s) ===" % len(kept))
for name in kept:
    print("  -", name)

env.cr.commit()
