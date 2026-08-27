import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { orderCategoryTree } from "@lib/util/category-order"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Cat = { id: number; name: string; slug: string; count?: number; image_url?: string | null; children?: Cat[] }

const ICON: Record<string, string> = {
  "head-protection": "M4 16a8 8 0 0 1 16 0 M2.5 16h19",
  "eye-face-protection": "M4 12h16 M5 12a3.5 3.5 0 1 0 7 0 M12 12a3.5 3.5 0 1 0 7 0",
  "respiratory-protection": "M3 9c5-2.5 13-2.5 18 0v3.5c-5 3.5-13 3.5-18 0z",
  "hearing-protection": "M4 13v-1a8 8 0 0 1 16 0v1 M3 12h3v7H3z M18 12h3v7h-3z",
  "hand-protection": "M8 21v-8 M8 13V6.5a1.5 1.5 0 0 1 3 0V11 M11 11V5a1.5 1.5 0 0 1 3 0v6 M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7H8",
  "workwear": "M8 3l4 3 4-3 4 3-2 3v12H6V9L4 6z",
  "foot-protection": "M7 3v9l-2 2v5h12a3 3 0 0 0 2.5-4.5L14 11V3z",
  "height-safety": "M9 8a3 3 0 1 1 6 0v8a3 3 0 0 1-6 0 M12 5v3",
  "traffic-safety": "M10 4h4l4 16H6z M8.5 11h7 M7.5 15h9",
  "first-aid": "M3 6h18v14H3z M12 10v6 M9 13h6",
  "general-protection": "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z",
}
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

export default async function CategoryCards() {
  const cats = await getCats()
  if (!cats.length) return null
  return (
    <section style={{ background: "var(--ms-bg)", padding: "48px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark" style={{ marginBottom: 28 }}>
          <div className="bar" />
          <span className="title">Бүтээгдэхүүний ангилал</span>
          <div className="rule" />
          <LocalizedClientLink href="/store" className="more">Бүгд →</LocalizedClientLink>
        </div>
        <div className="ms-grid-cats">
          {cats.map((c) => (
            <LocalizedClientLink key={c.id} href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`} style={{ textDecoration: "none" }}>
              <div className="ms-cattile">
                <div style={{ height: 140, background: "#f4f5f7", overflow: "hidden", position: "relative" }}>
                  {c.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={BASE + c.image_url} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#9aa0aa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                        {(ICON[c.slug] || ICON["general-protection"]).split(" M").map((s, i) => <path key={i} d={i === 0 ? s : "M" + s} />)}
                      </svg>
                    </div>
                  )}
                </div>
                <div style={{ padding: "13px 10px" }}>
                  <span className="ttl">{c.name}</span>
                  {typeof c.count === "number" && c.count > 0 && (
                    <div style={{ fontSize: 10.5, marginTop: 5, fontWeight: 700 }}>
                      <span style={{ color: "#FFCC00" }}>{c.count}</span>
                      <span style={{ color: "rgba(255,255,255,0.45)" }}> бүтээгдэхүүн</span>
                    </div>
                  )}
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 28 }}>
          <LocalizedClientLink href="/store" className="ms-btn-ghost" style={{ fontSize: 13, padding: "11px 28px" }}>
            Бүх ангиллыг үзэх
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
