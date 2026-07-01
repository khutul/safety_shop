import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"

const FALLBACK_IMAGE = "/products/product-1.jpg"

function formatPrice(amount: number, currency: string): string {
  if (currency === "mnt") return `${amount.toLocaleString("mn-MN")}` + "₮"
  if (currency === "eur") return "€" + `${amount.toLocaleString("de-DE", { minimumFractionDigits: 2 })}`
  return `${amount.toLocaleString()} ${currency.toUpperCase()}`
}

function getSavePct(original: number, calculated: number): number | null {
  if (!original || !calculated || original <= calculated) return null
  return Math.round(((original - calculated) / original) * 100)
}

function CartSVG() {
  return (
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
      <circle cx="7" cy="17" r="2" />
      <circle cx="15" cy="17" r="2" />
      <path d="M20,4.4V5l-1.8,6.3c-0.1,0.4-0.5,0.7-1,0.7H6.7c-0.4,0-0.8-0.3-1-0.7L3.3,3.9C3.1,3.3,2.6,3,2.1,3H0.4C0.2,3,0,2.8,0,2.6V1.4C0,1.2,0.2,1,0.4,1h2.5c1,0,1.8,0.6,2.1,1.6L5.1,3l2.3,6.8c0,0.1,0.2,0.2,0.3,0.2h8.6c0.1,0,0.3-0.1,0.3-0.2l1.3-4.4C17.9,5.2,17.7,5,17.5,5H9.4C9.2,5,9,4.8,9,4.6V3.4C9,3.2,9.2,3,9.4,3h9.2C19.4,3,20,3.6,20,4.4z"/>
    </svg>
  )
}

function CheckSVG() {
  return (
    <svg width="13" height="13" fill="currentColor" viewBox="0 0 13 13">
      <path d="M12,4.4L5.5,11L1,6.5l1.4-1.4l3.1,3.1L10.6,3L12,4.4z"/>
    </svg>
  )
}

function ProductCard({ product }: { product: HttpTypes.StoreProduct }) {
  const { cheapestPrice } = getProductPrice({ product })
  const imageUrl = product.thumbnail || (product.images?.[0]?.url) || FALLBACK_IMAGE
  const isLocalImage = imageUrl?.startsWith("/")
  const calculated = cheapestPrice?.calculated_price_number ?? 0
  const original = cheapestPrice?.original_price_number ?? 0
  const currency = cheapestPrice?.currency_code ?? "mnt"
  const savePct = getSavePct(original, calculated)
  const totalInventory = product.variants?.reduce((acc, v: any) => acc + (v.inventory_quantity ?? 0), 0) ?? 0
  const inStock = totalInventory > 0
  const brand = (product.metadata?.brand as string) || ""
  const productCode = (product.metadata?.code as string) || ""
  const pn = (product.metadata?.pn as string) || ""

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} style={{ textDecoration: "none", display: "block" }}>
      <div className="ms-card" style={{ cursor: "pointer" }}>
        <div style={{ height: 36, lineHeight: "36px", padding: "0 12px", borderBottom: "1px solid #f5f5f5" }}>
          {brand ? (
            <span style={{ fontSize: 11, color: "#828282", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {brand}
            </span>
          ) : (
            <span style={{ fontSize: 11, color: "#d1d5db" }}>MANADA SAFETY</span>
          )}
        </div>

        <div style={{
          width: "100%", height: 168,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#f9f9f9",
          overflow: "hidden",
          position: "relative",
        }}>
          {isLocalImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl!}
              alt={product.title}
              style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
            />
          ) : (
            <Image
              src={imageUrl!}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              style={{ objectFit: "contain" }}
              unoptimized
            />
          )}
          {savePct && savePct > 0 && (
            <div style={{
              position: "absolute", top: 8, left: 8,
              background: "#D62828", color: "#fff",
              fontSize: 10, fontWeight: 700,
              padding: "2px 7px", borderRadius: 2,
            }}>
              {savePct}% SALE
            </div>
          )}
        </div>

        <div style={{ padding: 10 }}>
          <a style={{
            display: "block",
            fontSize: 13, fontWeight: 500, color: "#210a2d",
            overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
            marginBottom: 2,
          }}>
            {product.title}
          </a>

          {product.description && (
            <span style={{
              display: "block",
              fontSize: 12, color: "#828282",
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
              marginBottom: 6,
            }}>
              {product.description}
            </span>
          )}

          {(productCode || pn) && (
            <span style={{
              display: "block",
              padding: "4px 8px",
              background: "#f1f1f1",
              borderRadius: 4,
              fontSize: 11, color: "#6c757d",
              marginBottom: 6,
              overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis",
            }}>
              {productCode && `Код: ${productCode}`}
              {productCode && pn && " ∙ "}
              {pn && `PN: ${pn}`}
            </span>
          )}

          <div style={{ marginBottom: 8 }}>
            <div style={{
              display: "inline-flex", alignItems: "center",
              background: inStock ? "#e2f2da" : "#ffe9b9",
              color: inStock ? "#44782a" : "#a97432",
              borderRadius: 12,
              padding: "3px 10px 3px 28px",
              fontSize: 12, fontWeight: 500,
              position: "relative",
              minHeight: 23,
            }}>
              <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", opacity: 0.85 }}>
                {inStock ? <CheckSVG /> : "⏳"}
              </span>
              {inStock
                ? (totalInventory > 0 && totalInventory < 1000 ? `Нөөцтэй: ${totalInventory}` : "Нөөцтэй")
                : "Захиалгаар"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ flex: 1, overflow: "hidden" }}>
              {calculated > 0 ? (
                <span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a1a" }}>
                    {formatPrice(calculated, currency)}
                  </span>
                  {savePct && original > 0 && (
                    <span style={{ fontSize: 12, color: "#D62828", fontWeight: 700, textDecoration: "line-through", marginLeft: 6 }}>
                      {formatPrice(original, currency)}
                    </span>
                  )}
                </span>
              ) : (
                <span style={{ fontSize: 12, color: "#828282" }}>Үнэ асуух</span>
              )}
            </div>
            <button style={{
              background: "transparent",
              border: "none",
              padding: 8,
              borderRadius: 2,
              cursor: "pointer",
              color: "#6b6b6b",
              flexShrink: 0,
            }}>
              <CartSVG />
            </button>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

function EmptyProducts() {
  return (
    <div style={{
      padding: "48px 24px",
      textAlign: "center",
      background: "#f9fafb",
      borderRadius: 4,
      border: "1px dashed #d1d5db",
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginBottom: 6, textTransform: "uppercase" }}>
        Бүтээгдэхүүн байхгүй байна
      </div>
      <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
        Odoo дээр бүтээгдэхүүн нэмээд "Вэбд нийтлэх" төлөвт оруулна уу
      </div>
      <a href="http://localhost:8079/web" style={{
        background: "#FFCC00", color: "#151515",
        fontSize: 12, fontWeight: 700,
        padding: "8px 20px", borderRadius: 2,
        textDecoration: "none", display: "inline-block",
      }}>
        Удирдлагын хэсэг
      </a>
    </div>
  )
}

export default async function SafetyProducts({ countryCode }: { countryCode: string }) {
  const region = await getRegion(countryCode).catch(() => null)
  let products: HttpTypes.StoreProduct[] = []

  if (region) {
    const result = await listProducts({
      countryCode,
      queryParams: {
        limit: 10,
        fields: "*variants.calculated_price,+variants.inventory_quantity,+metadata",
      },
    }).catch(() => null)
    products = result?.response.products ?? []
  }

  return (
    <div style={{ background: "#1A1A1A", padding: "28px 0 44px" }}>
      <div className="ms-container">
        <div className="ms-sechead">
          <div className="bar" />
          <span className="title">Шинэ бүтээгдэхүүн</span>
          <div className="rule" />
          <a href="/store" className="more">Бүгд →</a>
        </div>

        {products.length === 0 ? (
          <EmptyProducts />
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 12,
          }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
