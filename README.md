# safety_shop — Manada Safety eCommerce Platform

Хөдөлмөр хамгааллын хэрэгсэл (PPE) худалдааны цогц систем: онлайн захиалга,
төлбөр тооцоо (QPay), Odoo ERP бүртгэлтэй бүрэн уялдсан headless архитектур.

**Live:** <https://manada.mn>

## Архитектур

```
Хэрэглэгч → Next.js storefront → REST API (/api/v1) → Odoo 19 CE (headless ERP) → PostgreSQL
```

- **Odoo нь цорын ганц үнэний эх сурвалж** — бараа, ангилал, брэнд, үнэ, нөөц,
  захиалга, харилцагч бүгд Odoo-д. Odoo Website/eCommerce ашигладаггүй.
- **Storefront** нь Medusa DTC starter-аас хөрвүүлсэн Next.js апп бөгөөд бүх
  өгөгдлөө `/api/v1`-ээс авдаг (`next.config.js`-ийн rewrites-ээр Odoo руу proxy хийдэг).
- Үнэ, НӨАТ, хямдрал, нөөцийн тооцоог зөвхөн Odoo хийнэ — controller болон
  frontend талд бизнес логик дахин бичихгүй.

## Repo бүтэц

| Зам | Тайлбар |
|---|---|
| `apps/storefront/` | Next.js storefront (Tailwind, App Router) |
| `odoo/` | Odoo 19 CE dev орчин (docker-compose, config, addons) |
| `odoo/addons/safety_catalog/` | Каталогийн суурь модуль: brand, category, image, document, feature, hero, industry, site settings, partner request, stock count |
| `odoo/addons/safety_api/` | `/api/v1` REST controllers + QPay төлбөр + захиалга |
| `odoo/docs/` | API contract, ERD, өгөгдлийн загварууд |
| `deploy/` | Production docker-compose + nginx configs + гаргах заавар |
| `data/` | Түүхий материал (брэндбүүк г.м.) |

## Хөгжүүлэлт (локал)

**Odoo backend:**

```bash
cd odoo
docker compose up -d          # Odoo 19 → localhost:8079, PostgreSQL 16 → 5440
```

**Storefront:**

```bash
cd apps/storefront
npm install
npm run dev                   # localhost:8000, ODOO_INTERNAL_URL=http://localhost:8079
```

## Гаргалт (production)

Заавар: [`deploy/README.md`](deploy/README.md). Товчоор:

```bash
# Сервер дээр (/opt/safety_shop):
git pull
docker compose -f deploy/docker-compose.prod.yml --env-file deploy/.env up -d --build storefront
# Odoo модуль өөрчлөгдсөн бол:
docker compose -f deploy/docker-compose.prod.yml run --rm odoo odoo \
  -c /etc/odoo/odoo.conf -d safety_shop -u safety_catalog,safety_api --stop-after-init
docker compose -f deploy/docker-compose.prod.yml restart odoo
```

**Урсгал:** Windows дээр засвар → commit → push → сервер дээр `git pull` → build.
Файл гараар хуулахгүй.

## Дүрэм журам

Инженерчлэлийн дүрэм: [`odoo/PROJECT_RULES.md`](odoo/PROJECT_RULES.md) —
Standard First, Extend before Replace, Community only, security заавал.

API гэрээ: [`odoo/docs/API_CONTRACT.md`](odoo/docs/API_CONTRACT.md)
