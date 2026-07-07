"use client"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const sortOptions: { value: SortOptions; label: string }[] = [
  { value: "created_at", label: "Шинэ эхэндээ" },
  { value: "price_asc", label: "Үнэ: багаас их" },
  { value: "price_desc", label: "Үнэ: ихээс бага" },
]

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  return (
    <div data-testid={dataTestId}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
        Эрэмбэлэх
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sortOptions.map((o) => {
          const active = o.value === sortBy
          return (
            <button
              key={o.value}
              onClick={() => setQueryParams("sortBy", o.value)}
              data-testid="radio-label"
              data-active={active}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "7px 8px",
                borderRadius: 3,
                fontSize: 13,
                textAlign: "left",
                fontWeight: active ? 700 : 400,
                color: active ? "#FFCC00" : "rgba(255,255,255,0.68)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: active ? "#FFCC00" : "rgba(255,255,255,0.22)",
                }}
              />
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SortProducts
