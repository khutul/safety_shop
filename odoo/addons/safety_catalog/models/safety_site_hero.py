# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetySiteHero(models.Model):
    _name = "safety.site.hero"
    _description = "Storefront Hero Slide"
    _order = "sequence, id"

    name = fields.Char(string="Reference", required=True)
    sequence = fields.Integer(string="Sequence", default=10)
    active = fields.Boolean(string="Active", default=True)
    image = fields.Image(string="Background Image")
    badge = fields.Char(string="Badge Text", translate=True)
    line1 = fields.Char(string="Title Line 1", translate=True, required=True)
    line2 = fields.Char(string="Title Line 2", translate=True)
    line3 = fields.Char(string="Title Line 3", translate=True)
    cta_label = fields.Char(string="Button Label", translate=True)
    cta_url = fields.Char(string="Button URL", default="/store")
