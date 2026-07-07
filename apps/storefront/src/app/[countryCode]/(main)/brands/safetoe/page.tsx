import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Safetoe — Албан ёсны дистрибютор | Manada Safety",
  description:
    "Manada Safety нь дэлхийн тэргүүлэх PPE брэнд Safetoe-гийн Монгол дахь албан ёсны дистрибютор. Steel Toe, Composite Toe, EH, S7 Waterproof технологитой хөдөлмөр хамгааллын гутал.",
}

const REEL_URL = "https://www.facebook.com/reel/1652148602778908"

/** Safetoe-гийн патентлагдсан технологиуд (safetoe.net) — зураг: /public/safetoe/tech/ */
const CORE_TECH = [
  { img: "sanvlar-tex.webp", t: "Sanvlar-Tex®", s: "Ус нэвтэрдэггүй дэвшилтэт мембран" },
  { img: "heatvanta.webp", t: "HeatVanta™", s: "Халуунд тэсвэртэй систем" },
  { img: "tuff-tarsal.webp", t: "Tuff Tarsal™", s: "Өлмий, шилбэ хамгаалах бамбай" },
  { img: "plumashield.webp", t: "PlumaShield™", s: "Өндөр барьцалдалттай улны систем" },
  { img: "quickdial.webp", t: "QuickDial™", s: "Түргэн, нарийвчилсан тохируулгын түгжээ" },
  { img: "zorbtion.webp", t: "Zorbtion™", s: "Өдөржин тав тухтай зөөллөгч ул" },
]

const COMFORT_TECH = [
  { img: "vortigard.webp", t: "VortiGard™", s: "Цохилтоос хамгаалах дэвшилтэт хошуу" },
  { img: "matrix-tex.webp", t: "Matrix-Tex™", s: "Хөнгөн, хатгалтын эсрэг завсрын ул" },
  { img: "leathqua.webp", t: "LeathQua™", s: "Дээд зэрэглэлийн арьсан технологи" },
  { img: "cutronix.webp", t: "Cutronix™", s: "Зүсэлтэд тэсвэртэй бүтэц" },
  { img: "bactivoid.webp", t: "BactiVoid™", s: "Нянгийн эсрэг, эрүүл ахуйн дотор давхарга" },
  { img: "pneumatex.webp", t: "PneumaTex™", s: "Хүнсний үйлдвэрлэлийн орчинд тохиромжтой" },
]

function TechCard({ img, t, s }: { img: string; t: string; s: string }) {
  return (
    <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: "#fff", aspectRatio: "16/10", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 6 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/safetoe/tech/${img}`} alt={t} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", display: "block" }} />
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ color: "#FFCC00", fontSize: 14.5, fontWeight: 800, marginBottom: 4 }}>{t}</div>
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12.5, lineHeight: 1.55 }}>{s}</div>
      </div>
    </div>
  )
}

const INDUSTRIES = ["Эрчим хүч", "Газрын тос", "Уул уурхай", "Үйлдвэрлэл", "Барилга", "Өвөл / Хүйтэн агуулах"]

const FACTS = [
  { v: "16+", l: "жилийн туршлага" },
  { v: "50+", l: "улсад борлуулагддаг" },
  { v: "80+", l: "олон улсын түнш байгууллага" },
  { v: "2025", l: "оноос Manada Safety хамтран ажиллаж байна" },
]


export default async function SafetoePage() {
  return (
    <div style={{ background: "var(--ms-bg)" }}>
      {/* ── Hero ── */}
      <div style={{ background: "#0D0D0D", borderBottom: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "48px 20px", display: "flex", alignItems: "center", gap: 40, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18, background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.35)", padding: "6px 14px", borderRadius: 2 }}>
              <div style={{ width: 20, height: 2, background: "#FFCC00" }} />
              <span style={{ color: "#FFCC00", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Монгол дахь албан ёсны дистрибютор
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: "clamp(30px,4.5vw,50px)", fontWeight: 900, color: "#fff", textTransform: "uppercase", lineHeight: 1.1, margin: "0 0 14px" }}>
              SAFETOE<span style={{ color: "#FFCC00" }}>®</span>
            </h1>
            <div style={{ color: "#FFCC00", fontSize: 13, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>
              Top Quality Since 1984
            </div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.8, maxWidth: 560, margin: "0 0 26px" }}>
              Safetoe бол хөдөлмөр хамгааллын гутал, бээлий, каск, нүдний шил зэрэг толгойноос хөл хүртэлх
              бүрэн хамгаалалтын хэрэгслийг үйлдвэрлэдэг дэлхийн тэргүүлэх PPE брэнд юм.
              Manada Safety нь 2025 оноос Safetoe-той хамтран ажиллаж, Монгол дахь албан ёсны
              дистрибюторын эрхийг авсан — та манайхаас зөвхөн жинхэнэ, баталгаат бүтээгдэхүүн авна.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <LocalizedClientLink href="/store?brand=safetoe" className="ms-btn-gold">
                Safetoe бүтээгдэхүүн үзэх <span aria-hidden>→</span>
              </LocalizedClientLink>
              <a href="#technology" className="ms-btn-ghost">Технологиуд үзэх</a>
            </div>
          </div>
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/safetoe/logo.jpg" alt="Safetoe — Top Quality Since 1984" style={{ width: 210, height: 210, objectFit: "contain", borderRadius: "50%", boxShadow: "0 12px 44px rgba(255,204,0,0.18)" }} />
          </div>
        </div>
      </div>

      {/* ── Facts band ── */}
      <div style={{ background: "#181818", borderBottom: "1px solid #222" }}>
        <div className="ms-trustgrid ms-container" style={{ padding: "0 20px" }}>
          {FACTS.map((f, i) => (
            <div key={f.l} style={{ padding: "18px 16px", borderLeft: i > 0 ? "1px solid #242424" : "none" }}>
              <div style={{ color: "#FFCC00", fontSize: 20, fontWeight: 900, fontFamily: "var(--ms-font-display)" }}>{f.v}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11.5, marginTop: 3 }}>{f.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Partnership ── */}
      <section className="ms-container" style={{ padding: "48px 20px" }}>
        <div className="ms-sechead on-dark">
          <div className="bar" />
          <span className="title">Албан ёсны хамтын ажиллагаа</span>
          <div className="rule" />
        </div>
        <div className="ms-pdp-grid">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/safetoe/partnership.jpg" alt="Manada Safety ба Safetoe-гийн хамтын ажиллагаа" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--ms-border)", display: "block" }} />
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 10 }}>
              Safetoe-гийн төв оффис дээр дистрибюторын гэрээ гардан авч буй нь
            </div>
          </div>
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14.5, lineHeight: 1.9 }}>
            <p style={{ marginTop: 0 }}>
              <strong style={{ color: "#fff" }}>Манада ХХК</strong> нь 2025 оноос Safetoe брэндтэй хамтран ажиллаж эхэлсэн бөгөөд
              үйлдвэрлэгч <strong style={{ color: "#fff" }}>Shanghai Langfeng Industrial Co., Ltd</strong>-ээс
              Монгол улсын зах зээл дэх <strong style={{ color: "#FFCC00" }}>албан ёсны дистрибюторын гэрчилгээ</strong>-г авсан.
            </p>
            <p>
              Энэ нь Safetoe бүтээгдэхүүний борлуулалт, сурталчилгаа, худалдан авагчийн үйлчилгээг Монголд
              албан ёсоор хариуцаж, үйлдвэрээс шууд, баталгаат бараа нийлүүлнэ гэсэн үг.
              Хуурамч болон дамжуулан худалдаалагдсан бараанаас ялгаатай нь:
            </p>
            <ul style={{ paddingLeft: 20, margin: "0 0 16px" }}>
              <li style={{ marginBottom: 8 }}>Үйлдвэрийн шууд нийлүүлэлт — жинхэнэ бүтээгдэхүүний баталгаа</li>
              <li style={{ marginBottom: 8 }}>Бүрэн хэмжээний размерын нөөц, тогтмол ханган нийлүүлэлт</li>
              <li style={{ marginBottom: 8 }}>Борлуулалтын дараах үйлчилгээ, солилт буцаалтын баталгаа</li>
              <li>Байгууллагын бөөний захиалгад үйлдвэрийн үнийн бодлого</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Certificate ── */}
      <section id="certificate" style={{ background: "#161616", borderTop: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "48px 20px" }}>
          <div className="ms-sechead on-dark">
            <div className="bar" />
            <span className="title">Дистрибюторын гэрчилгээ</span>
            <div className="rule" />
          </div>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/safetoe/certificate.jpg" alt="Safetoe Distributor Certificate — MANADA LLC, Mongolia" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--ms-border)", display: "block", background: "#fff" }} />
          </div>
        </div>
      </section>

      {/* ── Technology ── */}
      <section id="technology" className="ms-container" style={{ padding: "48px 20px" }}>
        <div className="ms-sechead on-dark">
          <div className="bar" />
          <span className="title">Хамгаалалтын гол технологиуд</span>
          <div className="rule" />
        </div>
        <div className="ms-grid-3" style={{ marginBottom: 36 }}>
          {CORE_TECH.map((t) => <TechCard key={t.t} {...t} />)}
        </div>

        <div className="ms-sechead on-dark">
          <div className="bar" />
          <span className="title">Материал ба тав тухын технологиуд</span>
          <div className="rule" />
        </div>
        <div className="ms-grid-3">
          {COMFORT_TECH.map((t) => <TechCard key={t.t} {...t} />)}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 28 }}>
          {INDUSTRIES.map((ind) => (
            <span key={ind} style={{ border: "1px solid var(--ms-border)", background: "var(--ms-surface)", color: "rgba(255,255,255,0.7)", fontSize: 12.5, fontWeight: 600, borderRadius: 20, padding: "7px 16px" }}>
              {ind}
            </span>
          ))}
        </div>
      </section>

      {/* ── Certifications ── */}
      <section style={{ background: "#161616", borderTop: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "44px 20px" }}>
          <div className="ms-sechead on-dark">
            <div className="bar" />
            <span className="title">Олон улсын стандарт, сертификат</span>
            <div className="rule" />
          </div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, margin: "0 0 22px" }}>
            Safetoe бүтээгдэхүүн нь <strong style={{ color: "#fff" }}>EN ISO 20345</strong> болон{" "}
            <strong style={{ color: "#fff" }}>ASTM F2413</strong> стандартын шаардлагыг бүрэн хангаж,
            олон улсад баталгаажсан.
          </p>
          <div style={{ background: "#fff", border: "1px solid var(--ms-border)", borderRadius: 8, padding: "22px 26px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/safetoe/cert/badges.webp" alt="CE · ASTM International · CSA · Certified System · ISO" style={{ width: "100%", height: "auto", display: "block" }} />
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section style={{ background: "#161616", borderTop: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "48px 20px" }}>
          <div className="ms-sechead on-dark">
            <div className="bar" />
            <span className="title">Үйлдвэр ба чанарын хяналт</span>
            <div className="rule" />
          </div>
          <div style={{ maxWidth: 420, margin: "0 auto" }}>
            <div style={{ position: "relative", paddingTop: "177%", borderRadius: 8, overflow: "hidden", border: "1px solid var(--ms-border)", background: "#000" }}>
              <iframe
                src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(REEL_URL)}&show_text=false`}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                allowFullScreen
                title="Safetoe үйлдвэрийн видео"
              />
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <a href={REEL_URL} target="_blank" rel="noreferrer" style={{ color: "#FFCC00", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
                Facebook дээр үзэх →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ms-container" style={{ padding: "56px 20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--ms-font-display)", fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, color: "#fff", textTransform: "uppercase", margin: "0 0 12px" }}>
          Жинхэнэ Safetoe — зөвхөн Manada Safety-ээс
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 520, margin: "0 auto 26px", lineHeight: 1.7 }}>
          Уул уурхай, барилга, үйлдвэрийн хамгаалалтын гутлын бүрэн нэр төрөл — албан ёсны баталгаатай.
        </p>
        <LocalizedClientLink href="/store?brand=safetoe" className="ms-btn-gold">
          Бүтээгдэхүүн үзэх <span aria-hidden>→</span>
        </LocalizedClientLink>
      </section>
    </div>
  )
}
