const BRANDS = [
  { name: "safetoe", color: "#FFD000" },
  { name: "SAFEYEAR", color: "#CC2200" },
  { name: "3M", color: "#E63329" },
  { name: "HONEYWELL", color: "#FF6B00" },
  { name: "KAMELO", color: "#3A9B6F" },
  { name: "ENERGIZER", color: "#FFD700" },
]

export default function BrandLogos() {
  return (
    <div style={{ background: "#0D0D0D", borderTop: "1px solid #1A1A1A", padding: "14px 0" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
          <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0, paddingRight: 16, borderRight: "1px solid #2A2A2A" }}>
            АЛБАН ЁСНЫ ДИЛЕР
          </span>
          {BRANDS.map((b, i) => (
            <div key={b.name} style={{ padding: "4px 18px", borderRight: i < BRANDS.length - 1 ? "1px solid #2A2A2A" : "none", flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: b.color, fontFamily: "var(--ms-font-body)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
