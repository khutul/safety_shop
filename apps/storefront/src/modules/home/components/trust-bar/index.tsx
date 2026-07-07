const ITEMS = [
  { t: "100% жинхэнэ бараа", s: "Албан ёсны баталгаатай", d: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z M9 12l2 2 4-4" },
  { t: "Хурдан хүргэлт", s: "Улаанбаатар хотод 24ц", d: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M7 17a2 2 0 1 0 0-.01 M17 17a2 2 0 1 0 0-.01" },
  { t: "Чанарын баталгаа", s: "Олон улсын стандарт", d: "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M8 13l-2 7 6-3 6 3-2-7" },
  { t: "Мэргэжлийн зөвлөгөө", s: "7 хоногийн туслах", d: "M4 13v-1a8 8 0 0 1 16 0v1 M3 12h3v6H3z M18 12h3v6h-3z" },
]
function Ic({ d }: { d: string }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((s, i) => <path key={i} d={i === 0 ? s : "M" + s} />)}
    </svg>
  )
}
export default function TrustBar() {
  return (
    <div style={{ background: "#181818", borderTop: "1px solid #222", borderBottom: "1px solid #222" }}>
      <div className="ms-trustgrid" style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        {ITEMS.map((it, i) => (
          <div
            key={it.t}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "20px 18px",
              borderLeft: i > 0 ? "1px solid #242424" : "none",
            }}
          >
            <Ic d={it.d} />
            <div>
              <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.04em" }}>{it.t}</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 2 }}>{it.s}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
