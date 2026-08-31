import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { formatCurrency } from "@/lib/formatters"
import { ArrowRight, ShoppingBag } from "lucide-react"

type ProductCardProps = {
  id: string
  name: string
  priceInCents: number
  description: string
  imagePath: string
}

export function ProductCard({
  id,
  name,
  priceInCents,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={imagePath}
          fill
          alt={name}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full border border-slate-200/60 bg-white/90 px-3 py-1 text-sm font-bold text-slate-900 shadow-sm backdrop-blur-md">
          {formatCurrency(priceInCents / 100)}
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <CardTitle className="line-clamp-1 text-xl font-bold tracking-tight text-slate-900 group-hover:text-slate-800">
          {name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow px-5 py-2">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-3">
        <Button
          asChild
          size="lg"
          className="w-full justify-between rounded-xl bg-slate-950 font-semibold text-white shadow-md transition-all hover:bg-slate-800"
        >
          <Link href={`/products/${id}/purchase`}>
            <span>Get Asset</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm animate-pulse">
      <div className="aspect-video w-full bg-slate-200" />
      <CardHeader className="p-5 pb-2">
        <div className="h-6 w-3/4 rounded-lg bg-slate-200" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2 px-5 py-2">
        <div className="h-4 w-full rounded-md bg-slate-200" />
        <div className="h-4 w-2/3 rounded-md bg-slate-200" />
      </CardContent>
      <CardFooter className="p-5 pt-3">
        <div className="h-11 w-full rounded-xl bg-slate-200" />
      </CardFooter>
    </Card>
  )
}