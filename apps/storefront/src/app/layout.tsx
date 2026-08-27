import { getBaseURL } from "@lib/util/env"
import { CartProvider } from "@lib/cart/cart-context"
import { Metadata } from "next"
import "styles/globals.css"

// Set ALLOW_INDEXING=true in .env when the site goes live on manada.mn.
// While it's false (test server, localhost) search engines are told to stay out.
const INDEXABLE = process.env.ALLOW_INDEXING === "true"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Manada Safety — Хөдөлмөр хамгааллын хэрэгсэл | PPE Монгол",
    template: "%s | Manada Safety",
  },
  description:
    "Safetoe, Safeyear, 3M, Honeywell зэрэг дэлхийн брэндийн хөдөлмөр хамгааллын гутал, хувцас, хэрэгсэл. Монгол дахь албан ёсны дистрибютор — баталгаат бараа, шуурхай хүргэлт.",
  keywords: [
    "хөдөлмөр хамгаалал", "ХАБЭА", "аюулгүйн гутал", "ажлын хувцас",
    "каск", "бээлий", "PPE", "Safetoe", "Manada Safety", "манада",
  ],
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  verification: {
    google: "ukPXhmVak3N687_q208gAQlAHwnvBxZYioITe35NNuw",
  },
  openGraph: {
    type: "website",
    siteName: "Manada Safety",
    locale: "mn_MN",
    title: "Manada Safety — Хөдөлмөр хамгааллын хэрэгсэл",
    description:
      "Дэлхийн брэндийн хөдөлмөр хамгааллын хэрэгсэл — Монгол дахь албан ёсны дистрибютор.",
  },
}

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Manada Safety",
  legalName: "Манада ХХК",
  url: getBaseURL(),
  logo: `${getBaseURL()}/manada-logo.png`,
  email: "info@manada.mn",
  telephone: "+976-9910-2250",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Сонсголонгийн зам дагуу, Барилгачин ХТ, 3 давхар, С9",
    addressLocality: "Улаанбаатар",
    addressCountry: "MN",
  },
  sameAs: [
    "https://www.facebook.com/Manadasafetymongolia",
    "https://www.instagram.com/gutal.safetymn",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
      </head>
      <body>
        <CartProvider>
          <main className="relative">{props.children}</main>
        </CartProvider>
      </body>
    </html>
  )
}
