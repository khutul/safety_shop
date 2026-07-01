# PROJECT_RULES.md — Engineering Constitution

**Project:** safety_shop — ERP-powered PPE eCommerce Platform
**Backend:** Odoo 19 Community (headless ERP)
**Frontend:** Next.js (separate repository)
**Status:** Living document. Changes require team agreement and a PR.

> This document is the single source of truth for *how* we build. Code that
> violates these rules does not get merged, regardless of whether it "works".

---

## 0. Purpose & Scope

These rules govern the **Odoo backend repository** (`safety_shop_*` modules,
configuration, and docs). The Next.js frontend follows its own repo rules but
must honor the API contract and the architecture principles below.

---

## 1. Architecture Principles

1. **The architecture is fixed and approved.** It is not redesigned mid-sprint:
   `Customer → Next.js → REST API → Odoo 19 Community → PostgreSQL`.
2. **Odoo is a headless ERP.** We do **not** use Odoo Website, eCommerce, or
   themes as a customer-facing layer. No work depends on `website` / `website_sale`.
3. **Odoo is the single source of truth** for all business data and logic
   (products, stock, pricing, orders, customers).
4. **The API layer wraps standard Odoo logic — it never reimplements it.**
   Pricing, stock reservation, order totals, and taxes are computed by Odoo,
   not in controllers and not in Next.js.
5. **Standard First → Configure → Extend → Custom.** In that order, always.
   Custom code is the last resort, never the first.
6. **Extension before Replacement.** Inherit and add; never override or fork
   standard behavior when inheritance can achieve the goal.
7. **Small, cohesive, independent modules.** A module owns one clear concern and
   can be installed/uninstalled without breaking unrelated features.
8. **Every decision must support future upgrades.** Nothing that makes the next
   Odoo major-version migration harder than it has to be.

---

## 2. Odoo Development Rules

1. **Community only.** No dependency on Enterprise modules (`web_enterprise`,
   `account_accountant`, native Barcode app, Studio, Spreadsheet dashboards, etc.).
   If a feature seems to need Enterprise, raise it for discussion before building.
2. **Never edit Odoo core.** No changes to standard module source. Extend via
   inheritance (`_inherit`) and XML view inheritance (`xpath`) only.
3. **Prefer configuration over code.** UoM, pricelists, attributes, warehouses,
   routes, and promotions are configured in the UI, not coded.
4. **Inherit, don't replace.** Use `_inherit` to add fields/methods. Use
   `super()` in overridden methods. Do not blindly override standard methods.
5. **Security is mandatory, not optional.** Every new model ships with
   `ir.model.access.csv` entries (and record rules where relevant) in the same PR.
   No model is merged without access rights.
6. **No raw SQL** unless there is a measured performance reason and it is
   reviewed and documented. Use the ORM.
7. **Respect multi-company and `company_id`** where standard models do.
8. **Computed fields:** keep them non-stored unless a stored value is required
   for search/grouping; always declare `@api.depends` correctly.
9. **Translatable strings:** all user-facing labels/help texts are translatable;
   no hardcoded UI language in Python logic.
10. **Performance:** avoid N+1 patterns, batch with recordsets, prefer
    `read_group`/`search_read`; never loop queries inside loops.
11. **No print statements.** Use `logging` with an appropriate level.
12. **Custom field names are clean — no `x_` prefix.** The `x_` prefix is for
    Studio/manual fields. In versioned modules use descriptive snake_case
    (`brand_id`, `slug`, `is_published`). *(This supersedes the placeholder
    `x_*` names used in the design blueprints.)*

---

## 3. Module Naming Convention

- **Module technical name:** `safety_shop_<concern>` — lowercase, snake_case.
  Examples: `safety_shop_product`, `safety_shop_brand`, `safety_shop_api`.
- **Model `_name`:** dot-namespaced under the project: `safety_shop.brand`,
  `safety_shop.product.image`, `safety_shop.product.document`.
- **Module folder layout (standard Odoo):**
  ```
  safety_shop_product/
  ├── __init__.py
  ├── __manifest__.py
  ├── models/
  │   ├── __init__.py
  │   └── product_template.py
  ├── views/
  │   └── product_template_views.xml
  ├── security/
  │   └── ir.model.access.csv
  ├── data/
  └── README.md   (what this module does, in one paragraph)
  ```
- **One model per file**, file named after the model (`product_template.py`).
- **`__manifest__.py`:** accurate `name`, `summary`, `version`
  (`19.0.1.0.0`), `depends` (minimal!), `license` (`LGPL-3`), `author`,
  `category`. Declare *only* the dependencies actually used.
- **XML IDs:** `<model>_<purpose>` style, e.g. `view_safety_shop_brand_form`,
  `action_safety_shop_brand`, `menu_safety_shop_brand`.

---

## 4. Git Workflow

- **`main` is always deployable and protected.** No direct pushes.
- **Trunk-based, short-lived feature branches.** Branch off `main`, open a PR,
  get one review, merge, delete the branch.
- **Every PR maps to a backlog task** (e.g. `S1-04`). Small PRs > big PRs.
- **Rebase or squash-merge** to keep history linear and readable.
- **No merge without:** passing install/upgrade test, a review approval, and the
  Definition of Done satisfied.
- **`.gitignore` is respected** — never commit filestore, secrets, `.env`, or
  database dumps.

---

## 5. Branch Naming

```
<type>/<task-id>-<short-slug>
```
- **type:** `feature` | `fix` | `chore` | `refactor` | `docs`
- **examples:**
  - `feature/S1-04-brand-model`
  - `feature/S1-06-storefront-category`
  - `fix/S1-08-image-sequence`
  - `chore/S1-03-module-scaffold`

---

## 6. Commit Message Convention

We follow **Conventional Commits**:

```
<type>(<scope>): <subject>     [<task-id>]

<optional body — what & why, not how>
```

- **type:** `feat` | `fix` | `refactor` | `chore` | `docs` | `test` | `perf`
- **scope:** module or area, e.g. `brand`, `product`, `category`, `security`
- **subject:** imperative, lowercase, ≤ 72 chars
- **examples:**
  - `feat(brand): add safety_shop.brand model and views [S1-04]`
  - `feat(product): add brand_id to product.template [S1-05]`
  - `fix(category): correct parent_id recursion guard [S1-06]`
  - `chore(scaffold): create safety_shop_product module [S1-03]`

---

## 7. Coding Standards

**Python**
- PEP 8 + official Odoo coding guidelines.
- Import order: stdlib → Odoo → third-party (rarely).
- Model attribute order: `_name`, `_description`, `_inherit`, `_order`,
  fields, compute methods, constraints, CRUD overrides, action methods.
- Every model has a meaningful `_description`.
- Methods are documented when non-obvious; private methods prefixed `_`.
- Use `@api.depends`, `@api.constrains`, `@api.onchange` correctly and minimally.

**XML / Views**
- Inherit standard views via `xpath`; never copy-paste a full standard view.
- Put new product fields into clearly labeled notebook pages
  (Storefront / Media / Documents / Features / SEO).
- Consistent, prefixed XML IDs (see §3).

**Data & Security**
- `ir.model.access.csv` for every model, with least-privilege defaults.
- Demo/seed data lives in `data/` and is idempotent.

**General**
- No dead code, no commented-out blocks, no TODOs without a task ID.
- File encoding UTF-8; no trailing whitespace; newline at EOF.

---

## 8. Review Checklist (reviewer must confirm)

- [ ] PR maps to a backlog task; scope is small and focused.
- [ ] Standard-First respected (no custom where config/extension suffices).
- [ ] No Odoo core edits; extension via inheritance only.
- [ ] **No Enterprise dependency.**
- [ ] `ir.model.access.csv` present for all new models; least privilege.
- [ ] `__manifest__.py` deps are minimal and correct; version bumped.
- [ ] Field/model/XML-ID naming follows conventions; no `x_` prefix in modules.
- [ ] Views inherit cleanly; product form stays readable.
- [ ] No raw SQL / no N+1 loops / computed fields depend correctly.
- [ ] Strings translatable; logging instead of print.
- [ ] Module **installs and upgrades cleanly** on a fresh DB.
- [ ] Commit messages follow Conventional Commits with task ID.

---

## 9. Definition of Done

A task is **Done** only when **all** of the following are true:

1. Code is merged to `main` via an approved PR.
2. The module **installs on a fresh `safety_shop` DB and upgrades** on an
   existing one — both without errors or warnings.
3. New models have security rules; new fields appear correctly in the UI.
4. Behavior is verified against the relevant approved blueprint
   (Product Master Blueprint v1 / PIM Taxonomy / ERD).
5. The Review Checklist passes.
6. Naming, commits, and branch follow this document.
7. Any new module includes a one-paragraph `README.md`.
8. Nothing introduced makes a future Odoo upgrade harder (no core edits,
   no Enterprise deps, no hacks).

---

*End of constitution. When in doubt: Standard First, Extend before Replace,
keep it small, protect the upgrade path.*
