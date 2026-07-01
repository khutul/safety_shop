"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = process.env.NEXT_PUBLIC_ODOO_API_URL || "http://localhost:8079/api/v1"
const BASE = process.env.NEXT_PUBLIC_ODOO_BASE_URL || "http://localhost:8079"

// Fallback background images (used until images are uploaded in Odoo)
const FALLBACK_BG = [
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1600&q=80",
]

type Slide = { bg: string; badge: string; lines: string[]; ctaLabel: string; ctaUrl: string }

const FALLBACK_SLIDES: Slide[] = [
  { bg: FALLBACK_BG[0], badge: "УУЛ УУРХАЙН СТАНДАРТ", lines: ["АЖЛЫН ГАЗРАА", "ХАМГААЛЖ", "АЖИЛЛААРАЙ"], ctaLabel: "БҮТЭЭГДЭХҮҮН ҮЗЭХ", ctaUrl: "/store" },
  { bg: FALLBACK_BG[1], badge: "БАРИЛГЫН ХАМГААЛАЛТ", lines: ["НАЙДВАРТАЙ", "ТОНОГЛОГДСОН"], ctaLabel: "БҮТЭЭГДЭХҮҮН ҮЗЭХ", ctaUrl: "/store" },
  { bg: FALLBACK_BG[2], badge: "SAFETOE АЛБАН ЁСНЫ ДИЛЕР", lines: ["МОНГОЛЫН #1", "ХАМГААЛАХ ХЭРЭГЛЭЛ"], ctaLabel: "БҮТЭЭГДЭХҮҮН ҮЗЭХ", ctaUrl: "/store" },
]

const FALLBACK_SUBTITLE = "Safetoe, Safeyear, 3M, Honeywell зэрэг 50+ дэлхийн брэнд. Монголын тэргүүлэх хөдөлмөрийн хамгаалах хэрэгслийн нийлүүлэгч."

type Stat = { value: string; label: string }
const FALLBACK_STATS: Stat[] = [
  { value: "5,000+", label: "Бүтээгдэхүүний төрөл" },
  { value: "300+", label: "Хамтрагч байгууллага" },
  { value: "2023", label: "Үүсгэн байгуулагдсан" },
  { value: "50+", label: "Дэлхийн брэнд" },
]

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES)
  const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE)
  const [stats, setStats] = useState<Stat[]>(FALLBACK_STATS)
  const [phone, setPhone] = useState("+97699102250")

  // Load CMS content from Odoo (falls back to defaults if unavailable)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          fetch(`${API}/site/hero?lang=mn`, { cache: "no-store" }),
          fetch(`${API}/site/settings?lang=mn`, { cache: "no-store" }),
        ])
        const hero = hRes.ok ? await hRes.json() : []
        const st = sRes.ok ? await sRes.json() : {}
        if (!alive) return
        if (Array.isArray(hero) && hero.length) {
          setSlides(
            hero.map((s: any, i: number) => ({
              bg: s.image_url ? BASE + s.image_url : FALLBACK_BG[i % FALLBACK_BG.length],
              badge: s.badge || "",
              lines: [s.line1, s.line2, s.line3].filter(Boolean),
              ctaLabel: s.cta_label || st.cta_primary_label || "БҮТЭЭГДЭХҮҮН ҮЗЭХ",
              ctaUrl: s.cta_url || st.cta_primary_url || "/store",
            }))
          )
          setIdx(0)
        }
        if (st && typeof st === "object") {
          if (st.hero_subtitle) setSubtitle(st.hero_subtitle)
          if (Array.isArray(st.stats)) {
            const valid = st.stats.filter((x: Stat) => x.value)
            if (valid.length) setStats(valid)
          }
          if (st.phone) setPhone(st.phone.replace(/\s/g, ""))
        }
      } catch {
        /* keep fallbacks */
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [slides.length])

  const slide = slides[Math.min(idx, slides.length - 1)] || slides[0]

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0D0D0D" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + slide.bg + ")", backgroundSize: "cover", backgroundPosition: "center top" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#FFCC00" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1340, margin: "0 auto", padding: "0 24px", minHeight: 540, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 700 }}>
          {slide.badge && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 22, background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.3)", padding: "6px 14px", borderRadius: 2 }}>
              <div style={{ width: 20, height: 2, background: "#FFCC00" }} />
              <span style={{ color: "#FFCC00", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{slide.badge}</span>
            </div>
          )}
          <h1 style={{ fontSize: "clamp(46px,8vw,88px)", fontWeight: 900, color: "#fff", lineHeight: 0.98, marginBottom: 26, fontFamily: "var(--ms-font-display)", textTransform: "uppercase", letterSpacing: "0.005em" }}>
            {slide.lines.map((line, i) => (
              <span key={i} style={{ display: "block", color: "#fff" }}>{line}</span>
            ))}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.75, marginBottom: 36, maxWidth: 490 }}>
            {subtitle}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <LocalizedClientLink href={slide.ctaUrl} className="ms-btn-gold">
              {slide.ctaLabel}
            </LocalizedClientLink>
            <a href={`tel:${phone}`} className="ms-btn-ghost">
              ХОЛБОО БАРИХ
            </a>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 2, background: "var(--ms-gold-grad)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: `repeat(${stats.length},1fr)` }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "16px 20px", borderRight: i < stats.length - 1 ? "1px solid rgba(0,0,0,0.14)" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#151515", fontFamily: "var(--ms-font-display)", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.62)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#FFCC00", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{"<"}</button>
      <button onClick={() => setIdx((i) => (i + 1) % slides.length)} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#FFCC00", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{">"}</button>
      <div style={{ position: "absolute", bottom: 70, right: 24, display: "flex", gap: 6, zIndex: 3 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 4, borderRadius: 2, border: "none", cursor: "pointer", background: i === idx ? "#FFCC00" : "rgba(255,255,255,0.3)", transition: "all 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  )
}
