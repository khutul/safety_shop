# -*- coding: utf-8 -*-
"""Set up 'НӨАТгүй' (default) and 'НӨАТ' fiscal positions for the POS.

Run (POS session must be CLOSED first):

    docker compose -f deploy/docker-compose.prod.yml exec -T odoo \
        odoo shell -d safety_shop --no-http < deploy/scripts/setup_fiscal_positions.py

Result:
    - Every order defaults to 'НӨАТгүй' -> no VAT line on the receipt, total unchanged.
    - Cashier can switch an order to 'НӨАТ' -> shows 909.09 + НӨАТ 90.91 (for ebarimt).
Idempotent: safe to run more than once.
"""

Tax = env["account.tax"].sudo()
FP = env["account.fiscal.position"].sudo()
FPTax = env["account.fiscal.position.tax"].sudo()

# 1. Existing 10% VAT sale tax (price-included).
vat10 = Tax.search(
    [("type_tax_use", "=", "sale"), ("amount", "=", 10.0), ("amount_type", "=", "percent")],
    limit=1,
)
if not vat10:
    raise Exception("НӨАТ 10% борлуулалтын татвар олдсонгүй! Эхлээд татвараа тохируулна уу.")

company = vat10.company_id or env.company

# 2. 0% price-included 'НӨАТгүй' tax (copy from 10% so price_include stays the same).
vat0 = Tax.search(
    [("type_tax_use", "=", "sale"), ("amount", "=", 0.0),
     ("amount_type", "=", "percent"), ("name", "=", "НӨАТгүй 0%")],
    limit=1,
)
if not vat0:
    vat0 = vat10.copy({"name": "НӨАТгүй 0%", "amount": 0.0})
    print("Created 0%% tax id=%s" % vat0.id)

# 3a. 'НӨАТгүй' fiscal position: map 10% -> 0%.
fp_novat = FP.search([("name", "=", "НӨАТгүй")], limit=1)
if not fp_novat:
    fp_novat = FP.create({
        "name": "НӨАТгүй",
        "company_id": company.id,
        "tax_ids": [(0, 0, {"tax_src_id": vat10.id, "tax_dest_id": vat0.id})],
    })
    print("Created fiscal position 'НӨАТгүй' id=%s" % fp_novat.id)
else:
    fp_novat.tax_ids.unlink()
    FPTax.create({"position_id": fp_novat.id, "tax_src_id": vat10.id, "tax_dest_id": vat0.id})
    print("Updated fiscal position 'НӨАТгүй' id=%s" % fp_novat.id)

# 3b. 'НӨАТ' fiscal position: empty mapping -> keeps the product's own 10% tax.
fp_vat = FP.search([("name", "=", "НӨАТ")], limit=1)
if not fp_vat:
    fp_vat = FP.create({"name": "НӨАТ", "company_id": company.id})
    print("Created fiscal position 'НӨАТ' id=%s" % fp_vat.id)

# 4. Wire both into every POS config; default = НӨАТгүй.
configs = env["pos.config"].sudo().search([])
for pos in configs:
    pos.write({
        "default_fiscal_position_id": fp_novat.id,
        "fiscal_position_ids": [(6, 0, [fp_novat.id, fp_vat.id])],
    })
    print("POS '%s' -> default=НӨАТгүй, options=[НӨАТгүй, НӨАТ]" % pos.name)

env.cr.commit()
print("DONE. %s POS config(s) updated." % len(configs))
