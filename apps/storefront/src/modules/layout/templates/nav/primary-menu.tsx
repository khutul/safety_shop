"use client"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import TranslateWidget from "@modules/layout/components/translate-widget"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Brand = { id: number; name: string; slug: string; logo_url?: string | null }

const MENU: { label: string; href: string }[] = [
  { label: "Нүүр хуудас", href: "/" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Safetoe", href: "/brands/safetoe" },
  { label: "Лого хатгамал", href: "/embroidery" },
]

export default function PrimaryMenu() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileBrandsOpen, setMobileBrandsOpen] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/brands`)
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data)) setBrands(data)
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [])

  const brandHref = (b: Brand) => `/store?brand_id=${b.id}`

  return (
    <nav
      style={{ position: "relative", background: "#181818", borderTop: "1px solid #232323" }}
      onMouseLeave={() => setOpen(false)}
    >
      {/* ── Desktop row ── */}
      <div className="ms-navrow ms-hide-mobile" style={{ maxWidth: 1340, margin: "0 auto", padding: "0 12px", display: "flex", alignItems: "center", height: 46 }}>
        {MENU.map((m) => (
          <LocalizedClientLink key={m.label} href={m.href} className="ms-navlink" onMouseEnter={() => setOpen(false)}>
            {m.label}
          </LocalizedClientLink>
        ))}
        {/* Brands dropdown trigger */}
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          style={{ display: "flex", alignItems: "center", position: "relative", alignSelf: "stretch" }}
        >
          <LocalizedClientLink href="/store" className="ms-navlink" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            Брэндүүд
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
          </LocalizedClientLink>
          {open && brands.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, background: "#1A1A1A", border: "1px solid #2A2A2A", borderTop: "2px solid #FFCC00", borderRadius: "0 0 4px 4px", boxShadow: "0 16px 40px rgba(0,0,0,0.6)", zIndex: 60, minWidth: 200, padding: "6px 0" }}>
              {brands.map((b) => (
                <LocalizedClientLink
                  key={b.id}
                  href={brandHref(b)}
                  onClick={() => setOpen(false)}
                  className="ms-brandlink"
                >
                  {b.name}
                </LocalizedClientLink>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
          <a href="tel:+97699102250" style={{ display: "flex", alignItems: "center", gap: 7, color: "#FFCC00", textDecoration: "none", fontSize: 13, fontWeight: 800 }}>
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
            9910-2250
          </a>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Ажлын цаг 09:00 - 18:00</span>
          <TranslateWidget mount />
        </div>
      </div>

      {/* ── Mobile collapsible menu ── */}
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
          {/* Brands accordion */}
          <button
            onClick={() => setMobileBrandsOpen((v) => !v)}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", padding: "13px 20px", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #1f1f1f" }}
          >
            Брэндүүд
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: mobileBrandsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {mobileBrandsOpen && brands.map((b) => (
            <LocalizedClientLink
              key={b.id}
              href={brandHref(b)}
              onClick={() => setMobileOpen(false)}
              style={{ padding: "11px 20px 11px 36px", color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: 13, borderBottom: "1px solid #1c1c1c" }}
            >
              {b.name}
            </LocalizedClientLink>
          ))}
          <TranslateWidget mount={false} mobile />
          <a href="tel:+97699102250" style={{ padding: "13px 20px", color: "#FFCC00", textDecoration: "none", fontSize: 13, fontWeight: 700 }}>
            📞 99102250 — Утсаар захиалах
          </a>
        </div>
      )}

    </nav>
  )
}
