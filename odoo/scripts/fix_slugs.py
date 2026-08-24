# -*- coding: utf-8 -*-
"""
Бүх барааны URL slug-ийг цэвэрлэх (зай/том үсэг -> зураас, жижиг үсэг).
Зай бүхий slug нь дэлгэрэнгүй хуудсыг 404 болгодог.

Ажиллуулах:
    docker compose -f deploy/docker-compose.prod.yml exec -T odoo \
        odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < odoo/scripts/fix_slugs.py
"""

Product = env["product.template"]
prods = Product.search([])
print("Нийт бараа:", len(prods))

fixed = 0
for p in prods:
    before = p.slug or ""
    p._normalize_slug()
    if (p.slug or "") != before:
        fixed += 1
        print("  %-45s  %r -> %r" % ((p.name or "")[:45], before, p.slug))

env.cr.commit()
print("Зассан slug:", fixed, "/", len(prods))
