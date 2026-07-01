interface WolfLogoProps {
  size?: number
  /** "gold" = gold on dark bg (nav/footer), "dark" = dark on light bg */
  variant?: "gold" | "dark"
}

/**
 * MANADA wolf logo — geometric front-facing wolf head with red eye slashes and outer arc.
 * Matches the official company mark: tribal mane, pointed ears, partial circle arc.
 */
export default function WolfLogo({ size = 44, variant = "gold" }: WolfLogoProps) {
  const main = variant === "gold" ? "#D4A017" : "#1A1A1A"
  const shade = variant === "gold" ? "#9A7010" : "#3A3A3A"
  const light = variant === "gold" ? "#F0C840" : "#555555"
  const arc = variant === "gold" ? "#D4A017" : "#1A1A1A"

  return (
    <svg
      width={size}
      height={Math.round(size * 1.1)}
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ── Outer arc (partial circle, open at top between ears) ── */}
      <path
        d="M36,92 A85,85 0 1,0 164,92"
        stroke={arc}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Ears ── */}
      {/* Left ear outer */}
      <polygon points="36,92 58,18 92,68" fill={main} />
      {/* Left ear inner (shadow) */}
      <polygon points="44,86 62,24 86,65" fill={shade} />
      {/* Right ear outer */}
      <polygon points="164,92 142,18 108,68" fill={main} />
      {/* Right ear inner (shadow) */}
      <polygon points="156,86 138,24 114,65" fill={shade} />

      {/* ── Head body ── */}
      <ellipse cx="100" cy="115" rx="66" ry="56" fill={main} />

      {/* ── Forehead dark band (creates wolf facial structure) ── */}
      <ellipse cx="100" cy="108" rx="46" ry="36" fill={shade} />

      {/* ── Eye area highlight ── */}
      <path
        d="M60,108 Q100,95 140,108 Q100,120 60,108Z"
        fill={light}
        opacity="0.35"
      />

      {/* ── Left eye — red narrow slash ── */}
      <polygon points="60,104 73,96 87,104 73,112" fill="#D62828" />
      {/* Left eye glint */}
      <polygon points="62,103 68,97 74,103 68,108" fill="#FF3333" opacity="0.5" />

      {/* ── Right eye — red narrow slash ── */}
      <polygon points="113,104 127,96 140,104 127,112" fill="#D62828" />
      {/* Right eye glint */}
      <polygon points="115,103 121,97 127,103 121,108" fill="#FF3333" opacity="0.5" />

      {/* ── Nose bridge ── */}
      <polygon points="95,116 105,116 102,124 100,126 98,124" fill={shade} />

      {/* ── Tribal mane / beard flowing downward ── */}
      {/* Center main fang */}
      <polygon points="90,132 110,132 106,166 100,174 94,166" fill={main} />
      {/* Center inner (darker) */}
      <polygon points="95,136 105,136 102,160 100,166 98,160" fill={shade} />

      {/* Left mane — inner pair */}
      <polygon points="72,128 83,128 78,155 70,153" fill={main} />
      <polygon points="75,132 81,132 77,150 71,148" fill={shade} />

      {/* Left mane — outer pair */}
      <polygon points="54,120 65,124 58,148 50,145" fill={main} />

      {/* Right mane — inner pair */}
      <polygon points="117,128 128,128 130,153 122,155" fill={main} />
      <polygon points="119,132 125,132 123,150 129,148" fill={shade} />

      {/* Right mane — outer pair */}
      <polygon points="135,120 146,120 150,145 142,148" fill={main} />
    </svg>
  )
}
