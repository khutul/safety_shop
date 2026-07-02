import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"

type Cat = { id: number; name: string; slug: string; children?: Cat[] }

async function resolveCategoryName(slug?: string): Promise<string> {
  if (!slug) return "Бүх бараа"
  try {
    const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
    if (!res.ok) return "Бараа"
    const cats: Cat[] = await res.json()
    for (const c of cats) {
      if (c.slug === slug) return c.name
      for (const ch of c.children || []) if (ch.slug === slug) return ch.name
    }
    return "Бараа"
  } catch {
    return "Бараа"
  }
}

async function resolveIndustryName(slug: string): Promise<string> {
  try {
    const res = await fetch(`${API}/industries?lang=mn`, { cache: "no-store" })
    if (!res.ok) return "Салбар"
    const items: Cat[] = await res.json()
    const found = items.find((c) => c.slug === slug)
    return found ? found.name : "Салбар"
  } catch {
    return "Салбар"
  }
}

const StoreTemplate = async ({
  sortBy,
  page,
  category,
  industry,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  category?: string
  industry?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const title = industry ? await resolveIndustryName(industry) : await resolveCategoryName(category)

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList sortBy={sort} />
      <div className="w-full">
        <div className="mb-8">
          <h1
            data-testid="store-page-title"
            style={{ fontFamily: "var(--ms-font-display)", fontSize: 30, fontWeight: 800, textTransform: "uppercase", color: "#151515", letterSpacing: "0.02em" }}
          >
            {title}
          </h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            category={category}
            industry={industry}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
