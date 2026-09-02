# -*- coding: utf-8 -*-
from odoo import api, fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    # Storefront products are sold in the shop (POS) too -> available by default.
    available_in_pos = fields.Boolean(default=True)

    def _sync_pos(self):
        """Make storefront products available in POS and mirror their categories."""
        for p in self:
            vals = {}
            if not p.available_in_pos:
                vals["available_in_pos"] = True
            if p.storefront_categ_ids:
                pos_cats = p.storefront_categ_ids._get_or_create_pos_categ()
                if pos_cats:
                    vals["pos_categ_ids"] = [(6, 0, pos_cats.ids)]
            if vals:
                p.with_context(_skip_pos_sync=True).write(vals)

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        records.filtered(lambda r: r.storefront_categ_ids)._sync_pos()
        return records

    def write(self, vals):
        res = super().write(vals)
        if not self.env.context.get("_skip_pos_sync") and "storefront_categ_ids" in vals:
            self._sync_pos()
        return res
