# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetySiteSettings(models.Model):
    _name = "safety.site.settings"
    _description = "Storefront Site Settings"

    name = fields.Char(string="Name", default="Site Settings")
    # --- Contact ---
    phone = fields.Char(string="Phone")
    phone2 = fields.Char(string="Phone 2")
    address = fields.Char(string="Address", translate=True)
    email = fields.Char(string="Email")
    facebook_url = fields.Char(string="Facebook URL")
    instagram_url = fields.Char(string="Instagram URL")
    working_hours = fields.Char(string="Working Hours", translate=True)
    # --- Hero shared ---
    hero_subtitle = fields.Text(string="Hero Subtitle", translate=True)
    cta_primary_label = fields.Char(string="Primary Button Label", translate=True)
    cta_primary_url = fields.Char(string="Primary Button URL", default="/store")
    # --- Stats bar ---
    stat1_value = fields.Char(string="Stat 1 Value")
    stat1_label = fields.Char(string="Stat 1 Label", translate=True)
    stat2_value = fields.Char(string="Stat 2 Value")
    stat2_label = fields.Char(string="Stat 2 Label", translate=True)
    stat3_value = fields.Char(string="Stat 3 Value")
    stat3_label = fields.Char(string="Stat 3 Label", translate=True)
    stat4_value = fields.Char(string="Stat 4 Value")
    stat4_label = fields.Char(string="Stat 4 Label", translate=True)
