import db from "@/db/db"
import { notFound } from "next/navigation"
import Stripe from "stripe" 
import {CheckoutForm} from "./_components/CheckoutForm"
import { usableDiscountCodeWhere } from "@/lib/DiscountCodeHelpers"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
export default async function PurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>      
  searchParams: Promise<{ coupon?: string }> 
}) {
  const { id } = await params 
  const { coupon } = await searchParams

  const product = await db.product.findUnique({
    where: { id },
  })
  
  if (product == null) return notFound()
    const discountCode =coupon==null ? null:await getDiscountCode(coupon,product.id)
const paymentIntent = await stripe.paymentIntents.create({
    amount: product.priceInCents,
    currency: "USD",
    metadata: { productId: product.id },
  })

  if (paymentIntent.client_secret == null) {
    throw new Error("Stripe failed to create payment intent") 
  }
  return <CheckoutForm product={product} discountCode={discountCode||undefined} clientSecret={paymentIntent.client_secret}/>
}

function getDiscountCode(coupon: string,productId:string) {
  return db.discountCode.findUnique({
    select:{id:true,discountType:true,discountAmount:true},
    where: { ...usableDiscountCodeWhere, code: coupon },
  })
}