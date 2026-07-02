# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetySiteIndustry(models.Model):
    _name = "safety.site.industry"
    _description = "Storefront Industry (Салбар)"
    _order = "sequence, id"

    name = fields.Char(string="Name", required=True, translate=True)
    slug = fields.Char(string="URL Slug", help="Used to filter products by industry on the storefront.")
    image = fields.Image(string="Image")
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)
