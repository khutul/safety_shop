# -*- coding: utf-8 -*-
import base64
import time
from collections import defaultdict, deque

from odoo import http
from odoo.http import request
from odoo.tools.mimetypes import guess_mimetype

LANG_MAP = {"mn": "mn_MN", "en": "en_US"}

# Simple in-process rate limiter for the public order endpoint.
# Per Odoo worker: at most ORDER_RATE_MAX order creations per
# ORDER_RATE_WINDOW seconds from a single client IP.
ORDER_RATE_MAX = 5
ORDER_RATE_WINDOW = 60
_order_hits = defaultdict(deque)


def _rate_limited(ip):
    now = time.monotonic()
    hits = _order_hits[ip]
    while hits and now - hits[0] > ORDER_RATE_WINDOW:
        hits.popleft()
    if len(hits) >= ORDER_RATE_MAX:
        return True
    hits.append(now)
    # Keep the map from growing without bound.
    if len(_order_hits) > 10000:
        _order_hits.clear()
    return False


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


def _img_ver(rec):
    """Cache-busting version token: changes whenever the record is written,
    so a re-uploaded image gets a new URL and old browser caches are bypassed."""
    return rec.write_date and rec.write_date.strftime("%Y%m%d%H%M%S") or "0"


class SafetyCatalogAPI(http.Controller):

    # ---------------- Categories ----------------
    @http.route("/api/v1/categories", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def categories(self, **kw):
        cats = request.env["safety.catalog.category"].sudo().with_context(**_lang_ctx(kw)).search(
            [], order="sequence, complete_name")
        Product = request.env["product.template"].sudo()
        # One grouped query instead of a search_count per category (avoids N+1).
        groups = Product.read_group(
            [("storefront_published", "=", True), ("storefront_categ_ids", "!=", False)],
            ["__count"], ["storefront_categ_ids"])
        counts = {}
        for g in groups:
            key = g.get("storefront_categ_ids")
            if key:
                counts[key[0]] = g.get("storefront_categ_ids_count", g.get("__count", 0))
        by_id = {}
        for c in cats:
            by_id[c.id] = {
                "id": c.id, "name": c.name, "slug": c.slug or "",
                "parent_id": c.parent_id.id or None, "sequence": c.sequence,
                "image_url": ("/api/v1/categories/%s/image?v=%s" % (c.id, _img_ver(c))) if c.image else None,
                "count": counts.get(c.id, 0),
                "children": [],
            }
        roots = []
        for c in cats:
            node = by_id[c.id]
            if c.parent_id and c.parent_id.id in by_id:
                by_id[c.parent_id.id]["children"].append(node)
            else:
                roots.append(node)
        return self._cached_json(roots, max_age=300)

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
            "website": b.website or "",
            "logo_url": ("/api/v1/brands/%s/logo?v=%s" % (b.id, _img_ver(b))) if b.logo else None,
        } for b in brands]
        return self._cached_json(data, max_age=300)

    @http.route("/api/v1/brands/<int:brand_id>/logo", type="http",
                auth="public", csrf=False, cors="*")
    def brand_logo(self, brand_id, **kw):
        rec = request.env["safety.catalog.brand"].sudo().browse(brand_id)
        return self._image_response(rec, "logo")

    # ---------------- Industries (Салбар) ----------------
    @http.route("/api/v1/industries", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def industries(self, **kw):
        recs = request.env["safety.site.industry"].sudo().with_context(**_lang_ctx(kw)).search(
            [("active", "=", True)], order="sequence, id")
        data = [{
            "id": r.id, "name": r.name, "slug": r.slug or "",
            "image_url": ("/api/v1/industries/%s/image?v=%s" % (r.id, _img_ver(r))) if r.image else None,
        } for r in recs]
        return self._cached_json(data, max_age=300)

    @http.route("/api/v1/industries/<int:ind_id>/image", type="http",
                auth="public", csrf=False, cors="*")
    def industry_image(self, ind_id, **kw):
        rec = request.env["safety.site.industry"].sudo().browse(ind_id)
        return self._image_response(rec, "image")

    # ---------------- Products (list) ----------------
    @http.route("/api/v1/products", type="http", auth="public",
                methods=["GET"], csrf=False, cors="*")
    def products(self, **kw):
        Product = request.env["product.template"].sudo().with_context(**_lang_ctx(kw))
        domain = [("storefront_published", "=", True)]
        if kw.get("category"):
            domain.append(("storefront_categ_ids.slug", "=", kw["category"]))
        if kw.get("category_id"):
            try:
                cat_id = int(kw["category_id"])
                # Match the category itself and all of its children.
                cat_ids = request.env["safety.catalog.category"].sudo().search(
                    [("id", "child_of", cat_id)]).ids
                domain.append(("storefront_categ_ids", "in", cat_ids))
            except (ValueError, TypeError):
                pass
        if kw.get("brand"):
            domain.append(("brand_id.slug", "=", kw["brand"]))
        if kw.get("brand_id"):
            try:
                domain.append(("brand_id", "=", int(kw["brand_id"])))
            except (ValueError, TypeError):
                pass
        if kw.get("industry"):
            domain.append(("industry_ids.slug", "=", kw["industry"]))
        if kw.get("q"):
            q = kw["q"]
            # Search by name, SKU (default_code) or model number.
            domain.extend([
                "|", "|",
                ("name", "ilike", q),
                ("default_code", "ilike", q),
                ("product_model", "ilike", q),
            ])
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
        return self._cached_json({
            "products": [self._card(p) for p in prods],
            "count": count, "page": page, "limit": limit,
        }, max_age=60)

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
        return self._cached_json(self._detail(p), max_age=60)

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
            "image_url": ("/api/v1/site/hero/%s/image?v=%s" % (s.id, _img_ver(s))) if s.image else None,
        } for s in slides]
        return self._cached_json(data, max_age=60)

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
            return self._cached_json({}, max_age=60)
        return self._cached_json({
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
        }, max_age=60)

    # ---------------- helpers ----------------
    def _sale_pricelist(self):
        """The storefront discount pricelist (data/pricelist_data.xml).
        Falls back to a name search so a manually created pricelist with the
        same name also works. Returns None when nothing is found — then the
        storefront simply shows normal list prices."""
        pl = request.env.ref("safety_api.pricelist_storefront", raise_if_not_found=False)
        # sudo() BEFORE reading any field: the public (guest) user has no
        # read access to product.pricelist and would get a 403 otherwise.
        pl = pl.sudo() if pl else None
        if not pl or not pl.active:
            pl = request.env["product.pricelist"].sudo().search(
                [("name", "ilike", "Вэб дэлгүүрийн хямдрал")], limit=1)
        return pl if pl and pl.active else None

    def _sale_price(self, product, list_price, pricelist):
        """(price, old_price, discount_pct) for a product.product record.
        old_price/discount_pct are None unless the pricelist gives a lower price."""
        old = int(list_price or 0)
        if not pricelist or not product or not old:
            return old, None, None
        try:
            price = int(pricelist._get_product_price(product, 1.0))
        except Exception:  # noqa: BLE001 — never break the catalog over pricing
            return old, None, None
        if 0 < price < old:
            return price, old, int(round((1 - float(price) / old) * 100))
        return old, None, None

    def _cached_json(self, data, max_age=60, status=200):
        """JSON response with a short public cache so browsers/proxies can reuse it."""
        resp = request.make_json_response(data, status=status)
        resp.headers["Cache-Control"] = "public, max-age=%d" % max_age
        return resp

    def _image_response(self, rec, field):
        if not rec.exists() or not rec[field]:
            return request.not_found()
        data = base64.b64decode(rec[field])
        etag = '"%s-%s-%s"' % (
            rec._name.replace(".", "-"), rec.id,
            rec.write_date and rec.write_date.strftime("%Y%m%d%H%M%S") or "0")
        if request.httprequest.headers.get("If-None-Match") == etag:
            return request.make_response(
                b"", status=304,
                headers=[("Cache-Control", "public, max-age=86400"), ("ETag", etag)])
        mimetype = guess_mimetype(data, default="image/png")
        return request.make_response(
            data,
            headers=[
                ("Content-Type", mimetype),
                ("Cache-Control", "public, max-age=86400"),
                ("ETag", etag),
            ])

    def _card(self, p):
        qty = p.qty_available
        # Price is computed on the template itself: robust even when a
        # product's variants are archived (KeyError otherwise).
        price, old_price, discount_pct = self._sale_price(
            p, p.list_price, self._sale_pricelist())
        return {
            "id": p.id, "name": p.name or "", "slug": p.slug or "",
            "model": p.product_model or "",
            "brand": ({"name": p.brand_id.name, "slug": p.brand_id.slug or ""}
                      if p.brand_id else None),
            "price": price, "old_price": old_price, "discount_pct": discount_pct,
            "currency": p.currency_id.name,
            "in_stock": qty > 0, "stock_status": _stock_status(qty),
            "main_image_url": ("/api/v1/products/%s/image?v=%s" % (p.id, _img_ver(p))) if p.image_1920 else None,
            "categories": [c.slug for c in p.storefront_categ_ids if c.slug],
            "has_variants": len(p.product_variant_ids) > 1,
        }

    def _detail(self, p):
        d = self._card(p)
        d.update({
            "short_description": p.short_description or "",
            "long_description": p.long_description or "",
            "gallery": [{"url": "/api/v1/media/image/%s?v=%s" % (i.id, _img_ver(i)), "alt": i.name or ""}
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
            attr = (ptav.attribute_id.name or "").strip().lower()
            if attr in ("shoe size", "size", "хэмжээ", "размер"):
                size = ptav.name or ""
            elif attr in ("color", "өнгө", "цвет"):
                color = ptav.name or ""
            elif not size:
                size = ptav.name or ""
        qty = v.qty_available
        price, old_price, discount_pct = self._sale_price(
            v, v.lst_price, self._sale_pricelist())
        return {
            "id": v.id,
            "size": size,
            "color": color,
            "sku": v.default_code or "",
            "barcode": v.barcode or "",
            "price": price,
            "old_price": old_price,
            "discount_pct": discount_pct,
            "qty_available": qty,
            "in_stock": qty > 0,
        }

    # ---------------- Orders ----------------
    @http.route("/api/v1/orders", type="http", auth="public",
                methods=["POST", "OPTIONS"], csrf=False, cors="*")
    def create_order(self, **kw):
        import json
        if request.httprequest.method == "OPTIONS":
            return request.make_json_response({})
        ip = request.httprequest.remote_addr or "?"
        if _rate_limited(ip):
            return request.make_json_response(
                {"error": {"code": "rate_limited",
                           "message": "Хэт олон хүсэлт илгээгдлээ. Түр хүлээгээд дахин оролдоно уу."}},
                status=429)
        try:
            data = json.loads(request.httprequest.data or b"{}")
        except (ValueError, TypeError):
            return request.make_json_response(
                {"error": {"code": "bad_request", "message": "Invalid JSON"}}, status=400)

        cust = data.get("customer") or {}
        items = data.get("items") or []
        name = (cust.get("name") or "").strip()
        phone = (cust.get("phone") or "").strip()
        if not name or not phone or not items:
            return request.make_json_response(
                {"error": {"code": "missing_fields",
                           "message": "name, phone, items are required"}}, status=400)

        env = request.env
        try:
            Partner = env["res.partner"].sudo()
            partner = Partner.search([("phone", "=", phone)], limit=1)
            if not partner:
                partner = Partner.create({
                    "name": name, "phone": phone,
                    "email": (cust.get("email") or "").strip() or False,
                    "street": (cust.get("address") or "").strip() or False,
                    "company_type": "person",
                })
        except Exception as e:  # noqa: BLE001
            return request.make_json_response(
                {"error": {"code": "partner_failed", "message": str(e)[:500]}},
                status=500)

        Product = env["product.template"].sudo()
        lines = []
        shortages = []
        for it in items:
            try:
                tmpl_id = int(it.get("product_id"))
                qty = max(int(it.get("qty", 1)), 1)
            except (ValueError, TypeError):
                continue
            tmpl = Product.browse(tmpl_id)
            if not tmpl.exists() or not tmpl.storefront_published:
                continue
            variant = None
            if it.get("variant_id"):
                try:
                    vid = int(it["variant_id"])
                    variant = tmpl.product_variant_ids.filtered(lambda v: v.id == vid)[:1]
                except (ValueError, TypeError):
                    variant = None
            product = variant or tmpl.product_variant_ids[:1]
            if not product:
                continue
            available = product.qty_available - product.outgoing_qty
            if qty > available:
                shortages.append({
                    "name": product.display_name,
                    "requested": qty,
                    "available": max(int(available), 0),
                })
            lines.append((0, 0, {
                "product_id": product.id,
                "product_uom_qty": qty,
            }))

        if not lines:
            return request.make_json_response(
                {"error": {"code": "no_valid_items",
                           "message": "No valid products in order"}}, status=400)

        # Stock check: warn the customer unless they explicitly accepted backorder.
        if shortages and not data.get("allow_backorder"):
            return request.make_json_response(
                {"error": {"code": "insufficient_stock",
                           "message": "Зарим барааны үлдэгдэл хүрэлцэхгүй байна.",
                           "shortages": shortages}}, status=409)

        order_vals = {
            "partner_id": partner.id,
            "origin": "safety.mn storefront",
            "note": (cust.get("note") or "").strip() or False,
            "order_line": lines,
        }
        # Web orders use the storefront pricelist so the totals match
        # the discounted prices shown on the site.
        pricelist = self._sale_pricelist()
        if pricelist:
            order_vals["pricelist_id"] = pricelist.id
        try:
            order = env["sale.order"].sudo().create(order_vals)
        except Exception as e:  # noqa: BLE001 — surface the reason to the API client
            return request.make_json_response(
                {"error": {"code": "order_failed", "message": str(e)[:500]}},
                status=500)
        if shortages:
            order.message_post(body=(
                "⚠️ Үлдэгдэл хүрэлцээгүй ч хэрэглэгч захиалгаар авахыг зөвшөөрсөн: "
                + ", ".join("%s (захиалсан %s, боломжит %s)"
                            % (s["name"], s["requested"], s["available"])
                            for s in shortages)))
        return request.make_json_response({
            "ok": True,
            "order_id": order.id,
            "order_name": order.name,
        })

    @http.route("/api/v1/orders/lookup", type="http", auth="public",
                methods=["POST", "OPTIONS"], csrf=False, cors="*")
    def lookup_order(self, **kw):
        import json
        if request.httprequest.method == "OPTIONS":
            return request.make_json_response({})
        try:
            data = json.loads(request.httprequest.data or b"{}")
        except (ValueError, TypeError):
            return request.make_json_response(
                {"error": {"code": "bad_request", "message": "Invalid JSON"}}, status=400)

        def norm_phone(s):
            return "".join(ch for ch in (s or "") if ch.isdigit())[-8:]

        phone = norm_phone(data.get("phone"))
        order_name = (data.get("order_name") or "").strip()
        if not phone or not order_name:
            return request.make_json_response(
                {"error": {"code": "missing_fields",
                           "message": "phone, order_name are required"}}, status=400)

        order = request.env["sale.order"].sudo().search(
            [("name", "=ilike", order_name)], limit=1)
        partner_phone = norm_phone(order.partner_id.phone) if order else ""
        if not order or not partner_phone or phone != partner_phone:
            return request.make_json_response(
                {"error": {"code": "not_found",
                           "message": "Order not found"}}, status=404)

        return request.make_json_response({
            "ok": True,
            "name": order.name,
            "date": str(order.date_order or "")[:16],
            "state": order.state,
            "amount_total": int(order.amount_total or 0),
            "customer": order.partner_id.name or "",
            "lines": [{
                "name": l.product_id.display_name or l.name or "",
                "qty": int(l.product_uom_qty or 0),
                "price": int(l.price_unit or 0),
                "subtotal": int(l.price_subtotal or 0),
            } for l in order.order_line],
        })
