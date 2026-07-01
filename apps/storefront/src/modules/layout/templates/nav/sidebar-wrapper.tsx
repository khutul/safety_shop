"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"

type Cat = { id: number; name: string; slug: string; children?: Cat[] }

// Fallback (used only if the API is unreachable)
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
      <div style={{ position: "fixed", top: 0, left: open ? 0 : -310, width: 290, height: "100%", background: "#1A1A1A", zIndex: 1032, overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.6)", transition: "left 0.28s ease" }}>
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
            return (
              <li key={cat.id} style={{ borderBottom: "1px solid #242424" }}>
                {hasKids ? (
                  <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "14px 18px", color: expanded === i ? "#FFCC00" : "rgba(255,255,255,0.8)", fontSize: 13, textAlign: "left" }}>
                    <span style={{ flex: 1, fontWeight: expanded === i ? 700 : 400 }}>{cat.name}</span>
                    <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" style={{ transform: expanded === i ? "rotate(90deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }}>
                      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                    </svg>
                  </button>
                ) : (
                  <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "14px 18px", color: "rgba(255,255,255,0.8)", fontSize: 13, textDecoration: "none" }}>
                    {cat.name}
                  </LocalizedClientLink>
                )}
                {hasKids && expanded === i && (
                  <ul style={{ listStyle: "none", margin: 0, padding: "0 0 8px 0", background: "#131313" }}>
                    <li>
                      <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 18px 10px 32px", color: "rgba(255,255,255,0.75)", fontSize: 12, textDecoration: "none", fontWeight: 600 }}>
                        Бүх {cat.name.toLowerCase()}
                      </LocalizedClientLink>
                    </li>
                    {kids.map((sub) => (
                      <li key={sub.id}>
                        <LocalizedClientLink href={`/store?category=${sub.slug}`} onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 18px 10px 32px", color: "rgba(255,255,255,0.55)", fontSize: 12, textDecoration: "none" }}>
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
