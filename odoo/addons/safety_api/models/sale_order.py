# -*- coding: utf-8 -*-
from odoo import fields, models


class SaleOrder(models.Model):
    _inherit = "sale.order"

    qpay_invoice_id = fields.Char(string="QPay Invoice ID", copy=False)
    storefront_paid = fields.Boolean(string="Storefront Paid", default=False, copy=False)
