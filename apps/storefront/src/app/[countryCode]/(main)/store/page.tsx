import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"

export const metadata: Metadata = {
  title: "Бүх бараа — Хөдөлмөр хамгааллын хэрэгсэл",
  description:
    "Аюулгүйн гутал, ажлын хувцас, каск, бээлий, нүд амьсгал хамгаалах хэрэгсэл — дэлхийн брэндүүдийн бүрэн нэр төрөл, баталгаат үнэ.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
    category_id?: string
    industry?: string
    brand?: string
    brand_id?: string
    q?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page, category, category_id, industry, brand, brand_id, q } = searchParams

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      category={category}
      categoryId={category_id}
      industry={industry}
      brand={brand}
      brandId={brand_id}
      q={q}
      countryCode={params.countryCode}
    />
  )
}
