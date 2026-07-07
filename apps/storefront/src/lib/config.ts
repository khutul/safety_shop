import Medusa from "@medusajs/js-sdk"

// Medusa backend (legacy — kept so the original starter data layer still compiles).
let MEDUSA_BACKEND_URL = "http://localhost:9000"
if (process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL) {
  MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
}

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})

// ---- Odoo backend endpoints (single source of truth for the storefront) ----
export const ODOO_API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
export const ODOO_BASE = ""
