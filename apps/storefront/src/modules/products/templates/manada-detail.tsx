"use client"
import { useMemo, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCart } from "@lib/cart/cart-context"

type Variant = { id: number; size: string; color: string; sku: string; price: number; old_price?: number | null; discount_pct?: number | null; qty_available: number; in_stock: boolean }
type Feature = { label: string; value: string; icon?: string }
type Doc = { type: string; label: string; url: string }
type Product = {
  id: number
  name: string
  slug: string
  model?: string
  brand?: { name: string; slug: string } | null
  price: number
  old_price?: number | null
  discount_pct?: number | null
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

/** Түгээмэл өнгөний нэр → swatch өнгө (олдохгүй бол текстээр л харагдана) */
const COLOR_HEX: Record<string, string> = {
  "цагаан": "#f5f5f5",
  "хар": "#1a1a1a",
  "улаан": "#d62828",
  "хөх": "#1f5fbf",
  "цэнхэр": "#3b82f6",
  "шар": "#FFCC00",
  "ногоон": "#2e9e44",
  "улбар шар": "#f97316",
  "саарал": "#9ca3af",
  "бор": "#8b5e3c",
  "хүрэн": "#6b3f2a",
  "ягаан": "#ec4899",
  "бэж": "#d6c7a1",
  "хаки": "#8a865d",
  "white": "#f5f5f5",
  "black": "#1a1a1a",
  "red": "#d62828",
  "blue": "#1f5fbf",
  "yellow": "#FFCC00",
  "green": "#2e9e44",
  "orange": "#f97316",
  "grey": "#9ca3af",
  "gray": "#9ca3af",
  "brown": "#8b5e3c",
}

function normColor(c: string) {
  return (c || "").trim().toLowerCase()
}

const STOCK: Record<string, { label: string; bg: string; fg: string }> = {
  in: { label: "Нөөцтэй", bg: "rgba(127,199,94,0.14)", fg: "#7fc75e" },
  low: { label: "Бага үлдэгдэлтэй", bg: "rgba(255,204,0,0.12)", fg: "#FFCC00" },
  out: { label: "Захиалгаар", bg: "rgba(255,255,255,0.08)", fg: "rgba(255,255,255,0.6)" },
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

  const variants = useMemo(() => p.variants || [], [p])

  // Distinct colours (all) and sizes (depend on the chosen colour)
  const colors = useMemo(() => {
    const seen = new Set<string>()
    return variants.filter((v) => v.color && !seen.has(v.color) && seen.add(v.color)).map((v) => v.color)
  }, [variants])

  const [color, setColor] = useState<string | null>(colors[0] ?? null)

  const sizesForColor = useMemo(() => {
    const seen = new Set<string>()
    return variants
      .filter((v) => (!color || !v.color || v.color === color) && v.size && !seen.has(v.size) && seen.add(v.size))
      .map((v) => v.size)
  }, [variants, color])

  const [size, setSize] = useState<string | null>(sizesForColor[0] ?? null)

  // The concrete variant for the current colour+size combination
  const selected = useMemo(() => {
    if (!variants.length) return null
    return (
      variants.find((v) => (!color || v.color === color) && (!size || v.size === size)) ||
      variants.find((v) => !color || v.color === color) ||
      variants[0]
    )
  }, [variants, color, size])

  const pickColor = (c: string) => {
    setColor(c)
    // Keep the size if it still exists under the new colour, else fall back
    const seen = new Set<string>()
    const avail = variants
      .filter((v) => (!v.color || v.color === c) && v.size && !seen.has(v.size) && seen.add(v.size))
      .map((v) => v.size)
    if (size && !avail.includes(size)) setSize(avail[0] ?? null)
  }

  const variantFor = (c: string | null, s: string | null) =>
    variants.find((v) => (!c || v.color === c) && (!s || v.size === s)) || null

  const { add } = useCart()
  const [added, setAdded] = useState(false)

  const addToCart = () => {
    // Cap the cart quantity at the available stock; out-of-stock items are
    // uncapped because the backorder flow handles them at checkout.
    const stockSource = selected ?? p.variants?.[0] ?? null
    const available = stockSource?.qty_available ?? 0
    add({
      productId: p.id,
      variantId: selected?.id ?? null,
      name: p.name,
      brand: p.brand?.name,
      size: selected?.size,
      color: selected?.color,
      price: (selected?.price || p.price) ?? 0,
      image: p.main_image_url ? base + p.main_image_url : null,
      maxQty: available > 0 ? available : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const price = selected?.price || p.price
  const oldPrice = selected ? selected.old_price : p.old_price
  const discountPct = selected ? selected.discount_pct : p.discount_pct
  const stockStatus = selected ? (selected.qty_available > 10 ? "in" : selected.qty_available > 0 ? "low" : "out") : p.stock_status
  const st = STOCK[stockStatus] || STOCK.out
  const availableQty = selected?.qty_available ?? 0

  return (
    <div style={{ background: "var(--ms-bg)" }}>
      <div className="ms-container" style={{ padding: "22px 20px 8px" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          <LocalizedClientLink href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Нүүр</LocalizedClientLink>
          <span style={{ margin: "0 8px" }}>/</span>
          <LocalizedClientLink href="/store" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Дэлгүүр</LocalizedClientLink>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.85)" }}>{p.name}</span>
        </div>
      </div>

      <div className="ms-container ms-pdp-grid" style={{ padding: "12px 20px 56px" }}>
        {/* ── Gallery ── */}
        <div>
          <div style={{ position: "relative", background: "#f4f5f7", border: "1px solid var(--ms-border)", borderRadius: 8, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            {images.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[Math.min(active, images.length - 1)].url} alt={p.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
            ) : (
              <div className="ms-imgph">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#b9bec7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
                <span>Manada Safety</span>
              </div>
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
                <button key={i} onClick={() => setActive(i)} style={{ width: 70, height: 70, borderRadius: 6, overflow: "hidden", cursor: "pointer", background: "#f4f5f7", border: i === active ? "2px solid #FFCC00" : "1px solid var(--ms-border)", padding: 0 }}>
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
            <div style={{ fontSize: 12, color: "#FFCC00", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{p.brand.name}</div>
          )}
          <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: 30, fontWeight: 800, color: "#ffffff", lineHeight: 1.15, margin: "0 0 6px" }}>{p.name}</h1>
          {p.model && <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 14 }}>Модель: {p.model}</div>}

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "14px 0" }}>
            <span style={{ display: "inline-flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: "#FFCC00" }}>{price > 0 ? fmt(price) : "Үнэ асуух"}</span>
              {oldPrice ? (
                <>
                  <span style={{ fontSize: 17, color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>{fmt(oldPrice)}</span>
                  {discountPct ? (
                    <span style={{ background: "#d62828", color: "#fff", fontSize: 12, fontWeight: 800, padding: "3px 10px", borderRadius: 2, letterSpacing: "0.04em" }}>-{discountPct}%</span>
                  ) : null}
                </>
              ) : null}
            </span>
            <span style={{ background: st.bg, color: st.fg, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>
              {st.label}
              {availableQty > 0 ? ` · ${availableQty} ширхэг` : ""}
            </span>
          </div>

          {p.short_description && (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", lineHeight: 1.7, margin: "0 0 18px" }}>{p.short_description}</p>
          )}

          {/* Colour selector */}
          {colors.length > 0 && (
            <div style={{ margin: "0 0 18px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                Өнгө сонгох{color ? <span style={{ color: "#FFCC00", marginLeft: 8, textTransform: "none" }}>{color}</span> : null}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {colors.map((c) => {
                  const isSel = c === color
                  const swatch = COLOR_HEX[normColor(c)]
                  const oos = (variantFor(c, null)?.qty_available ?? 0) <= 0 &&
                    variants.filter((v) => v.color === c).every((v) => v.qty_available <= 0)
                  return (
                    <button
                      key={c}
                      onClick={() => pickColor(c)}
                      title={c}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        padding: swatch ? "7px 12px" : "9px 14px",
                        borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700,
                        background: isSel ? "rgba(255,204,0,0.12)" : "var(--ms-surface)",
                        color: oos && !isSel ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.9)",
                        border: isSel ? "2px solid #FFCC00" : "1px solid var(--ms-border)",
                      }}
                    >
                      {swatch && (
                        <span style={{ width: 18, height: 18, borderRadius: "50%", background: swatch, border: "1px solid rgba(255,255,255,0.35)", flexShrink: 0 }} />
                      )}
                      {c}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Size selector */}
          {sizesForColor.length > 0 && (
            <div style={{ margin: "0 0 20px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Хэмжээ сонгох</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sizesForColor.map((s) => {
                  const isSel = s === size
                  const oos = (variantFor(color, s)?.qty_available ?? 0) <= 0
                  return (
                    <button key={s} onClick={() => setSize(s)} style={{ minWidth: 46, padding: "9px 14px", borderRadius: 4, cursor: "pointer", fontSize: 14, fontWeight: 700, background: isSel ? "#FFCC00" : "var(--ms-surface)", color: isSel ? "#151515" : oos ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.85)", border: isSel ? "2px solid #FFCC00" : "1px solid var(--ms-border)", textDecoration: oos ? "line-through" : "none" }}>
                      {s}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "8px 0 24px" }}>
            <button onClick={addToCart} className="ms-btn-gold" style={{ minWidth: 220, justifyContent: "center", background: added ? "#7fc75e" : undefined }}>
              {added ? (
                <>
                  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" viewBox="0 0 24 24"><path d="M4 12l5 5L20 6" /></svg>
                  Сагсанд нэмэгдлээ
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M3 3h2l2.4 12.2A2 2 0 0 0 9.36 17H18a2 2 0 0 0 1.96-1.6L21.6 8H6" />
                    <circle cx="9.5" cy="20.5" r="1.5" />
                    <circle cx="17.5" cy="20.5" r="1.5" />
                  </svg>
                  Сагсанд нэмэх
                </>
              )}
            </button>
            <a href={`tel:${phone}`} className="ms-btn-ghost">Утсаар холбогдох</a>
          </div>

          {/* Trust / delivery info */}
          <div style={{ border: "1px solid var(--ms-border)", borderRadius: 8, background: "var(--ms-surface)", padding: "4px 16px", marginBottom: 20 }}>
            {[
              { icon: "🚚", t: "Хүргэлт", s: "Улаанбаатар хотод 24 цагт, 100,000₮-с дээш үнэгүй" },
              { icon: "🛡️", t: "100% жинхэнэ бараа", s: "Албан ёсны дистрибюторын баталгаатай" },
              { icon: "📞", t: "Мэргэжлийн зөвлөгөө", s: "99102250 — Даваа-Бямба 09:00-18:00" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderTop: i > 0 ? "1px solid var(--ms-border-soft)" : "none" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(255,255,255,0.88)" }}>{r.t}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)" }}>{r.s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Features / specs */}
          {(p.features?.length ?? 0) > 0 && (
            <div style={{ border: "1px solid var(--ms-border)", borderRadius: 8, overflow: "hidden", marginBottom: 20, background: "var(--ms-surface)" }}>
              <div style={{ background: "var(--ms-elevated)", padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "#ffffff", textTransform: "uppercase", letterSpacing: "0.04em" }}>Үзүүлэлт</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <tbody>
                  {p.features!.map((f, i) => (
                    <tr key={i} style={{ borderTop: "1px solid var(--ms-border-soft)" }}>
                      <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.5)", width: "40%" }}>{f.label}</td>
                      <td style={{ padding: "10px 16px", color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>{f.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Documents */}
          {(p.documents?.length ?? 0) > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", marginBottom: 10 }}>Бичиг баримт</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {p.documents!.map((d, i) => (
                  <a key={i} href={base + d.url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#FFCC00", textDecoration: "none" }}>📄 {d.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Long description ── */}
      {p.long_description && (
        <div style={{ background: "#161616", padding: "40px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
          <div className="ms-container" style={{ padding: "0 20px" }}>
            <div className="ms-sechead on-dark">
              <div className="bar" />
              <span className="title">Дэлгэрэнгүй тайлбар</span>
              <div className="rule" />
            </div>
            <div style={{ maxWidth: 860, fontSize: 15, color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: p.long_description }} />
          </div>
        </div>
      )}
    </div>
  )
}
