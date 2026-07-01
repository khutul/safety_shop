"use client"
import { useState } from "react"

const INDUSTRIES = [
  { name: "УУЛ УУРХАЙ", bg: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=500&q=75" },
  { name: "БАРИЛГА", bg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=500&q=75" },
  { name: "ГАГНУУР", bg: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=500&q=75" },
  { name: "ЦАХИЛГААН", bg: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=500&q=75" },
  { name: "ҮЙЛДВЭР", bg: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=75" },
  { name: "ЗАМ ТЭЭВЭР", bg: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=500&q=75" },
]

function IndustryCard({ ind }: { ind: typeof INDUSTRIES[0] }) {
  const [hov, setHov] = useState(false)
  return (
    <a href="/store" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ textDecoration: "none", display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3", border: hov ? "2px solid #FFCC00" : "2px solid transparent", transition: "border-color 0.25s" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "url(" + ind.bg + ")", backgroundSize: "cover", backgroundPosition: "center", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#FFCC00" }} />
      <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", zIndex: 1 }}>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--ms-font-display)" }}>{ind.name}</span>
      </div>
    </a>
  )
}

export default function IndustrySection() {
  return (
    <div style={{ background: "#ffffff", padding: "34px 0 34px" }}>
      <div className="ms-container">
        <div className="ms-sechead">
          <div className="bar" />
          <span className="title">Салбараар хайх</span>
          <div className="rule" />
          <a href="/store" className="more">Бүгд →</a>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 6 }}>
          {INDUSTRIES.map(ind => <IndustryCard key={ind.name} ind={ind} />)}
        </div>
      </div>
    </div>
  )
}
