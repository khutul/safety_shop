# -*- coding: utf-8 -*-
"""Bukh baraand NOAT 10% (uned shingesen) onooj, US demo tatvaruudyg arkhivlana."""

Tax = env["account.tax"]

# 1. Borluulaltyn NOAT 10% tatvar oloh / uusgeh
vat = Tax.search([
    ("type_tax_use", "=", "sale"),
    ("amount", "=", 10),
    ("name", "ilike", "НӨАТ"),
], limit=1)

def _price_include_vals():
    # Odoo hувилбар хоорондын зөрүүг даана
    if "price_include" in Tax._fields:
        return {"price_include": True}
    if "price_include_override" in Tax._fields:
        return {"price_include_override": "tax_included"}
    return {}

if not vat:
    vals = {
        "name": "НӨАТ 10%",
        "amount": 10,
        "amount_type": "percent",
        "type_tax_use": "sale",
        "description": "НӨАТ 10%",
    }
    vals.update(_price_include_vals())
    vat = Tax.create(vals)
    print("Shine tatvar uusgev: NOAT 10% (sale, price-included)")
else:
    upd = _price_include_vals()
    # Uned shingesen bolgono (saitad haragdah une = ecsiin une)
    for k, v in upd.items():
        if getattr(vat, k, None) != v:
            vat.write({k: v})
            print("Tatvaryg uned shingesen bolgov:", k)
    print("Oldson tatvar:", vat.name, "| id:", vat.id)

# 2. Bukh baraand sale tatvar bolgon onooh
templates = env["product.template"].with_context(active_test=False).search([])
templates.write({"taxes_id": [(6, 0, [vat.id])]})
print("Baraand onoov:", len(templates), "-> NOAT 10%")

# 3. US demo sale-tatvaruudyg arkhivlah (ustgahgui - zovhon idevhgui)
us_taxes = Tax.search([
    ("type_tax_use", "=", "sale"),
    ("id", "!=", vat.id),
    "|", ("name", "ilike", "(US)"), ("name", "ilike", "Tax 15"),
])
if us_taxes:
    us_taxes.write({"active": False})
    print("Arkhivlav:", ", ".join(us_taxes.mapped("name")))

env.cr.commit()
print("=" * 50)
print("Duuslaa. Shineer uusekh zahialga NOAT 10%-tai bodogdono.")
