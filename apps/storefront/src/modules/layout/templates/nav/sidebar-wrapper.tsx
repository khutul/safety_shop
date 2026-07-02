"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"

type Cat = { id: number; name: string; slug: string; count?: number; image_url?: string | null; children?: Cat[] }

const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

const ICON_PATHS: Record<string, string> = {
  "head-protection": "M4 16a8 8 0 0 1 16 0 M2.5 16h19",
  "eye-face-protection": "M4 12h16 M5 12a3.5 3.5 0 1 0 7 0 M12 12a3.5 3.5 0 1 0 7 0",
  "respiratory-protection": "M3 9c5-2.5 13-2.5 18 0v3.5c-5 3.5-13 3.5-18 0z M3 10.5H1.5 M22.5 10.5H21",
  "hearing-protection": "M4 13v-1a8 8 0 0 1 16 0v1 M3 12h3v7H3z M18 12h3v7h-3z",
  "hand-protection": "M8 21v-8 M8 13V6.5a1.5 1.5 0 0 1 3 0V11 M11 11V5a1.5 1.5 0 0 1 3 0v6 M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7H8",
  "workwear": "M8 3l4 3 4-3 4 3-2 3v12H6V9L4 6z",
  "foot-protection": "M7 3v9l-2 2v5h12a3 3 0 0 0 2.5-4.5L14 11V3z",
  "height-safety": "M9 8a3 3 0 1 1 6 0v8a3 3 0 0 1-6 0 M12 5v3",
  "traffic-safety": "M10 4h4l4 16H6z M8.5 11h7 M7.5 15h9",
  "first-aid": "M3 6h18v14H3z M12 10v6 M9 13h6",
  "general-protection": "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z",
}

function CatIcon({ slug }: { slug: string }) {
  const d = ICON_PATHS[slug] || "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {d.split(" M").map((seg, i) => (
        <path key={i} d={(i === 0 ? seg : "M" + seg)} />
      ))}
    </svg>
  )
}

const FALLBACK: Cat[] = [
  { id: -1, name: "Хөдөлмөр хамгааллын хувцас", slug: "workwear" },
  { id: -2, name: "Хөлийн хамгаалалт", slug: "foot-protection" },
  { id: -3, name: "Гар хамгаалах", slug: "hand-protection" },
]

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [cats, setCats] = useState<Cat[]>(FALLBACK)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data) && data.length) setCats(data)
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, padding: "4px 8px", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        ЦЭС
      </button>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1031 }} />}
      <div style={{ position: "fixed", top: 0, left: open ? 0 : -320, width: 300, height: "100%", background: "#1A1A1A", zIndex: 1032, overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.6)", transition: "left 0.28s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #2A2A2A", background: "#151515" }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#FFCC00", letterSpacing: "0.1em" }}>АНГИЛАЛ</span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 22, lineHeight: 1 }}>x</button>
        </div>
        <LocalizedClientLink href="/store" onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", color: "#D62828", fontWeight: 700, fontSize: 13, textDecoration: "none", borderBottom: "1px solid #2A2A2A", background: "rgba(214,40,40,0.06)" }}>
          ХЯМДРАЛТАЙ БАРАА
        </LocalizedClientLink>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {cats.map((cat, i) => {
            const kids = cat.children || []
            const hasKids = kids.length > 0
            const label = (
              <>
                {cat.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={BASE + cat.image_url} alt="" style={{ width: 22, height: 22, objectFit: "contain", flexShrink: 0 }} />
                ) : (
                  <span style={{ color: "#FFCC00", display: "flex", flexShrink: 0 }}><CatIcon slug={cat.slug} /></span>
                )}
                <span style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: expanded === i ? 700 : 500 }}>{cat.name}</span>
                  {typeof cat.count === "number" && cat.count > 0 && (
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{cat.count} бүтээгдэхүүн</span>
                  )}
                </span>
              </>
            )
            return (
              <li key={cat.id} style={{ borderBottom: "1px solid #242424" }}>
                {hasKids ? (
                  <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", color: expanded === i ? "#FFCC00" : "rgba(255,255,255,0.85)", fontSize: 13, textAlign: "left" }}>
                    {label}
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" style={{ transform: expanded === i ? "rotate(90deg)" : "none", transition: "transform 0.2s", opacity: 0.5, flexShrink: 0 }}>
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                ) : (
                  <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={() => setOpen(false)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", color: "rgba(255,255,255,0.85)", fontSize: 13, textDecoration: "none" }}>
                    {label}
                  </LocalizedClientLink>
                )}
                {hasKids && expanded === i && (
                  <ul style={{ listStyle: "none", margin: 0, padding: "0 0 8px 0", background: "#131313" }}>
                    <li>
                      <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 18px 10px 52px", color: "rgba(255,255,255,0.75)", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                        Бүх {cat.name.toLowerCase()}
                      </LocalizedClientLink>
                    </li>
                    {kids.map((sub) => (
                      <li key={sub.id}>
                        <LocalizedClientLink href={`/store?category=${sub.slug}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 18px 10px 52px", color: "rgba(255,255,255,0.55)", fontSize: 12, textDecoration: "none" }}>
                          {sub.name}
                        </LocalizedClientLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
