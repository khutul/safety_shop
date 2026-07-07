# -*- coding: utf-8 -*-
"""Вариантгүй бараануудыг засна: архивлагдсаныг сэргээх эсвэл шинээр үүсгэх,
дараа нь зурагтай бараануудад үлдэгдэл тавина."""
QTY = 20

wh = env.ref("stock.warehouse0", raise_if_not_found=False)
loc = wh.lot_stock_id if wh else env["stock.location"].search([("usage", "=", "internal")], limit=1)
Quant = env["stock.quant"].with_context(inventory_mode=True)
Variant = env["product.product"].with_context(active_test=False)

templates = env["product.template"].search([("storefront_published", "=", True)])
revived, created, stocked, broken = 0, 0, 0, []
for t in templates:
    if not t.product_variant_ids:
        archived = Variant.search([("product_tmpl_id", "=", t.id), ("active", "=", False)])
        if archived:
            archived.action_unarchive()
            revived += len(archived)
            print("Сэргээв:", t.name, "-", len(archived), "вариант")
        if not t.product_variant_ids:
            t._create_variant_ids()
            if t.product_variant_ids:
                created += len(t.product_variant_ids)
                print("Шинээр үүсгэв:", t.name, "-", len(t.product_variant_ids), "вариант")
            else:
                broken.append(t.name)
                continue
    if not t.is_storable and t.type == "consu":
        t.is_storable = True
    for v in t.product_variant_ids:
        if v.qty_available > 0 or not t.image_1920:
            continue
        q = Quant.search([("product_id", "=", v.id), ("location_id", "=", loc.id)], limit=1)
        if not q:
            q = Quant.create({"product_id": v.id, "location_id": loc.id})
        q.inventory_quantity = QTY
        q.action_apply_inventory()
        stocked += 1

env.cr.commit()
print("=" * 50)
print("Сэргээсэн вариант:", revived)
print("Шинээр үүсгэсэн вариант:", created)
print("Үлдэгдэл тавьсан вариант:", stocked)
if broken:
    print("ЗАСАГДААГҮЙ (гараар үзэх шаардлагатай):", ", ".join(broken))
print("=" * 50)
