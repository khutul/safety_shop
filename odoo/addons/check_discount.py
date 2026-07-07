# -*- coding: utf-8 -*-
"""Хямдралын оношилгоо: pricelist олдож буй эсэх, үнэ хэрхэн бодогдож буйг хэвлэнэ."""
print("=" * 60)
pl_ref = env.ref("safety_api.pricelist_storefront", raise_if_not_found=False)
print("1. XML-ID pricelist (safety_api.pricelist_storefront):",
      (pl_ref.id, pl_ref.display_name, "active" if pl_ref.active else "ARCHIVED") if pl_ref else "ОЛДСОНГҮЙ — модуль -u хийгдээгүй")

by_name = env["product.pricelist"].search([("name", "ilike", "Вэб дэлгүүрийн хямдрал")])
print("2. Нэрээр хайлт:", [(p.id, p.name, p.active) for p in by_name] or "ОЛДСОНГҮЙ")

print("3. Бүх pricelist:")
for pl in env["product.pricelist"].with_context(active_test=False).search([]):
    print("   PL", pl.id, repr(pl.name), "| active:", pl.active, "| дүрэм:", len(pl.item_ids))
    for it in pl.item_ids:
        print("      -", it.display_name, "| type:", it.compute_price,
              "| min_qty:", it.min_quantity, "| start:", it.date_start, "| end:", it.date_end)

t = env["product.template"].search([("name", "ilike", "цув")], limit=1)
if t:
    v = t.product_variant_ids[:1]
    print("4. Бараа:", t.id, t.name, "| list_price:", t.list_price)
    for pl in env["product.pricelist"].search([]):
        try:
            print("   ", repr(pl.name), "->", pl._get_product_price(v, 1.0))
        except Exception as e:
            print("   ", repr(pl.name), "-> АЛДАА:", repr(e))
else:
    print("4. 'цув' нэртэй бараа олдсонгүй")
print("=" * 60)
