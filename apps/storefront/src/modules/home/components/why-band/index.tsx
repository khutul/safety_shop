// Icons: multi-path "d" strings joined with " M" (rendered as gold outlines)
const ITEMS = [
  { d: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z M9 12l2 2 4-4", value: "10+ жил", label: "Мэргэжлийн туршлага" },
  { d: "M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8", value: "5,000+", label: "Бүтээгдэхүүний төрөл" },
  { d: "M3 21h18 M5 21V7l7-4v18 M12 21V11l7-3v13 M8 9h.01 M8 13h.01 M8 17h.01", value: "300+", label: "Хамтрагч байгууллага" },
  { d: "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M8 13l-2 8 6-3 6 3-2-8", value: "ISO · CE · ASTM", label: "Олон улсын стандарт" },
  { d: "M4 13v-1a8 8 0 0 1 16 0v1 M3 12h3v6H3z M18 12h3v6h-3z M18 18a4 4 0 0 1-4 3", value: "Мэргэжлийн", label: "Сонголтын зөвлөгөө" },
  { d: "M8 12l-4 2v6h16v-6l-4-2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z", value: "Баталгаат", label: "Борлуулалтын дараах үйлчилгээ" },
]

function GoldIcon({ d }: { d: string }) {
  return (
    <span
      style={{
        width: 44,
        height: 44,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,204,0,0.08)",
        border: "1px solid rgba(255,204,0,0.3)",
        borderRadius: 4,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {d.split(" M").map((s, i) => <path key={i} d={i === 0 ? s : "M" + s} />)}
      </svg>
    </span>
  )
}

/** "Яагаад Manada Safety?" stats band. */
export default function WhyBand() {
  return (
    <section style={{ background: "var(--ms-bg)", padding: "44px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark" style={{ marginBottom: 24 }}>
          <div className="bar" />
          <span className="title">Яагаад Manada Safety?</span>
          <div className="rule" />
        </div>
        <div className="ms-whygrid">
          {ITEMS.map((it) => (
            <div
              key={it.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                background: "var(--ms-surface)",
                border: "1px solid var(--ms-border)",
                borderRadius: 4,
                padding: "16px 18px",
                minWidth: 0,
              }}
            >
              <GoldIcon d={it.d} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#FFCC00", fontFamily: "var(--ms-font-display)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{it.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
