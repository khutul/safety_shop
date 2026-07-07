const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

async function getPhone(): Promise<string> {
  try {
    const res = await fetch(`${API}/site/settings?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return "99102250"
    const s = await res.json()
    return s.phone || "99102250"
  } catch {
    return "99102250"
  }
}

export default async function TopBar() {
  const phone = await getPhone()
  return (
    <div style={{ background: "var(--ms-gold-grad)", color: "#151515", fontSize: 12, fontWeight: 600 }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "6px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <strong style={{ fontWeight: 800 }}>АНХААРУУЛГА:</strong> Ажлын хамгаалалт — Амьдралын хамгаалал
        </span>
        <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
          🚚 Хүргэлт ҮНЭГҮЙ <span style={{ opacity: 0.7 }}>(100,000₮-с дээш)</span>
        </span>
        <a href={`tel:${phone.replace(/\s/g, "")}`} style={{ color: "#151515", textDecoration: "none", fontWeight: 800, whiteSpace: "nowrap" }}>
          📞 Дилер: {phone}
        </a>
      </div>
    </div>
  )
}
