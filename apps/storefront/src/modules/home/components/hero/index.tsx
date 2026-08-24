"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"
const BASE = ""

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

export default function Hero() {
  const [idx, setIdx] = useState(0)
  // null = still loading from Odoo → show an empty dark box, NOT the fallback,
  // so stock photos never flash before the real slides arrive.
  const [slides, setSlides] = useState<Slide[] | null>(null)
  const [subtitle, setSubtitle] = useState(FALLBACK_SUBTITLE)

  // Load CMS content from Odoo (falls back to defaults only if unavailable)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const [hRes, sRes] = await Promise.all([
          // no-store: tiny JSON, always fresh so Odoo edits show up immediately
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
        } else {
          setSlides(FALLBACK_SLIDES)
        }
        setIdx(0)
        if (st && typeof st === "object") {
          if (st.hero_subtitle) setSubtitle(st.hero_subtitle)
        }
      } catch {
        if (alive) setSlides(FALLBACK_SLIDES)
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  const slideCount = slides?.length || 0
  useEffect(() => {
    if (slideCount < 2) return
    const t = setInterval(() => setIdx((i) => (i + 1) % slideCount), 5000)
    return () => clearInterval(t)
  }, [slideCount])

  // Loading: reserve the banner space with a plain dark box (no flash)
  if (!slides) {
    return (
      <div style={{ background: "var(--ms-bg)", padding: "14px 0 0" }}>
        <div className="ms-container">
          <div style={{ minHeight: 340, borderRadius: 6, background: "#0D0D0D", border: "1px solid var(--ms-border-soft)" }} />
        </div>
      </div>
    )
  }

  const slide = slides[Math.min(idx, slides.length - 1)] || slides[0]

  return (
    // Boxed banner: same width as the content sections below (ms-container)
    <div style={{ background: "var(--ms-bg)", padding: "14px 0 0" }}>
      <div className="ms-container">
        <div style={{ position: "relative", overflow: "hidden", borderRadius: 6, background: "#0D0D0D", border: "1px solid var(--ms-border-soft)" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + slide.bg + ")", backgroundSize: "cover", backgroundPosition: "right center" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(100deg, rgba(0,0,0,0.88) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.08) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#FFCC00" }} />
      <div className="ms-hero-inner" style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 740 }}>
          {slide.badge && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20, background: "rgba(255,204,0,0.1)", border: "1px solid rgba(255,204,0,0.3)", padding: "6px 14px", borderRadius: 2 }}>
              <div style={{ width: 20, height: 2, background: "#FFCC00" }} />
              <span style={{ color: "#FFCC00", fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" }}>{slide.badge}</span>
            </div>
          )}
          <h1 style={{ fontSize: "clamp(24px,3.5vw,44px)", fontWeight: 900, color: "#fff", lineHeight: 1.12, marginBottom: 18, fontFamily: "var(--ms-font-display)", textTransform: "uppercase", letterSpacing: "0.01em" }}>
            {slide.lines.map((line, i) => (
              // Middle line gets the brand gold accent (mockup style)
              <span key={i} style={{ display: "block", color: slide.lines.length > 1 && i === 1 ? "#FFCC00" : "#fff" }}>{line}</span>
            ))}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 1.7, marginBottom: 24, maxWidth: 470 }}>
            {subtitle}
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <LocalizedClientLink href={slide.ctaUrl} className="ms-btn-gold">
              {slide.ctaLabel} <span aria-hidden>→</span>
            </LocalizedClientLink>
          </div>
        </div>
      </div>
      <button onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#FFCC00", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{"<"}</button>
      <button onClick={() => setIdx((i) => (i + 1) % slides.length)} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#FFCC00", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{">"}</button>
      <div style={{ position: "absolute", bottom: 20, right: 24, display: "flex", gap: 6, zIndex: 3 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 4, borderRadius: 2, border: "none", cursor: "pointer", background: i === idx ? "#FFCC00" : "rgba(255,255,255,0.3)", transition: "all 0.3s", padding: 0 }} />
        ))}
      </div>
        </div>
      </div>
    </div>
  )
}
