import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { orderCategoryTree } from "@lib/util/category-order"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Cat = { id: number; name: string; slug: string; image_url?: string | null; children?: Cat[] }

async function getCats(): Promise<Cat[]> {
  try {
    const res = await fetch(`${API}/categories?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return []
    const d = await res.json()
    return Array.isArray(d) ? orderCategoryTree(d) : []
  } catch {
    return []
  }
}

/** Quick category chips right under the hero (mockup-style). */
export default async function QuickCats() {
  const cats = (await getCats()).slice(0, 5)
  if (!cats.length) return null
  return (
    <div style={{ background: "#0D0D0D", borderTop: "1px solid #1c1c1c" }}>
      <div className="ms-container" style={{ padding: "16px 20px" }}>
        <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto" }}>
          {cats.map((c) => (
            <LocalizedClientLink
              key={c.id}
              href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`}
              className="ms-chip"
            >
              {c.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={BASE + c.image_url} alt="" style={{ width: 38, height: 38, objectFit: "contain", flexShrink: 0 }} />
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" />
                </svg>
              )}
              {c.name}
            </LocalizedClientLink>
          ))}
          <LocalizedClientLink href="/store" className="ms-chip" style={{ borderColor: "rgba(255,204,0,0.4)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <path d="M20 7h-9 M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
            </svg>
            Бүх бараа
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
