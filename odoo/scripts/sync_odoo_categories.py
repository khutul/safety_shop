# -*- coding: utf-8 -*-
"""
Одоо байгаа бараануудын native Odoo ангиллыг вэб ангилалтай нь тааруулах.

Ажиллуулах:
    docker compose -f deploy/docker-compose.prod.yml exec -T odoo \
        odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < odoo/scripts/sync_odoo_categories.py
"""

Product = env["product.template"]
tmpls = Product.search([("storefront_categ_ids", "!=", False)])
print("Синк хийх бараа:", len(tmpls))

done = 0
for p in tmpls:
    before = p.categ_id.display_name
    p._sync_odoo_categ()
    after = p.categ_id.display_name
    if before != after:
        done += 1
        print("  %s: %s -> %s" % (p.name[:40], before, after))

env.cr.commit()
print("Шинэчилсэн:", done, "/", len(tmpls))
