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
    <LocalizedClientLink href={`/products/${p.handle}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div className="ms-card-dark" style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ height: 190, display: "flex", alignItems: "center", justifyContent: "center", background: "#f4f5f7", overflow: "hidden", flexShrink: 0 }}>
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={p.title} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }} />
          ) : (
            <div className="ms-imgph">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#b9bec7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <span>Manada Safety</span>
            </div>
          )}
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
            {brand || "Manada Safety"}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.92)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis", marginBottom: 8 }}>
            {p.title}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: "auto" }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#FFCC00" }}>{price > 0 ? fmt(price) : "Үнэ асуух"}</span>
            <span style={{ color: inStock ? "#7fc75e" : "rgba(255,255,255,0.45)", fontSize: 10, fontWeight: 600 }}>
              {inStock ? "Нөөцтэй" : "Захиалгаар"}
            </span>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

export default async function PaginatedProducts({
  sortBy,
  page,
  category,
  categoryId,
  industry,
  brandId,
  q,
  productsIds,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  category?: string
  categoryId?: string
  industry?: string
  brandId?: string
  q?: string
  productsIds?: string[]
  countryCode: string
}) {
  const queryParams: any = { limit: PRODUCT_LIMIT }
  if (category) queryParams.category = category
  if (categoryId) queryParams.category_id = categoryId
  if (industry) queryParams.industry = industry
  if (brandId) queryParams.brand_id = brandId
  if (q) queryParams.q = q
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
      <div style={{ padding: "48px 0", color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
        Энэ ангилалд одоогоор бүтээгдэхүүн алга.
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: 14, fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{count} бүтээгдэхүүн</div>
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
