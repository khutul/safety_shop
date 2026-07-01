import LocalizedClientLink from "@modules/common/components/localized-client-link"

const REASONS = [
  {
    num: "01",
    title: "ЦОРЫН ГАНЦ ДИСТРИБЮТОР",
    desc: "Safetoe® & Safeyear® брэндийн Монгол дахь цорын ганц албан ёсны дилер — 2027 он хүртэл баталгаатай",
  },
  {
    num: "02",
    title: "CE · ASTM · ISO СТАНДАРТ",
    desc: "Олон улсын стандарт бүрэн хангасан бүтээгдэхүүн — таны хамт олны амь аюулгүй байдал баталгаатай",
  },
  {
    num: "03",
    title: "БАЙГУУЛЛАГЫН ТУСГАЙ ҮНЭ",
    desc: "300+ байгууллагад нийлүүлдэг · Тендер нийлүүлэлт · Лого хатгамал · Хямдрал",
  },
]

const BRANDS = [
  { name: "Safetoe®", star: true },
  { name: "Safeyear®", star: true },
  { name: "Honeywell", star: false },
  { name: "MSA", star: false },
  { name: "3M", star: false },
  { name: "DeltaPlus", star: false },
  { name: "Safety Jogger", star: false },
  { name: "DuPont / Tyvek", star: false },
  { name: "DeWalt", star: false },
  { name: "uvex", star: false },
  { name: "ТОНО", star: false },
]

const TRUST = [
  { icon: "🚚", title: "Хурдан хүргэлт", sub: "УБ: 24 цагийн дотор" },
  { icon: "🛡️", title: "Чанарын баталгаа", sub: "CE · ASTM · ISO 9001" },
  { icon: "💰", title: "Тэнцвэрт үнэ", sub: "Ширхгээр бөөн үнэ" },
  { icon: "📞", title: "7 хоног тусламж", sub: "+976 99102250" },
]

export default function WhySection() {
  return (
    <>
      {/* ── WHY CHOOSE US ── */}
      <section style={{ background: "#f9fafb", padding: "40px 0", borderTop: "1px solid #f3f4f6" }}>
        <div className="content-container">
          <h2
            style={{
              fontFamily: "'Barlow Condensed', Impact, sans-serif",
              fontSize: "32px",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#111",
              marginBottom: "24px",
              letterSpacing: "0.02em",
            }}
          >
            Яагаад Manada Safety-г сонгох вэ?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {REASONS.map((r) => (
              <div
                key={r.num}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "20px",
                  display: "flex",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Barlow Condensed', Impact, sans-serif",
                    fontSize: "36px",
                    fontWeight: 900,
                    color: "#f5c518",
                    lineHeight: 1,
                    minWidth: "36px",
                  }}
                >
                  {r.num}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 800,
                      color: "#111",
                      letterSpacing: "0.04em",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                    }}
                  >
                    {r.title}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: 1.6 }}>
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* B2B CTA */}
          <div
            style={{
              background: "#111",
              borderRadius: "10px",
              padding: "24px 28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Barlow Condensed', Impact, sans-serif",
                  fontSize: "22px",
                  fontWeight: 900,
                  color: "#fff",
                  textTransform: "uppercase",
                  marginBottom: "4px",
                }}
              >
                Байгууллагын захиалга хийх үү?
              </div>
              <div style={{ color: "#9ca3af", fontSize: "13px" }}>
                Тусгай үнэ, хямдрал болон тендер нийлүүлэлт авах боломжтой
              </div>
            </div>
            <LocalizedClientLink
              href="/store"
              style={{
                background: "#f5c518",
                color: "#111",
                borderRadius: "30px",
                padding: "12px 28px",
                fontWeight: 800,
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                textDecoration: "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Үнийн санал авах →
            </LocalizedClientLink>
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <section
        style={{
          background: "#fff",
          padding: "28px 0",
          borderTop: "1px solid #f3f4f6",
        }}
      >
        <div className="content-container">
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#9ca3af",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Албан ёсны дилер брэндүүд
          </div>
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {BRANDS.map((b) => (
              <span
                key={b.name}
                style={{
                  border: b.star ? "1.5px solid #f5c518" : "1px solid #e5e7eb",
                  background: b.star ? "#fffbeb" : "#fff",
                  color: b.star ? "#111" : "#4b5563",
                  fontSize: "11px",
                  fontWeight: b.star ? 800 : 500,
                  padding: "5px 14px",
                  borderRadius: "4px",
                }}
              >
                {b.name}
                {b.star && " ★"}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ background: "#111", borderTop: "1px solid #1a1a1a" }}>
        <div className="content-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
          >
            {TRUST.map((t, i) => (
              <div
                key={t.title}
                style={{
                  padding: "20px 16px",
                  textAlign: "center",
                  borderRight: i < 3 ? "1px solid #222" : "none",
                }}
              >
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>
                  {t.icon}
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.03em",
                    marginBottom: "3px",
                  }}
                >
                  {t.title}
                </div>
                <div style={{ color: "#6b7280", fontSize: "11px" }}>
                  {t.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
