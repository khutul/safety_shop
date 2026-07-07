"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCart } from "@lib/cart/cart-context"

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

export default function CartButton() {
  const { count, total } = useCart()

  return (
    <LocalizedClientLink
      href="/cart"
      style={{
        position: "relative",
        color: "rgba(255,255,255,0.6)",
        textDecoration: "none",
        padding: "6px 8px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      aria-label="Сагс"
    >
      <span style={{ position: "relative", display: "flex" }}>
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
        {count > 0 && (
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -8,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
              background: "#FFCC00",
              color: "#151515",
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              lineHeight: 1,
            }}
          >
            {count > 99 ? "99+" : count}
          </span>
        )}
      </span>
      <span className="ms-hide-mobile" style={{ lineHeight: 1.15 }}>
        <span style={{ display: "block", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Сагс</span>
        <span style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#FFCC00" }}>{fmt(total)}</span>
      </span>
    </LocalizedClientLink>
  )
}
