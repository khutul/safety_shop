import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type ApiProduct = {
  id: number
  name: string
  slug: string
  brand: { name: string; slug: string } | null
  price: number
  in_stock: boolean
  stock_status: "in" | "low" | "out"
  main_image_url: string | null
}
type ApiCategory = { id: number; name: string; slug: string; children?: ApiCategory[] }

const STOCK_LABEL: Record<string, string> = { in: "Нөөцтэй", low: "Бага үлдэгдэлтэй", out: "Захиалгаар" }

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { cache: "no-store" })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

function CheckIcon() {
  return (
    <svg width="12" height="12" fill="currentColor" viewBox="0 0 13 13">
      <path d="M12,4.4L5.5,11L1,6.5l1.4-1.4l3.1,3.1L10.6,3L12,4.4z" />
    </svg>
  )
}

function RailCard({ p }: { p: ApiProduct }) {
  const img = p.main_image_url ? BASE + p.main_image_url : null
  const inStock = p.stock_status !== "out"
  return (
    <LocalizedClientLink
      href={`/products/${p.slug}`}
      style={{ textDecoration: "none", display: "block", width: 210, flexShrink: 0 }}
    >
      <div className="ms-card" style={{ cursor: "pointer" }}>
        <div style={{ height: 34, lineHeight: "34px", padding: "0 12px", borderBottom: "1px solid #f5f5f5" }}>
          <span style={{ fontSize: 10, color: p.brand ? "#828282" : "#d1d5db", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {p.brand?.name || "MANADA SAFETY"}
          </span>
        </div>
        <div style={{ height: 168, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", overflow: "hidden" }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          ) : (
            <span style={{ fontSize: 11, color: "#c3c7cd" }}>Зураг байхгүй</span>
          )}
        </div>
        <div style={{ padding: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#210a2d", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 8 }}>
            {p.name}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: inStock ? "#e2f2da" : "#ffe9b9", color: inStock ? "#44782a" : "#a97432", borderRadius: 12, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>
              {inStock ? <CheckIcon /> : "⏳"}
              {STOCK_LABEL[p.stock_status]}
            </span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{fmt(p.price)}</span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

async function CategoryRail({ cat }: { cat: ApiCategory }) {
  const data = await getJSON<{ products: ApiProduct[]; count: number }>(
    `${API}/products?category=${encodeURIComponent(cat.slug)}&limit=10`
  )
  const products = data?.products ?? []
  if (products.length === 0) return null

  return (
    <div style={{ marginBottom: 36 }}>
      <div className="ms-sechead">
        <div className="bar" />
        <span className="title">{cat.name}</span>
        <div className="rule" />
        <LocalizedClientLink href={`/store?category=${cat.slug}`} className="more">
          Бүгд ({data?.count ?? products.length}) →
        </LocalizedClientLink>
      </div>
      <div className="no-scrollbar" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {products.map((p) => (
          <RailCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}

export default async function CategoryRails() {
  const cats = (await getJSON<ApiCategory[]>(`${API}/categories`)) ?? []
  // Flatten one level (roots + children) so every category with products gets a rail.
  const flat: ApiCategory[] = []
  for (const c of cats) {
    flat.push(c)
    for (const ch of c.children ?? []) flat.push(ch)
  }

  return (
    <div style={{ background: "#f7f7f8", padding: "36px 0 48px" }}>
      <div className="ms-container">
        {flat.map((cat) => (
          // @ts-expect-error Async Server Component
          <CategoryRail key={cat.id} cat={cat} />
        ))}
      </div>
    </div>
  )
}
