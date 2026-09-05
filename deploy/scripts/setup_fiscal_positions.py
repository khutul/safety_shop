# -*- coding: utf-8 -*-
"""Set up 'НӨАТгүй' (default) and 'НӨАТ' fiscal positions for the POS. (Odoo 19)

Odoo 19 removed 'account.fiscal.position.tax'. Tax mapping is now:
  - fiscal_position.tax_ids   = destination taxes to apply
  - <tax>.original_tax_ids    = source taxes this tax replaces
So to map 10% -> 0% we make a 0% tax whose original_tax_ids = [10% tax]
and put that 0% tax in the 'НӨАТгүй' position's tax_ids.

Run (POS session is force-closed automatically inside):

    docker compose -f deploy/docker-compose.prod.yml exec -T odoo \
        odoo shell -d safety_shop --no-http < deploy/scripts/setup_fiscal_positions.py

Result:
    - Every order defaults to 'НӨАТгүй' -> no VAT line, total unchanged.
    - Cashier can switch an order to 'НӨАТ' -> shows 909.09 + НӨАТ 90.91.
Idempotent: safe to run more than once.
"""
from odoo import fields

# 0. Force-close any open POS session (config writes are blocked otherwise).
for s in env["pos.session"].sudo().search([("state", "!=", "closed")]):
    s.write({"state": "closed", "stop_at": fields.Datetime.now()})
    print("closed session", s.name)

Tax = env["account.tax"].sudo()
FP = env["account.fiscal.position"].sudo()

# 1. Existing 10% VAT sale tax (price-included).
vat10 = Tax.search(
    [("type_tax_use", "=", "sale"), ("amount", "=", 10.0), ("amount_type", "=", "percent")],
    limit=1,
)
if not vat10:
    raise Exception("НӨАТ 10% борлуулалтын татвар олдсонгүй!")
company = vat10.company_id or env.company

# 2. 0% price-included tax (copy from 10% to keep price_include), replacing 10%.
vat0 = Tax.search(
    [("type_tax_use", "=", "sale"), ("amount", "=", 0.0),
     ("amount_type", "=", "percent"), ("name", "=", "НӨАТгүй 0%")],
    limit=1,
)
if not vat0:
    vat0 = vat10.copy({"name": "НӨАТгүй 0%", "amount": 0.0})
    print("created 0%% tax id=%s" % vat0.id)
vat0.write({"original_tax_ids": [(6, 0, [vat10.id])]})

# 3a. 'НӨАТгүй' fiscal position -> applies the 0% tax (which replaces 10%).
fp_novat = FP.search([("name", "=", "НӨАТгүй")], limit=1)
if not fp_novat:
    fp_novat = FP.create({"name": "НӨАТгүй", "company_id": company.id})
    print("created fiscal position 'НӨАТгүй' id=%s" % fp_novat.id)
fp_novat.write({"tax_ids": [(6, 0, [vat0.id])]})

# 3b. 'НӨАТ' fiscal position -> empty mapping -> keeps the product's own 10%.
fp_vat = FP.search([("name", "=", "НӨАТ")], limit=1)
if not fp_vat:
    fp_vat = FP.create({"name": "НӨАТ", "company_id": company.id})
    print("created fiscal position 'НӨАТ' id=%s" % fp_vat.id)

# 4. Wire both into every POS config; default = НӨАТгүй.
configs = env["pos.config"].sudo().search([])
for pos in configs:
    # tax_regime_selection=True is REQUIRED: otherwise _set_fiscal_position()
    # clears fiscal_position_ids back to empty (pos_config.py line ~729).
    pos.write({
        "tax_regime_selection": True,
        "default_fiscal_position_id": fp_novat.id,
        "fiscal_position_ids": [(6, 0, [fp_novat.id, fp_vat.id])],
    })
    print("POS '%s' -> regime=True, default=НӨАТгүй, options=[НӨАТгүй, НӨАТ]" % pos.name)

env.cr.commit()
print("DONE. %s POS config(s) updated." % len(configs))
