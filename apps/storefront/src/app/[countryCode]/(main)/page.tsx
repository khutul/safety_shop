import { Metadata } from "next"
import Hero from "@modules/home/components/hero"
import TrustBar from "@modules/home/components/trust-bar"
import BrandLogos from "@modules/home/components/brand-logos"
import CategoryCards from "@modules/home/components/category-cards"
import FeaturedBlock from "@modules/home/components/featured-block"
import IndustrySection from "@modules/home/components/industry-section"
import WhyBand from "@modules/home/components/why-band"
import Testimonials from "@modules/home/components/testimonials"

export const metadata: Metadata = {
  title: { absolute: "Manada Safety — Хөдөлмөр хамгааллын хэрэгсэл | PPE Монгол" },
  description: "Монголын тэргүүлэх PPE нийлүүлэгч. Safetoe, 3M, Honeywell болон 50+ дэлхийн брэнд.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  await props.params
  return (
    <div style={{ background: "#151515" }}>
      <Hero />
      <TrustBar />
      <BrandLogos />
      <CategoryCards />
      <FeaturedBlock />
      <IndustrySection />
      <WhyBand />
      <Testimonials />
    </div>
  )
}
