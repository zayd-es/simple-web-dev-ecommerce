import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import db from "@/db/db"
import { Resend } from "resend"
import PurchaseReceiptEmail from "@/email/PurchaseReceip"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
const resend = new Resend(process.env.RESEND_API_KEY as string)

export async function POST(req: NextRequest) {
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      req.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    )
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === "charge.succeeded") {
    const charge = event.data.object as Stripe.Charge

    const rawEmail = charge.metadata?.email || charge.billing_details?.email
    const discountCodeId = charge.metadata?.discountCodeId || null
    const email = rawEmail?.toLowerCase().trim()
    const productId = charge.metadata?.productId
    const pricePaidInCents = charge.amount

    if (!productId || !email) {
      return new NextResponse("Bad Request: Missing productId or email", { status: 400 })
    }

    const product = await db.product.findUnique({
      where: { id: productId },
    })

    if (product == null) {
      return new NextResponse("Bad Request: Product not found", { status: 400 })
    }

    const orderData = {
      productId,
      pricePaidInCents,
      discountCodeId: discountCodeId || undefined,
    }

    const { orders: [order] } = await db.user.upsert({
      where: { email },
      create: {
        email,
        orders: { create: orderData },
      },
      update: {
        orders: { create: orderData },
      },
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    })

    const downloadVerification = await db.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    })

    if (discountCodeId != null) {
      await db.discountCode.update({
        where: { id: discountCodeId },
        data: { uses: { increment: 1 } },
      })
    }

    try {
      const emailResult = await resend.emails.send({
        from: `Support <onboarding@resend.dev>`,
        to: email,
        subject: "Order Confirmation",
        react: (
          <PurchaseReceiptEmail
            product={product}
            order={order}
            downloadVerificationId={downloadVerification.id}
          />
        ),
      })
      console.log("RESEND SUCCESS:", emailResult)
    } catch (error) {
      console.error("RESEND ERROR:", error)
    }

    return new NextResponse("Order Processed", { status: 200 })
  }

  return new NextResponse(null, { status: 200 })
}