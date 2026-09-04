import React from 'react'
import PageHeader from '../_components/PageHeader'
import { Download, Edit, Globe, Infinity, Minus, MoreVertical, PackageCheck, Plus, ShoppingCart, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency, formatDateTime, formatDiscountCode, formatNumber } from '@/lib/formatters'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import db from "@/db/db"
import { Prisma } from '@/app/generated/prisma'
import { ActiveToggleDropdownItem, DeleteDropDownItem } from './_components/DiscountActions'

const WHERE_EXPIRED: Prisma.DiscountCodeWhereInput = {
  OR: [
    { limit: { not: null, lte: db.discountCode.fields.uses } },
    { expiresAt: { not: null, lte: new Date() } }
  ]
}

const SELECT_FIELD: Prisma.DiscountCodeSelect = {
  id: true,
  allProducts: true,
  code: true,
  discountAmount: true,
  discountType: true,
  expiresAt: true,
  limit: true,
  uses: true,
  isActive: true,
  product: { select: { name: true } },
  _count: { select: { orders: true } }
}

function getExpiredDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELD,
    where: WHERE_EXPIRED,
    orderBy: { createdAt: "asc" }
  })
}

function getUnexpiredDiscountCodes() {
  return db.discountCode.findMany({
    select: SELECT_FIELD,
    where: { NOT: WHERE_EXPIRED },
    orderBy: { createdAt: "asc" }
  })
}

export default async function DiscountPage() {
  const [expiredDiscountCodes, unexpiredDiscountCodes] = await Promise.all([
    getExpiredDiscountCodes(),
    getUnexpiredDiscountCodes()
  ])

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <PageHeader>Coupons</PageHeader>
          <p className="text-sm text-slate-500 mt-1">Manage store products, active status, and inventory links.</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm transition-all hover:shadow-md bg-slate-900 text-white hover:bg-slate-800">
          <Link href={"/admin/discount-codes/new"} className="flex items-center gap-2 font-medium">
            <Plus className="h-4 w-4" />
            Add Coupon
          </Link>
        </Button>
      </div>

      <DiscountCodesTable discountCodes={unexpiredDiscountCodes} canDeactivate />
      <div className="mt-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Expired Coupons</h2>
        <DiscountCodesTable discountCodes={expiredDiscountCodes} isInactive />
      </div>
    </div>
  )
}

type DiscountCodeTableProps = {
  discountCodes: Awaited<ReturnType<typeof getUnexpiredDiscountCodes>>
  isInactive?: boolean
  canDeactivate?: boolean
}

function DiscountCodesTable({
  discountCodes,
  isInactive = false,
  canDeactivate = false
}: DiscountCodeTableProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent border-slate-200/80">
            <TableHead className="w-[0px]">
              <span className="sr-only">Is Active</span>
            </TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Code</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Discount</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Expires</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Remaining Uses</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Orders</TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">Products</TableHead>
            <TableHead className="w-[0px] text-right">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {discountCodes.map(discountCode => (
            <TableRow key={discountCode.id} className="transition-colors hover:bg-slate-50/60 border-slate-200/60">
              <TableCell className="py-4">
                {discountCode.isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Inactive
                  </span>
                )}
              </TableCell>
              <TableCell className="font-semibold text-slate-900 py-4">{discountCode.code}</TableCell>
              <TableCell className="font-medium text-slate-600 py-4">{formatDiscountCode(discountCode)}</TableCell>
              <TableCell className="text-slate-600">
                {discountCode.expiresAt == null ? (
                  <Minus className="h-4 w-4 text-slate-400" />
                ) : (
                  formatDateTime(discountCode.expiresAt)
                )}
              </TableCell>
              <TableCell className="text-slate-600">
                {discountCode.limit == null ? (
                  <Infinity className="h-4 w-4 text-slate-400" />
                ) : (
                  formatNumber(discountCode.limit - discountCode.uses)
                )}
              </TableCell>
              <TableCell className="text-slate-600">
                {formatNumber(discountCode._count.orders)}
              </TableCell>
              <TableCell className="text-slate-600">
                {discountCode.allProducts ? (
                  <Globe className="h-4 w-4 text-slate-500" />
                ) : (
                  discountCode.product?.name
                )}
              </TableCell>
              <TableCell className="text-right py-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="h-4 w-4 text-slate-600" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent align="end" className="w-48 rounded-xl p-1.5 border-slate-200 shadow-lg bg-white">
                    {canDeactivate && (
                      <>
                        <ActiveToggleDropdownItem
                          id={discountCode.id}
                          isActive={discountCode.isActive}
                        />
                        <DropdownMenuSeparator className="my-1 border-slate-100" />
                      </>
                    )}
                    <DeleteDropDownItem
                      id={discountCode.id}
                      disabled={discountCode._count.orders > 0}
                    />
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