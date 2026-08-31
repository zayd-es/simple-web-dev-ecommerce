import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard"
import { Button } from "@/components/ui/button"
import db from "@/db/db"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import { Product } from "../generated/prisma"
import { cache } from "@/lib/cache"

const getMostPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: {
        isAvailableForPurchase: true,
        orders: { some: {} },
      },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    })
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
)

const getNewestProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    })
  },
  ["/", "getNewestProducts"],
  { revalidate: 60 * 60 * 24 }
)

export default function HomePage() {
  return (
    <main className="space-y-16 pb-12 pt-4">
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        }
      >
        <ProductGridSection
          title="Most Popular Assets"
          subtitle="Top-rated boilerplates and UI kits trusted by developers"
          productsFetcher={getMostPopularProducts}
        />
      </Suspense>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        }
      >
        <ProductGridSection
          title="Newest Releases"
          subtitle="Fresh components and tools added this week"
          productsFetcher={getNewestProducts}
        />
      </Suspense>
    </main>
  )
}

type ProductGridSectionProps = {
  title: string
  subtitle?: string
  productsFetcher: () => Promise<Product[]>
}

async function ProductGridSection({
  productsFetcher,
  title,
  subtitle,
}: ProductGridSectionProps) {
  const products = await productsFetcher()

  if (products.length === 0) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
          {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        <Button variant="ghost" className="self-start md:self-auto hover:bg-slate-100 text-slate-700 font-medium rounded-xl" asChild>
          <Link href="/products" className="flex items-center gap-2">
            <span>View All Assets</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  )
}