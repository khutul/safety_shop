"use client"
import { useEffect, useRef, useState } from "react"

// Дэлгүүрийн зургийн слайд — public/about/shop-1.jpg ... shop-10.jpg
// файлуудаас байгааг нь автоматаар олж харуулна. Зураг байхгүй бол
// хэсэг бүхэлдээ харагдахгүй.
const CANDIDATES = Array.from({ length: 10 }, (_, i) => `/about/shop-${i + 1}.jpg`)
const INTERVAL_MS = 4000

export default function ShopGallery() {
  const [images, setImages] = useState<string[]>([])
  const [idx, setIdx] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Байгаа зургуудыг илрүүлэх
  useEffect(() => {
    let alive = true
    Promise.all(
      CANDIDATES.map(
        (src) =>
          new Promise<string | null>((resolve) => {
            const im = new Image()
            im.onload = () => resolve(src)
            im.onerror = () => resolve(null)
            im.src = src
          })
      )
    ).then((res) => {
      if (alive) setImages(res.filter(Boolean) as string[])
    })
    return () => {
      alive = false
    }
  }, [])

  // Автомат гүйлгэлт
  useEffect(() => {
    if (images.length < 2) return
    timer.current = setInterval(() => setIdx((i) => (i + 1) % images.length), INTERVAL_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [images.length])

  const go = (i: number) => {
    setIdx((i + images.length) % images.length)
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => setIdx((x) => (x + 1) % images.length), INTERVAL_MS)
  }

  if (!images.length) return null

  const btnStyle: React.CSSProperties = {
    position: "absolute", top: "50%", transform: "translateY(-50%)", zIndex: 2,
    width: 40, height: 40, borderRadius: "50%", border: "none", cursor: "pointer",
    background: "rgba(21,21,21,0.55)", color: "#FFCC00", fontSize: 20, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center",
  }

  return (
    <section className="ms-container" style={{ padding: "8px 20px 8px" }}>
      <div className="ms-sechead">
        <div className="bar" />
        <span className="title">Манай дэлгүүр</span>
        <div className="rule" />
      </div>
      <div style={{ position: "relative", overflow: "hidden", borderRadius: 10, background: "#0f0f0f" }}>
        {/* Слайдын зурвас */}
        <div
          style={{
            display: "flex",
            transform: `translateX(-${idx * 100}%)`,
            transition: "transform 0.7s cubic-bezier(0.25, 0.8, 0.25, 1)",
          }}
        >
          {images.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt="Манада дэлгүүр"
              style={{ width: "100%", flexShrink: 0, height: "min(56vw, 480px)", objectFit: "cover", display: "block" }}
            />
          ))}
        </div>

        {images.length > 1 && (
          <>
            <button aria-label="Өmnөх" onClick={() => go(idx - 1)} style={{ ...btnStyle, left: 12 }}>‹</button>
            <button aria-label="Дараах" onClick={() => go(idx + 1)} style={{ ...btnStyle, right: 12 }}>›</button>
            <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 2 }}>
              {images.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Зураг ${i + 1}`}
                  onClick={() => go(i)}
                  style={{
                    width: i === idx ? 22 : 8, height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                    background: i === idx ? "#FFCC00" : "rgba(255,255,255,0.5)", transition: "all 0.3s",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
