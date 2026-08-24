"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

// Text-only labels — no flag glyphs (Windows renders flag emoji as
// letter codes like "MN", which looked wrong in the header).
const LANGS: { code: string; label: string }[] = [
  { code: "mn", label: "Монгол" },
  { code: "en", label: "English" },
  { code: "zh-CN", label: "中文" },
  { code: "ru", label: "Русский" },
  { code: "ko", label: "한국어" },
  { code: "ja", label: "日本語" },
  { code: "kk", label: "Қазақша" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "tr", label: "Türkçe" },
]

function currentLang(): string {
  if (typeof document === "undefined") return "mn"
  const m = document.cookie.match(/googtrans=\/mn\/([^;]+)/)
  return m ? decodeURIComponent(m[1]) : "mn"
}

function setLang(code: string) {
  const clear = () => {
    const past = "Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = `googtrans=;path=/;expires=${past}`
    document.cookie = `googtrans=;path=/;domain=${location.hostname};expires=${past}`
    document.cookie = `googtrans=;path=/;domain=.${location.hostname};expires=${past}`
  }
  if (code === "mn") {
    clear()
  } else {
    clear()
    document.cookie = `googtrans=/mn/${code};path=/`
  }
  location.reload()
}

/**
 * Google Website Translator (custom UI).
 * `mount` renders the hidden Google element + loads the script —
 * exactly one instance per page should mount; extra instances can be
 * dropdown-only (mount=false).
 */
export default function TranslateWidget({ mount = true, mobile = false }: { mount?: boolean; mobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const [lang, setLangState] = useState("mn")
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLangState(currentLang())
    if (!mount) return
    if (document.getElementById("gt-script")) return

    // Load Google's script only after the page has fully loaded and React
    // hydration has settled. If Google mutates the DOM while React is still
    // hydrating, React regenerates the tree and wipes the translation.
    let timer: ReturnType<typeof setTimeout> | undefined
    const inject = () => {
      timer = setTimeout(() => {
        if (document.getElementById("gt-script")) return
        window.googleTranslateElementInit = () => {
          try {
            new window.google.translate.TranslateElement(
              { pageLanguage: "mn", autoDisplay: false },
              "google_translate_element"
            )
          } catch {
            /* ignore */
          }
        }
        const s = document.createElement("script")
        s.id = "gt-script"
        s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        s.async = true
        document.body.appendChild(s)
      }, 1200)
    }
    if (document.readyState === "complete") {
      inject()
    } else {
      window.addEventListener("load", inject, { once: true })
    }
    return () => {
      window.removeEventListener("load", inject)
      if (timer) clearTimeout(timer)
    }
  }, [mount])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [open])

  const active = LANGS.find((l) => l.code === lang) || LANGS[0]

  return (
    <div ref={boxRef} style={{ position: "relative", display: mobile ? "block" : "inline-block" }} className="notranslate">
      {mount && <div id="google_translate_element" style={{ display: "none" }} />}
      <button
        onClick={() => setOpen((v) => !v)}
        style={
          mobile
            ? { width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: "13px 20px", color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid #1f1f1f" }
            : { background: "none", border: "1px solid #2A2A2A", borderRadius: 3, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 10px", color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 600 }
        }
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18 M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
        </svg>
        {active.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: mobile ? "auto" : 0,
            left: mobile ? 20 : "auto",
            marginTop: 6,
            background: "#1A1A1A",
            border: "1px solid #2A2A2A",
            borderRadius: 4,
            boxShadow: "0 16px 40px rgba(0,0,0,0.6)",
            zIndex: 90,
            minWidth: 170,
            padding: 6,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                background: l.code === lang ? "rgba(255,204,0,0.1)" : "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 10px",
                borderRadius: 3,
                color: l.code === lang ? "#FFCC00" : "rgba(255,255,255,0.75)",
                fontSize: 13,
                textAlign: "left",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
