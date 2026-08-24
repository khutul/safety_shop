import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

type Cat = { id: number; name: string; slug: string; children?: Cat[] }

async function resolveCategoryName(slug?: string, id?: string): Promise<string> {
  if (!slug && !id) return "Бүх бараа"
  try {
    const res = await fetch(`${API}/categories?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return "Бараа"
    const cats: Cat[] = await res.json()
    const numId = id ? parseInt(id) : null
    for (const c of cats) {
      if ((slug && c.slug === slug) || (numId && c.id === numId)) return c.name
      for (const ch of c.children || [])
        if ((slug && ch.slug === slug) || (numId && ch.id === numId)) return ch.name
    }
    return "Бараа"
  } catch {
    return "Бараа"
  }
}

async function resolveIndustryName(slug: string): Promise<string> {
  try {
    const res = await fetch(`${API}/industries?lang=mn`, { next: { revalidate: 300 } })
    if (!res.ok) return "Салбар"
    const items: Cat[] = await res.json()
    const found = items.find((c) => c.slug === slug)
    return found ? found.name : "Салбар"
  } catch {
    return "Салбар"
  }
}

async function resolveBrandName(brandId?: string, brandSlug?: string): Promise<string> {
  try {
    const res = await fetch(`${API}/brands`, { next: { revalidate: 300 } })
    if (!res.ok) return "Брэнд"
    const items: { id: number; name: string; slug?: string }[] = await res.json()
    const found = items.find(
      (b) =>
        (brandId && b.id === parseInt(brandId)) ||
        (brandSlug && (b.slug || "").toLowerCase() === brandSlug.toLowerCase())
    )
    return found ? found.name : "Брэнд"
  } catch {
    return "Брэнд"
  }
}

const StoreTemplate = async ({
  sortBy,
  page,
  category,
  categoryId,
  industry,
  brand,
  brandId,
  q,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  category?: string
  categoryId?: string
  industry?: string
  brand?: string
  brandId?: string
  q?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const title = q
    ? `Хайлт: "${q}"`
    : brandId || brand
      ? await resolveBrandName(brandId, brand)
      : industry
        ? await resolveIndustryName(industry)
        : await resolveCategoryName(category, categoryId)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="ms-sechead on-dark" style={{ marginBottom: 24 }}>
          <div className="bar" />
          <h1 data-testid="store-page-title" className="title" style={{ margin: 0 }}>
            {title}
          </h1>
          <div className="rule" />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            category={category}
            categoryId={categoryId}
            industry={industry}
            brand={brand}
            brandId={brandId}
            q={q}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
