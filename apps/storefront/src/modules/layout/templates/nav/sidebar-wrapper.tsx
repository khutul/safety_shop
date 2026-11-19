import LocalizedClientLink from "@modules/common/components/localized-client-link"

// "БҮТЭЭГДЭХҮҮН" button — links straight to the store (category-filtered listing).
// (The old mega-menu dropdown was removed per design feedback.)
export default function SidebarWrapper() {
  return (
    <LocalizedClientLink
      href="/store"
      style={{
        background: "#FFCC00",
        color: "#151515",
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 800,
        padding: "9px 16px",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        borderRadius: 3,
        textDecoration: "none",
        flexShrink: 0,
      }}
    >
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
      </svg>
      БҮТЭЭГДЭХҮҮН
    </LocalizedClientLink>
  )
}
