import db from "@/db/db"
import { notFound, redirect } from "next/navigation"
import { NextRequest } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  })

  if (product == null) return notFound()

  redirect(product.filePath)
}