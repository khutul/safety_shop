"use client"
import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Cat = {
  id: number
  name: string
  slug: string
  count?: number
  image_url?: string | null
  children?: { id: number; name: string; slug: string }[]
}

const ICON_PATHS: Record<string, string> = {
  "head-protection": "M4 16a8 8 0 0 1 16 0 M2.5 16h19",
  "eye-face-protection": "M4 12h16 M5 12a3.5 3.5 0 1 0 7 0 M12 12a3.5 3.5 0 1 0 7 0",
  "respiratory-protection": "M3 9c5-2.5 13-2.5 18 0v3.5c-5 3.5-13 3.5-18 0z M3 10.5H1.5 M22.5 10.5H21",
  "hearing-protection": "M4 13v-1a8 8 0 0 1 16 0v1 M3 12h3v7H3z M18 12h3v7h-3z",
  "hand-protection": "M8 21v-8 M8 13V6.5a1.5 1.5 0 0 1 3 0V11 M11 11V5a1.5 1.5 0 0 1 3 0v6 M14 11V6.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7H8",
  workwear: "M8 3l4 3 4-3 4 3-2 3v12H6V9L4 6z",
  "foot-protection": "M7 3v9l-2 2v5h12a3 3 0 0 0 2.5-4.5L14 11V3z",
  "height-safety": "M9 8a3 3 0 1 1 6 0v8a3 3 0 0 1-6 0 M12 5v3",
  "traffic-safety": "M10 4h4l4 16H6z M8.5 11h7 M7.5 15h9",
  "first-aid": "M3 6h18v14H3z M12 10v6 M9 13h6",
}

function CatIcon({ slug, size = 26 }: { slug: string; size?: number }) {
  const d = ICON_PATHS[slug] || "M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : "M" + seg} />
      ))}
    </svg>
  )
}

const IMG_FALLBACK: Record<string, string> = {
  "head-protection": "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=400&q=75",
  "eye-face-protection": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=75",
  "respiratory-protection": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=400&q=75",
  "hand-protection": "https://images.unsplash.com/photo-1583407723467-9b2c3c1e0d33?auto=format&fit=crop&w=400&q=75",
}

const FALLBACK_CATS: Cat[] = [
  {
    id: -1, name: "Толгойн хамгаалалт", slug: "head-protection", count: 126,
    children: [
      { id: -101, name: "Аюулгүйн малгай", slug: "head-protection-helmets" },
      { id: -102, name: "Малгайн дотор гарцаг", slug: "head-protection-liners" },
      { id: -103, name: "Малгайн оосор", slug: "head-protection-straps" },
      { id: -104, name: "Түлгүүр малгай", slug: "head-protection-bump-caps" },
      { id: -105, name: "Дагалдах хэрэгсэл", slug: "head-protection-accessories" },
    ],
  },
  {
    id: -2, name: "Нүдний хамгаалалт", slug: "eye-face-protection", count: 89,
    children: [
      { id: -201, name: "Хамгаалалтын шил", slug: "eye-protection-glasses" },
      { id: -202, name: "Хамгаалалтын нүдний шил", slug: "eye-protection-goggles" },
      { id: -203, name: "Нүүрний хаалт", slug: "eye-protection-face-shields" },
      { id: -204, name: "Гагнуурын шил", slug: "eye-protection-welding" },
      { id: -205, name: "Дагалдах хэрэгсэл", slug: "eye-protection-accessories" },
    ],
  },
  {
    id: -3, name: "Амьсгалын хамгаалалт", slug: "respiratory-protection", count: 92,
    children: [
      { id: -301, name: "Амны хаалт", slug: "respiratory-masks" },
      { id: -302, name: "Шүүлтүүр", slug: "respiratory-filters" },
      { id: -303, name: "Амьсгалын аппарат", slug: "respiratory-apparatus" },
      { id: -304, name: "Хийн маск", slug: "respiratory-gas-masks" },
      { id: -305, name: "Дагалдах хэрэгсэл", slug: "respiratory-accessories" },
    ],
  },
  {
    id: -4, name: "Сонсголын хамгаалалт", slug: "hearing-protection", count: 43,
    children: [
      { id: -401, name: "Чихэвч", slug: "hearing-earmuffs" },
      { id: -402, name: "Чихний бити", slug: "hearing-earplugs" },
      { id: -403, name: "Дагалдах хэрэгсэл", slug: "hearing-accessories" },
    ],
  },
  {
    id: -5, name: "Гарын хамгаалалт", slug: "hand-protection", count: 214,
    children: [
      { id: -501, name: "Ажлын бээлий", slug: "hand-protection-work-gloves" },
      { id: -502, name: "Зүсэлтийн хамгаалалттай", slug: "hand-protection-cut-resistant" },
      { id: -503, name: "Дулаан тусгаарлагч бээлий", slug: "hand-protection-thermal" },
      { id: -504, name: "Химийн хамгаалалтын бээлий", slug: "hand-protection-chemical" },
      { id: -505, name: "Дагалдах хэрэгсэл", slug: "hand-protection-accessories" },
    ],
  },
  { id: -6, name: "Хөдөлмөр хамгааллын хувцас", slug: "workwear", count: 189 },
  { id: -7, name: "Хөлийн хамгаалалт", slug: "foot-protection", count: 156 },
  { id: -8, name: "Өндөрт ажиллах хамгаалалт", slug: "height-safety", count: 73 },
  { id: -9, name: "Зам, тэмдэг, хашлага", slug: "traffic-safety", count: 98 },
  { id: -10, name: "Анхны тусламж, эрүүл ахуй", slug: "first-aid", count: 60 },
]

function CategoryRow({ cat, index, active, onEnter }: { cat: Cat; index: number; active: boolean; onEnter: () => void }) {
  return (
    <LocalizedClientLink
      href={`/store?category=${cat.slug}`}
      onMouseEnter={onEnter}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "13px 16px",
        textDecoration: "none",
        borderBottom: "1px solid #262626",
        background: active ? "#232323" : "transparent",
        transition: "background 0.15s",
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 800, color: active ? "#FFCC00" : "rgba(255,255,255,0.3)", width: 20, flexShrink: 0 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div style={{ width: 34, height: 34, borderRadius: 4, overflow: "hidden", background: "#262626", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {cat.image_url || IMG_FALLBACK[cat.slug] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cat.image_url ? BASE + cat.image_url : IMG_FALLBACK[cat.slug]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ color: "#FFCC00" }}><CatIcon slug={cat.slug} size={18} /></span>
        )}
      </div>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#fff" : "rgba(255,255,255,0.82)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {cat.name}
        </span>
        {typeof cat.count === "number" && cat.count > 0 && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.38)" }}>{cat.count} бүтээгдэхүүн</span>
        )}
      </span>
      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" style={{ color: active ? "#FFCC00" : "rgba(255,255,255,0.3)", flexShrink: 0 }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </LocalizedClientLink>
  )
}

function SubcategoryPanel({ cat }: { cat: Cat }) {
  const kids = cat.children ?? []
  const img = cat.image_url ? BASE + cat.image_url : IMG_FALLBACK[cat.slug]
  return (
    <div style={{ background: "#1E1E1E", border: "1px solid #2A2A2A", padding: "18px 18px 20px" }}>
      <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid #2A2A2A" }}>
        {cat.name}
      </div>
      <div style={{ height: 110, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={cat.name} style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", borderRadius: 4 }} />
        ) : (
          <span style={{ color: "#FFCC00" }}><CatIcon slug={cat.slug} size={54} /></span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {kids.slice(0, 5).map((sub) => (
          <LocalizedClientLink
            key={sub.id}
            href={`/store?category=${sub.slug}`}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #262626", fontSize: 12.5, color: "rgba(255,255,255,0.68)", textDecoration: "none" }}
          >
            <span>{sub.name}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
          </LocalizedClientLink>
        ))}
      </div>
      <LocalizedClientLink
        href={`/store?category=${cat.slug}`}
        style={{ display: "inline-block", marginTop: 12, fontSize: 11, fontWeight: 800, color: "#FFCC00", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.06em" }}
      >
        Бүгдийг үзэх →
      </LocalizedClientLink>
    </div>
  )
}

export default function CategorySidebar() {
  const [cats, setCats] = useState<Cat[]>(FALLBACK_CATS)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data) && data.length) setCats(data)
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const previewCats = cats.filter((c) => (c.children ?? []).length > 0).slice(0, 4)
  const panels = previewCats.length > 0 ? previewCats : cats.slice(0, 4)

  return (
    <div style={{ background: "#151515", padding: "28px 0 8px" }}>
      <div className="ms-container">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <aside style={{ width: 280, flexShrink: 0, background: "#1A1A1A", border: "1px solid #262626" }}>
            <div style={{ padding: "14px 16px", background: "#FFCC00" }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#151515", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" /></svg>
                Бүтээгдэхүүнүүд
              </span>
            </div>
            {cats.map((cat, i) => (
              <CategoryRow key={cat.id} cat={cat} index={i} active={active === i} onEnter={() => setActive(i)} />
            ))}
            <LocalizedClientLink href="/store" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 16px", fontSize: 12.5, fontWeight: 700, color: "#FFCC00", textDecoration: "none" }}>
              Бүх ангиллыг үзэх →
            </LocalizedClientLink>
          </aside>

          <div style={{ flex: 1, minWidth: 0, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {panels.map((c) => (
              <SubcategoryPanel key={c.id} cat={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
