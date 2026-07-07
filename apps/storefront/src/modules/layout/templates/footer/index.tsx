import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

const LINK_COLS = [
  {
    title: "Бүтээгдэхүүн",
    links: [
      { label: "Ажлын хувцас", href: "/store" },
      { label: "Гутал", href: "/store" },
      { label: "Толгой хамгаалалт", href: "/store" },
      { label: "Бээлий", href: "/store" },
      { label: "Маск", href: "/store" },
      { label: "Нүд хамгаалалт", href: "/store" },
    ],
  },
  {
    title: "Компани",
    links: [
      { label: "Бидний тухай", href: "/about" },
      { label: "Захиалга өгөх", href: "/store" },
      { label: "Захиалга шалгах", href: "/order-status" },
      { label: "Холбоо барих", href: "/about" },
    ],
  },
  {
    title: "Мэдээлэл",
    links: [
      { label: "Хүргэлтийн журам", href: "/about" },
      { label: "Буцаалтын журам", href: "/about" },
      { label: "Нууцлалын бодлого", href: "/about" },
    ],
  },
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
    const res = await fetch(`${API}/site/settings?lang=mn`, { next: { revalidate: 300 } })
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
        <div className="ms-footgrid">
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
            <div style={{ display: "flex", gap: 10 }}>
              <a href={facebook} target="_blank" rel="noreferrer" aria-label="Facebook" title="Facebook" style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A1A1A", border: "1px solid #2A2A2A", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.5-.13-2.4 0-4.1 1.5-4.1 4.2v2.3H7.4V13h2.7v8h3.4z" /></svg>
              </a>
              <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" style={{ width: 36, height: 36, borderRadius: "50%", background: "#1A1A1A", border: "1px solid #2A2A2A", color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" /></svg>
              </a>
              <a href={telHref} aria-label="Утас" title="Залгах" style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFCC00", color: "#151515", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
              </a>
            </div>
          </div>
          {LINK_COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#FFCC00", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #2A2A2A" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((link) => (
                  <LocalizedClientLink key={link.label} href={link.href} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}>{link.label}</LocalizedClientLink>
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
