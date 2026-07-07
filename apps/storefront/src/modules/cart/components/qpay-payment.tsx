"use client"

import { useEffect, useState } from "react"

const API = typeof window === "undefined" ? (process.env.ODOO_INTERNAL_URL || "http://localhost:8079") + "/api/v1" : "/api/v1"

type Invoice = {
  invoice_id: string
  qr_text: string
  qr_image: string
  short_url: string
  urls: { name: string; description: string; logo: string; link: string }[]
  amount: number
}

function fmt(n: number) {
  return `${(n || 0).toLocaleString("mn-MN")}₮`
}

/**
 * QPay payment block shown on the order success screen.
 * Renders nothing while QPay credentials are not configured in Odoo.
 */
export default function QpayPayment({ orderName, phone }: { orderName: string; phone: string }) {
  const [enabled, setEnabled] = useState(false)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [paid, setPaid] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let alive = true
    fetch(`${API}/payments/qpay/status`)
      .then((r) => r.json())
      .then((d) => alive && setEnabled(!!d.enabled))
      .catch(() => {})
    return () => {
      alive = false
    }
  }, [])

  const createInvoice = async () => {
    setError("")
    setLoading(true)
    try {
      const res = await fetch(`${API}/payments/qpay/invoice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_name: orderName, phone }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data?.error?.message || "Нэхэмжлэл үүсгэж чадсангүй.")
      setInvoice(data)
    } catch (e: any) {
      setError(e?.message?.includes("fetch") ? "Сервертэй холбогдож чадсангүй." : e?.message)
    } finally {
      setLoading(false)
    }
  }

  const checkPayment = async () => {
    setError("")
    setChecking(true)
    try {
      const res = await fetch(`${API}/payments/qpay/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_name: orderName, phone }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data?.error?.message || "Шалгаж чадсангүй.")
      if (data.paid) setPaid(true)
      else setError("Төлбөр хараахан бүртгэгдээгүй байна. Төлснийхөө дараа дахин шалгана уу.")
    } catch (e: any) {
      setError(e?.message?.includes("fetch") ? "Сервертэй холбогдож чадсангүй." : e?.message)
    } finally {
      setChecking(false)
    }
  }

  if (!enabled) return null

  if (paid) {
    return (
      <div style={{ marginTop: 24, background: "rgba(127,199,94,0.1)", border: "1px solid #7fc75e", borderRadius: 6, padding: "18px 20px", maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: "#7fc75e" }}>✓ Төлбөр амжилттай төлөгдлөө</div>
        <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>
          Захиалга {orderName} баталгаажлаа. Бид хүргэлтэд бэлтгэж эхэлнэ.
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 24, background: "var(--ms-surface)", border: "1px solid var(--ms-border)", borderRadius: 6, padding: 20, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
        Онлайн төлбөр
      </div>

      {!invoice ? (
        <>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", margin: "0 0 14px", lineHeight: 1.6 }}>
            QPay QR кодоор дурын банкны аппаар шууд төлөх боломжтой.
          </p>
          <button onClick={createInvoice} disabled={loading} className="ms-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Үүсгэж байна..." : "QPay-ээр төлөх"}
          </button>
        </>
      ) : (
        <>
          <div style={{ background: "#fff", borderRadius: 6, padding: 12, display: "flex", justifyContent: "center", marginBottom: 12 }}>
            {invoice.qr_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`data:image/png;base64,${invoice.qr_image}`} alt="QPay QR" style={{ width: 220, height: 220 }} />
            ) : (
              <span style={{ fontSize: 12, color: "#333", wordBreak: "break-all" }}>{invoice.qr_text}</span>
            )}
          </div>
          <div style={{ textAlign: "center", fontSize: 15, fontWeight: 800, color: "#FFCC00", marginBottom: 10 }}>
            {fmt(invoice.amount)}
          </div>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "center", margin: "0 0 12px" }}>
            Банкны аппаараа QR кодыг уншуулж төлөөд доорх товчийг дарна уу.
          </p>
          {invoice.urls?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginBottom: 12 }}>
              {invoice.urls.slice(0, 8).map((u, i) => (
                <a key={i} href={u.link} style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", border: "1px solid var(--ms-border)", borderRadius: 3, padding: "4px 8px", textDecoration: "none" }}>
                  {u.name}
                </a>
              ))}
            </div>
          )}
          <button onClick={checkPayment} disabled={checking} className="ms-btn-gold" style={{ width: "100%", justifyContent: "center", opacity: checking ? 0.7 : 1 }}>
            {checking ? "Шалгаж байна..." : "Төлбөр шалгах"}
          </button>
        </>
      )}

      {error && (
        <div style={{ marginTop: 12, background: "rgba(214,40,40,0.12)", border: "1px solid rgba(214,40,40,0.4)", color: "#ff8f8f", fontSize: 12.5, borderRadius: 4, padding: "9px 12px" }}>
          {error}
        </div>
      )}
    </div>
  )
}
