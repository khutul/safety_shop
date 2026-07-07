import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Brand = { id: number; name: string; slug: string; website?: string; logo_url?: string | null }

// Fallback (used only if the API returns nothing)
const FALLBACK: Brand[] = [
  { id: -1, name: "SAFETOE", slug: "safetoe" },
  { id: -2, name: "SAFEYEAR", slug: "safeyear" },
  { id: -3, name: "3M", slug: "3m" },
  { id: -4, name: "HONEYWELL", slug: "honeywell" },
  { id: -5, name: "MSA", slug: "msa" },
  { id: -6, name: "DELTAPLUS", slug: "deltaplus" },
  { id: -7, name: "UVEX", slug: "uvex" },
  { id: -8, name: "GUARDWON", slug: "guardwon" },
]

async function getBrands(): Promise<Brand[]> {
  try {
    const res = await fetch(`${API}/brands`, { next: { revalidate: 60 } })
    if (!res.ok) return FALLBACK
    const data = await res.json()
    return Array.isArray(data) && data.length ? data : FALLBACK
  } catch {
    return FALLBACK
  }
}

/**
 * Official brand wordmarks bundled with the storefront (public/brands/*.svg).
 * A logo uploaded in Odoo (brand.logo) always wins; these are the fallback so
 * the row looks right before logos are uploaded.
 */
const LOCAL_LOGOS: Record<string, string> = {
  safetoe: "/brands/safetoe.svg",
  safeyear: "/brands/safeyear.svg",
  "3m": "/brands/3m.svg",
  honeywell: "/brands/honeywell.svg",
  msa: "/brands/msa.svg",
  deltaplus: "/brands/deltaplus.svg",
  delta: "/brands/deltaplus.svg",
  uvex: "/brands/uvex.svg",
  safetyjogger: "/brands/safetyjogger.svg",
  guardwon: "/brands/guardwon.svg",
  manada: "/brands/manada.svg",
  manadasafety: "/brands/manada.svg",
}

function localLogo(b: Brand): string | null {
  const key = (b.slug || b.name || "").toLowerCase().replace(/[^a-z0-9]/g, "")
  return LOCAL_LOGOS[key] || null
}

function BrandCard({ b, hidden }: { b: Brand; hidden?: boolean }) {
  const logoSrc = b.logo_url ? BASE + b.logo_url : localLogo(b)
  const inner = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logoSrc} alt={hidden ? "" : b.name} style={{ height: 46, maxWidth: 170, width: "auto", objectFit: "contain", display: "block" }} />
  ) : (
    <span style={{ fontSize: 16, fontWeight: 800, color: "#3a3f47", letterSpacing: "0.04em", whiteSpace: "nowrap", fontFamily: "var(--ms-font-display)" }}>{b.name}</span>
  )
  const style: React.CSSProperties = {
    flex: "0 0 auto",
    minWidth: 150,
    height: 82,
    background: "#fff",
    border: "1px solid var(--ms-border)",
    borderRadius: 4,
    padding: "12px 22px",
    marginRight: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  }
  // Real brands (id > 0) link to their product list in the store;
  // fallback placeholder brands just open the store.
  const href = b.id > 0 ? `/store?brand_id=${b.id}` : "/store"
  return (
    <LocalizedClientLink href={href} style={style} title={b.name} aria-hidden={hidden} tabIndex={hidden ? -1 : undefined}>
      {inner}
    </LocalizedClientLink>
  )
}

export default async function BrandLogos() {
  const brands = await getBrands()
  // Continuous right-to-left marquee once there are enough logos;
  // a plain scrollable row when there are only a few.
  const marquee = brands.length >= 6
  return (
    <section style={{ background: "var(--ms-bg)", padding: "40px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark" style={{ marginBottom: 22 }}>
          <div className="bar" />
          <span className="title">Бидний нийлүүлдэг брэндүүд</span>
          <div className="rule" />
          <LocalizedClientLink href="/store" className="more">Бүгд →</LocalizedClientLink>
        </div>
        {marquee ? (
          <div className="ms-marquee">
            <div
              className="ms-marquee-track"
              style={{ ["--ms-marquee-duration" as any]: `${Math.max(brands.length * 4, 24)}s` }}
            >
              {brands.map((b) => <BrandCard key={b.id} b={b} />)}
              {/* Duplicate set makes the loop seamless */}
              {brands.map((b) => <BrandCard key={`dup-${b.id}`} b={b} hidden />)}
            </div>
          </div>
        ) : (
          <div className="no-scrollbar" style={{ display: "flex", alignItems: "center", overflowX: "auto" }}>
            {brands.map((b) => <BrandCard key={b.id} b={b} />)}
          </div>
        )}
      </div>
    </section>
  )
}
