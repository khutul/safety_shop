"use client"

import { useEffect, useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

const STATE_LABEL: Record<string, { label: string; color: string }> = {
  draft: { label: "Хүлээн авсан — баталгаажуулахыг хүлээж байна", color: "#FFCC00" },
  sent: { label: "Үнийн санал илгээсэн", color: "#FFCC00" },
  sale: { label: "Баталгаажсан — бэлтгэгдэж байна", color: "#7fc75e" },
  done: { label: "Хүргэгдсэн", color: "#7fc75e" },
  cancel: { label: "Цуцлагдсан", color: "#ff8f8f" },
}

type Result = {
  name: string
  date: string
  state: string
  amount_total: number
  customer: string
  lines: { name: string; qty: number; price: number; subtotal: number }[]
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--ms-elevated)",
  border: "1px solid var(--ms-border)",
  borderRadius: 4,
  padding: "11px 12px",
  fontSize: 14,
  color: "#fff",
  outline: "none",
}

type Saved = { name: string; phone: string; total?: number; date?: string }

export default function OrderLookup() {
  const [phone, setPhone] = useState("")
  const [orderName, setOrderName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [saved, setSaved] = useState<Saved[]>([])

  // Энэ төхөөрөмж дээр хадгалагдсан захиалгууд
  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem("manada_orders_v1") || "[]")
      if (Array.isArray(arr)) setSaved(arr.filter((o) => o && o.name && o.phone))
    } catch {}
  }, [])

  const lookup = async (ph: string, name: string) => {
    setError("")
    setResult(null)
    if (!ph.trim() || !name.trim()) {
      setError("Утасны дугаар болон захиалгын дугаараа оруулна уу.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/orders/lookup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: ph, order_name: name.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 404) {
        throw new Error("Захиалга олдсонгүй. Утасны дугаар болон захиалгын дугаараа шалгана уу.")
      }
      if (!res.ok || !data.ok) {
        throw new Error(data?.error?.message || "Шалгахад алдаа гарлаа.")
      }
      setResult(data)
    } catch (e: any) {
      const msg = e?.message || ""
      setError(
        msg.includes("fetch")
          ? "Сервертэй холбогдож чадсангүй. Түр хүлээгээд дахин оролдоно уу."
          : msg
      )
    } finally {
      setLoading(false)
    }
  }

  const submit = () => lookup(phone, orderName)

  const openSaved = (o: Saved) => {
    setPhone(o.phone)
    setOrderName(o.name)
    lookup(o.phone, o.name)
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const st = result ? STATE_LABEL[result.state] || { label: result.state, color: "#fff" } : null

  return (
    <div style={{ background: "var(--ms-bg)", minHeight: "60vh", padding: "36px 0 60px" }}>
      <div className="ms-container" style={{ maxWidth: 720 }}>
        <div className="ms-sechead on-dark" style={{ marginBottom: 10 }}>
          <div className="bar" />
          <h1 className="title" style={{ margin: 0 }}>Захиалга шалгах</h1>
          <div className="rule" />
        </div>
        <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.7, margin: "0 0 24px" }}>
          Захиалга өгөхдөө ашигласан утасны дугаар болон захиалгын дугаараа (жишээ нь: S00012) оруулж төлөвөө шалгаарай.
        </p>

        <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, padding: 20, marginBottom: 20 }}>
          <div className="ms-lookup-grid" style={{ marginBottom: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Утасны дугаар</label>
              <input style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="99112233" inputMode="tel" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Захиалгын дугаар</label>
              <input style={inputStyle} value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="S00012" onKeyDown={(e) => e.key === "Enter" && submit()} />
            </div>
          </div>

          {error && (
            <div style={{ background: "rgba(214,40,40,0.12)", border: "1px solid rgba(214,40,40,0.4)", color: "#ff8f8f", fontSize: 13, borderRadius: 4, padding: "10px 12px", marginBottom: 14 }}>
              {error}
            </div>
          )}

          <button onClick={submit} disabled={loading} className="ms-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Шалгаж байна..." : "Шалгах"}
          </button>
        </div>

        {/* Энэ төхөөрөмж дээр хадгалагдсан захиалгууд — нэг товшилтоор шалгах */}
        {saved.length > 0 && (
          <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
              Миний захиалгууд
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {saved.map((o) => (
                <button
                  key={o.name}
                  onClick={() => openSaved(o)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, background: "var(--ms-elevated)", border: "1px solid var(--ms-border)", borderRadius: 4, padding: "10px 14px", cursor: "pointer", textAlign: "left", width: "100%" }}
                >
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#FFCC00" }}>{o.name}</span>
                    {o.date && (
                      <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                        {new Date(o.date).toLocaleDateString("mn-MN")}
                        {typeof o.total === "number" ? ` · ${fmt(o.total)}` : ""}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 5 }}>
                    Шалгах
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 6l6 6-6 6" /></svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {result && st && (
          <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--ms-border-soft)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{result.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{result.date} · {result.customer}</div>
              </div>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: st.color, border: `1px solid ${st.color}`, borderRadius: 20, padding: "5px 14px" }}>
                {st.label}
              </span>
            </div>
            {result.lines.map((l, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "11px 20px", borderBottom: "1px solid var(--ms-border-soft)", fontSize: 13 }}>
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{l.name}</span>
                <span style={{ color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>{l.qty} × {fmt(l.price)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 20px" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Нийт дүн</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#FFCC00" }}>{fmt(result.amount_total)}</span>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          Асуулт байвал <a href="tel:+97699102250" style={{ color: "#FFCC00", textDecoration: "none" }}>99102250</a> дугаарт залгаарай.
          {" "}<LocalizedClientLink href="/store" style={{ color: "#FFCC00", textDecoration: "none" }}>← Дэлгүүр рүү буцах</LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
