import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="mn" data-mode="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
