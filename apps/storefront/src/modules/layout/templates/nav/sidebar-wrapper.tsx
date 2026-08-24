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
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
      </svg>
      БҮТЭЭГДЭХҮҮН
    </LocalizedClientLink>
  )
}
