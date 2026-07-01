"use client"
import { useMemo, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Variant = { id: number; size: string; color: string; sku: string; price: number; qty_available: number; in_stock: boolean }
type Feature = { label: string; value: string; icon?: string }
type Doc = { type: string; label: string; url: string }
type Product = {
  id: number
  name: string
  slug: string
  model?: string
  brand?: { name: string; slug: string } | null
  price: number
  stock_status: "in" | "low" | "out"
  main_image_url?: string | null
  short_description?: string
  long_description?: string
  gallery?: { url: string; alt: string }[]
  documents?: Doc[]
  features?: Feature[]
  variants?: Variant[]
  categories?: string[]
}

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

const STOCK: Record<string, { label: string; bg: string; fg: string }> = {
  in: { label: "Нөөцтэй", bg: "#e2f2da", fg: "#44782a" },
  low: { label: "Бага үлдэгдэлтэй", bg: "#fef3cd", fg: "#a67c00" },
  out: { label: "Захиалгаар", bg: "#ffe9b9", fg: "#a97432" },
}

export default function ManadaProductDetail({ product, base, phone }: { product: Product; base: string; phone: string }) {
  const p = product
  const images = useMemo(() => {
    const arr: { url: string; alt: string }[] = []
    if (p.main_image_url) arr.push({ url: base + p.main_image_url, alt: p.name })
    for (const g of p.gallery || []) arr.push({ url: base + g.url, alt: g.alt || p.name })
    return arr
  }, [p, base])

  const [active, setActive] = useState(0)

  const sizes = useMemo(() => {
    const seen = new Set<string>()
    const out: Variant[] = []
    for (const v of p.variants || []) {
      if (v.size && !seen.has(v.size)) {
        seen.add(v.size)
        out.push(v)
      }
    }
    return out
  }, [p])

  const [sizeId, setSizeId] = useState<number | null>(sizes[0]?.id ?? null)
  const selected = sizes.find((v) => v.id === sizeId) || null

  const price = selected?.price || p.price
  const stockStatus = selected ? (selected.qty_available > 10 ? "in" : selected.qty_available > 0 ? "low" : "out") : p.stock_status
  const st = STOCK[stockStatus] || STOCK.out

  return (
    <div style={{ background: "#fff" }}>
      <div className="ms-container" style={{ padding: "22px 20px 8px" }}>
        <div style={{ fontSize: 12, color: "#9ca3af" }}>
          <LocalizedClientLink href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Нүүр</LocalizedClientLink>
          <span style={{ margin: "0 8px" }}>/</span>
          <LocalizedClientLink href="/store" style={{ color: "#9ca3af", textDecoration: "none" }}>Дэлгүүр</LocalizedClientLink>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#151515" }}>{p.name}</span>
        </div>
      </div>

      <div className="ms-container" style={{ padding: "12px 20px 56px", display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)", gap: 40 }}>
        {/* ── Gallery ── */}
        <div>
          <div style={{ position: "relative", background: "#f7f7f8", border: "1px solid #ededed", borderRadius: 8, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {images.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[Math.min(active, images.length - 1)].url} alt={p.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <span style={{ color: "#c3c7cd", fontSize: 13 }}>Зураг байхгүй</span>
            )}
            {images.length > 1 && (
              <>
                <button aria-label="Өмнөх" onClick={() => setActive((i) => (i - 1 + images.length) % images.length)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", border: "1px solid #e5e7eb", background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", cursor: "pointer", color: "#151515", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>‹</button>
                <button aria-label="Дараах" onClick={() => setActive((i) => (i + 1) % images.length)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 42, height: 42, borderRadius: "50%", border: "1px solid #e5e7eb", background: "rgba(255,255,255,0.92)", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", cursor: "pointer", color: "#151515", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>›</button>
                <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 12 }}>
                  {Math.min(active, images.length - 1) + 1} / {images.length}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ width: 70, height: 70, borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#f7f7f8", border: i === active ? "2px solid #FFCC00" : "1px solid #e5e7eb", padding: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.alt} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Info ── */}
        <div>
          {p.brand?.name && (
            <div style={{ fontSize: 12, color: "#8a6d00", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{p.brand.name}</div>
          )}
          <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: 30, fontWeight: 800, color: "#151515", lineHeight: 1.15, margin: "0 0 6px" }}>{p.name}</h1>
          {p.model && <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>Модель: {p.model}</div>}

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "14px 0" }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: "#151515" }}>{price > 0 ? fmt(price) : "Үнэ асуух"}</span>
            <span style={{ background: st.bg, color: st.fg, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>{st.label}</span>
          </div>

          {p.short_description && (
            <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.7, margin: "0 0 18px" }}>{p.short_description}</p>
          )}

          {/* Size selector */}
          {sizes.length > 0 && (
            <div style={{ margin: "0 0 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#151515", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Хэмжээ сонгох</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sizes.map((v) => {
                  const isSel = v.id === sizeId
                  const oos = v.qty_available <= 0
                  return (
                    <button key={v.id} onClick={() => setSizeId(v.id)} style={{ minWidth: 46, padding: "9px 14px", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, background: isSel ? "#151515" : "#fff", color: isSel ? "#fff" : oos ? "#c3c7cd" : "#151515", border: isSel ? "2px solid #151515" : "1px solid #d1d5db", textDecoration: oos ? "line-through" : "none" }}>
                      {v.size}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "8px 0 24px" }}>
            <a href={`tel:${phone}`} className="ms-btn-gold">Захиалах / Үнийн санал</a>
            <a href={`tel:${phone}`} className="ms-btn-ghost" style={{ color: "#151515", borderColor: "#d1d5db" }}>Утсаар холбогдох</a>
          </div>

          {/* Features / specs */}
          {(p.features?.length ?? 0) > 0 && (
            <div style={{ border: "1px solid #ededed", borderRadius: 8, overflow: "hidden", marginBottom: 20 }}>
              <div style={{ background: "#f7f7f8", padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "#151515", textTransform: "uppercase", letterSpacing: "0.04em" }}>Үзүүлэлт</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {p.features!.map((f, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "10px 16px", color: "#6b7280", width: "40%" }}>{f.label}</td>
                      <td style={{ padding: "10px 16px", color: "#151515", fontWeight: 600 }}>{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Documents */}
          {(p.documents?.length ?? 0) > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#151515", textTransform: "uppercase", marginBottom: 10 }}>Бичиг баримт</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.documents!.map((d, i) => (
                  <a key={i} href={base + d.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#8a6d00", textDecoration: "none" }}>📄 {d.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Long description ── */}
      {p.long_description && (
        <div style={{ background: "#f7f7f8", padding: "40px 0" }}>
          <div className="ms-container" style={{ padding: "0 20px" }}>
            <div className="ms-sechead">
              <div className="bar" />
              <span className="title">Дэлгэрэнгүй тайлбар</span>
              <div className="rule" />
            </div>
            <div style={{ maxWidth: 860, fontSize: 15, color: "#374151", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: p.long_description }} />
          </div>
        </div>
      )}
    </div>
  )
}
