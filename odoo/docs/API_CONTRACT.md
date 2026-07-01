# safety_shop — API Contract v1 (Odoo ↔ Next.js storefront)

Contract-first spec derived from the storefront's data needs (`apps/storefront/src/lib/data/*`).
The Odoo backend exposes these REST endpoints; the storefront's data layer is rewritten to
call them and map responses into the shapes its UI components expect (Medusa `StoreProduct`-like).

Implemented by a future custom module **`safety_api`** (thin controllers wrapping standard Odoo
ORM + our `safety_catalog` models). No business logic is reimplemented — pricing, stock, and
order totals stay in Odoo.

---

## 0. Conventions

- **Base path:** `/api/v1`
- **Format:** JSON. `Content-Type: application/json`.
- **Language:** `?lang=mn|en` (default `mn`). Translatable fields (name, descriptions) return the
  requested language via Odoo's translation context.
- **Currency:** MNT (company currency). Prices are integers (no decimals).
- **Pagination:** `?page=1&limit=12`. List responses include `count`, `page`, `limit`.
- **Auth:**
  - Phase 1 (catalog read) — **public**, no auth.
  - Phase 2 (cart/customer/order) — token/session (defined later).
- **Errors:** `{ "error": { "code": "...", "message": "..." } }` with proper HTTP status.

---

## 1. Phase 1 — Catalog (read-only)  ← MVP

### 1.1 GET /api/v1/categories
Storefront category tree (the 11 PPE categories).
```
GET /api/v1/categories?lang=mn
→ 200
[
  { "id": 5, "name": "Хөлийн хамгаалалт", "slug": "foot-protection",
    "parent_id": null, "sequence": 70, "image_url": "/api/v1/categories/5/image",
    "children": [] }
]
```
**Odoo source:** `safety.catalog.category` (name*, slug, parent_id, sequence, image).  *translatable

### 1.2 GET /api/v1/brands
```
GET /api/v1/brands
→ 200
[ { "id": 1, "name": "Safetoe", "slug": "safetoe", "logo_url": "/api/v1/brands/1/logo" } ]
```
**Odoo source:** `safety.catalog.brand`.  ⚠️ *Backend gap: add `slug` field to brand.*

### 1.3 GET /api/v1/products  (list)
Query params: `category` (slug), `brand` (slug), `q` (search), `sort` (`price_asc|price_desc|newest`),
`page`, `limit`, `lang`.
```
GET /api/v1/products?category=foot-protection&sort=price_asc&page=1&limit=12&lang=mn
→ 200
{
  "products": [
    {
      "id": 42, "name": "SAFETOE М-8025NB бор үдээсгүй", "slug": "safetoe-m-8025nb-bor-udeesgui",
      "model": "М-8025NB",
      "brand": { "name": "Safetoe", "slug": "safetoe" },
      "price": 185000, "currency": "MNT",
      "in_stock": true, "stock_status": "in",           // in | low | out
      "main_image_url": "/api/v1/products/42/image",
      "categories": ["foot-protection"],
      "has_variants": true
    }
  ],
  "count": 45, "page": 1, "limit": 12
}
```
**Odoo source:** `product.template` filtered by `storefront_published = true`.
Fields: name*, slug, product_model, brand_id, list_price, qty_available/free_qty→stock_status,
image_1920, storefront_categ_ids.

### 1.4 GET /api/v1/products/{slug}  (detail)
```
GET /api/v1/products/safetoe-m-8025nb-bor-udeesgui?lang=mn
→ 200
{
  "id": 42, "name": "...", "slug": "...", "model": "М-8025NB",
  "brand": { "name": "Safetoe", "slug": "safetoe" },
  "price": 185000, "currency": "MNT",
  "categories": ["foot-protection"],
  "short_description": "...",          // ⚠️ backend gap: add field
  "long_description": "...",           // ⚠️ backend gap: add field
  "gallery": [ { "url": "/api/v1/product-images/10", "alt": "..." } ],
  "documents": [ { "type": "certificate", "label": "EN ISO 20345", "url": "/api/v1/product-documents/3" } ],
  "features": [ { "label": "Хамгаалалт", "value": "S3", "icon": "shield" } ],
  "variants": [
    { "id": 501, "size": "40", "color": "Бор", "sku": "SHOE-8025-40",
      "barcode": "...", "price": 185000, "qty_available": 10, "in_stock": true }
  ],
  "meta_title": "...", "meta_description": "..."
}
```
**Odoo source:** `product.template` + `product.product` (variants: Shoe Size, Color, default_code,
barcode, qty_available) + `safety.catalog.product.image` (gallery) +
`safety.catalog.product.document` (WHERE `is_public = true`) + `safety.catalog.product.feature`.

### 1.5 Images
`GET /api/v1/products/{id}/image`, `/product-images/{id}`, `/product-documents/{id}`,
`/brands/{id}/logo`, `/categories/{id}/image` → binary (or redirect to Odoo `/web/image`).

---

## 2. Phase 2 — Commerce (outline, defined later)

- **Customer:** `POST /api/v1/auth/register`, `/auth/login`, `GET/PUT /api/v1/customer`, addresses.
  → `res.partner` (+ `customer_type` B2C/B2B/Dealer), portal user, token auth.
- **Cart:** `POST /api/v1/cart`, `GET /api/v1/cart/{id}`, add/update/remove line, apply pricelist.
  → draft `sale.order` / `sale.order.line`. **Odoo computes price/totals** (pricelist by customer).
- **Checkout / Order:** `POST /api/v1/cart/{id}/checkout` → confirm `sale.order`; `GET /api/v1/orders`.
- **Payment:** QPay (custom `payment.provider`), bank transfer, company invoice.

---

## 3. Backend gaps to close (safety_catalog / safety_api)

Before/while building `safety_api`, add to `safety_catalog`:
1. `safety.catalog.brand`: **`slug`** field.
2. `product.template`: **`short_description`**, **`long_description`** (Text, `translate=True`).
3. Make translatable: `product.template.slug` stays non-translated; `name` already translatable;
   set `translate=True` on short/long description (+ meta if per-language SEO wanted).
4. Choose the **warehouse** used for `qty_available`/stock_status; define thresholds
   (e.g. `>10 = in`, `1–10 = low`, `0 = out`).
5. Enable **Mongolian + English** languages in Odoo (Settings → Languages).

---

## 4. i18n design

- Every endpoint accepts `?lang=mn|en`; Odoo returns translated `name`, `short/long_description`,
  category `name`, features (if translated).
- Frontend uses a `[locale]` route segment (repurpose Medusa's `[countryCode]`) + `next-intl`
  for UI strings. Product data language driven by the `lang` query param.

---

## 5. Adapter mapping (storefront)

The storefront's `lib/data/*` is rewritten to call these endpoints and map into the
Medusa-like shapes its UI expects:

| Storefront (Medusa) | safety_shop API |
|---------------------|-----------------|
| `StoreProduct.title` | `name` |
| `StoreProduct.handle` | `slug` |
| `StoreProduct.thumbnail` / `images[]` | `main_image_url` / `gallery[]` |
| `StoreProduct.variants[]` (+ prices, options) | `variants[]` (size/color, price, qty) |
| `StoreProductCategory` | `categories` endpoint |
| region/countryCode pricing | removed — single MNT price from Odoo |

Medusa's **region / countryCode** machinery is neutralized (single market, MNT). The
`[countryCode]` route becomes `[locale]` for language only.
