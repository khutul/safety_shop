# -*- coding: utf-8 -*-
from odoo import fields, models


class SafetyCatalogProductDocument(models.Model):
    _name = "safety.catalog.product.document"
    _description = "Product Document"
    _order = "sequence, id"

    name = fields.Char(string="Title", required=True)
    doc_type = fields.Selection(
        selection=[
            ("certificate", "Certificate"),
            ("manual", "Manual"),
            ("datasheet", "Datasheet"),
            ("other", "Other"),
        ],
        string="Type",
        default="certificate",
        required=True,
    )
    file = fields.Binary(string="File", attachment=True, required=True)
    file_name = fields.Char(string="File Name")
    is_public = fields.Boolean(
        string="Public",
        default=True,
        help="If set, this document is exposed on the storefront.",
    )
    sequence = fields.Integer(string="Sequence", default=10)
    product_tmpl_id = fields.Many2one(
        comodel_name="product.template",
        string="Product",
        required=True,
        ondelete="cascade",
        index=True,
    )
