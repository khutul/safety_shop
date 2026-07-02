import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

function StoreCard({ product }: { product: HttpTypes.StoreProduct }) {
  const p: any = product
  const img = p.thumbnail || p.images?.[0]?.url || null
  const price = p.variants?.[0]?.calculated_price?.calculated_amount ?? 0
  const qty = (p.variants || []).reduce((a: number, v: any) => a + (v.inventory_quantity ?? 0), 0)
  const inStock = qty > 0
  const brand = p.subtitle || ""

  return (
    <LocalizedClientLink href={`/products/${p.handle}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="ms-card" style={{ cursor: "pointer", height: "100%" }}>
        <div style={{ height: 34, lineHeight: "34px", padding: "0 12px", borderBottom: "1px solid #f5f5f5" }}>
          <span style={{ fontSize: 10, color: brand ? "#828282" : "#d1d5db", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {brand || "MANADA SAFETY"}
          </span>
        </div>
        <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", overflow: "hidden" }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.title} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          ) : (
            <span style={{ fontSize: 11, color: "#c3c7cd" }}>Зураг байхгүй</span>
          )}
        </div>
        <div style={{ padding: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#210a2d", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 8 }}>
            {p.title}
          </div>
          <div style={{ marginBottom: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: inStock ? "#e2f2da" : "#ffe9b9", color: inStock ? "#44782a" : "#a97432", borderRadius: 12, padding: "3px 10px", fontSize: 11, fontWeight: 500 }}>
              {inStock ? "Нөөцтэй" : "Захиалгаар"}
            </span>
          </div>
          <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>{price > 0 ? fmt(price) : "Үнэ асуух"}</span>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default async function PaginatedProducts({
  sortBy,
  page,
  category,
  industry,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  category?: string
  industry?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: any = { limit: PRODUCT_LIMIT }
  if (category) queryParams.category = category
  if (industry) queryParams.industry = industry
  if (productsIds) queryParams.id = productsIds
  if (sortBy === "created_at") queryParams.order = "created_at"

  const region = await getRegion(countryCode)
  if (!region) return null

  const {
    response: { products, count },
  } = await listProductsWithSort({ page, queryParams, sortBy, countryCode })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  if (!products.length) {
    return (
      <div style={{ padding: "48px 0", color: "#6b7280", fontSize: 14 }}>
        Энэ ангилалд одоогоор бүтээгдэхүүн алга.
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 14, fontSize: 13, color: "#6b7280" }}>{count} бүтээгдэхүүн</div>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-4 gap-y-5"
        data-testid="products-list"
      >
        {products.map((p) => (
          <li key={p.id}>
            <StoreCard product={p} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && (
        <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />
      )}
    </>
  )
}
