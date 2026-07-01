"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SLIDES = [
  { bg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80", badge: "UUL UURHAIN STANDARD", lines: ["AJLIIN GAZRAA", "KHAMGAALJ", "AJILLAARA"] },
  { bg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80", badge: "BARILDGIIN KHAMGAALALT", lines: ["NAIDVARTAI", "TONOGLOGDSON"] },
  { bg: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1600&q=80", badge: "SAFETOE DISTRIBUTOR", lines: ["MONGOLIIN #1", "PPE NIILUELEG"] },
]
const STATS = [
  { value: "5,000+", label: "Product types" },
  { value: "300+", label: "Partner orgs" },
  { value: "10+", label: "Years exp" },
  { value: "50+", label: "Global brands" },
]

export default function Hero() {
  const [idx, setIdx] = useState(0)
  const slide = SLIDES[idx]
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])
  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden", background: "#0D0D0D" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + slide.bg + ")", backgroundSize: "cover", backgroundPosition: "center top" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: "#D4A017" }} />
      <div style={{ position: "relative", zIndex: 2, maxWidth: 1340, margin: "0 auto", padding: "0 24px", minHeight: 500, display: "flex", alignItems: "center" }}>
        <div style={{ maxWidth: 680 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 28, height: 2, background: "#D4A017" }} />
            <span style={{ color: "#D4A017", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" }}>{slide.badge}</span>
          </div>
          <h1 style={{ fontSize: "clamp(44px,8vw,82px)", fontWeight: 900, color: "#fff", lineHeight: 1.0, marginBottom: 24, fontFamily: "Impact,Arial,sans-serif", textTransform: "uppercase" }}>
            {slide.lines.map((line, i) => (
              <span key={i} style={{ display: "block", color: i === 0 ? "#D4A017" : "#fff" }}>{line}</span>
            ))}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
            Safetoe, Safeyear, 3M, Honeywell and 50+ global brands. Mongolia top PPE supplier.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <LocalizedClientLink href="/store" style={{ background: "#D4A017", color: "#151515", padding: "14px 32px", borderRadius: 2, fontWeight: 900, fontSize: 13, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              VIEW PRODUCTS
            </LocalizedClientLink>
            <a href="tel:+97699102250" style={{ border: "1.5px solid rgba(255,255,255,0.35)", color: "#fff", padding: "13px 28px", borderRadius: 2, fontWeight: 700, fontSize: 13, textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              CONTACT US
            </a>
          </div>
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 2, background: "rgba(212,160,23,0.92)" }}>
        <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "14px 20px", borderRight: i < 3 ? "1px solid rgba(0,0,0,0.12)" : "none", textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#151515", fontFamily: "Impact,Arial,sans-serif" }}>{s.value}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.6)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={() => setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length)} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#D4A017", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{"<"}</button>
      <button onClick={() => setIdx(i => (i + 1) % SLIDES.length)} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-60%)", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 2, width: 40, height: 40, cursor: "pointer", color: "#D4A017", fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3 }}>{">"}</button>
      <div style={{ position: "absolute", bottom: 70, right: 24, display: "flex", gap: 6, zIndex: 3 }}>
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 24 : 8, height: 4, borderRadius: 2, border: "none", cursor: "pointer", background: i === idx ? "#D4A017" : "rgba(255,255,255,0.3)", transition: "all 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  )
}
