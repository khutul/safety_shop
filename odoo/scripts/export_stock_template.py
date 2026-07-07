# -*- coding: utf-8 -*-
"""
Export an Excel-friendly CSV template of every product variant so stock
quantities can be filled in and imported back with import_stock.cmd.

Output: odoo/addons/stock_template.csv  (open with Excel, fill "qty")
"""
import csv

PATH = "/mnt/extra-addons/stock_template.csv"

variants = env["product.product"].search(  # noqa: F821
    [("product_tmpl_id.storefront_published", "=", True)],
    order="product_tmpl_id, id")

with open(PATH, "w", encoding="utf-8-sig", newline="") as f:
    w = csv.writer(f)
    w.writerow(["variant_id", "product", "variant", "sku", "qty"])
    for p in variants:
        variant_desc = ", ".join(p.product_template_variant_value_ids.mapped("name"))
        w.writerow([p.id, p.product_tmpl_id.name, variant_desc, p.default_code or "", ""])

print("Загвар файл бэлэн: odoo/addons/stock_template.csv (%s мөр)" % len(variants))
print("Excel-ээр нээж 'qty' баганад үлдэгдлээ бичээд CSV UTF-8 хэлбэрээр хадгална уу.")
