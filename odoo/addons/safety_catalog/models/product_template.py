# -*- coding: utf-8 -*-
import re

from odoo import api, fields, models


# Монгол кирилл -> латин галиглал (URL slug автоматаар үүсгэхэд)
_MN_TRANSLIT = {
    "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "yo",
    "ж": "j", "з": "z", "и": "i", "й": "i", "к": "k", "л": "l", "м": "m",
    "н": "n", "о": "o", "ө": "o", "п": "p", "р": "r", "с": "s", "т": "t",
    "у": "u", "ү": "u", "ф": "f", "х": "kh", "ц": "ts", "ч": "ch", "ш": "sh",
    "щ": "sh", "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
}


def _translit(text):
    out = []
    for ch in (text or ""):
        out.append(_MN_TRANSLIT.get(ch.lower(), ch))
    return "".join(out)


def _slugify(value):
    """URL-safe slug: галиглаад, жижиг үсэг, non [a-z0-9] -> зураас, эмхэлнэ."""
    s = _translit(value).strip().lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"-+", "-", s).strip("-")
    return s


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
    made_to_order = fields.Boolean(
        string="Made to Order",
        default=False,
        help="If set, the storefront shows a 'Захиалгаар хийгдэнэ' badge "
             "regardless of stock (e.g. custom logo embroidery items).",
    )
    slug = fields.Char(
        string="URL Slug",
        help="Used to build the storefront product URL in the Next.js frontend.",
    )
    meta_title = fields.Char(string="Meta Title")
    meta_description = fields.Text(string="Meta Description")

    # --- Sync native Odoo product category from the primary storefront category ---
    def _sync_odoo_categ(self):
        """Set native categ_id to match the product's primary (first) storefront category.
        Keeps standard Odoo reports/inventory grouping aligned with the web taxonomy."""
        for p in self:
            primary = p.storefront_categ_ids[:1]
            if not primary:
                continue
            target = primary._get_or_create_odoo_categ()
            if target and p.categ_id.id != target.id:
                p.with_context(_skip_categ_sync=True).categ_id = target.id

    def _normalize_slug(self):
        """URL slug-ийг автоматаар үүсгэж/цэвэрлэх.
        - slug хоосон бол барааны нэрнээс автоматаар үүсгэнэ (латинаар)
        - гараар бичсэн зай/том үсгийг цэвэрлэнэ
        - давхцахгүй байхаар баталгаажуулна"""
        for p in self:
            # Одоо байгаа slug байвал түүнийг цэвэрлэнэ, үгүй бол нэрнээс үүсгэнэ.
            cleaned = _slugify(p.slug) or _slugify(p.name) or _slugify(p.product_model)
            if not cleaned:
                cleaned = "bar-%s" % p.id
            twin = self.sudo().search(
                [("slug", "=", cleaned), ("id", "!=", p.id)], limit=1)
            if twin:
                cleaned = "%s-%s" % (cleaned, p.id)
            if cleaned != (p.slug or ""):
                p.with_context(_skip_slug_norm=True).slug = cleaned

    @api.onchange("name")
    def _onchange_name_slug(self):
        """Формд нэр бичихэд slug хоосон бол автоматаар санал болгоно."""
        if self.name and not self.slug:
            self.slug = _slugify(self.name) or False

    @api.model_create_multi
    def create(self, vals_list):
        records = super().create(vals_list)
        records._sync_odoo_categ()
        records._normalize_slug()
        return records

    def write(self, vals):
        res = super().write(vals)
        if not self.env.context.get("_skip_categ_sync") and "storefront_categ_ids" in vals:
            self._sync_odoo_categ()
        if not self.env.context.get("_skip_slug_norm") and "slug" in vals:
            self._normalize_slug()
        return res
