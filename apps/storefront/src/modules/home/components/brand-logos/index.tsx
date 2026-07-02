const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Brand = { id: number; name: string; slug: string; website?: string; logo_url?: string | null }

// Fallback (used only if the API returns nothing)
const FALLBACK: Brand[] = [
  { id: -1, name: "safetoe", slug: "safetoe" },
  { id: -2, name: "SAFEYEAR", slug: "safeyear" },
  { id: -3, name: "3M", slug: "3m" },
  { id: -4, name: "HONEYWELL", slug: "honeywell" },
  { id: -5, name: "KAMELO", slug: "kamelo" },
  { id: -6, name: "ENERGIZER", slug: "energizer" },
]

async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API}/brands`, { cache: "no-store" })
    if (!res.ok) return FALLBACK
    const data = await res.json()
    return Array.isArray(data) && data.length ? data : FALLBACK
  } catch {
    return FALLBACK
  }
}

function BrandItem({ b, last }: { b: Brand; last: boolean }) {
  const inner = b.logo_url ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={BASE + b.logo_url} alt={b.name} style={{ height: 26, width: "auto", objectFit: "contain", display: "block", filter: "grayscale(0.15)" }} />
  ) : (
    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.65)", letterSpacing: "0.02em", whiteSpace: "nowrap" }}>{b.name}</span>
  )
  const style: React.CSSProperties = { padding: "4px 20px", borderRight: last ? "none" : "1px solid #2A2A2A", flexShrink: 0, display: "flex", alignItems: "center", textDecoration: "none" }
  return b.website ? (
    <a href={b.website} target="_blank" rel="noreferrer" style={style} title={b.name}>{inner}</a>
  ) : (
    <div style={style}>{inner}</div>
  )
}

export default async function BrandLogos() {
  const brands = await getBrands()
  return (
    <div style={{ background: "#0D0D0D", borderTop: "1px solid #1A1A1A", padding: "16px 0" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
          <span style={{ color: "rgba(255,255,255,0.32)", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", whiteSpace: "nowrap", flexShrink: 0, paddingRight: 16, borderRight: "1px solid #2A2A2A" }}>
            Албан ёсны дилер
          </span>
          {brands.map((b, i) => (
            <BrandItem key={b.id} b={b} last={i === brands.length - 1} />
          ))}
        </div>
      </div>
    </div>
  )
}
