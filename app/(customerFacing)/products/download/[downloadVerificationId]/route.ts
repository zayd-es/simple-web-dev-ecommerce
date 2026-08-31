import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import fs from "fs/promises"
import { redirect } from "next/navigation";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ downloadVerificationId: string }> }
) {
  const { downloadVerificationId } = await params;

  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select:{product:{select:{filePath:true, name:true}}}
  });
  if(data==null){
redirect("/products/download/expired");
  }
   const { size } = await fs.stat(data.product.filePath)
    const file = await fs.readFile(data.product.filePath)
    const extension = data.product.filePath.split(".").pop()
  
    return new NextResponse(file, {
      headers: {  
        "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
        "Content-Length": size.toString(),
      },
    })

  return new NextResponse("hi");
}