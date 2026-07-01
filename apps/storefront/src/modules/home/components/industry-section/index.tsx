"use client"
import { useState } from "react"

const INDUSTRIES = [
  { name: "UUL UURHAI", bg: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=75" },
  { name: "BARILDGA", bg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=75" },
  { name: "GAGNUUR", bg: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=500&q=75" },
  { name: "TSAKHILGAAN", bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=75" },
  { name: "UUILDVER", bg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=75" },
  { name: "ZAM", bg: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&q=75" },
]

function IndustryCard({ ind }: { ind: typeof INDUSTRIES[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="/store" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textDecoration: "none", display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3", border: hov ? "2px solid #D4A017" : "2px solid transparent", transition: "border-color 0.25s" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + ind.bg + ")", backgroundSize: "cover", backgroundPosition: "center", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#D4A017" }} />
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
        <span style={{ color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "Impact,Arial,sans-serif" }}>{ind.name}</span>
      </div>
    </a>
  )
}

export default function IndustrySection() {
  return (
    <div style={{ background: "#151515", padding: "28px 0 32px" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "0 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 4, height: 22, background: "#D4A017", borderRadius: 1 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "0.14em", textTransform: "uppercase" }}>INDUSTRY SEARCH</span>
          <div style={{ flex: 1, height: 1, background: "#2A2A2A" }} />
          <a href="/store" style={{ color: "#D4A017", fontSize: 11, fontWeight: 700, textDecoration: "none", letterSpacing: "0.08em" }}>VIEW ALL</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
          {INDUSTRIES.map(ind => <IndustryCard key={ind.name} ind={ind} />)}
        </div>
      </div>
    </div>
  )
}
