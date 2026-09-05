import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { redirect } from "next/navigation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerificationId: string }> }
) {
  const { downloadVerificationId } = await params;

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } }
  });

  if (data == null) {
    redirect("/products/download/expired");
  }

  redirect(data.product.filePath)
}