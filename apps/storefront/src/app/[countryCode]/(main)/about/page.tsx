import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ShopGallery from "@modules/about/shop-gallery"

export const metadata: Metadata = {
  title: "Бидний тухай",
  description:
    "МАНАДА ХХК — хөдөлмөр хамгааллын хувцас, хамгаалах хэрэгслийн итгэлт түнш. Safetoe, Safeyear брэндийн Монгол дахь албан ёсны дистрибютор.",
}

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

type SiteSettings = {
  phone?: string
  phone2?: string
  address?: string
  email?: string
  facebook_url?: string
  instagram_url?: string
  working_hours?: string
}

async function getSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(`${API}/site/settings?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return {}
    return await res.json()
  } catch {
    return {}
  }
}

const ADVANTAGES = [
  {
    title: "Чанар ба стандарт",
    desc: "Олон улсын чанарын стандартад нийцсэн, баталгаатай брэнд бүтээгдэхүүнийг таны хэрэгцээнд нийцүүлэн нийлүүлнэ.",
  },
  {
    title: "Стандарт хангасан хамгаалалт",
    desc: "Манай хамгаалалтын хэрэгслүүд холбогдох стандартуудыг бүрэн хангасан бөгөөд таны хамт олны аюулгүй байдал, амь насны баталгаа болно.",
  },
  {
    title: "Найдвартай түншлэл",
    desc: "Итгэлцэл дээр суурилсан, урт хугацааны хамтын ажиллагааг эрхэмлэн ажилладаг. Бид харилцагч бүрийнхээ үнэнч түнш.",
  },
  {
    title: "Шудрага үнийн бодлого",
    desc: "Чанартай бүтээгдэхүүнийг хамгийн боломжит үнээр санал болгож, ширхэг барааг ч бөөний үнээр авах боломжоор хангадаг.",
  },
]


export default async function AboutPage() {
  const s = await getSettings()
  const phone = s.phone || "+976 99102250"
  const phone2 = s.phone2 || "99092250"
  const address = s.address || "Сонсголонгийн зам дагуу, Барилгачин ХТ, 3 давхар, С9"
  const email = s.email || "info@manada.mn"
  const hours = s.working_hours || "Даваа-Бямба: 09:00-18:00"

  return (
    <div style={{ background: "#fff" }}>
      {/* ── Page hero band (дэлгүүрийн панорам дэвсгэртэй) ── */}
      <div style={{ position: "relative", background: "#151515", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute", inset: 0,
            backgroundImage: "url(/about/hero.jpg)",
            backgroundSize: "cover", backgroundPosition: "center",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(15,15,15,0.93) 0%, rgba(15,15,15,0.75) 55%, rgba(15,15,15,0.55) 100%)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#FFCC00", zIndex: 1 }} />
        <div className="ms-container" style={{ padding: "72px 20px 76px", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
            <LocalizedClientLink href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Нүүр</LocalizedClientLink>
            <span style={{ margin: "0 8px" }}>/</span>
            <span style={{ color: "#FFCC00" }}>Бидний тухай</span>
          </div>
          <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: "clamp(38px,6vw,64px)", fontWeight: 800, color: "#fff", textTransform: "uppercase", lineHeight: 1, margin: 0 }}>
            Бидний тухай
          </h1>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.7, maxWidth: 640, marginTop: 18 }}>
            Чанартай бүтээгдэхүүн, мэргэжлийн үйлчилгээний итгэлт түнш — МАНАДА ХХК
          </p>
        </div>
      </div>

      {/* ── Intro ── */}
      <section className="ms-container" style={{ padding: "56px 20px 20px" }}>
        <div className="ms-sechead">
          <div className="bar" />
          <span className="title">МАНАДА ХХК</span>
          <div className="rule" />
        </div>
        <div className="ms-about-grid">
          <div style={{ color: "#374151", fontSize: 14, lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 14px" }}>
              2023 оноос үйл ажиллагаагаа явуулж эхэлсэн <strong>“Манада” ХХК</strong> нь хөдөлмөр хамгааллын хувцас,
              хамгаалах хэрэгсэл, тоног төхөөрөмж, сэлбэг материалын худалдаа, үйлчилгээний чиглэлээр ажиллаж байна.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Бид уул уурхай, барилга, үйлдвэрлэл, зам тээвэр, эмнэлэг болон бусад аж ахуйн нэгжийн хэрэгцээнд нийцсэн
              хөдөлмөр хамгааллын хувцас, тусгай хэрэгслийг 4 улирлын онцлогт тохируулан, чанар, загвар, материалын өргөн
              сонголттойгоор нийлүүлж байна.
            </p>
            <p style={{ margin: "0 0 14px" }}>
              Түүнчлэн манай компани тоног төхөөрөмж, цахилгаан, автоматжуулалтын сэлбэг, материалыг чанарын өндөр
              шалгуураар нийлүүлэн ажилласаар ирсэн. Харилцагч бүрийн хэрэгцээ шаардлагад нийцсэн уян хатан үнэ,
              стандартын шаардлага хангасан бүтээгдэхүүнээр үйлчлэх нь бидний зорилго.
            </p>
            <p style={{ margin: 0 }}>
              Цаашид “Манада” ХХК нь дотоодын үйлдвэрлэгч болох зорилго тавин, нийгэм болон улс орондоо хүлээсэн үүргээ
              нэр төртэйгээр биелүүлэхээр чармайн ажиллаж байна.
            </p>
          </div>
          {/* Дэлгүүрийн зургийн слайд — текстийн хажууд */}
          <ShopGallery />
        </div>
      </section>

      {/* ── Advantages ── */}
      <section style={{ background: "#f7f7f8", padding: "48px 0", marginTop: 40 }}>
        <div className="ms-container">
          <div className="ms-sechead">
            <div className="bar" />
            <span className="title">Компанийн давуу тал</span>
            <div className="rule" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {ADVANTAGES.map((a, i) => (
              <div key={a.title} style={{ background: "#fff", border: "1px solid #ededed", borderRadius: 6, padding: "22px 20px", display: "flex", gap: 14 }}>
                <div style={{ fontFamily: "var(--ms-font-display)", fontSize: 32, fontWeight: 800, color: "#FFCC00", lineHeight: 1, minWidth: 34 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#151515", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 8 }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Distributor banner ── */}
      <section className="ms-container" style={{ padding: "48px 20px" }}>
        <div style={{ background: "#151515", borderRadius: 10, padding: "34px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#FFCC00" }} />
          <div>
            <div style={{ color: "#FFCC00", fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: 8 }}>
              Албан ёсны дистрибютор
            </div>
            <div style={{ fontFamily: "var(--ms-font-display)", fontSize: 26, fontWeight: 800, color: "#fff", textTransform: "uppercase", lineHeight: 1.1 }}>
              Safetoe® ба Safeyear®
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, marginTop: 8 }}>
              Монгол дахь цорын ганц албан ёсны дистрибютор — 2027 он хүртэл баталгаажсан
            </div>
          </div>
          <LocalizedClientLink href="/store" className="ms-btn-gold">
            Бүтээгдэхүүн үзэх
          </LocalizedClientLink>
        </div>
      </section>

      {/* ── Байршил (утас/имэйл footer-т бий — энд зөвхөн хаяг + газрын зураг) ── */}
      <section id="contact" style={{ background: "#151515", padding: "52px 0" }}>
        <div className="ms-container">
          <div className="ms-sechead on-dark">
            <div className="bar" />
            <span className="title">Байршил</span>
            <div className="rule" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px 18px", marginBottom: 20 }}>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{address}</span>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{hours}</span>
            <a href="https://maps.app.goo.gl/UrfoNjShUFZ9rxtm6" target="_blank" rel="noreferrer" style={{ color: "#FFCC00", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              Google Maps дээр нээх →
            </a>
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #2A2A2A" }}>
            <iframe
              title="Манада дэлгүүрийн байршил"
              src="https://www.google.com/maps?q=Manada+Safety+%D0%A3%D0%BB%D0%B0%D0%B0%D0%BD%D0%B1%D0%B0%D0%B0%D1%82%D0%B0%D1%80&output=embed"
              width="100%"
              height="360"
              style={{ border: 0, display: "block", filter: "grayscale(15%)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
