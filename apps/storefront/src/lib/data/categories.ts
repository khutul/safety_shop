import { HttpTypes } from "@medusajs/types"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"

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
  const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
  if (!res.ok) return []
  const cats: OdooCat[] = await res.json()
  return flatten(cats).map(toCat)
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = categoryHandle[categoryHandle.length - 1]
  const all = await listCategories()
  return all.find((c) => c.handle === handle)
}
