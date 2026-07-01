import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"

const LINK_COLS = [
  { title: "Бүтээгдэхүүн", links: ["Ажлын хувцас", "Гутал", "Толгой хамгаалалт", "Бээлий", "Маск", "Нүд хамгаалалт"] },
  { title: "Компани", links: ["Бидний тухай", "Захиалга өгөх", "Тендер нийлүүлэлт", "Холбоо барих"] },
  { title: "Мэдээлэл", links: ["Хүргэлтийн журам", "Буцаалтын журам", "Нууцлалын бодлого"] },
]

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
    const res = await fetch(`${API}/site/settings?lang=mn`, { cache: "no-store" })
    if (!res.ok) return {}
    return await res.json()
  } catch {
    return {}
  }
}

export default async function Footer() {
  const s = await getSettings()
  const phone = s.phone || "+976 99102250"
  const phoneLabel = s.phone2 ? `${phone}, ${s.phone2}` : phone
  const telHref = "tel:" + phone.replace(/\s/g, "")
  const address = s.address || "Барилгачин ХТ, 3 давхар, С9"
  const hours = s.working_hours || "Даваа-Бямба: 09:00-18:00"
  const email = s.email || "info@manadasafety.mn"
  const facebook = s.facebook_url || "https://www.facebook.com/Manadasafetymongolia"
  const instagram = s.instagram_url || "https://www.instagram.com/gutal.safetymn"

  const contacts = [
    { label: phoneLabel, href: telHref, gold: true },
    { label: address, href: "#", gold: false },
    { label: hours, href: "#", gold: false },
    { label: email, href: "mailto:" + email, gold: false },
  ]

  return (
    <footer style={{ background: "#111111" }}>
      <div style={{ height: 3, background: "linear-gradient(90deg, #FFCC00 0%, #FFE066 50%, #FFCC00 100%)" }} />
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 40, padding: "40px 0 32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/manada-logo-light.png" alt="Manada Safety" style={{ height: 50, width: "auto", display: "block" }} />
              <div>
                <div style={{ fontSize: 19, fontWeight: 900, color: "#FFCC00", letterSpacing: "0.05em", fontFamily: "var(--ms-font-display)" }}>MANADA</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.22em", textTransform: "uppercase" }}>SAFETY MN</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.8, marginBottom: 18, maxWidth: 280 }}>
              Safetoe, Safeyear брэндийн Монгол дахь албан ёсны дистрибютор. Хөдөлмөрийн хамгаалах хэрэгслийн тэргүүлэх нийлүүлэгч.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {contacts.map((c) => (
                <a key={c.label} href={c.href} style={{ fontSize: 11, color: c.gold ? "#FFCC00" : "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: c.gold ? 700 : 400 }}>
                  {c.label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href={facebook} target="_blank" rel="noreferrer" style={{ background: "#1877f2", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Facebook</a>
              <a href={instagram} target="_blank" rel="noreferrer" style={{ background: "#e4405f", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Instagram</a>
            </div>
          </div>
          {LINK_COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#FFCC00", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #2A2A2A" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <LocalizedClientLink key={link} href="/store" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}>{link}</LocalizedClientLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1E1E1E", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>2024-2026 Манада ХХК. Бүх эрх хуулиар хамгаалагдсан.</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["CE", "ASTM", "ISO 9001"].map((c) => (
              <span key={c} style={{ background: "#1A1A1A", border: "1px solid #FFCC00", color: "#FFCC00", fontSize: 10, padding: "2px 8px", borderRadius: 2, fontWeight: 700 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
