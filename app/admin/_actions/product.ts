"use server"

import db from "@/db/db"
import { z } from "zod"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: z.string().url("Must be a valid URL"),
  image: z.string().url("Must be a valid URL"),
})

const editSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
})

export async function AddProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.flatten().fieldErrors
  }

  const data = result.data

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath: data.file,
      imagePath: data.image,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

export async function UpdateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()))
  if (result.success === false) {
    return result.error.flatten().fieldErrors
  }

  const data = result.data
  const product = await db.product.findUnique({ where: { id } })
  if (product == null) return notFound()

  const filePath = data.file && data.file.length > 0 ? data.file : product.filePath
  const imagePath = data.image && data.image.length > 0 ? data.image : product.imagePath

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  })

  revalidatePath("/")
  revalidatePath("/products")
  redirect("/admin/products")
}

export async function ToggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } })
  revalidatePath("/")
  revalidatePath("/products")
}

export async function DeleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } })
  if (product == null) return notFound()

  revalidatePath("/")
  revalidatePath("/products")
}