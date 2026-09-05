"use server"

import { DiscountCodeType } from "@/app/generated/prisma"
import db from "@/db/db"
import { notFound, redirect } from "next/navigation"
import { z } from "zod"

const addSchema = z
  .object({
    code: z.string().min(1, "Code is required"),
    discountAmount: z.coerce.number().int().min(1, "Amount must be at least 1"),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date(), "Expiration date must be in the future").optional()
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
  })
  .refine(
    (data) => {
      if (data.discountType === DiscountCodeType.PERCENTAGE) {
        return data.discountAmount <= 100
      }
      return true
    },
    {
      message: "Percentage discount must be less than or equal to 100",
      path: ["discountAmount"],
    }
  )
  .refine(
    (data) => {
      if (data.allProducts === true) {
        return data.productIds == null
      }
      return true
    },
    {
      message: "Cannot select products when all products is selected",
      path: ["productIds"],
    }
  )
  .refine(
  (data) => {
    if (data.allProducts === false) {
      return Array.isArray(data.productIds) && data.productIds.length > 0
    }
    return true
  },
  {
    message: "Must select at least one product",
    path: ["productIds"],
  }
)

export async function addDiscountCode(prevState: unknown, formData: FormData) {
  const productIds = formData.getAll("productIds") as string[]
  const allProducts = formData.get("allProducts") === "true"

  const result = addSchema.safeParse({
    ...Object.fromEntries(formData.entries()),
    allProducts,
    productIds: productIds.length > 0 ? productIds : undefined,
  })

  if (result.success === false) {
    return result.error.flatten()
  }

  const data = result.data

  try {
    await db.discountCode.create({
      data: {
        code: data.code,
        discountAmount: data.discountAmount,
        discountType: data.discountType,
        allProducts: data.allProducts,
        product:
          data.productIds && data.productIds.length > 0
            ? { connect: { id: data.productIds[0] } }
            : undefined,
        expiresAt: data.expiresAt,
        limit: data.limit,
      },
    })
  } catch (e: any) {
    if (e?.code === "P2002") {
      return {
        fieldErrors: {
          code: ["This coupon code already exists. Please use a different code."],
        },
      }
    }
    throw e
  }

  redirect("/admin/discount-codes")
}

export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
  await db.discountCode.update({ where: { id }, data: { isActive } })
}

export async function deleteDiscountCode(id: string) {
  const discountCode = await db.discountCode.delete({ where: { id } })

  if (discountCode == null) return notFound()

  return discountCode
}