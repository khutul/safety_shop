import ManadaCart from "@modules/cart/templates/manada-cart"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Сагс | Manada Safety",
  description: "Таны сонгосон бүтээгдэхүүнүүд",
}

export default function Cart() {
  return <ManadaCart />
}
