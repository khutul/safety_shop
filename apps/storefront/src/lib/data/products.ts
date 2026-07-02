"use server"

import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

function toStoreProduct(p: any): HttpTypes.StoreProduct {
  const amount = p.price || 0
  const rawVariants =
    p.variants && p.variants.length
      ? p.variants
      : [{ id: `${p.id}-def`, size: "", color: "", sku: "", price: amount, qty_available: p.in_stock ? 10 : 0 }]
  const variants = rawVariants.map((v: any) => ({
    id: String(v.id),
    title: [v.size, v.color].filter(Boolean).join(" / ") || "Default",
    sku: v.sku || "",
    inventory_quantity: v.qty_available ?? (p.in_stock ? 10 : 0),
    manage_inventory: true,
    calculated_price: {
      calculated_amount: v.price ?? amount,
      original_amount: v.price ?? amount,
      currency_code: "mnt",
      calculated_price: { price_list_type: "default" },
    },
  }))
  return {
    id: String(p.id),
    title: p.name,
    handle: p.slug,
    subtitle: p.brand?.name || "",
    description: p.short_description || "",
    thumbnail: p.main_image_url ? BASE + p.main_image_url : null,
    images: (p.gallery || []).map((g: any, i: number) => ({ id: `${p.id}-img-${i}`, url: BASE + g.url })),
    variants,
    options: [],
    categories: (p.categories || []).map((s: string) => ({ id: s, handle: s, name: s })),
    tags: [],
    metadata: { model: p.model || "" },
    created_at: "",
    updated_at: "",
  } as unknown as HttpTypes.StoreProduct
}

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: any
  countryCode?: string
  regionId?: string
}) => {
  const limit = queryParams?.limit || 12
  const page = Math.max(pageParam || 1, 1)
  const sp = new URLSearchParams({ lang: "mn", page: String(page), limit: String(limit) })
  if (queryParams?.q) sp.set("q", queryParams.q)
  if (queryParams?.category) sp.set("category", queryParams.category)
  if (queryParams?.industry) sp.set("industry", queryParams.industry)
  if (queryParams?.brand) sp.set("brand", queryParams.brand)
  if (queryParams?.sort) sp.set("sort", queryParams.sort)

  const res = await fetch(`${API}/products?${sp.toString()}`, { cache: "no-store" })
  if (!res.ok) return { response: { products: [], count: 0 }, nextPage: null, queryParams }
  const data = await res.json()
  const products = (data.products || []).map(toStoreProduct)
  const count = data.count || products.length
  const nextPage = count > page * limit ? page + 1 : null
  return { response: { products, count }, nextPage, queryParams }
}

export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: any
  sortBy?: SortOptions
  countryCode?: string
}) => {
  const sortMap: Record<string, string> = {
    price_asc: "price_asc",
    price_desc: "price_desc",
    created_at: "newest",
  }
  const limit = queryParams?.limit || 12
  const p = Math.max(page || 1, 1)
  const { response } = await listProducts({
    pageParam: p,
    queryParams: { ...queryParams, limit, sort: sortMap[sortBy] || "" },
    countryCode,
  })
  const nextPage = response.count > p * limit ? p + 1 : null
  return { response, nextPage, queryParams }
}
