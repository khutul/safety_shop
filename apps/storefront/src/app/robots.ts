import type { MetadataRoute } from "next"
import { getBaseURL } from "@lib/util/env"

// ALLOW_INDEXING=true only on the live manada.mn deployment.
const INDEXABLE = process.env.ALLOW_INDEXING === "true"

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } }
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/cart", "/order-status", "/checkout", "/account", "/api/"],
    },
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
