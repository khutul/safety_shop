import { notFound } from "next/navigation"

// Medusa-era collections are not used on this storefront.
// The route exists only so old links resolve to a clean 404
// (and no build-time Medusa fetches happen).
export default function CollectionPage() {
  notFound()
}
