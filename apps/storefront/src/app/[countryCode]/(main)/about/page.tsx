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

const INDUSTRIES = [
  "Уул уурхай",
  "Барилга, зам тээвэр",
  "Үйлдвэрлэл",
  "Эмнэлэг, үйлчилгээ",
  "Харуул хамгаалалт",
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

      {/* ── Industries ── */}
      <section className="ms-container" style={{ padding: "8px 20px 20px" }}>
        <div className="ms-sechead">
          <div className="bar" />
          <span className="title">Хамтран ажилладаг салбарууд</span>
          <div className="rule" />
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {INDUSTRIES.map((ind) => (
            <span key={ind} style={{ background: "#fff", border: "1.5px solid #FFCC00", color: "#151515", fontSize: 13, fontWeight: 700, padding: "10px 18px", borderRadius: 30 }}>
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" style={{ background: "#151515", padding: "52px 0" }}>
        <div className="ms-container">
          <div className="ms-sechead on-dark">
            <div className="bar" />
            <span className="title">Холбоо барих</span>
            <div className="rule" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24, color: "#fff" }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Утас</div>
              <a href={"tel:" + phone.replace(/\s/g, "")} style={{ color: "#FFCC00", fontSize: 18, fontWeight: 700, textDecoration: "none" }}>{phone}</a>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4 }}>{phone2}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Хаяг</div>
              <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{address}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, marginTop: 6 }}>{hours}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Имэйл</div>
              <a href={"mailto:" + email} style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, textDecoration: "none" }}>{email}</a>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <a href={s.facebook_url || "https://www.facebook.com/Manadasafetymongolia"} target="_blank" rel="noreferrer" style={{ background: "#1877f2", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Facebook</a>
                <a href={s.instagram_url || "https://www.instagram.com/gutal.safetymn"} target="_blank" rel="noreferrer" style={{ background: "#e4405f", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
