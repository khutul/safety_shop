"use client"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Cat = { id: number; name: string; slug: string; count?: number; image_url?: string | null; children?: Cat[] }

const MENU: { label: string; href: string; mega?: boolean }[] = [
  { label: "Нүүр хуудас", href: "/" },
  { label: "Бүтээгдэхүүн", href: "/store", mega: true },
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
        <LocalizedClientLink href={`/store?category=${c.slug}`} onClick={onNav} style={{ fontFamily: "var(--ms-font-display)", fontSize: 15, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", textDecoration: "none", lineHeight: 1.15 }}>
          {c.name}
        </LocalizedClientLink>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {kids.slice(0, 5).map((sub) => (
          <LocalizedClientLink key={sub.id} href={`/store?category=${sub.slug}`} onClick={onNav} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>
            <span>{sub.name}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
          </LocalizedClientLink>
        ))}
        <LocalizedClientLink href={`/store?category=${c.slug}`} onClick={onNav} style={{ fontSize: 12, fontWeight: 700, color: "#FFCC00", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 4 }}>
          Бүгдийг үзэх →
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default function PrimaryMenu() {
  const [cats, setCats] = useState<Cat[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data)) setCats(data)
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
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 12px", display: "flex", alignItems: "center", height: 46 }}>
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
      </div>

      {open && cats.length > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: "100%", background: "#151515", borderTop: "2px solid #FFCC00", boxShadow: "0 24px 48px rgba(0,0,0,0.55)", zIndex: 60 }}>
          <div style={{ maxWidth: 1340, margin: "0 auto", padding: "24px 20px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px 32px" }}>
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
