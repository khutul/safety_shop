import { notFound } from "next/navigation"

// Category browsing happens at /store?category=... (Odoo-driven).
// This Medusa-era route exists only so old links resolve to a clean 404
// (and no build-time Medusa fetches happen).
export default function CategoryPage() {
  notFound()
}
