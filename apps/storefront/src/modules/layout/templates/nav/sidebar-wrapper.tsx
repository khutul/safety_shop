"use client"
import { useState, useEffect } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CATEGORIES = [
  { name: "Workwear", sub: ["All Workwear", "Summer", "Winter", "Protective", "Vest"] },
  { name: "Gloves", sub: ["All Gloves", "Work Gloves", "Leather", "Chemical", "Protective"] },
  { name: "Mask / Respiratory", sub: ["All Masks", "Gas Mask", "Filter", "Face Mask"] },
  { name: "Boots", sub: ["All Boots", "Summer", "Winter", "Water Boots"] },
  { name: "Head Protection", sub: ["Helmet", "Welding Hood", "Face Shield"] },
  { name: "Eye Protection", sub: ["Safety Glasses", "Goggles"] },
  { name: "Hearing Protection", sub: ["Ear Muffs", "Ear Plugs"] },
  { name: "Height Equipment", sub: ["Harness", "Rope", "Anchor"] },
  { name: "Safety Equipment", sub: ["Warning Devices", "First Aid"] },
  { name: "Tools", sub: ["All Tools", "Measuring"] },
]

export default function SidebarWrapper() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 700, padding: "4px 8px", letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
        </svg>
        MENU
      </button>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1031 }} />}
      <div style={{ position: "fixed", top: 0, left: open ? 0 : -310, width: 290, height: "100%", background: "#1A1A1A", zIndex: 1032, overflowY: "auto", boxShadow: "4px 0 24px rgba(0,0,0,0.6)", transition: "left 0.28s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 20px", borderBottom: "1px solid #2A2A2A", background: "#151515" }}>
          <span style={{ fontWeight: 800, fontSize: 13, color: "#D4A017", letterSpacing: "0.1em" }}>CATEGORIES</span>
          <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 22, lineHeight: 1 }}>x</button>
        </div>
        <a href="/store" style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", color: "#D62828", fontWeight: 700, fontSize: 13, textDecoration: "none", borderBottom: "1px solid #2A2A2A", background: "rgba(214,40,40,0.06)" }}>
          SALE ITEMS
        </a>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {CATEGORIES.map((cat, i) => (
            <li key={cat.name} style={{ borderBottom: "1px solid #242424" }}>
              <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", padding: "14px 18px", color: expanded === i ? "#D4A017" : "rgba(255,255,255,0.8)", fontSize: 13, textAlign: "left" }}>
                <span style={{ flex: 1, fontWeight: expanded === i ? 700 : 400 }}>{cat.name}</span>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" style={{ transform: expanded === i ? "rotate(90deg)" : "none", transition: "transform 0.2s", opacity: 0.5 }}>
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
              {expanded === i && (
                <ul style={{ listStyle: "none", margin: 0, padding: "0 0 8px 0", background: "#131313" }}>
                  {cat.sub.map(sub => (
                    <li key={sub}>
                      <LocalizedClientLink href="/store" onClick={() => setOpen(false)} style={{ display: "block", padding: "10px 18px 10px 32px", color: "rgba(255,255,255,0.55)", fontSize: 12, textDecoration: "none" }}>
                        {sub}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
