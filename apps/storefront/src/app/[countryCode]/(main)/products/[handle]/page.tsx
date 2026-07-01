import { Metadata } from "next"
import { notFound } from "next/navigation"
import ManadaProductDetail from "@modules/products/templates/manada-detail"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${API}/products/${encodeURIComponent(slug)}?lang=mn`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function getPhone(): Promise<string> {
  try {
    const res = await fetch(`${API}/site/settings?lang=mn`, { cache: "no-store" })
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
  if (!p) return { title: "Бүтээгдэхүүн | Manada Safety" }
  return {
    title: `${p.meta_title || p.name} | Manada Safety`,
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
  return <ManadaProductDetail product={p} base={BASE} phone={phone} />
}
