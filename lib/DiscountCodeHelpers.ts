import { Prisma } from "@/app/generated/prisma"
import db from "@/db/db"

export function usableDiscountCodeWhere(productId: string) {
  return {
    isActive: true,
    AND: [
      {
        OR: [
          { allProducts: true }, 
        { product: { id: productId } }
        ],
      },
      {
        OR: [
          { limit: null }, 
          { limit: { gt: db.discountCode.fields.uses } }
        ],
      },
      {
        OR: [
          { expiresAt: null }, 
          { expiresAt: { gt: new Date() } }
        ],
      },
    ],
  } satisfies Prisma.DiscountCodeWhereInput
}

