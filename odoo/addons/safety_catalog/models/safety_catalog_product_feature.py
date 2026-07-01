# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyCatalogProductFeature(models.Model):
    _name = "safety.catalog.product.feature"
    _description = "Product Feature"
    _order = "sequence, id"

    name = fields.Char(string="Feature", required=True)
    value = fields.Char(string="Value", required=True)
    icon = fields.Char(string="Icon", help="Optional icon name/class for the storefront.")
    sequence = fields.Integer(string="Sequence", default=10)
    product_tmpl_id = fields.Many2one(
        comodel_name="product.template",
        string="Product",
        required=True,
        ondelete="cascade",
        index=True,
    )
