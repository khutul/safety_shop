import { Suspense } from "react"
import CartButton from "@modules/layout/components/cart-button"
import SearchBox from "@modules/layout/components/search-box"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SidebarWrapper from "./sidebar-wrapper"
import PrimaryMenu from "./primary-menu"

function CartIconSVG() {
  return (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="7" cy="17" r="2" />
      <circle cx="15" cy="17" r="2" />
      <path d="M20,4.4V5l-1.8,6.3c-0.1,0.4-0.5,0.7-1,0.7H6.7c-0.4,0-0.8-0.3-1-0.7L3.3,3.9C3.1,3.3,2.6,3,2.1,3H0.4C0.2,3,0,2.8,0,2.6V1.4C0,1.2,0.2,1,0.4,1h2.5c1,0,1.8,0.6,2.1,1.6L5.1,3l2.3,6.8c0,0.1,0.2,0.2,0.3,0.2h8.6c0.1,0,0.3-0.1,0.3-0.2l1.3-4.4C17.9,5.2,17.7,5,17.5,5H9.4C9.2,5,9,4.8,9,4.6V3.4C9,3.2,9.2,3,9.4,3h9.2C19.4,3,20,3.6,20,4.4z" />
    </svg>
  )
}

const UTIL_LEFT = [
  { icon: "✓", label: "100% жинхэнэ бараа" },
  { icon: "🚚", label: "Үнэгүй хүргэлт (100,000₮-с дээш)" },
  { icon: "⏱", label: "УБ хотод 24 цагийн дотор" },
]

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* ── Utility bar ── */}
      <div className="ms-hide-mobile" style={{ background: "#0C0C0C", borderBottom: "1px solid #1c1c1c" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 32, gap: 22 }}>
          {UTIL_LEFT.map((u) => (
            <span key={u.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              <span style={{ color: "#FFCC00", fontSize: 11 }}>{u.icon}</span>
              {u.label}
            </span>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
            <LocalizedClientLink href="/order-status" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              Захиалга шалгах
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              Бидэнтэй холбогдох
            </LocalizedClientLink>
            <a href="mailto:info@manadasafety.mn" style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textDecoration: "none" }}>
              Хэрэглэгчийн дэмжлэг
            </a>
          </div>
        </div>
      </div>

      {/* ── Main row ── */}
      <header style={{ background: "#151515", borderBottom: "1px solid #2A2A2A", boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 64, gap: 16 }}>
          <LocalizedClientLink href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/manada-logo-light.png" alt="Manada Safety" style={{ height: 42, width: "auto", display: "block" }} />
              <div className="ms-hide-mobile" style={{ lineHeight: 1.12 }}>
                <div style={{ fontSize: 19, fontWeight: 900, color: "#FFCC00", letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: "var(--ms-font-display)" }}>MANADA</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.24em", textTransform: "uppercase" }}>SAFETY MN</div>
              </div>
            </div>
          </LocalizedClientLink>

          <SidebarWrapper />

          <div className="ms-hide-mobile" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <SearchBox />
          </div>

          <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto", flexShrink: 0 }}>
            <LocalizedClientLink href="/order-status" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, padding: "6px 8px" }}>
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M9 5h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9z" />
                <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span className="ms-hide-mobile" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Захиалга шалгах</span>
            </LocalizedClientLink>
            <Suspense fallback={
              <LocalizedClientLink href="/cart" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "6px 8px", display: "flex", alignItems: "center" }}>
                <CartIconSVG />
              </LocalizedClientLink>
            }>
              <CartButton />
            </Suspense>
          </div>
        </div>
        <PrimaryMenu />
      </header>
    </div>
  )
}
