"use client"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { orderCategoryTree } from "@lib/util/category-order"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Cat = { id: number; name: string; slug: string; count?: number; image_url?: string | null; children?: Cat[] }

const MENU: { label: string; href: string; mega?: boolean }[] = [
  { label: "Нүүр хуудас", href: "/" },
  { label: "Safetoe", href: "/brands/safetoe" },
  { label: "Брэндүүд", href: "/store" },
  { label: "Салбарууд", href: "/store" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Холбоо барих", href: "/about" },
]

function MegaColumn({ c, onNav }: { c: Cat; onNav: () => void }) {
  const kids = c.children || []
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }}>
        {c.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={BASE + c.image_url} alt="" style={{ width: 40, height: 40, objectFit: "contain", flexShrink: 0 }} />
        ) : (
          <div style={{ width: 40, height: 40, borderRadius: 4, background: "#222", flexShrink: 0 }} />
        )}
        <LocalizedClientLink href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`} onClick={onNav} style={{ fontFamily: "var(--ms-font-display)", fontSize: 15, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", textDecoration: "none", lineHeight: 1.15 }}>
          {c.name}
        </LocalizedClientLink>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {kids.slice(0, 5).map((sub) => (
          <LocalizedClientLink key={sub.id} href={sub.slug ? `/store?category=${sub.slug}` : `/store?category_id=${sub.id}`} onClick={onNav} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            <span>{sub.name}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink href={c.slug ? `/store?category=${c.slug}` : `/store?category_id=${c.id}`} onClick={onNav} style={{ fontSize: 12, fontWeight: 700, color: "#FFCC00", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
          Бүгдийг үзэх →
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default function PrimaryMenu() {
  const [cats, setCats] = useState<Cat[]>([])
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`)
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data)) setCats(orderCategoryTree(data))
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <nav
      style={{ position: "relative", background: "#181818", borderTop: "1px solid #232323" }}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="ms-navrow ms-hide-mobile" style={{ maxWidth: 1340, margin: "0 auto", padding: "0 12px", display: "flex", alignItems: "center", height: 46 }}>
        {MENU.map((m) =>
          m.mega ? (
            <div key={m.label} onMouseEnter={() => setOpen(true)} style={{ display: "flex", alignItems: "center" }}>
              <LocalizedClientLink href={m.href} className="ms-navlink" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                {m.label}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
              </LocalizedClientLink>
            </div>
          ) : (
            <LocalizedClientLink key={m.label} href={m.href} className="ms-navlink" onMouseEnter={() => setOpen(false)}>
              {m.label}
            </LocalizedClientLink>
          )
        )}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <a href="tel:+97699102250" style={{ display: "flex", alignItems: "center", gap: 7, color: "#FFCC00", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
            9910-2250
          </a>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Ажлын цаг 09:00 - 18:00</span>
        </div>
      </div>

      {/* Mobile collapsible menu */}
      <button
        className="ms-show-mobile"
        onClick={() => setMobileOpen((v) => !v)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" /></svg>
          Цэс
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: mobileOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {mobileOpen && (
        <div className="ms-show-mobile" style={{ flexDirection: "column", borderTop: "1px solid #232323", background: "#151515" }}>
          {MENU.map((m) => (
            <LocalizedClientLink
              key={m.label}
              href={m.href}
              onClick={() => setMobileOpen(false)}
              style={{ padding: "13px 20px", color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #1f1f1f" }}
            >
              {m.label}
            </LocalizedClientLink>
          ))}
          <a href="tel:+97699102250" style={{ padding: "13px 20px", color: "#FFCC00", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            📞 99102250 — Утсаар захиалах
          </a>
        </div>
      )}

      {open && cats.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#151515", borderTop: "2px solid #FFCC00", boxShadow: "0 24px 48px rgba(0,0,0,0.55)", zIndex: 60 }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "24px 20px" }}>
            <div className="ms-megagrid">
              {cats.map((c) => (
                <MegaColumn key={c.id} c={c} onNav={() => setOpen(false)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
