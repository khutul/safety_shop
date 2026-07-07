import { HttpTypes } from "@medusajs/types"
import { orderCategoryTree } from "@lib/util/category-order"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

type OdooCat = {
  id: number; name: string; slug: string; parent_id: number | null
  sequence: number; image_url: string | null; children: OdooCat[]
}

function toCat(c: OdooCat): HttpTypes.StoreProductCategory {
  return {
    id: String(c.id),
    name: c.name,
    handle: c.slug,
    description: "",
    category_children: (c.children || []).map(toCat),
    parent_category: null,
  } as unknown as HttpTypes.StoreProductCategory
}

function flatten(cats: OdooCat[]): OdooCat[] {
  const out: OdooCat[] = []
  const walk = (list: OdooCat[]) =>
    list.forEach((c) => { out.push(c); if (c.children?.length) walk(c.children) })
  walk(cats)
  return out
}

export const listCategories = async (_query?: Record<string, unknown>) => {
  const res = await fetch(`${API}/categories?lang=mn`, { next: { revalidate: 300 } })
  if (!res.ok) return []
  const cats: OdooCat[] = await res.json()
  return flatten(orderCategoryTree(cats)).map(toCat)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = categoryHandle[categoryHandle.length - 1]
  const all = await listCategories()
  return all.find((c) => c.handle === handle)
}
