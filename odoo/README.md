# safety_shop — Odoo 19 Community (Development)

ERP backend for the **safety_shop** PPE / occupational-safety eCommerce platform.

> **Architecture decision:** Odoo is used **only as a headless ERP/backend** —
> Products, Categories, Brands, Inventory, Sales Orders, Customers, Pricelists, Stock.
> We do **NOT** use the Odoo Website / eCommerce / themes. The customer-facing
> storefront will be a **separate Next.js frontend** that talks to Odoo over an API.

This environment is **completely isolated** from the existing `bodons_erp` project:
separate compose project, container names, volumes, ports, database user, and addons folder.
Running it will **not** touch or conflict with `bodons_erp`.

---

## Stack

| Component   | Version            | Host port | Container port |
|-------------|--------------------|-----------|----------------|
| Odoo        | 19 Community       | **8079**  | 8069           |
| Websocket   | (Odoo gevent)      | **8089**  | 8072           |
| PostgreSQL  | 16                 | **5440**  | 5432           |

Web UI: <http://localhost:8079>

---

## Folder structure

```
safety_shop/
└── odoo/
    ├── docker-compose.yml      # Odoo 19 + PostgreSQL 16 services
    ├── config/
    │   └── odoo.conf           # Odoo configuration (dbfilter, addons path, dev settings)
    ├── addons/                 # Custom addons (empty for now — standard Odoo first)
    │   └── .gitkeep
    ├── .gitignore
    └── README.md
```

> All commands below are run from inside the `safety_shop/odoo/` folder.

---

## 1. Start

```bash
cd safety_shop/odoo
docker compose up -d
```

First run pulls the `odoo:19` and `postgres:16` images, then starts both containers.
The compose **project name is `safety_shop`**, so everything is grouped and isolated.

## 2. Create the first database

The config restricts databases to names starting with `safety_shop` (`dbfilter = ^safety_shop.*$`).
Name your first database accordingly, e.g. **`safety_shop`**.

Option A — via the web UI (recommended):

1. Open <http://localhost:8079>
2. Database name: `safety_shop`
3. Master password: `safety_shop_master_2026`  (from `config/odoo.conf`)
4. Set an admin email/password, choose language/country, **leave "demo data" unchecked**.

Option B — from the command line (creates the DB and installs the backend apps in one go):

```bash
docker compose run --rm odoo odoo \
  -c /etc/odoo/odoo.conf \
  -d safety_shop \
  -i base,contacts,stock,sale_management,purchase \
  --without-demo=all --stop-after-init
```

Then start normally: `docker compose up -d`.

## 3. Install the backend modules (standard Odoo, no customization yet)

This is a **headless backend** — install only the ERP apps below. Do **NOT** install
Website (`website`) or eCommerce (`website_sale`); the storefront is a separate Next.js app.

| App / area        | Technical name   |
|-------------------|------------------|
| Contacts          | `contacts`       |
| Inventory         | `stock`          |
| Sales             | `sale_management`|
| Purchase          | `purchase`       |

> No custom modules exist yet — the goal is to evaluate standard Odoo functionality first.

## 3b. Headless / API access (for the Next.js storefront)

Odoo ships with an **External API out of the box** — no custom module needed to start:

- **XML-RPC:** `http://localhost:8079/xmlrpc/2/common` and `/xmlrpc/2/object`
- **JSON-RPC:** `http://localhost:8079/jsonrpc`

The Next.js frontend can authenticate and read Products / Categories / Stock / create
Sale Orders through these endpoints. Later we will build cleaner, purpose-built REST
endpoints (product, category, stock, cart/order, payment) as a custom module under `./addons`.

---

## Everyday commands

```bash
# Start (detached)
docker compose up -d

# Stop (keeps data/volumes)
docker compose stop

# Stop and remove containers (keeps named volumes / data)
docker compose down

# Restart everything
docker compose restart

# Restart just Odoo (e.g. after editing odoo.conf or adding an addon)
docker compose restart odoo

# View logs (all services, follow)
docker compose logs -f

# View only Odoo logs
docker compose logs -f odoo

# Open a shell in the Odoo container
docker compose exec odoo bash

# psql into the database
docker compose exec db psql -U odoo -d safety_shop
```

### Update / install a module on an existing DB

```bash
# Install a module
docker compose run --rm odoo odoo -c /etc/odoo/odoo.conf -d safety_shop -i <module> --stop-after-init

# Upgrade a module
docker compose run --rm odoo odoo -c /etc/odoo/odoo.conf -d safety_shop -u <module> --stop-after-init
```

---

## Reset (wipe data and start clean)

⚠️ This deletes the safety_shop database and filestore (volumes are project-scoped, so `bodons_erp` is untouched):

```bash
docker compose down -v
```

---

## Isolation from `bodons_erp` — quick reference

| Resource        | safety_shop value         |
|-----------------|---------------------------|
| Compose project | `safety_shop`             |
| Odoo container  | `safety_shop_odoo`        |
| DB container    | `safety_shop_db`          |
| DB volume       | `safety_shop_db_data`     |
| Odoo volume     | `safety_shop_odoo_data`   |
| Odoo HTTP port  | `8079`                    |
| Websocket port  | `8089`                    |
| Postgres port   | `5440`                    |
| dbfilter        | `^safety_shop.*$`         |

As long as `bodons_erp` does **not** also use ports 8079 / 8089 / 5440 or the names above,
the two environments run side by side without conflict.

> Tip: verify before starting — `docker ps --format '{{.Names}}\t{{.Ports}}'`
