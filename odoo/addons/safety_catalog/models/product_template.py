# -*- coding: utf-8 -*-
from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = "product.template"

    # --- Identification / classification ---
    brand_id = fields.Many2one(
        comodel_name="safety.catalog.brand",
        string="Brand",
        ondelete="set null",
        index=True,
    )
    product_model = fields.Char(string="Model")
    storefront_categ_ids = fields.Many2many(
        comodel_name="safety.catalog.category",
        string="Storefront Categories",
    )
    industry_ids = fields.Many2many(
        comodel_name="safety.site.industry",
        string="Storefront Industries",
    )

    # --- Storefront content ---
    short_description = fields.Text(string="Short Description", translate=True)
    long_description = fields.Html(string="Long Description", translate=True, sanitize=True)
    gallery_image_ids = fields.One2many(
        comodel_name="safety.catalog.product.image",
        inverse_name="product_tmpl_id",
        string="Gallery Images",
    )
    document_ids = fields.One2many(
        comodel_name="safety.catalog.product.document",
        inverse_name="product_tmpl_id",
        string="Storefront Documents",
    )
    feature_ids = fields.One2many(
        comodel_name="safety.catalog.product.feature",
        inverse_name="product_tmpl_id",
        string="Features",
    )

    # --- SEO / publishing (for the Next.js storefront) ---
    storefront_published = fields.Boolean(
        string="Published on Storefront",
        default=False,
        help="If set, this product is exposed on the Next.js storefront.",
    )
    slug = fields.Char(
        string="URL Slug",
        help="Used to build the storefront product URL in the Next.js frontend.",
    )
    meta_title = fields.Char(string="Meta Title")
    meta_description = fields.Text(string="Meta Description")
