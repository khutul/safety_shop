"use client"
import { useState, useEffect } from "react"
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
function CatIcon({ slug }: { slug: string }) {
  const d = ICON[slug] || ICON["general-protection"]
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {d.split(" M").map((s, i) => <path key={i} d={i === 0 ? s : "M" + s} />)}
    </svg>
  )
}

const FALLBACK: Cat[] = [
  { id: -1, name: "Хөдөлмөр хамгааллын хувцас", slug: "workwear" },
  { id: -2, name: "Хөлийн хамгаалалт", slug: "foot-protection" },
  { id: -3, name: "Гар хамгаалах", slug: "hand-protection" },
]

function Column({ c, onNav }: { c: Cat; onNav: () => void }) {
  const kids = c.children || []
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }}>
        {c.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={BASE + c.image_url} alt="" style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
        ) : (
          <CatIcon slug={c.slug} />
        )}
        <LocalizedClientLink href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`} onClick={onNav} style={{ fontFamily: "var(--ms-font-display)", fontSize: 14, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", textDecoration: "none", lineHeight: 1.15 }}>
          {c.name}
        </LocalizedClientLink>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {kids.slice(0, 5).map((sub) => (
          <LocalizedClientLink key={sub.id} href={sub.slug ? `/store?category=${sub.slug}` : `/store?category_id=${sub.id}`} onClick={onNav} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            <span>{sub.name}</span><span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`} onClick={onNav} style={{ fontSize: 12, fontWeight: 700, color: "#FFCC00", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
          Бүгдийг үзэх →
        </LocalizedClientLink>
      </div>
    </div>
  )
}

function MobileRow({ c, onNav }: { c: Cat; onNav: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const kids = c.children || []
  return (
    <div style={{ borderBottom: "1px solid #232323" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <LocalizedClientLink
          href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`}
          onClick={onNav}
          style={{ flex: 1, display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.02em", fontFamily: "var(--ms-font-display)" }}
        >
          <CatIcon slug={c.slug} />
          {c.name}
        </LocalizedClientLink>
        {kids.length > 0 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            aria-label="Дэд ангилал"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "14px 18px", color: "rgba(255,255,255,0.5)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
          </button>
        )}
      </div>
      {expanded && kids.length > 0 && (
        <div style={{ paddingBottom: 8 }}>
          {kids.map((sub) => (
            <LocalizedClientLink
              key={sub.id}
              href={sub.slug ? `/store?category=${sub.slug}` : `/store?category_id=${sub.id}`}
              onClick={onNav}
              style={{ display: "block", padding: "10px 16px 10px 50px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13.5 }}
            >
              {sub.name}
            </LocalizedClientLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false)
  const [cats, setCats] = useState<Cat[]>(FALLBACK)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`)
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data) && data.length) setCats(orderCategoryTree(data))
      } catch {}
    })()
    return () => { alive = false }
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        style={{ background: "#FFCC00", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#151515", fontSize: 13, fontWeight: 800, padding: "9px 16px", letterSpacing: "0.04em", textTransform: "uppercase", flexShrink: 0, borderRadius: 3 }}
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
        БҮТЭЭГДЭХҮҮН
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 55 }} />
          <div
            onMouseLeave={() => setOpen(false)}
            style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#151515", borderTop: "2px solid #FFCC00", boxShadow: "0 24px 48px rgba(0,0,0,0.55)", zIndex: 60, maxHeight: "72vh", overflowY: "auto" }}
          >
            {/* Desktop: multi-column mega menu */}
            <div className="ms-hide-mobile" style={{ maxWidth: 1340, margin: "0 auto", padding: "24px 20px" }}>
              <div className="ms-megagrid">
                {cats.map((c) => <Column key={c.id} c={c} onNav={() => setOpen(false)} />)}
              </div>
            </div>
            {/* Mobile: clean accordion list */}
            <div className="ms-show-mobile" style={{ flexDirection: "column" }}>
              {cats.map((c) => <MobileRow key={c.id} c={c} onNav={() => setOpen(false)} />)}
            </div>
          </div>
        </>
      )}
    </>
  )
}
