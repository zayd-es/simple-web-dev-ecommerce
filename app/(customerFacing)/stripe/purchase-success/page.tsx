import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import { CheckCircle2, Download, RefreshCw, XCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

type SuccessPageProps = {
  searchParams: Promise<{ payment_intent?: string }> | { payment_intent?: string }
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const resolvedSearchParams = await searchParams
  const paymentIntentId = resolvedSearchParams.payment_intent

  if (paymentIntentId == null) return notFound()

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

  if (paymentIntent.metadata.productId == null) return notFound()

  const product = await db.product.findUnique({
    where: { id: paymentIntent.metadata.productId },
  })

  if (product == null) return notFound()
  const isSuccess = paymentIntent.status === "succeeded"
const downloadVerificationId = isSuccess
  ? await createDownloadVerification(product.id)
  : null

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-gradient-to-b from-card/80 to-card/30 backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-2xl space-y-8 relative overflow-hidden">
        
        <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none ${isSuccess ? 'bg-emerald-500' : 'bg-destructive'}`} />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-background/50 border border-border/40 shadow-inner">
            {isSuccess ? (
              <CheckCircle2 className="w-10 h-10 text-emerald-500 animate-in zoom-in-50 duration-300" />
            ) : (
              <XCircle className="w-10 h-10 text-destructive animate-in zoom-in-50 duration-300" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSuccess 
              ? "Thank you for your purchase. Your digital asset is ready."
              : "Something went wrong with your transaction. Please try again."
            }
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-center p-4 rounded-2xl bg-background/40 border border-border/30 backdrop-blur-sm relative z-10">
          <div className="aspect-video w-full sm:w-2/5 relative rounded-xl overflow-hidden border border-border/20 shadow-md flex-shrink-0">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {formatCurrency(product.priceInCents / 100)}
            </span>
            <h2 className="text-xl font-bold tracking-tight text-foreground">{product.name}</h2>
            <p className="line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        <div className="pt-2 relative z-10">
          <Button 
            className={`w-full h-12 rounded-xl text-base font-medium shadow-lg transition-all duration-300 ${
              isSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                : ''
            }`}
            size="lg" 
            asChild
          >
            {isSuccess ? (
              <a href={`/products/download/${downloadVerificationId}`} className="flex items-center justify-center gap-2">
                <Download className="w-5 h-5" /> Download Product
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`} className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" /> Try Again
              </Link>
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}

async function createDownloadVerification(productId:string){
    return(
        await db.downloadVerification.create({
            data:{
                productId:productId,
                expiresAt:new Date(Date.now()+1000*60*60*24)
            }
        })
    ).id
}