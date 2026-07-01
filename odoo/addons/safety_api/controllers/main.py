# -*- coding: utf-8 -*-
import base64
from odoo import http
from odoo.http import request

LANG_MAP = {"mn": "mn_MN", "en": "en_US"}


def _lang_ctx(kw):
    """Return {'lang': code} only if that language is installed & active, else {}."""
    code = LANG_MAP.get((kw.get("lang") or "mn").lower())
    if not code:
        return {}
    Lang = request.env["res.lang"].sudo()
    if Lang.search_count([("code", "=", code), ("active", "=", True)]):
        return {"lang": code}
    return {}


def _stock_status(qty):
    if not qty or qty <= 0:
        return "out"
    if qty <= 10:
        return "low"
    return "in"


class SafetyCatalogAPI(http.Controller):

    # ---------------- Categories ----------------
    @http.route("/api/v1/categories", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def categories(self, **kw):
        cats = request.env["safety.catalog.category"].sudo().with_context(**_lang_ctx(kw)).search([])
        by_id = {}
        for c in cats:
            by_id[c.id] = {
                "id": c.id, "name": c.name, "slug": c.slug or "",
                "parent_id": c.parent_id.id or None, "sequence": c.sequence,
                "image_url": ("/api/v1/categories/%s/image" % c.id) if c.image else None,
                "children": [],
            }
        roots = []
        for c in cats:
            node = by_id[c.id]
            if c.parent_id and c.parent_id.id in by_id:
                by_id[c.parent_id.id]["children"].append(node)
            else:
                roots.append(node)
        return request.make_json_response(roots)

    @http.route("/api/v1/categories/<int:cat_id>/image", type="http",
                auth="public", csrf=False, cors="*")
    def category_image(self, cat_id, **kw):
        rec = request.env["safety.catalog.category"].sudo().browse(cat_id)
        return self._image_response(rec, "image")

    # ---------------- Brands ----------------
    @http.route("/api/v1/brands", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def brands(self, **kw):
        brands = request.env["safety.catalog.brand"].sudo().search([])
        data = [{
            "id": b.id, "name": b.name, "slug": b.slug or "",
            "logo_url": ("/api/v1/brands/%s/logo" % b.id) if b.logo else None,
        } for b in brands]
        return request.make_json_response(data)

    @http.route("/api/v1/brands/<int:brand_id>/logo", type="http",
                auth="public", csrf=False, cors="*")
    def brand_logo(self, brand_id, **kw):
        rec = request.env["safety.catalog.brand"].sudo().browse(brand_id)
        return self._image_response(rec, "logo")

    # ---------------- Products (list) ----------------
    @http.route("/api/v1/products", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def products(self, **kw):
        Product = request.env["product.template"].sudo().with_context(**_lang_ctx(kw))
        domain = [("storefront_published", "=", True)]
        if kw.get("category"):
            domain.append(("storefront_categ_ids.slug", "=", kw["category"]))
        if kw.get("brand"):
            domain.append(("brand_id.slug", "=", kw["brand"]))
        if kw.get("q"):
            domain.append(("name", "ilike", kw["q"]))
        order = {
            "price_asc": "list_price asc",
            "price_desc": "list_price desc",
            "newest": "create_date desc",
        }.get(kw.get("sort"), "sequence, name")
        try:
            page = max(int(kw.get("page", 1)), 1)
            limit = min(max(int(kw.get("limit", 12)), 1), 100)
        except (ValueError, TypeError):
            page, limit = 1, 12
        offset = (page - 1) * limit
        count = Product.search_count(domain)
        prods = Product.search(domain, order=order, limit=limit, offset=offset)
        return request.make_json_response({
            "products": [self._card(p) for p in prods],
            "count": count, "page": page, "limit": limit,
        })

    # ---------------- Product (detail) ----------------
    @http.route("/api/v1/products/<string:slug>", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def product_detail(self, slug, **kw):
        Product = request.env["product.template"].sudo().with_context(**_lang_ctx(kw))
        p = Product.search(
            [("slug", "=", slug), ("storefront_published", "=", True)], limit=1)
        if not p:
            return request.make_json_response(
                {"error": {"code": "not_found", "message": "Product not found"}},
                status=404)
        return request.make_json_response(self._detail(p))

    @http.route("/api/v1/products/<int:prod_id>/image", type="http",
                auth="public", csrf=False, cors="*")
    def product_image(self, prod_id, **kw):
        rec = request.env["product.template"].sudo().browse(prod_id)
        return self._image_response(rec, "image_1920")

    # ---------------- Media ----------------
    @http.route("/api/v1/media/image/<int:img_id>", type="http",
                auth="public", csrf=False, cors="*")
    def gallery_image(self, img_id, **kw):
        rec = request.env["safety.catalog.product.image"].sudo().browse(img_id)
        return self._image_response(rec, "image")

    @http.route("/api/v1/media/document/<int:doc_id>", type="http",
                auth="public", csrf=False, cors="*")
    def document(self, doc_id, **kw):
        rec = request.env["safety.catalog.product.document"].sudo().browse(doc_id)
        if not rec.exists() or not rec.is_public or not rec.file:
            return request.not_found()
        data = base64.b64decode(rec.file)
        headers = [
            ("Content-Type", "application/octet-stream"),
            ("Content-Disposition", http.content_disposition(rec.file_name or "document")),
        ]
        return request.make_response(data, headers=headers)

    # ---------------- Site content (CMS) ----------------
    @http.route("/api/v1/site/hero", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def site_hero(self, **kw):
        slides = request.env["safety.site.hero"].sudo().with_context(**_lang_ctx(kw)).search(
            [("active", "=", True)], order="sequence, id")
        data = [{
            "id": s.id,
            "badge": s.badge or "",
            "line1": s.line1 or "",
            "line2": s.line2 or "",
            "line3": s.line3 or "",
            "cta_label": s.cta_label or "",
            "cta_url": s.cta_url or "/store",
            "image_url": ("/api/v1/site/hero/%s/image" % s.id) if s.image else None,
        } for s in slides]
        return request.make_json_response(data)

    @http.route("/api/v1/site/hero/<int:hero_id>/image", type="http",
                auth="public", csrf=False, cors="*")
    def site_hero_image(self, hero_id, **kw):
        rec = request.env["safety.site.hero"].sudo().browse(hero_id)
        return self._image_response(rec, "image")

    @http.route("/api/v1/site/settings", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def site_settings(self, **kw):
        s = request.env["safety.site.settings"].sudo().with_context(**_lang_ctx(kw)).search([], limit=1)
        if not s:
            return request.make_json_response({})
        return request.make_json_response({
            "phone": s.phone or "",
            "phone2": s.phone2 or "",
            "address": s.address or "",
            "email": s.email or "",
            "facebook_url": s.facebook_url or "",
            "instagram_url": s.instagram_url or "",
            "working_hours": s.working_hours or "",
            "hero_subtitle": s.hero_subtitle or "",
            "cta_primary_label": s.cta_primary_label or "",
            "cta_primary_url": s.cta_primary_url or "/store",
            "stats": [
                {"value": s.stat1_value or "", "label": s.stat1_label or ""},
                {"value": s.stat2_value or "", "label": s.stat2_label or ""},
                {"value": s.stat3_value or "", "label": s.stat3_label or ""},
                {"value": s.stat4_value or "", "label": s.stat4_label or ""},
            ],
        })

    # ---------------- helpers ----------------
    def _image_response(self, rec, field):
        if not rec.exists() or not rec[field]:
            return request.not_found()
        return request.make_response(
            base64.b64decode(rec[field]),
            headers=[("Content-Type", "image/png")])

    def _card(self, p):
        qty = p.qty_available
        return {
            "id": p.id, "name": p.name or "", "slug": p.slug or "",
            "model": p.product_model or "",
            "brand": ({"name": p.brand_id.name, "slug": p.brand_id.slug or ""}
                      if p.brand_id else None),
            "price": int(p.list_price or 0), "currency": p.currency_id.name,
            "in_stock": qty > 0, "stock_status": _stock_status(qty),
            "main_image_url": ("/api/v1/products/%s/image" % p.id) if p.image_1920 else None,
            "categories": [c.slug for c in p.storefront_categ_ids if c.slug],
            "has_variants": len(p.product_variant_ids) > 1,
        }

    def _detail(self, p):
        d = self._card(p)
        d.update({
            "short_description": p.short_description or "",
            "long_description": p.long_description or "",
            "gallery": [{"url": "/api/v1/media/image/%s" % i.id, "alt": i.name or ""}
                        for i in p.gallery_image_ids],
            "documents": [{"type": doc.doc_type, "label": doc.name,
                           "url": "/api/v1/media/document/%s" % doc.id}
                          for doc in p.document_ids if doc.is_public],
            "features": [{"label": f.name, "value": f.value, "icon": f.icon or ""}
                         for f in p.feature_ids],
            "variants": [self._variant(v) for v in p.product_variant_ids],
            "meta_title": p.meta_title or "", "meta_description": p.meta_description or "",
        })
        return d

    def _variant(self, v):
        size = color = ""
        for ptav in v.product_template_variant_value_ids:
            attr = (ptav.attribute_id.name or "").lower()
            if attr in ("shoe size", "size", "размер"):
                size = ptav.name
            elif attr in ("color", "өнгө"):
                color = ptav.name
        qty = v.qty_available
        return {
            "id": v.id, "size": size, "color": color,
            "sku": v.default_code or "", "barcode": v.barcode or "",
            "price": int(v.lst_price or 0), "qty_available": qty, "in_stock": qty > 0,
        }
