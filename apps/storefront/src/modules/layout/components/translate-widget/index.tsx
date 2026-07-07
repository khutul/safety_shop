"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    google?: any
    googleTranslateElementInit?: () => void
  }
}

/**
 * Google Website Translator. Renders a 🌐 "Орчуулах" trigger;
 * the Google gadget itself mounts into #google_translate_element.
 */
export default function TranslateWidget() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (document.getElementById("gt-script")) {
      setReady(true)
      return
    }
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "mn",
            autoDisplay: false,
          },
          "google_translate_element"
        )
        setReady(true)
      } catch {
        /* ignore */
      }
    }
    const s = document.createElement("script")
    s.id = "gt-script"
    s.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    s.async = true
    document.body.appendChild(s)
  }, [])

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFCC00" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18 M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z" />
      </svg>
      <span
        id="google_translate_element"
        style={{ display: "inline-block", minWidth: ready ? undefined : 70 }}
      />
    </span>
  )
}
