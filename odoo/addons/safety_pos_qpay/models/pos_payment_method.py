# -*- coding: utf-8 -*-
from odoo import models


class PosPaymentMethod(models.Model):
    _inherit = "pos.payment.method"

    def _get_payment_terminal_selection(self):
        # Register 'qpay' as a selectable POS payment terminal type.
        return super()._get_payment_terminal_selection() + [("qpay", "QPay (QR)")]
