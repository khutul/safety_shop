"use client"
import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Static "industries we serve" section (Safetoe-style, Mongolian labels).
// Images: put files at public/industries/<slug>.jpg — a missing image
// gracefully falls back to the dark tile with the name only.
type Industry = { name: string; slug: string }

const INDUSTRIES: Industry[] = [
  { name: "Уул уурхай", slug: "mining" },
  { name: "Барилга", slug: "construction" },
  { name: "Эрчим хүч, цахилгаан", slug: "energy" },
  { name: "Газрын тос, хий", slug: "oil-gas" },
  { name: "Үйлдвэрлэл", slug: "manufacturing" },
  { name: "Гагнуур", slug: "welding" },
  { name: "Зам тээвэр", slug: "transport" },
  { name: "Агуулах, логистик", slug: "warehousing" },
  { name: "Хөдөө аж ахуй", slug: "agriculture" },
  { name: "Өвөл, хүйтэн орчин", slug: "winter" },
  { name: "Нунтаглалт, зүлгүүр", slug: "grinding" },
  { name: "Анхны тусламж, аврах", slug: "rescue" },
]

function IndustryCard({ ind }: { ind: Industry }) {
  const [hov, setHov] = useState(false)
  const [imgOk, setImgOk] = useState(true)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "block", position: "relative", overflow: "hidden", aspectRatio: "4/3", border: hov ? "2px solid #FFCC00" : "2px solid transparent", transition: "border-color 0.25s", background: "#101010" }}
    >
      {imgOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/industries/${ind.slug}.jpg`}
          alt={ind.name}
          onError={() => setImgOk(false)}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: hov ? "scale(1.06)" : "scale(1)", transition: "transform 0.4s ease" }}
        />
      )}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(0,0,0,0.1) 0%,rgba(0,0,0,0.65) 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#FFCC00" }} />
      <div style={{ position: "absolute", bottom: 12, left: 6, right: 6, textAlign: "center", zIndex: 1 }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--ms-font-display)" }}>{ind.name}</span>
      </div>
    </div>
  )
}

export default function IndustrySection() {
  return (
    <div style={{ background: "#161616", padding: "40px 0", borderTop: "1px solid var(--ms-border-soft)" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark">
          <div className="bar" />
          <span className="title">Ашиглагдах салбарууд</span>
          <div className="rule" />
          <LocalizedClientLink href="/store" className="more">Бүгд →</LocalizedClientLink>
        </div>
        <div className="ms-grid-industries">
          {INDUSTRIES.map((ind) => <IndustryCard key={ind.slug} ind={ind} />)}
        </div>
      </div>
    </div>
  )
}
