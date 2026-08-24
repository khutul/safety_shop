"use client"
import { useState } from "react"

const API = "/api/v1"

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#1E1E1E",
  border: "1px solid #2E2E2E",
  borderRadius: 4,
  padding: "12px 14px",
  fontSize: 14,
  color: "#eee",
  outline: "none",
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "rgba(255,255,255,0.6)",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 7,
}

export default function PartnershipForm() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", message: "" })
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Нэр болон утасны дугаараа оруулна уу.")
      return
    }
    setSending(true)
    try {
      const res = await fetch(`${API}/partnership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.error) {
        setError(data?.error?.message || "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.")
      } else {
        setDone(true)
      }
    } catch {
      setError("Сүлжээний алдаа гарлаа. Дахин оролдоно уу.")
    } finally {
      setSending(false)
    }
  }

  if (done) {
    return (
      <div style={{ textAlign: "center", padding: "56px 20px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(127,199,94,0.12)", border: "1px solid rgba(127,199,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7fc75e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 10, fontFamily: "var(--ms-font-display)", textTransform: "uppercase" }}>
          Хүсэлт илгээгдлээ
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, maxWidth: 420, margin: "0 auto", lineHeight: 1.7 }}>
          Бид таны хүсэлтийг хүлээн авлаа. Ажлын цагаар ({"09:00-18:00"}) тантай эргэн холбогдох болно. Баярлалаа!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <div>
          <label style={labelStyle}>Нэр *</label>
          <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="Таны нэр" />
        </div>
        <div>
          <label style={labelStyle}>Байгууллага</label>
          <input style={inputStyle} value={form.company} onChange={set("company")} placeholder="Байгууллагын нэр" />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
        <div>
          <label style={labelStyle}>Утас *</label>
          <input style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="99112233" inputMode="tel" />
        </div>
        <div>
          <label style={labelStyle}>И-мэйл</label>
          <input style={inputStyle} value={form.email} onChange={set("email")} placeholder="name@company.mn" inputMode="email" />
        </div>
      </div>
      <div>
        <label style={labelStyle}>Захиа</label>
        <textarea
          style={{ ...inputStyle, minHeight: 140, resize: "vertical", fontFamily: "inherit" }}
          value={form.message}
          onChange={set("message")}
          placeholder="Хамтран ажиллах саналаа энд бичнэ үү — ямар бүтээгдэхүүн, ямар хэмжээний хэрэгцээ, байгууллагын танилцуулга гэх мэт."
        />
      </div>
      {error && (
        <div style={{ background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.35)", borderRadius: 4, padding: "10px 14px", color: "#ff8a8a", fontSize: 13 }}>
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={sending}
        className="ms-btn-gold"
        style={{ border: "none", cursor: sending ? "wait" : "pointer", opacity: sending ? 0.7 : 1, alignSelf: "flex-start" }}
      >
        {sending ? "Илгээж байна..." : "Хүсэлт илгээх →"}
      </button>
    </form>
  )
}
