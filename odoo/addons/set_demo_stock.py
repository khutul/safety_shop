# -*- coding: utf-8 -*-
"""Вэбд нийтлэгдсэн, зурагтай бүх бараанд туршилтын үлдэгдэл тавина.
Ажиллуулах (CMD, D:\safety_shop\odoo дотор):
  docker compose exec -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http < addons\set_demo_stock.py
PowerShell бол:
  Get-Content addons\set_demo_stock.py | docker compose exec -T odoo odoo shell -c /etc/odoo/odoo.conf -d safety_shop --no-http
"""
QTY = 20          # тавих үлдэгдэл (вариант тус бүрд)
ONLY_WITH_IMAGE = True   # False болговол зураггүй бараанд ч тавина

wh = env.ref("stock.warehouse0", raise_if_not_found=False)
loc = wh.lot_stock_id if wh else env["stock.location"].search(
    [("usage", "=", "internal")], limit=1)
Quant = env["stock.quant"].with_context(inventory_mode=True)

templates = env["product.template"].search([("storefront_published", "=", True)])
updated, skipped = 0, 0
for t in templates:
    if ONLY_WITH_IMAGE and not t.image_1920:
        skipped += 1
        continue
    if t.type != "consu":       # зөвхөн бараа (үйлчилгээ биш)
        skipped += 1
        continue
    if not t.is_storable:       # Track Inventory-г асаана
        t.is_storable = True
    for v in t.product_variant_ids:
        if v.qty_available > 0:  # аль хэдийн үлдэгдэлтэйг өөрчлөхгүй
            continue
        q = Quant.search([("product_id", "=", v.id), ("location_id", "=", loc.id)], limit=1)
        if not q:
            q = Quant.create({"product_id": v.id, "location_id": loc.id})
        q.inventory_quantity = QTY
        q.action_apply_inventory()
        updated += 1

env.cr.commit()
print("=" * 50)
print("Үлдэгдэл тавьсан вариант:", updated)
print("Алгассан бараа (зураггүй/үйлчилгээ):", skipped)
print("=" * 50)
