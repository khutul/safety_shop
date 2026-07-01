# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyCatalogBrand(models.Model):
    _name = "safety.catalog.brand"
    _description = "Product Brand"
    _order = "sequence, name"

    name = fields.Char(string="Name", required=True)
    slug = fields.Char(
        string="URL Slug",
        help="Used to build the storefront brand URL in the Next.js frontend.",
    )
    sequence = fields.Integer(string="Sequence", default=10)
    logo = fields.Image(string="Logo")
    website = fields.Char(string="Website")
    active = fields.Boolean(string="Active", default=True)
