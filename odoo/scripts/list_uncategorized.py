# -*- coding: utf-8 -*-
"""
Вэб ангилал оноогоогүй ("Goods"-д үлдсэн) бараануудыг жагсаах.

Ажиллуулах:
    docker compose -f deploy/docker-compose.prod.yml exec -T odoo \
        odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < odoo/scripts/list_uncategorized.py
"""

Product = env["product.template"]
missing = Product.search([("storefront_categ_ids", "=", False)], order="name")
print("=" * 50)
print("ВЭБ АНГИЛАЛГҮЙ БАРАА:", len(missing))
print("=" * 50)
for i, p in enumerate(missing, 1):
    pub = "нийтэлсэн" if p.storefront_published else "нийтлээгүй"
    print("%2d. %-45s [%s]" % (i, (p.name or "")[:45], pub))
print("=" * 50)
print("Эдгээрт Storefront таб -> Storefront Categories оноовол")
print("native ангилал автоматаар зөв руу шилжинэ.")
