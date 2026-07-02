"use client"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Industry = { id: number; name: string; slug: string; image_url?: string | null }

// Fallback images per slug (used until images uploaded in Odoo)
const FALLBACK_BG: Record<string, string> = {
  mining: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=75",
  construction: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=75",
  welding: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=500&q=75",
  electrical: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=75",
  manufacturing: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=75",
  transport: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&q=75",
}
const DEFAULT_BG = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=75"

const FALLBACK: Industry[] = [
  { id: -1, name: "Уул уурхай", slug: "mining" },
  { id: -2, name: "Барилга", slug: "construction" },
  { id: -3, name: "Гагнуур", slug: "welding" },
  { id: -4, name: "Цахилгаан", slug: "electrical" },
  { id: -5, name: "Үйлдвэр", slug: "manufacturing" },
  { id: -6, name: "Зам тээвэр", slug: "transport" },
]

function bgFor(ind: Industry) {
  if (ind.image_url) return BASE + ind.image_url
  return FALLBACK_BG[ind.slug] || DEFAULT_BG
}

function IndustryCard({ ind }: { ind: Industry }) {
  const [hov, setHov] = useState(false)
  return (
    <LocalizedClientLink
      href={`/store?industry=${ind.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ textDecoration: "none", display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3", border: hov ? "2px solid #FFCC00" : "2px solid transparent", transition: "border-color 0.25s" }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + bgFor(ind) + ")", backgroundSize: "cover", backgroundPosition: "center", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#FFCC00" }} />
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--ms-font-display)" }}>{ind.name}</span>
      </div>
    </LocalizedClientLink>
  )
}

export default function IndustrySection() {
  const [items, setItems] = useState<Industry[]>(FALLBACK)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/industries?lang=mn`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data) && data.length) setItems(data)
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div style={{ background: "#ffffff", padding: "34px 0 34px" }}>
      <div className="ms-container">
        <div className="ms-sechead">
          <div className="bar" />
          <span className="title">Салбараар хайх</span>
          <div className="rule" />
          <LocalizedClientLink href="/store" className="more">Бүгд →</LocalizedClientLink>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
          {items.map((ind) => <IndustryCard key={ind.id} ind={ind} />)}
        </div>
      </div>
    </div>
  )
}
