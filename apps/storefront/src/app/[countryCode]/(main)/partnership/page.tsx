import { Metadata } from "next"
import PartnershipForm from "@modules/partnership"

export const metadata: Metadata = {
  title: "Хамтран ажиллах хүсэлт",
  description:
    "Байгууллагын бөөний захиалга, хамтын ажиллагааны санал — Manada Safety-тэй хамтран ажиллах хүсэлтээ илгээнэ үү.",
}

export default async function PartnershipPage() {
  return (
    <div style={{ background: "var(--ms-bg)", minHeight: "60vh" }}>
      <div className="ms-container" style={{ padding: "48px 20px", maxWidth: 860 }}>
        <div className="ms-sechead on-dark" style={{ marginBottom: 14 }}>
          <div className="bar" />
          <h1 className="title" style={{ margin: 0 }}>Хамтран ажиллах хүсэлт</h1>
          <div className="rule" />
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.8, margin: "0 0 30px", maxWidth: 640 }}>
          Байгууллагын бөөний захиалга, тогтмол ханган нийлүүлэлт, дистрибюторын хамтын ажиллагаа
          сонирхож байвал доорх маягтыг бөглөөрэй. Бид ажлын цагаар тантай эргэн холбогдоно.
        </p>
        <div style={{ background: "#1A1A1A", border: "1px solid #262626", borderRadius: 6, padding: "28px 26px" }}>
          <PartnershipForm />
        </div>
      </div>
    </div>
  )
}
