import { Metadata } from "next"
import { notFound } from "next/navigation"
import ManadaProductDetail from "@modules/products/templates/manada-detail"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(slug)}?lang=mn`, { next: { revalidate: 60 } })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getPhone(): Promise<string> {
  try {
    const res = await fetch(`${API}/site/settings?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return "+97699102250"
    const s = await res.json()
    return (s.phone || "+97699102250").replace(/\s/g, "")
  } catch {
    return "+97699102250"
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { handle } = await props.params
  const p = await getProduct(handle)
  if (!p) return { title: "Бүтээгдэхүүн" }
  return {
    title: `${p.meta_title || p.name}`,
    description: p.meta_description || p.short_description || p.name,
    openGraph: {
      title: p.name,
      images: p.main_image_url ? [BASE + p.main_image_url] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const { handle } = await props.params
  const [p, phone] = await Promise.all([getProduct(handle), getPhone()])
  if (!p) notFound()

  // Product schema (JSON-LD) — lets Google show price/availability in results
  const site = process.env.NEXT_PUBLIC_BASE_URL || "https://manada.mn"
  const inStock = (p.variants || []).some((v: any) => v.in_stock) || p.in_stock
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.meta_description || p.short_description || p.name,
    image: p.main_image_url ? [site + p.main_image_url] : undefined,
    brand: p.brand?.name ? { "@type": "Brand", name: p.brand.name } : undefined,
    sku: p.variants?.[0]?.sku || undefined,
    offers: {
      "@type": "Offer",
      url: `${site}/products/${p.slug}`,
      priceCurrency: "MNT",
      price: p.price || 0,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: "Manada Safety" },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ManadaProductDetail product={p} base={BASE} phone={phone} />
    </>
  )
}
