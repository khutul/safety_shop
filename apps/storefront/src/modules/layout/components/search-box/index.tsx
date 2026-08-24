"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SearchBox() {
  const [q, setQ] = useState("")
  const router = useRouter()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (!term) return
    router.push(`/store?q=${encodeURIComponent(term)}`)
  }

  return (
    <form
      onSubmit={submit}
      style={{
        flex: 1,
        maxWidth: 520,
        background: "#252525",
        border: "1px solid #333",
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Бүтээгдэхүүн хайх..."
        style={{ background: "none", border: "none", outline: "none", flex: 1, padding: "10px 14px", fontSize: 13, color: "#e0e0e0", minWidth: 0 }}
      />
      <button
        type="submit"
        aria-label="Хайх"
        style={{ background: "#FFCC00", border: "none", cursor: "pointer", padding: "10px 16px", color: "#151515", flexShrink: 0, display: "flex", alignItems: "center" }}
      >
        <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </button>
    </form>
  )
}
