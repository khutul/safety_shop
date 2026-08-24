import { Metadata } from "next"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Лого хатгамал — Ажлын хувцсанд компанийн лого",
  description:
    "Ажлын хувцсаа сонгоод газар дээр нь компанийн логогоо мэргэжлийн түвшинд хатгуулаарай. Бүгдийг нэг дороос — хурдан гүйцэтгэл, найдвартай чанар. Манада ХХК.",
}

const STEPS = [
  {
    n: "1",
    t: "Хувцсаа сонго",
    s: "Хэрэгцээт ажлын хувцас, хантааз, куртикаа манай дэлгүүрээс сонгоод аваарай.",
    d: "M8 3l4 3 4-3 4 3-2 3v12H6V9L4 6z",
  },
  {
    n: "2",
    t: "Логогоо хатгуул",
    s: "Газар дээр нь компанийн логогоо чанартай утсаар, мэргэжлийн түвшинд шуурхай хатгуулна.",
    d: "M12 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10z M8 13l-2 8 6-3 6 3-2-8",
  },
  {
    n: "3",
    t: "Бэлэн болсныг ав",
    s: "Цаг хугацаагаа хэмнэж, логотой бэлэн ажлын хувцсаа шууд хүлээн аваарай.",
    d: "M9 5h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V9z M9 12l2 2 4-4",
  },
]

const GALLERY = [
  "/embroidery/image2.jpeg",
  "/embroidery/image3.jpeg",
  "/embroidery/image4.jpeg",
  "/embroidery/image5.jpeg",
  "/embroidery/image6.jpeg",
]

export default async function EmbroideryPage() {
  return (
    <div style={{ background: "var(--ms-bg)" }}>
      {/* ── Hero ── */}
      <div style={{ background: "#0D0D0D", borderBottom: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "56px 20px", display: "flex", alignItems: "center", gap: 44, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px", minWidth: 0, maxWidth: 620 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18, background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.35)", padding: "6px 14px", borderRadius: 2 }}>
              <div style={{ width: 20, height: 2, background: "#FFCC00" }} />
              <span style={{ color: "#FFCC00", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>
                Бүгдийг нэг дороос
              </span>
            </div>
            <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, color: "#fff", textTransform: "uppercase", lineHeight: 1.15, margin: "0 0 16px" }}>
              Ажлын хувцас <span style={{ color: "#FFCC00" }}>+ Хатгамал лого</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, lineHeight: 1.8, margin: "0 0 14px" }}>
              Манада ХХК таны алтан цагийг хэмнэх "Бүгдийг нэг дороос" үйлчилгээг хүргэж байна.
              Та манайхаас хувцсаа сонгон авч, газар дээр нь өөрийн компанийн логог чанартай
              утсаар, мэргэжлийн түвшинд хатгуулах боломжтой.
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.8, margin: "0 0 26px" }}>
              Олон газраар явж цаг алдах шаардлагагүй — хурдан гүйцэтгэл, найдвартай чанар зөвхөн манайд.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="tel:+97699102250" className="ms-btn-gold">
                Утсаар захиалах — 9910-2250
              </a>
              <LocalizedClientLink href="/store?category=workwear" className="ms-btn-ghost">
                Ажлын хувцас үзэх
              </LocalizedClientLink>
            </div>
          </div>
          <div style={{ flex: "1 1 320px", minWidth: 0, display: "flex", justifyContent: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/embroidery/image1.png"
              alt="Компьютержсэн олон зүүт хатгамалын машин"
              style={{ width: "100%", maxWidth: 460, background: "#fff", borderRadius: 8, border: "1px solid var(--ms-border)", display: "block" }}
            />
          </div>
        </div>
      </div>

      {/* ── 3 steps ── */}
      <section className="ms-container" style={{ padding: "48px 20px" }}>
        <div className="ms-sechead on-dark" style={{ marginBottom: 28 }}>
          <div className="bar" />
          <span className="title">Хэрхэн ажилладаг вэ?</span>
          <div className="rule" />
        </div>
        <div className="ms-grid-3">
          {STEPS.map((st) => (
            <div key={st.n} style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, padding: "26px 24px", position: "relative" }}>
              <div style={{ position: "absolute", top: 18, right: 20, fontSize: 44, fontWeight: 900, color: "rgba(255,204,0,0.12)", fontFamily: "var(--ms-font-display)", lineHeight: 1 }}>
                {st.n}
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 4, background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {st.d.split(" M").map((s, i) => <path key={i} d={i === 0 ? s : "M" + s} />)}
                </svg>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "var(--ms-font-display)", textTransform: "uppercase" }}>{st.t}</div>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{st.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section style={{ background: "#161616", borderTop: "1px solid var(--ms-border-soft)" }}>
        <div className="ms-container" style={{ padding: "48px 20px" }}>
          <div className="ms-sechead on-dark" style={{ marginBottom: 26 }}>
            <div className="bar" />
            <span className="title">Хийсэн ажлуудаас</span>
            <div className="rule" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {GALLERY.map((src) => (
              <div key={src} style={{ borderRadius: 6, overflow: "hidden", border: "1px solid var(--ms-border)", background: "#0D0D0D", aspectRatio: "4/3" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Лого хатгамал — хийсэн ажлын дээж" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="ms-container" style={{ padding: "56px 20px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--ms-font-display)", fontSize: "clamp(22px,3vw,30px)", fontWeight: 900, color: "#fff", textTransform: "uppercase", margin: "0 0 12px" }}>
          Байгууллагын захиалга авна
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 520, margin: "0 auto 26px", lineHeight: 1.7 }}>
          Хамт олныхоо ажлын хувцсыг нэг загвараар, компанийнхаа логотой захиалаарай —
          тоо хэмжээнээс хамаарсан үнийн санал өгнө.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="tel:+97699102250" className="ms-btn-gold">
            9910-2250 руу залгах
          </a>
          <LocalizedClientLink href="/partnership" className="ms-btn-ghost">
            Хүсэлт илгээх
          </LocalizedClientLink>
        </div>
      </section>
    </div>
  )
}
