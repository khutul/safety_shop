import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WolfLogo from "@modules/layout/components/wolf-logo"

const LINK_COLS = [
  { title: "Products", links: ["Workwear", "Boots", "Head Protection", "Gloves", "Masks", "Eye Protection"] },
  { title: "Company", links: ["About Us", "Place Order", "Tender Supply", "Contact"] },
  { title: "Info", links: ["Delivery Policy", "Return Policy", "Privacy Policy"] },
]

const CONTACTS = [
  { label: "+976 99102250, 99092250", href: "tel:+97699102250", gold: true },
  { label: "Barildgachin HTT, A blok, 3 davkhar, S9", href: "#", gold: false },
  { label: "Mon-Sat: 09:00-18:00", href: "#", gold: false },
  { label: "info@manadasafety.mn", href: "mailto:info@manadasafety.mn", gold: false },
]

export default function Footer() {
  return (
    <footer style={{ background: "#111111" }}>
      <div style={{ height: 3, background: "linear-gradient(90deg, #D4A017 0%, #F0C040 50%, #D4A017 100%)" }} />
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2.2fr 1fr 1fr 1fr", gap: 40, padding: "40px 0 32px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <WolfLogo size={44} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#D4A017", letterSpacing: "0.06em", fontFamily: "Georgia, serif" }}>MANADA</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", textTransform: "uppercase" }}>SAFETY MN</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, lineHeight: 1.8, marginBottom: 18, maxWidth: 280 }}>
              Official Safetoe and Safeyear distributor in Mongolia. Leading PPE supplier.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {CONTACTS.map(c => (
                <a key={c.label} href={c.href} style={{ fontSize: 11, color: c.gold ? "#D4A017" : "rgba(255,255,255,0.4)", textDecoration: "none", fontWeight: c.gold ? 700 : 400 }}>
                  {c.label}
                </a>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <a href="https://www.facebook.com/Manadasafetymongolia" target="_blank" rel="noreferrer" style={{ background: "#1877f2", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Facebook</a>
              <a href="https://www.instagram.com/gutal.safetymn" target="_blank" rel="noreferrer" style={{ background: "#e4405f", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 2, textDecoration: "none" }}>Instagram</a>
            </div>
          </div>
          {LINK_COLS.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#D4A017", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16, paddingBottom: 8, borderBottom: "1px solid #2A2A2A" }}>{col.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(link => (
                  <LocalizedClientLink key={link} href="/store" style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, textDecoration: "none" }}>{link}</LocalizedClientLink>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1E1E1E", padding: "14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>2024-2026 Manada LLC. All rights reserved.</span>
          <div style={{ display: "flex", gap: 6 }}>
            {["CE", "ASTM", "ISO 9001"].map(c => (
              <span key={c} style={{ background: "#1A1A1A", border: "1px solid #D4A017", color: "#D4A017", fontSize: 10, padding: "2px 8px", borderRadius: 2, fontWeight: 700 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
