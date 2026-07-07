"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { orderCategoryTree } from "@lib/util/category-order"

import SortProducts, { SortOptions } from "./sort-products"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

type Cat = { id: number; name: string; slug: string; count?: number; children?: Cat[] }

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  "data-testid"?: string
}

function CategoryLink({ cat, active, child }: { cat: Cat; active: boolean; child?: boolean }) {
  return (
    <LocalizedClientLink
      href={cat.slug ? `/store?category=${cat.slug}` : `/store?category_id=${cat.id}`}
      style={{
        display: "block",
        padding: child ? "5px 8px 5px 22px" : "7px 8px",
        borderRadius: 3,
        fontSize: child ? 12.5 : 13,
        fontWeight: active ? 700 : child ? 400 : 600,
        color: active ? "#FFCC00" : child ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.8)",
        textDecoration: "none",
        background: active ? "rgba(255,204,0,0.08)" : "none",
      }}
    >
      {cat.name}
    </LocalizedClientLink>
  )
}

const RefinementList = ({ sortBy, "data-testid": dataTestId }: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [cats, setCats] = useState<Cat[]>([])
  // Mobile: filters collapsed by default so products show immediately
  const [open, setOpen] = useState(false)
  const activeSlug = searchParams.get("category") || ""
  const activeId = searchParams.get("category_id") || ""
  const isActive = (c: Cat) =>
    (!!c.slug && c.slug === activeSlug) || (!!activeId && String(c.id) === activeId)

  // Close the mobile panel after any navigation (category picked, sort changed)
  useEffect(() => {
    setOpen(false)
  }, [searchParams])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`)
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data)) setCats(orderCategoryTree(data))
      } catch {}
    })()
    return () => {
      alive = false
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      params.delete("page")
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <aside
      className="small:min-w-[250px] small:max-w-[250px] mb-4 small:mb-0 small:mr-8"
      style={{ flexShrink: 0 }}
    >
      {/* Mobile-only toggle: keeps products above the fold */}
      <button
        className="ms-show-mobile"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#1A1A1A",
          border: "1px solid #262626",
          borderRadius: 4,
          padding: "11px 14px",
          marginBottom: 10,
          cursor: "pointer",
          color: "rgba(255,255,255,0.85)",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="15" height="15" fill="none" stroke="#FFCC00" strokeWidth="1.8" strokeLinecap="round" viewBox="0 0 24 24"><path d="M4 6h16 M7 12h10 M10 18h4" /></svg>
          Ангилал / Эрэмбэлэх
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      <div className={open ? undefined : "ms-hide-mobile"}>
      <div style={{ background: "#1A1A1A", border: "1px solid #262626", borderRadius: 4, padding: "16px 14px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
          Ангилал
        </div>
        <LocalizedClientLink
          href="/store"
          style={{
            display: "block",
            padding: "7px 8px",
            borderRadius: 3,
            fontSize: 13,
            fontWeight: !activeSlug && !activeId ? 700 : 600,
            color: !activeSlug && !activeId ? "#FFCC00" : "rgba(255,255,255,0.8)",
            textDecoration: "none",
            background: !activeSlug && !activeId ? "rgba(255,204,0,0.08)" : "none",
          }}
        >
          Бүх бараа
        </LocalizedClientLink>
        {cats.map((c) => (
          <div key={c.id}>
            <CategoryLink cat={c} active={isActive(c)} />
            {(c.children || []).map((ch) => (
              <CategoryLink key={ch.id} cat={ch} active={isActive(ch)} child />
            ))}
          </div>
        ))}
      </div>
      <div style={{ background: "#1A1A1A", border: "1px solid #262626", borderRadius: 4, padding: "16px 14px" }}>
        <SortProducts sortBy={sortBy} setQueryParams={setQueryParams} data-testid={dataTestId} />
      </div>
      </div>
    </aside>
  )
}

export default RefinementList
