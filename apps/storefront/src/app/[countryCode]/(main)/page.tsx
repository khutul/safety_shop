import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import SafetyProducts from "@modules/home/components/axetor-products"
import BrandLogos from "@modules/home/components/brand-logos"
import IndustrySection from "@modules/home/components/industry-section"

export const metadata: Metadata = {
  title: "Manada Safety - Ажлын хамгаалалтын хэрэгсэл | PPE Монгол",
  description: "Монголын тэргүүлэх PPE нийлүүлэгч. Safetoe, 3M, Honeywell болон 50+ дэлхийн брэнд.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params
  return (
    <div style={{ background: "#151515" }}>
      <Hero />
      <IndustrySection />
      <SafetyProducts countryCode={countryCode} />
      <BrandLogos />
    </div>
  )
}
