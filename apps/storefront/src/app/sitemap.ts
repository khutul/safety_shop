import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

const API = (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1"

type Cat = { id: number; slug: string; children?: Cat[] }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getBaseURL()
  const now = new Date()

  const urls: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/store`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/brands/safetoe`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/embroidery`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/partnership`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ]

  // Products
  try {
    const res = await fetch(`${API}/products?lang=mn&limit=1000&page=1`, {
      next: { revalidate: 3600 },
    })
    if (res.ok) {
      const data = await res.json()
      for (const p of data.products || []) {
        if (p.slug) {
          urls.push({
            url: `${base}/products/${p.slug}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
  } catch {}

  // Category listing pages (slug-based only — clean URLs)
  try {
    const res = await fetch(`${API}/categories?lang=mn`, { next: { revalidate: 3600 } })
    if (res.ok) {
      const cats: Cat[] = await res.json()
      const walk = (list: Cat[]) => {
        for (const c of list) {
          if (c.slug) {
            urls.push({
              url: `${base}/store?category=${encodeURIComponent(c.slug)}`,
              lastModified: now,
              changeFrequency: "weekly",
              priority: 0.6,
            })
          }
          if (c.children?.length) walk(c.children)
        }
      }
      walk(cats)
    }
  } catch {}

  return urls
}
