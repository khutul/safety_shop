import { Suspense } from "react"
import CartButton from "@modules/layout/components/cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SidebarWrapper from "./sidebar-wrapper"
import WolfLogo from "@modules/layout/components/wolf-logo"

function CartIconSVG() {
  return (
    <svg width="22" height="22" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="7" cy="17" r="2" />
      <circle cx="15" cy="17" r="2" />
      <path d="M20,4.4V5l-1.8,6.3c-0.1,0.4-0.5,0.7-1,0.7H6.7c-0.4,0-0.8-0.3-1-0.7L3.3,3.9C3.1,3.3,2.6,3,2.1,3H0.4C0.2,3,0,2.8,0,2.6V1.4C0,1.2,0.2,1,0.4,1h2.5c1,0,1.8,0.6,2.1,1.6L5.1,3l2.3,6.8c0,0.1,0.2,0.2,0.3,0.2h8.6c0.1,0,0.3-0.1,0.3-0.2l1.3-4.4C17.9,5.2,17.7,5,17.5,5H9.4C9.2,5,9,4.8,9,4.6V3.4C9,3.2,9.2,3,9.4,3h9.2C19.4,3,20,3.6,20,4.4z" />
    </svg>
  )
}

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header style={{ background: "#151515", borderBottom: "1px solid #2A2A2A", boxShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", height: 64, gap: 14 }}>
          <SidebarWrapper />
          <LocalizedClientLink href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <WolfLogo size={38} />
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#D4A017", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Georgia, serif" }}>MANADA</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.22em", textTransform: "uppercase" }}>SAFETY MN</div>
              </div>
            </div>
          </LocalizedClientLink>
          <div style={{ width: 1, height: 30, background: "#2A2A2A", flexShrink: 0 }} />
          <div style={{ flex: 1, maxWidth: 440, background: "#252525", border: "1px solid #333", borderRadius: 3, display: "flex", alignItems: "center", overflow: "hidden" }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 10px 8px 14px", color: "#D4A017", flexShrink: 0 }}>
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
            </button>
            <input type="text" placeholder="Search products..." style={{ background: "none", border: "none", outline: "none", flex: 1, padding: "9px 12px 9px 0", fontSize: 13, color: "#e0e0e0" }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
            <LocalizedClientLink href="/account" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", display: "flex", alignItems: "center", padding: "6px 8px" }}>
              <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </LocalizedClientLink>
            <Suspense fallback={
              <LocalizedClientLink href="/cart" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", padding: "6px 8px", display: "flex", alignItems: "center" }}>
                <CartIconSVG />
              </LocalizedClientLink>
            }>
              <CartButton />
            </Suspense>
            <a href="tel:+97699102250" style={{ border: "1px solid #D4A017", color: "#D4A017", fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: 2, textDecoration: "none", whiteSpace: "nowrap" }}>
              99102250
            </a>
          </div>
        </div>
      </header>
    </div>
  )
}
