/** Floating call button (bottom-right, always visible). */
export default function CallFab() {
  return (
    <a
      href="tel:+97699102250"
      aria-label="Утсаар холбогдох"
      style={{
        position: "fixed",
        right: 18,
        bottom: 18,
        zIndex: 80,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#FFCC00",
        color: "#151515",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(255,204,0,0.35), 0 4px 12px rgba(0,0,0,0.4)",
        textDecoration: "none",
      }}
    >
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
    </a>
  )
}
