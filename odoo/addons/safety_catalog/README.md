# Safety Catalog

Catalog module for the **safety_shop** PPE platform. It provides the
**Storefront Category** taxonomy (`safety.catalog.category`) — the customer-facing
product categories used by the headless Next.js frontend, kept independent of
Odoo's internal accounting `product.category`.

Ships with the 11 standard PPE storefront categories as seed data, plus a
**Product Brand** model (`safety.catalog.brand`). Future catalog extensions
(product gallery, documents, features) will build on this module.

- **Technical name:** `safety_catalog`
- **Odoo:** 19.0 Community
- **Depends:** `product`
- **License:** LGPL-3
- **Model:** `safety.catalog.category` (hierarchical: name, parent_id, sequence, slug, image, active)
- **Menu:** Safety Catalog → Storefront Categories
