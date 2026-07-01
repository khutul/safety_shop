# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyCatalogProductImage(models.Model):
    _name = "safety.catalog.product.image"
    _description = "Product Gallery Image"
    _order = "sequence, id"

    name = fields.Char(string="Title")
    image = fields.Image(string="Image", required=True)
    sequence = fields.Integer(string="Sequence", default=10)
    product_tmpl_id = fields.Many2one(
        comodel_name="product.template",
        string="Product",
        required=True,
        ondelete="cascade",
        index=True,
    )
