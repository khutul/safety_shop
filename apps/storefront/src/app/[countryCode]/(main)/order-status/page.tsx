import OrderLookup from "@modules/order/templates/order-lookup"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Захиалга шалгах",
  description: "Захиалгынхаа төлөвийг утасны дугаар болон захиалгын дугаараар шалгаарай",
}

export default function OrderStatusPage() {
  return <OrderLookup />
}
