import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type P = { id: number; name: string; slug: string; brand?: { name: string } | null; price: number; old_price?: number | null; discount_pct?: number | null; stock_status: string; main_image_url?: string | null }

function fmt(n: number) { return `${(n || 0).toLocaleString("mn-MN")}₮` }

async function getNewest(): Promise<P[]> {
  try {
    const res = await fetch(`${API}/products?sort=newest&limit=6&lang=mn`, { next: { revalidate: 120 } })
    if (!res.ok) return []
    const d = await res.json()
    return d.products || []
  } catch {
    return []
  }
}

function ImagePlaceholder() {
  return (
    <div className="ms-imgph">
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#b9bec7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <span>Manada Safety</span>
    </div>
  )
}

export default async function FeaturedBlock() {
  const items = await getNewest()
  if (!items.length) return null
  return (
    <section style={{ background: "var(--ms-bg)", padding: "48px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark">
          <div className="bar" />
          <span className="title">Шинээр ирсэн бараа</span>
          <div className="rule" />
          <LocalizedClientLink href="/store?sortBy=created_at" className="more">Бүгдийг үзэх →</LocalizedClientLink>
        </div>
        <div className="ms-grid-products">
          {items.map((p) => (
            <LocalizedClientLink key={p.id} href={`/products/${p.slug}`} style={{ textDecoration: "none" }}>
              <div className="ms-card-dark" style={{ position: "relative", display: "flex", flexDirection: "column", height: "100%" }}>
                {p.discount_pct ? (
                  <div style={{ position: "absolute", top: 8, left: 8, background: "#d62828", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 2, textTransform: "uppercase", zIndex: 1, letterSpacing: "0.04em" }}>-{p.discount_pct}%</div>
                ) : (
                  <div style={{ position: "absolute", top: 8, left: 8, background: "#FFCC00", color: "#151515", fontSize: 10, fontWeight: 800, padding: "3px 9px", borderRadius: 2, textTransform: "uppercase", zIndex: 1, letterSpacing: "0.04em" }}>Шинэ</div>
                )}
                <div style={{ height: 150, background: "#f4f5f7", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {p.main_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={BASE + p.main_image_url} alt={p.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>
                <div style={{ padding: "11px 12px 12px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
                    {p.brand?.name || "Manada Safety"}
                  </div>
                  <div className="ms-clamp2" style={{ fontSize: 12.5, fontWeight: 500, color: "rgba(255,255,255,0.92)", lineHeight: 1.3, marginBottom: 8 }}>{p.name}</div>
                  <span style={{ marginTop: "auto", display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#FFCC00" }}>{p.price > 0 ? fmt(p.price) : "Үнэ асуух"}</span>
                    {p.old_price ? (
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>{fmt(p.old_price)}</span>
                    ) : null}
                  </span>
                </div>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}
