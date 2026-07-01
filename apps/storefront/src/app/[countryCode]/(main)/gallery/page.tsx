async function getImageCount(): Promise<number> {
  try {
    const res = await fetch("http://localhost:8001/api/image", {
      method: "POST",
      cache: "no-store",
    })
    if (res.ok) {
      const data = await res.json()
      return data.count || 49
    }
  } catch {}
  return 49
}

export default async function GalleryPage() {
  const count = await getImageCount()
  const images = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", padding: "32px 24px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', Impact, sans-serif",
            fontSize: "32px",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#111",
            marginBottom: "6px",
          }}>
            Бараа зургийн галерей — {count} зураг
          </h1>
          <p style={{ color: "#6b7280", fontSize: "13px", lineHeight: 1.6 }}>
            Зураг дээр дарж дугаарыг тэмдэглэ → Admin panel дээр тухайн барааны Media таб дотор URL-ийг оруул:
            <br />
            <code style={{ background: "#e5e7eb", padding: "2px 6px", borderRadius: "3px", fontSize: "12px" }}>
              http://localhost:8001/api/image?n=<strong>N</strong>
            </code>
          </p>
        </div>

        {/* Category filter hint */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "10px",
          marginBottom: "24px",
          background: "#111",
          borderRadius: "8px",
          padding: "16px 20px",
        }}>
          {[
            { label: "Ажлын гутал", color: "#f5c518" },
            { label: "Ажлын хувцас", color: "#f5c518" },
            { label: "Толгой хамгаалах", color: "#f5c518" },
            { label: "Бээлий", color: "#f5c518" },
            { label: "Нүд хамгаалах", color: "#f5c518" },
            { label: "Амьсгал хамгаалах", color: "#f5c518" },
          ].map((cat) => (
            <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cat.color }} />
              <span style={{ color: "#d1d5db", fontSize: "11px" }}>{cat.label}</span>
            </div>
          ))}
        </div>

        {/* Image grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}>
          {images.map((n) => (
            <div key={n} style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              {/* Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/image?n=${n}`}
                alt={`Зураг ${n}`}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "contain",
                  background: "#f3f4f6",
                  display: "block",
                  padding: "8px",
                }}
                loading="lazy"
              />

              {/* Info */}
              <div style={{ padding: "10px 12px", borderTop: "1px solid #f3f4f6" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}>
                  <span style={{
                    background: "#111",
                    color: "#f5c518",
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: "4px",
                  }}>
                    #{n}
                  </span>
                  <span style={{ fontSize: "10px", color: "#9ca3af", fontFamily: "monospace" }}>
                    product-{n}.jpg
                  </span>
                </div>
                <div style={{
                  background: "#f9fafb",
                  borderRadius: "4px",
                  padding: "4px 8px",
                  fontSize: "10px",
                  color: "#6b7280",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                }}>
                  /api/image?n={n}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer instructions */}
        <div style={{
          marginTop: "32px",
          background: "#1f2937",
          borderRadius: "10px",
          padding: "24px",
          borderLeft: "4px solid #f5c518",
        }}>
          <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>
            Admin panel дээр зураг холбох заавар:
          </h3>
          <ol style={{ color: "#d1d5db", fontSize: "13px", lineHeight: "2", paddingLeft: "20px" }}>
            <li>
              <a href="http://localhost:9000/app/products" style={{ color: "#f5c518" }}>
                localhost:9000/app/products
              </a> → Бараа сонгох
            </li>
            <li>
              <strong style={{ color: "#fff" }}>Media</strong> таб дарах
            </li>
            <li>
              <strong style={{ color: "#fff" }}>Upload</strong> товч → Зураг файл сонгох
              <span style={{ color: "#9ca3af" }}> (C:\Users\khutul\safety_shop\picture\ фолдороос)</span>
            </li>
            <li>Эсвэл URL: <code style={{ background: "#374151", padding: "2px 6px", borderRadius: "3px", color: "#f5c518" }}>
              http://localhost:8001/api/image?n=5
            </code></li>
          </ol>
        </div>
      </div>
    </div>
  )
}
