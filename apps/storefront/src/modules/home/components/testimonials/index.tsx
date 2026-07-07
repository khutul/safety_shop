/**
 * Хэрэглэгчдийн сэтгэгдэл — доорх REVIEWS жагсаалтыг бодит
 * сэтгэгдлүүдээрээ сольж болно (нэр, байгууллага, текст).
 */
const REVIEWS = [
  {
    text: "Бид олон жилийн турш хамтран ажиллаж байна. Захиалга бүр цаг хугацаандаа, чанартай ирдэг нь бидний ажлыг ихээхэн хөнгөвчилдөг.",
    name: "Б. Эрдэнэ",
    org: "Эрчим хүчний байгууллага",
  },
  {
    text: "Хүргэлт хурдан, бараа 100% жинхэнэ. Байгууллагын бөөний захиалгад үнийн уян хатан бодлого баримталдаг нь таалагддаг.",
    name: "А. Отгон",
    org: "Барилгын компани",
  },
  {
    text: "Мэргэжлийн зөвлөгөө, үйлчилгээ маш сайн. Ажилтнуудынхаа хэмжээ, хэрэгцээнд тохирсон сонголтыг үргэлж санал болгодог.",
    name: "С. Туяа",
    org: "Үйлдвэрийн компани",
  },
]

function Stars() {
  return (
    <div style={{ color: "#FFCC00", fontSize: 13, letterSpacing: 2, marginBottom: 12 }}>★★★★★</div>
  )
}

export default function Testimonials() {
  return (
    <section style={{ background: "#161616", padding: "44px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark" style={{ marginBottom: 24 }}>
          <div className="bar" />
          <span className="title">Хэрэглэгчдийн сэтгэгдэл</span>
          <div className="rule" />
        </div>
        <div className="ms-grid-3">
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              style={{
                background: "var(--ms-surface)",
                border: "1px solid var(--ms-border)",
                borderRadius: 6,
                padding: "22px 22px 18px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stars />
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.75)", lineHeight: 1.75, margin: "0 0 16px", flex: 1 }}>
                “{r.text}”
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFCC00", color: "#151515", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{r.name}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{r.org}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
