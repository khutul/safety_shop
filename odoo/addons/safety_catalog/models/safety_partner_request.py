# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyPartnerRequest(models.Model):
    """Partnership / cooperation requests submitted from the storefront."""

    _name = "safety.partner.request"
    _description = "Partnership Request"
    _order = "create_date desc"

    name = fields.Char(string="Нэр", required=True)
    company = fields.Char(string="Байгууллага")
    phone = fields.Char(string="Утас", required=True)
    email = fields.Char(string="И-мэйл")
    message = fields.Text(string="Захиа")
    state = fields.Selection(
        [("new", "Шинэ"), ("in_progress", "Холбогдож байгаа"), ("done", "Хаагдсан")],
        string="Төлөв",
        default="new",
    )
