import React from 'react'
import PageHeader from '../_components/PageHeader'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import db from "@/db/db"
import { Download, Edit, MoreVertical, Plus, PackageCheck, Tag, ShoppingCart, Layers } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/formatters'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { ActiveToggleDropdownItem, DeleteDropDownItem } from './_components/ProductActions'

const AdminProductsPage = () => {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <PageHeader>Products Catalog</PageHeader>
          <p className="text-sm text-slate-500 mt-1">Manage store products, active status, and inventory links.</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm transition-all hover:shadow-md bg-slate-900 text-white hover:bg-slate-800">
          <Link href={"/admin/products/new"} className="flex items-center gap-2 font-medium">
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <ProductsTable />
    </div>
  )
}

export default AdminProductsPage

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { orders: true } } 
    },
    orderBy: { name: "asc" }
  })

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
        <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 mb-3 text-slate-400">
          <Layers className="size-6" />
        </div>
        <p className="text-slate-900 font-semibold text-base">No products found</p>
        <p className="text-slate-500 text-sm mt-1">Get started by creating your first product above.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent border-slate-200/80">
            <TableHead className="w-[140px] font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><PackageCheck className="size-3.5" /> Status</span>
            </TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Name</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><Tag className="size-3.5" /> Price</span>
            </TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><ShoppingCart className="size-3.5" /> Orders</span>
            </TableHead>
            <TableHead className="w-[60px] text-right font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              Actions
            </TableHead> 
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map(product => (
            <TableRow key={product.id} className="transition-colors hover:bg-slate-50/60 border-slate-200/60">
              <TableCell className="py-4">
                {product.isAvailableForPurchase ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Unavailable
                  </span>
                )}
              </TableCell>
              <TableCell className="font-semibold text-slate-900 py-4">{product.name}</TableCell>
              <TableCell className="font-medium text-slate-600 py-4">{formatCurrency(product.priceInCents / 100)}</TableCell>
              <TableCell className="font-medium text-slate-600 py-4">{formatNumber(product._count.orders)}</TableCell>
              <TableCell className="text-right py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 border-slate-200 shadow-lg bg-white">
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer transition-colors focus:bg-slate-100">
                      <a download href={`/admin/products/${product.id}/download`} className="flex items-center gap-2 text-slate-700">
                        <Download className="h-4 w-4 text-slate-400" />
                        Download Asset
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer transition-colors focus:bg-slate-100">
                      <Link href={`/admin/products/${product.id}/edit`} className="flex items-center gap-2 text-slate-700">
                        <Edit className="h-4 w-4 text-slate-400" />
                        Edit Product
                      </Link>
                    </DropdownMenuItem>
                    <ActiveToggleDropdownItem id={product.id} isAvailableForPurchase={product.isAvailableForPurchase}/>
                    <DropdownMenuSeparator className="my-1 border-slate-100" />
                    <DeleteDropDownItem id={product.id} disabled={product._count.orders > 0}/>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}