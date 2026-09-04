import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { orderCategoryTree } from "@lib/util/category-order"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

// How many category rails to show on the homepage at most.
const MAX_RAILS = 6

type ApiProduct = {
  id: number
  name: string
  slug: string
  brand: { name: string; slug: string } | null
  price: number
  old_price?: number | null
  discount_pct?: number | null
  in_stock: boolean
  stock_status: "in" | "low" | "out"
  made_to_order?: boolean
  main_image_url: string | null
}
type ApiCategory = {
  id: number
  name: string
  slug: string
  count?: number
  children?: ApiCategory[]
}

const STOCK_LABEL: Record<string, string> = { in: "Нөөцтэй", low: "Бага үлдэгдэлтэй", out: "Үйлдвэрлэгдэж байгаа" }

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

async function getJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 120 } })
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

function ImagePlaceholder() {
  return (
    <div className="ms-imgph">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#b9bec7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <span>Manada Safety</span>
    </div>
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
      <div className="ms-card-dark" style={{ position: "relative" }}>
        {p.discount_pct ? (
          <div style={{ position: "absolute", top: 8, left: 8, background: "#d62828", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 2, zIndex: 1, letterSpacing: "0.04em" }}>-{p.discount_pct}%</div>
        ) : null}
        <div style={{ height: 168, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", overflow: "hidden" }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {p.brand?.name || "Manada Safety"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.92)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 8 }}>
            {p.name}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "#FFCC00" }}>{fmt(p.price)}</span>
              {p.old_price ? (
                <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>{fmt(p.old_price)}</span>
              ) : null}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: p.made_to_order ? "#FFCC00" : inStock ? "#7fc75e" : "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600 }}>
              {p.made_to_order ? "✍️" : inStock ? <CheckIcon /> : "⏳"}
              {p.made_to_order ? "Захиалгаар хийгдэнэ" : STOCK_LABEL[p.stock_status]}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

function Rail({ cat, products }: { cat: ApiCategory; products: ApiProduct[] }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div className="ms-sechead on-dark">
        <div className="bar" />
        <span className="title">{cat.name}</span>
        <div className="rule" />
        <LocalizedClientLink
          href={cat.slug ? `/store?category=${cat.slug}` : `/store?category_id=${cat.id}`}
          className="more"
        >
          Бүгд ({cat.count ?? products.length}) →
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
  const cats = orderCategoryTree(
    (await getJSON<ApiCategory[]>(`${API}/categories?lang=mn`)) ?? []
  )

  // Root categories that actually have products, in menu order.
  const totalCount = (c: ApiCategory): number =>
    (c.count ?? 0) + (c.children ?? []).reduce((s, ch) => s + totalCount(ch), 0)
  const roots = cats.filter((c) => totalCount(c) > 0).slice(0, MAX_RAILS)

  const results = await Promise.all(
    roots.map((cat) =>
      getJSON<{ products: ApiProduct[]; count: number }>(
        `${API}/products?category_id=${cat.id}&limit=10&lang=mn`
      ).then((data) => ({
        cat: { ...cat, count: data?.count ?? totalCount(cat) },
        products: data?.products ?? [],
      }))
    )
  )

  // Safety net: if the backend ignores category_id (old Odoo module),
  // every rail returns the same list — show each unique list only once.
  const seen = new Set<string>()
  const rails = results.filter(({ products }) => {
    if (products.length === 0) return false
    const sig = products.map((p) => p.id).join(",")
    if (seen.has(sig)) return false
    seen.add(sig)
    return true
  })

  if (rails.length === 0) return null

  return (
    <div style={{ background: "#161616", padding: "48px 0 40px", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        {rails.map(({ cat, products }) => (
          <Rail key={cat.id} cat={cat} products={products} />
        ))}
      </div>
    </div>
  )
}
