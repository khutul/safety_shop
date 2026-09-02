# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyCatalogCategory(models.Model):
    _inherit = "safety.catalog.category"

    pos_categ_id = fields.Many2one(
        comodel_name="pos.category",
        string="POS Category (auto)",
        ondelete="set null",
        copy=False,
        help="POS category auto-created to mirror this storefront category.",
    )

    def _get_or_create_pos_categ(self):
        """Return the mirrored pos.category recordset (creating missing ones)."""
        Pos = self.env["pos.category"].sudo()
        result = self.env["pos.category"]
        for c in self:
            if c.pos_categ_id:
                cat = c.pos_categ_id
                if cat.name != c.name:
                    cat.name = c.name
            else:
                cat = Pos.create({"name": c.name})
                c.sudo().pos_categ_id = cat.id
            result |= cat
        return result
