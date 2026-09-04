import { DiscountCodeType } from "@/app/generated/prisma"

export function getDiscountedAmount(
  discountCode: { discountAmount: number; discountType: DiscountCodeType },
  priceInCents: number
) {
  if (discountCode.discountType === "PERCENTAGE") {
    const discountInCents = (priceInCents * discountCode.discountAmount) / 100
    
    return Math.max(
      0,
      Math.ceil(priceInCents - discountInCents)
    )
  }

  if (discountCode.discountType === "FIXED") {
    const discountInCents = discountCode.discountAmount * 100
    
    return Math.max(
      0,
      Math.ceil(priceInCents - discountInCents)
    )
  }

  throw new Error(`Invalid discount type`)
}