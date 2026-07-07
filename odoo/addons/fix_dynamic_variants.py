# -*- coding: utf-8 -*-
"""Dynamic горимтой attribute-уудыг 'always' болгож, вариантуудыг үүсгээд,
зурагтай бараануудад үлдэгдэл тавина."""
QTY = 20

Attr = env["product.attribute"]
dyn = Attr.search([("create_variant", "=", "dynamic")])
print("Dynamic attribute-ууд:", dyn.mapped("name") or "байхгүй")
if dyn:
    # ORM нь ашиглагдаж буй attribute-ийн горимыг өөрчлөхийг хориглодог тул
    # нэг удаагийн дата засварыг SQL-ээр хийнэ.
    env.cr.execute(
        "UPDATE product_attribute SET create_variant = 'always' WHERE id IN %s",
        [tuple(dyn.ids)])
    env.invalidate_all()
    print("-> 'always' болгож өөрчлөв")

wh = env.ref("stock.warehouse0", raise_if_not_found=False)
loc = wh.lot_stock_id if wh else env["stock.location"].search([("usage", "=", "internal")], limit=1)
Quant = env["stock.quant"].with_context(inventory_mode=True)

templates = env["product.template"].search([("storefront_published", "=", True)])
created, stocked, broken = 0, 0, []
for t in templates:
    if not t.product_variant_ids:
        t._create_variant_ids()
        if t.product_variant_ids:
            created += len(t.product_variant_ids)
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
print("Shineer uusgesen variant:", created)
print("Uldegdel tavisan variant:", stocked)
if broken:
    print("ZASAGDAAGUI:", ", ".join(broken))
else:
    print("Bukh baraa zasagdlaa")
print("=" * 50)
