# -*- coding: utf-8 -*-
"""
Import stock quantities from odoo/addons/stock_template.csv
(the file produced by export_stock_template.py, with "qty" filled in).

Rows with an empty qty are skipped, so partial fills are fine.
"""
import csv

PATH = "/mnt/extra-addons/stock_template.csv"

wh_loc = env.ref("stock.stock_location_stock", raise_if_not_found=False)  # noqa: F821
if not wh_loc:
    wh = env["stock.warehouse"].search([], limit=1)  # noqa: F821
    wh_loc = wh.lot_stock_id
print("Агуулахын байрлал:", wh_loc.complete_name)

Quant = env["stock.quant"].sudo()  # noqa: F821
Product = env["product.product"].sudo()  # noqa: F821

done = skipped = 0
with open(PATH, encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        qty_raw = (row.get("qty") or "").strip()
        if not qty_raw:
            continue
        try:
            pid = int(row.get("variant_id") or 0)
            qty = float(qty_raw.replace(",", "."))
        except (ValueError, TypeError):
            skipped += 1
            continue
        prod = Product.browse(pid)
        if not prod.exists():
            skipped += 1
            continue
        quant = Quant.search(
            [("product_id", "=", pid), ("location_id", "=", wh_loc.id)], limit=1)
        if quant:
            quant.inventory_quantity = qty
        else:
            quant = Quant.create({
                "product_id": pid,
                "location_id": wh_loc.id,
                "inventory_quantity": qty,
            })
        quant.action_apply_inventory()
        done += 1

env.cr.commit()  # noqa: F821
print("Үлдэгдэл орууллаа: %s мөр, алгассан: %s мөр" % (done, skipped))
