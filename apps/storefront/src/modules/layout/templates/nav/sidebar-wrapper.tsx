"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

type Cat = {
  id: number
  name: string
  slug: string
  count?: number
  image_url?: string | null
  children?: Cat[]
}

const ICON_PATHS: Record<string, string[]> = {
  "head-protection": ["M4 12.5a8 8 0 0 1 16 0", "M2.5 12.5h19", "M12 6v2"],
  "eye-face-protection": [
    "M3.5 9a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3z",
    "M13.5 9a3 3 0 0 1 3-3h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1a3 3 0 0 1-3-3z",
    "M10.5 10.5h3",
  ],
  "respiratory-protection": ["M6 9a6 6 0 0 1 12 0v3a6 6 0 0 1-12 0z", "M12 10.3a1.7 1.7 0 1 0 0.01 0", "M4 9.5h2", "M18 9.5h2"],
  "hearing-protection": [
    "M4 12v-.5a8 8 0 0 1 16 0v.5",
    "M3 12h3v6H4a1 1 0 0 1-1-1z",
    "M18 12h3v6h-2a1 1 0 0 1-1-1z",
  ],
  "hand-protection": [
    "M7 21v-6a2 2 0 0 1 2-2",
    "M9 13V5.5a1.5 1.5 0 0 1 3 0V11",
    "M12 11V4.5a1.5 1.5 0 0 1 3 0V11",
    "M15 11V6.5a1.5 1.5 0 0 1 3 0V14",
    "M18 13v3a5 5 0 0 1-5 5H9a2 2 0 0 1-2-2",
  ],
  "workwear": ["M9 3L6 6v14a1 1 0 0 0 1 1h2V4", "M15 3l3 3v14a1 1 0 0 1-1 1h-2V4", "M9 3h6l-1.5 3h-3z"],
  "foot-protection": ["M9 3v8l-4 3v4a1 1 0 0 0 1 1h13a2 2 0 0 0 2-2c0-1.2-1-2-3-2.5L11 13", "M9 6.5h4", "M9 9.5h4"],
  "height-safety": [
    "M9 3h6a1 1 0 0 1 1 1v3a4 4 0 0 1-8 0V4a1 1 0 0 1 1-1z",
    "M8 11l8 10",
    "M16 11l-8 10",
  ],
  "traffic-safety": ["M12 3l4 15H8z", "M9.3 12h5.4", "M7 18h10", "M6 21h12"],
  "first-aid": ["M4 7h16v12H4z", "M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2", "M12 10v6", "M9 13h6"],
  "general-protection": ["M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"],
}
const DEFAULT_ICON = ["M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z"]

function CatIcon({ slug, size = 22 }: { slug: string; size?: number }) {
  const paths = ICON_PATHS[slug] || DEFAULT_ICON
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

const IMG_FALLBACK: Record<string, string> = {
  "head-protection": "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=300&q=75",
  "head-protection-work-helmets": "https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&w=300&q=75",
  "head-protection-face-shields": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=300&q=75",
  "head-protection-full": "https://images.unsplash.com/photo-1618839645299-cf27ea988f57?auto=format&fit=crop&w=300&q=75",
  "head-protection-heat": "https://images.unsplash.com/photo-1504328345606-18c886ef7e00?auto=format&fit=crop&w=300&q=75",
  "eye-face-protection": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=300&q=75",
  "respiratory-protection": "https://images.unsplash.com/photo-1584634731339-252c581abfc5?auto=format&fit=crop&w=300&q=75",
  "hearing-protection": "https://images.unsplash.com/photo-1591901206567-08ecb54d3e33?auto=format&fit=crop&w=300&q=75",
  "hand-protection": "https://images.unsplash.com/photo-1583407723467-9b2c3c1e0d33?auto=format&fit=crop&w=300&q=75",
  "workwear": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=75",
  "foot-protection": "https://images.unsplash.com/photo-1603808033176-9d0785d34e2e?auto=format&fit=crop&w=300&q=75",
  "height-safety": "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=75",
  "traffic-safety": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=300&q=75",
  "first-aid": "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=300&q=75",
}
const DEFAULT_IMG = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=75"

function imgFor(slug: string) {
  return IMG_FALLBACK[slug] || DEFAULT_IMG
}

// Returns a flat list of leaf-level sub-items for a category, regardless of
// whether the API/demo data is 2 levels deep (children are already leaves)
// or 3 levels deep (children are groups that themselves have children).
function flatLeaves(cat: Cat, limit = 6): Cat[] {
  const kids = cat.children ?? []
  if (kids.length === 0) return []
  const isGrouped = kids.every((k) => (k.children ?? []).length > 0)
  const flat = isGrouped ? kids.flatMap((k) => k.children ?? []) : kids
  return flat.slice(0, limit)
}

let gid = -1000
function leaf(name: string, slug: string): Cat {
  return { id: gid--, name, slug }
}
function group(name: string, slug: string, items: Cat[]): Cat {
  return { id: gid--, name, slug, children: items }
}

const FALLBACK_CATS: Cat[] = [
  {
    id: -1, name: "Толгойн хамгаалалт", slug: "head-protection", count: 126,
    children: [
      group("Ажлын малгай", "head-protection-work-helmets", [
        leaf("Аюулгүйн малгай", "head-protection-helmets"),
        leaf("Түлгүүр малгай", "head-protection-bump-caps"),
        leaf("Уурхайн малгай", "head-protection-mining"),
        leaf("Малгайн оосор", "head-protection-straps"),
        leaf("Дагалдах хэрэгсэл", "head-protection-accessories"),
      ]),
      group("Нүүрний хамгаалалт", "head-protection-face-shields", [
        leaf("Хамгаалах шил", "head-protection-visor"),
        leaf("Нүүрний хаалт", "head-protection-shield"),
        leaf("Дагалдах хэрэгсэл", "head-protection-face-accessories"),
      ]),
      group("Толгойн бүтэн хамгаалалт", "head-protection-full", [
        leaf("Амьсгалын систэмтэй", "head-protection-full-respiratory"),
        leaf("Дагалдах хэрэгсэл", "head-protection-full-accessories"),
      ]),
      group("Халуунаас хамгаалах", "head-protection-heat", [
        leaf("Дулаан тусгаарлагч малгай", "head-protection-heat-thermal"),
        leaf("Галд тэсвэртэй малгай", "head-protection-heat-fire"),
        leaf("Дагалдах хэрэгсэл", "head-protection-heat-accessories"),
      ]),
    ],
  },
  {
    id: -2, name: "Нүдний хамгаалалт", slug: "eye-face-protection", count: 89,
    children: [
      group("Хамгаалалтын шил", "eye-protection-glasses", [
        leaf("Тунгалаг линз", "eye-glasses-clear"),
        leaf("Хар линз", "eye-glasses-tinted"),
        leaf("Гэрэл мэдрэгч линз", "eye-glasses-photochromic"),
        leaf("Дагалдах хэрэгсэл", "eye-glasses-accessories"),
      ]),
      group("Хамгаалалтын нүдний шил", "eye-protection-goggles", [
        leaf("Химийн эсрэг", "eye-goggles-chemical"),
        leaf("Тоос, шаврын эсрэг", "eye-goggles-dust"),
        leaf("Дагалдах хэрэгсэл", "eye-goggles-accessories"),
      ]),
      group("Нүүрний хаалт", "eye-protection-face-shields", [
        leaf("Гагнуурын хаалт", "eye-face-shield-welding"),
        leaf("Ерөнхий зориулалтын хаалт", "eye-face-shield-general"),
      ]),
      group("Гагнуурын шил", "eye-protection-welding", [
        leaf("Автомат харанхуйлагч", "eye-welding-auto-darkening"),
        leaf("Гар шилжүүлэгч", "eye-welding-fixed"),
      ]),
    ],
  },
  {
    id: -3, name: "Амьсгалын хамгаалалт", slug: "respiratory-protection", count: 92,
    children: [
      group("Нэг удаагийн амны хаалт", "respiratory-disposable", [
        leaf("N95", "respiratory-n95"),
        leaf("FFP2", "respiratory-ffp2"),
        leaf("FFP3", "respiratory-ffp3"),
      ]),
      group("Дахин ашиглагдах амны хаалт", "respiratory-reusable", [
        leaf("Хагас нүүрний", "respiratory-half-mask"),
        leaf("Бүтэн нүүрний", "respiratory-full-mask"),
      ]),
      group("Шүүлтүүр", "respiratory-filters", [
        leaf("Тоосны шүүлтүүр", "respiratory-dust-filters"),
        leaf("Хийн шүүлтүүр", "respiratory-gas-filters"),
      ]),
      group("Амьсгалын аппарат", "respiratory-apparatus", [
        leaf("PAPR систем", "respiratory-papr"),
        leaf("SCBA систем", "respiratory-scba"),
      ]),
    ],
  },
  {
    id: -4, name: "Сонсголын хамгаалалт", slug: "hearing-protection", count: 43,
    children: [
      group("Чихэвч", "hearing-earmuffs", [
        leaf("Толгойн дээгүүр зүүдэг", "hearing-earmuffs-headband"),
        leaf("Малгайнд бэхлэгддэг", "hearing-earmuffs-helmet"),
      ]),
      group("Чихний бити", "hearing-earplugs", [
        leaf("Дахин ашиглагдах", "hearing-earplugs-reusable"),
        leaf("Нэг удаагийн", "hearing-earplugs-disposable"),
      ]),
    ],
  },
  {
    id: -5, name: "Гарын хамгаалалт", slug: "hand-protection", count: 214,
    children: [
      group("Ажлын бээлий", "hand-protection-work-gloves", [
        leaf("Арьсан бээлий", "hand-gloves-leather"),
        leaf("Даавуун бээлий", "hand-gloves-fabric"),
        leaf("Наилон бээлий", "hand-gloves-nylon"),
      ]),
      group("Зүсэлтийн хамгаалалттай", "hand-protection-cut-resistant", [
        leaf("Түвшин 3", "hand-cut-level-3"),
        leaf("Түвшин 5", "hand-cut-level-5"),
      ]),
      group("Дулаан тусгаарлагч бээлий", "hand-protection-thermal", [
        leaf("Хүйтний эсрэг", "hand-thermal-cold"),
        leaf("Халуунд тэсвэртэй", "hand-thermal-heat"),
      ]),
      group("Химийн хамгаалалтын бээлий", "hand-protection-chemical", [
        leaf("Нитрил", "hand-chemical-nitrile"),
        leaf("Латекс", "hand-chemical-latex"),
      ]),
    ],
  },
  {
    id: -6, name: "Хөдөлмөр хамгааллын хувцас", slug: "workwear", count: 189,
    children: [
      group("Ажлын хантааз", "workwear-vests", [leaf("Тусгай өнгөт", "workwear-vests-hivis"), leaf("Гэрэлтдэг судалтай", "workwear-vests-reflective")]),
      group("Ажлын өмд", "workwear-pants", [leaf("Каргo загвар", "workwear-pants-cargo"), leaf("Изолирсон", "workwear-pants-insulated")]),
      group("Ажлын куртка", "workwear-jackets", [leaf("Зунын", "workwear-jackets-summer"), leaf("Өвлийн", "workwear-jackets-winter")]),
      group("Комбинезон", "workwear-coveralls", [leaf("Нэг удаагийн", "workwear-coveralls-disposable"), leaf("Дахин ашиглагдах", "workwear-coveralls-reusable")]),
    ],
  },
  {
    id: -7, name: "Хөлийн хамгаалалт", slug: "foot-protection", count: 156,
    children: [
      group("Ажлын гутал", "foot-protection-boots", [leaf("Ган хуруувчтай", "foot-boots-steel-toe"), leaf("Хөнгөн хайлштай", "foot-boots-composite-toe")]),
      group("Гумон гутал", "foot-protection-rubber", [leaf("Усны эсрэг", "foot-rubber-waterproof"), leaf("Химийн эсрэг", "foot-rubber-chemical")]),
      group("Дагалдах хэрэгсэл", "foot-protection-accessories", [leaf("Оймс", "foot-accessories-socks"), leaf("Дотор ул", "foot-accessories-insoles")]),
    ],
  },
  {
    id: -8, name: "Өндөрт ажиллах хамгаалалт", slug: "height-safety", count: 73,
    children: [
      group("Аюулгүйн бүс", "height-safety-harness", [leaf("Бүтэн биеийн", "height-harness-full-body"), leaf("Хагас биеийн", "height-harness-half-body")]),
      group("Уналтын хамгаалагч", "height-safety-fall-arrest", [leaf("Автомат чангалагч", "height-fall-retractable"), leaf("Энгийн", "height-fall-lanyard")]),
      group("Дагалдах хэрэгсэл", "height-safety-accessories", [leaf("Карабин", "height-accessories-carabiner"), leaf("Олс", "height-accessories-rope")]),
    ],
  },
  {
    id: -9, name: "Зам, тэмдэг, хашлага", slug: "traffic-safety", count: 98,
    children: [
      group("Гэрэлтдэг хувцас", "traffic-safety-hivis", [leaf("Хантааз", "traffic-hivis-vest"), leaf("Бүтэн хувцас", "traffic-hivis-suit")]),
      group("Замын хашлага", "traffic-safety-barriers", [leaf("Хөдөлгөөнт", "traffic-barriers-mobile"), leaf("Байнгын", "traffic-barriers-fixed")]),
      group("Тэмдэг", "traffic-safety-signs", [leaf("Анхааруулах", "traffic-signs-warning"), leaf("Чиглүүлэх", "traffic-signs-directional")]),
    ],
  },
  {
    id: -10, name: "Анхны тусламж, эрүүл ахуй", slug: "first-aid", count: 60,
    children: [
      group("Анхны тусламжийн цүнх", "first-aid-kits", [leaf("Жижиг", "first-aid-kits-small"), leaf("Том", "first-aid-kits-large")]),
      group("Халдваргүйжүүлэгч", "first-aid-sanitizers", [leaf("Гар ариутгагч", "first-aid-hand-sanitizer"), leaf("Спиртэн шүүдэс", "first-aid-alcohol-wipes")]),
      group("Дагалдах хэрэгсэл", "first-aid-accessories", [leaf("Боолт", "first-aid-bandages"), leaf("Наалт", "first-aid-plasters")]),
    ],
  },
]

type Industry = { name: string; slug: string; img: string }
const INDUSTRIES: Industry[] = [
  { name: "Уул уурхайн шийдэл", slug: "mining", img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=700&q=75" },
  { name: "Барилгын шийдэл", slug: "construction", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=75" },
  { name: "Үйлдвэрийн шийдэл", slug: "manufacturing", img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=75" },
  { name: "Гагнуурын шийдэл", slug: "welding", img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=700&q=75" },
  { name: "Цахилгааны шийдэл", slug: "electrical", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=75" },
  { name: "Тээврийн шийдэл", slug: "transport", img: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=700&q=75" },
]

function IndustryCard({ ind, onClose }: { ind: Industry; onClose: () => void }) {
  return (
    <LocalizedClientLink
      href={`/store?industry=${ind.slug}`}
      onClick={onClose}
      style={{ position: "relative", flex: "0 0 320px", height: 170, borderRadius: 4, overflow: "hidden", textDecoration: "none", display: "block" }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${ind.img})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.82) 100%)" }} />
      <div style={{ position: "absolute", left: 16, right: 16, bottom: 14 }}>
        <div style={{ color: "#fff", fontSize: 17, fontWeight: 900, textTransform: "uppercase", lineHeight: 1.15, marginBottom: 10, fontFamily: "var(--ms-font-display)" }}>
          {ind.name}
        </div>
        <span style={{ display: "inline-block", background: "#FFCC00", color: "#151515", fontSize: 10.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "7px 12px", borderRadius: 2 }}>
          Бүтээгдэхүүн үзэх →
        </span>
      </div>
    </LocalizedClientLink>
  )
}

function IndustryCarousel({ onClose }: { onClose: () => void }) {
  return (
    <div className="no-scrollbar" style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 4, marginBottom: 26 }}>
      {INDUSTRIES.map((ind) => (
        <IndustryCard key={ind.slug} ind={ind} onClose={onClose} />
      ))}
    </div>
  )
}

function CategoryRow({ cat, index, onClose }: { cat: Cat; index: number; onClose: () => void }) {
  return (
    <LocalizedClientLink
      href={`/store?category=${cat.slug}`}
      onClick={onClose}
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "13px 18px", minHeight: 60,
        textDecoration: "none", borderBottom: "1px solid #262626",
      }}
      className="ms-cat-row"
    >
      <span style={{ fontSize: 13, fontWeight: 900, color: "#FFCC00", width: 20, flexShrink: 0 }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span style={{ color: "rgba(255,255,255,0.6)", display: "flex", flexShrink: 0 }}>
        <CatIcon slug={cat.slug} size={22} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.01em", lineHeight: 1.3, color: "rgba(255,255,255,0.9)", whiteSpace: "normal", overflowWrap: "break-word" }}>
          {cat.name}
        </span>
        {typeof cat.count === "number" && cat.count > 0 && (
          <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{cat.count} бүтээгдэхүүн</span>
        )}
      </span>
      <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" style={{ color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
      </svg>
    </LocalizedClientLink>
  )
}

function CategoryColumn({ cat, onClose }: { cat: Cat; onClose: () => void }) {
  const items = flatLeaves(cat)
  const img = cat.image_url ? BASE + cat.image_url : imgFor(cat.slug)
  return (
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.02em", marginBottom: 8 }}>
        {cat.name}
      </div>
      <div style={{ width: 30, height: 3, background: "#FFCC00", marginBottom: 16 }} />
      <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={onClose} style={{ display: "block", height: 130, marginBottom: 16, background: "#1E1E1E", border: "1px solid #2A2A2A", borderRadius: 4, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </LocalizedClientLink>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {items.map((it) => (
          <LocalizedClientLink key={it.id} href={`/store?category=${it.slug}`} onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #262626", fontSize: 12.5, color: "rgba(255,255,255,0.68)", textDecoration: "none" }}>
            <span>{it.name}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>›</span>
          </LocalizedClientLink>
        ))}
      </div>
      <LocalizedClientLink href={`/store?category=${cat.slug}`} onClick={onClose} style={{ display: "inline-block", marginTop: 12, fontSize: 11.5, fontWeight: 800, color: "#FFCC00", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        Бүгдийг үзэх →
      </LocalizedClientLink>
    </div>
  )
}

const FEATURES = [
  { label: "Албан ёсны дистрибьютер", sub: "100% баталгаатай", d: "M12 2l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V5z" },
  { label: "Хүргэлт 24 цаг", sub: "Улаанбаатар хот", d: "M3 7h11v8H3z M14 10h4l3 3v2h-7z M6.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M17.5 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" },
  { label: "Байгууллагын хямдрал", sub: "Тусгай үнэ", d: "M9 3l1.5 1.5L14 3l1.5 1.5L19 3l1 1v16l-1 1-3.5-1.5L14 21l-1.5-1.5L9 21l-1.5-1.5L4 21l-1-1V4z" },
  { label: "НӨАТ-ын тооцоо", sub: "Инвойс боломжтой", d: "M6 2h9l5 5v15H6z M15 2v5h5 M9 12h6 M9 16h6" },
  { label: "Аюулгүй төлбөр", sub: "QPay, SocialPay, Bank", d: "M12 2l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V5z" },
]

function FeaturesBar() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 20, marginTop: 32, paddingTop: 24, borderTop: "1px solid #2A2A2A" }}>
      {FEATURES.map((f) => (
        <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ color: "#FFCC00", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={f.d} /></svg>
          </span>
          <span>
            <span style={{ display: "block", fontSize: 12, fontWeight: 800, color: "#fff", textTransform: "uppercase", lineHeight: 1.3 }}>{f.label}</span>
            <span style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{f.sub}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false)
  const [cats, setCats] = useState<Cat[]>(FALLBACK_CATS)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch(`${API}/categories?lang=mn`, { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive && Array.isArray(data) && data.length) {
          const bySlug = new Map(FALLBACK_CATS.map((c) => [c.slug, c]))
          const merged = data.map((c: Cat) => {
            const tmpl = bySlug.get(c.slug)
            const hasKids = Array.isArray(c.children) && c.children.length > 0
            return hasKids || !tmpl ? c : { ...c, children: tmpl.children }
          })
          setCats(merged)
        }
      } catch {
        /* keep fallback */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const close = () => setOpen(false)
  const columnCats = cats.filter((c) => flatLeaves(c).length > 0).slice(0, 4)

  return (
    <>
      <style>{`.ms-cat-row:hover{background:#232323}`}</style>
      <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, padding: "4px 8px", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        ЦЭС
      </button>

      {open && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1040, background: "#151515", overflowY: "auto" }}>
          <div style={{ position: "sticky", top: 0, zIndex: 2, background: "#1A1A1A", borderBottom: "1px solid #2A2A2A", padding: "16px 24px", display: "flex", alignItems: "center" }}>
            <button onClick={close} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em" }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>✕</span> ЦЭС ХААХ
            </button>
          </div>

          <div className="ms-container" style={{ display: "flex", gap: 22, alignItems: "flex-start", padding: "22px 24px 60px" }}>
            <aside style={{ width: 300, flexShrink: 0, background: "#1A1A1A", border: "1px solid #262626" }}>
              <div style={{ padding: "15px 18px", background: "#FFCC00" }}>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: "#151515", letterSpacing: "0.08em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8 }}>
                  <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" /></svg>
                  Бүтээгдэхүүнүүд
                </span>
              </div>
              {cats.map((cat, i) => (
                <CategoryRow key={cat.id} cat={cat} index={i} onClose={close} />
              ))}
              <LocalizedClientLink href="/store" onClick={close} style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 18px", fontSize: 12.5, fontWeight: 700, color: "#FFCC00", textDecoration: "none" }}>
                Бүх ангиллыг үзэх →
              </LocalizedClientLink>
            </aside>

            <div style={{ flex: 1, minWidth: 0 }}>
              <IndustryCarousel onClose={close} />
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(columnCats.length, 1)}, 1fr)`, gap: 24 }}>
                {columnCats.map((c) => (
                  <CategoryColumn key={c.id} cat={c} onClose={close} />
                ))}
              </div>
              <FeaturesBar />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
