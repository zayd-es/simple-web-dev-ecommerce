import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import db from "@/db/db"
import { formatCurrency } from "@/lib/formatters"
import PageHeader from "../_components/PageHeader"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Package, Mail, DollarSign, ShoppingBag } from "lucide-react"
import { DeleteDropDownItem } from "./_components/OrderActions"

function getOrders() {
  return db.order.findMany({
    select: {
      id: true,
      pricePaidInCents: true,
      product: { select: { name: true } },
      user: { select: { email: true } },
    },
    orderBy: { createdAt: "desc" },
  })
}

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <PageHeader>Sales History</PageHeader>
        <p className="text-sm text-slate-500 mt-1">Track completed customer purchases and order receipts.</p>
      </div>

      <OrdersTable />
    </div>
  )
}

async function OrdersTable() {
  const orders = await getOrders()

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
        <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 mb-3 text-slate-400">
          <ShoppingBag className="size-6" />
        </div>
        <p className="text-slate-900 font-semibold text-base">No sales found</p>
        <p className="text-slate-500 text-sm mt-1">When users make purchases, transactions will be listed here.</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <Table>
        <TableHeader className="bg-slate-50/80">
          <TableRow className="hover:bg-transparent border-slate-200/80">
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><Package className="size-3.5" /> Product</span>
            </TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><Mail className="size-3.5" /> Customer</span>
            </TableHead>
            <TableHead className="font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              <span className="flex items-center gap-1.5"><DollarSign className="size-3.5" /> Price Paid</span>
            </TableHead>
            <TableHead className="w-[60px] text-right font-bold text-[11px] tracking-wider uppercase text-slate-500 py-4">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map(order => (
            <TableRow key={order.id} className="transition-colors hover:bg-slate-50/60 border-slate-200/60">
              <TableCell className="font-semibold text-slate-900 py-4">
                {order.product.name}
              </TableCell>
              <TableCell className="font-medium text-slate-600 py-4">
                {order.user.email}
              </TableCell>
              <TableCell className="font-semibold text-slate-900 py-4">
                {formatCurrency(order.pricePaidInCents / 100)}
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
                    <DeleteDropDownItem id={order.id} />
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