"use client"

import { useState } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import QpayPayment from "@modules/cart/components/qpay-payment"
import { useCart } from "@lib/cart/cart-context"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(255,255,255,0.7)",
  marginBottom: 6,
}

function QtyControl({ qty, max, onChange }: { qty: number; max?: number; onChange: (q: number) => void }) {
  const atMax = typeof max === "number" && max > 0 && qty >= max
  const btn: React.CSSProperties = {
    width: 30,
    height: 30,
    border: "1px solid var(--ms-border)",
    background: "var(--ms-elevated)",
    color: "#fff",
    fontSize: 15,
    cursor: "pointer",
    borderRadius: 3,
    lineHeight: 1,
  }
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button style={btn} onClick={() => onChange(qty - 1)} aria-label="Хасах">−</button>
      <span style={{ minWidth: 26, textAlign: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{qty}</span>
      <button
        style={{ ...btn, opacity: atMax ? 0.35 : 1, cursor: atMax ? "not-allowed" : "pointer" }}
        onClick={() => !atMax && onChange(qty + 1)}
        disabled={atMax}
        title={atMax ? `Үлдэгдэл: ${max}` : undefined}
        aria-label="Нэмэх"
      >+</button>
    </div>
  )
}

export default function ManadaCart() {
  const { items, total, count, setQty, remove, clear } = useCart()
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState<{ orderName: string; phone: string } | null>(null)
  const [shortages, setShortages] = useState<{ name: string; requested: number; available: number }[]>([])

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (allowBackorder = false) => {
    setError("")
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Нэр болон утасны дугаараа оруулна уу.")
      return
    }
    if (!/^\d{8,}$/.test(form.phone.replace(/[\s+-]/g, ""))) {
      setError("Утасны дугаар буруу байна.")
      return
    }
    setSending(true)
    try {
      const res = await fetch(`${API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: form,
          allow_backorder: allowBackorder,
          items: items.map((i) => ({ product_id: i.productId, variant_id: i.variantId, qty: i.qty })),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409 && data?.error?.code === "insufficient_stock") {
        setShortages(data.error.shortages || [])
        setSending(false)
        return
      }
      if (!res.ok || !data.ok) {
        throw new Error(data?.error?.message || "Захиалга илгээхэд алдаа гарлаа.")
      }
      setShortages([])
      // Захиалгын дугаарыг хэрэглэгчийн төхөөрөмжид (browser) хадгална —
      // дараа орж ирэхэд "Миний захиалгууд" хэсэгт нэг товшилтоор шалгана.
      try {
        const KEY = "manada_orders_v1"
        const prev = JSON.parse(localStorage.getItem(KEY) || "[]")
        const next = [
          { name: data.order_name, phone: form.phone, total, date: new Date().toISOString() },
          ...prev.filter((o: any) => o && o.name !== data.order_name),
        ].slice(0, 30)
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {}
      setDone({ orderName: data.order_name, phone: form.phone })
      clear()
    } catch (e: any) {
      const msg = e?.message || ""
      setError(
        msg.includes("fetch")
          ? "Сервертэй холбогдож чадсангүй. Та түр хүлээгээд дахин оролдох эсвэл 99102250 дугаарт залгана уу."
          : msg || "Захиалга илгээхэд алдаа гарлаа. Дахин оролдоно уу."
      )
    } finally {
      setSending(false)
    }
  }

  // ── Success screen ──
  if (done) {
    return (
      <div style={{ background: "var(--ms-bg)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(127,199,94,0.15)", border: "2px solid #7fc75e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>✓</div>
          <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: 26, fontWeight: 800, color: "#fff", textTransform: "uppercase", margin: "0 0 10px" }}>Захиалга хүлээн авлаа</h1>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.7, margin: "0 0 8px" }}>
            Захиалгын дугаар: <strong style={{ color: "#FFCC00" }}>{done.orderName}</strong>
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
            Манай ажилтан удахгүй тантай холбогдож захиалгыг баталгаажуулна. Захиалгын дугаараа тэмдэглэж авбал төлөвөө хэдийд ч шалгаж болно.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <LocalizedClientLink href="/store" className="ms-btn-gold">Худалдан авалт үргэлжлүүлэх</LocalizedClientLink>
            <LocalizedClientLink href="/order-status" className="ms-btn-ghost">Захиалга шалгах</LocalizedClientLink>
          </div>
          <QpayPayment orderName={done.orderName} phone={done.phone} />
        </div>
      </div>
    )
  }

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div style={{ background: "var(--ms-bg)", minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 16, display: "flex", justifyContent: "center" }}>
            <svg width="56" height="56" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M3 3h2l2.4 12.2A2 2 0 0 0 9.36 17H18a2 2 0 0 0 1.96-1.6L21.6 8H6" />
              <circle cx="9.5" cy="20.5" r="1.5" />
              <circle cx="17.5" cy="20.5" r="1.5" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "var(--ms-font-display)", fontSize: 24, fontWeight: 800, color: "#fff", textTransform: "uppercase", margin: "0 0 10px" }}>Таны сагс хоосон байна</h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, margin: "0 0 24px" }}>Бүтээгдэхүүн сонгоод сагсандаа нэмээрэй.</p>
          <LocalizedClientLink href="/store" className="ms-btn-gold">Бүтээгдэхүүн үзэх</LocalizedClientLink>
        </div>
      </div>
    )
  }

  // ── Cart + checkout ──
  return (
    <div style={{ background: "var(--ms-bg)", padding: "28px 0 60px" }}>
      <div className="ms-container">
        <div className="ms-sechead on-dark" style={{ marginBottom: 24 }}>
          <div className="bar" />
          <h1 className="title" style={{ margin: 0 }}>Таны сагс ({count})</h1>
          <div className="rule" />
        </div>

        <div className="ms-cart-grid">
          {/* Items */}
          <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, overflow: "hidden" }}>
            {items.map((i, idx) => (
              <div key={i.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderTop: idx > 0 ? "1px solid var(--ms-border-soft)" : "none" }}>
                <div style={{ width: 64, height: 64, background: "#f4f5f7", borderRadius: 4, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  {i.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.image} alt={i.name} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  ) : (
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b9bec7" strokeWidth="1.4"><path d="M12 3l8 3v6c0 4.5-3.5 8-8 9-4.5-1-8-4.5-8-9V6z" /></svg>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "rgba(255,255,255,0.92)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{i.name}</div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>
                    {i.brand || "Manada Safety"}{i.color ? ` · Өнгө: ${i.color}` : ""}{i.size ? ` · Хэмжээ: ${i.size}` : ""}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#FFCC00", marginTop: 4 }}>{fmt(i.price)}</div>
                </div>
                <QtyControl qty={i.qty} max={i.maxQty} onChange={(q) => { setQty(i.key, q); setShortages([]) }} />
                <div style={{ width: 100, textAlign: "right", fontSize: 14, fontWeight: 700, color: "#fff" }}>{fmt(i.price * i.qty)}</div>
                <button onClick={() => { remove(i.key); setShortages([]) }} aria-label="Устгах" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 18, padding: 6 }}>✕</button>
              </div>
            ))}
          </div>

          {/* Order form */}
          <div style={{ background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>Захиалгын мэдээлэл</div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Нэр / Байгууллага *</label>
                <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Таны нэр" />
              </div>
              <div>
                <label style={labelStyle}>Утасны дугаар *</label>
                <input style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="99112233" inputMode="tel" />
              </div>
              <div>
                <label style={labelStyle}>Хүргэлтийн хаяг</label>
                <input style={inputStyle} value={form.address} onChange={set("address")} placeholder="Дүүрэг, хороо, байр..." />
              </div>
              <div>
                <label style={labelStyle}>Нэмэлт тэмдэглэл</label>
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.note} onChange={set("note")} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--ms-border)", margin: "18px 0 14px", paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Нийт дүн</span>
              <span style={{ fontSize: 22, fontWeight: 800, color: "#FFCC00" }}>{fmt(total)}</span>
            </div>
            {/* Захиалгын нөхцөлийн мэдээлэл (толгойн мөрнөөс нүүлгэн ирүүлсэн) */}
            <div style={{ border: "1px solid var(--ms-border)", borderRadius: 4, padding: "4px 12px", marginBottom: 14 }}>
              {[
                { d: "M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z M9 12l2 2 4-4", t: "100% жинхэнэ бараа — албан ёсны баталгаатай" },
                { d: "M3 7h11v8H3z M14 10h4l3 3v2h-7z", t: "100,000₮-с дээш захиалгад УБ хотод хүргэлт үнэгүй" },
                { d: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v5l3 3", t: "УБ хотод 24 цагийн дотор хүргэнэ" },
                { d: "M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z", t: "Төлбөрийг ажилтан холбогдож баталгаажуулна" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 11.5, color: "rgba(255,255,255,0.55)", padding: "8px 0", borderTop: i > 0 ? "1px solid var(--ms-border-soft)" : "none" }}>
                  <svg width="15" height="15" fill="none" stroke="#FFCC00" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 1 }}>
                    {r.d.split(" M").map((s, j) => <path key={j} d={j === 0 ? s : "M" + s} />)}
                  </svg>
                  <span>{r.t}</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ background: "rgba(214,40,40,0.12)", border: "1px solid rgba(214,40,40,0.4)", color: "#ff8f8f", fontSize: 13, borderRadius: 4, padding: "10px 12px", marginBottom: 12 }}>
                {error}
              </div>
            )}

            {shortages.length > 0 && (
              <div style={{ background: "rgba(255,204,0,0.08)", border: "1px solid rgba(255,204,0,0.45)", borderRadius: 4, padding: "12px 14px", marginBottom: 12 }}>
                <div style={{ color: "#FFCC00", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                  ⚠️ Зарим барааны үлдэгдэл хүрэлцэхгүй байна
                </div>
                {shortages.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", padding: "3px 0" }}>
                    {s.name} — захиалсан: {s.requested}, үлдэгдэл: {s.available}
                  </div>
                ))}
                <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", marginTop: 8 }}>
                  Үргэлжлүүлбэл дутуу барааг захиалгаар (нэмэлт хугацаатай) бэлтгэж хүргэнэ.
                </div>
              </div>
            )}

            <button
              onClick={() => submit(shortages.length > 0)}
              disabled={sending}
              className="ms-btn-gold"
              style={{ width: "100%", justifyContent: "center", opacity: sending ? 0.7 : 1 }}
            >
              {sending ? "Илгээж байна..." : shortages.length > 0 ? "Зөвшөөрч, захиалгаар авах" : "Захиалга илгээх"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
