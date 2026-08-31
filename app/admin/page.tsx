import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import db from "@/db/db"
import { formatCurrency, formatNumber } from "@/lib/formatters"

async function getUserData() {
  const [usercount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true }
    })
  ])
  
  return {
    usercount,
    averageValuePerUser: usercount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / usercount / 100
  }
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true
  })
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count
  }
}

async function getProductData() {
  const [activeProduct, inActiveProduct] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } })
  ])
  return { activeProduct, inActiveProduct }
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
  icon: React.ReactNode
}

function DashboardCard({ title, subtitle, body, icon }: DashboardCardProps) {
  return (
    <Card className="relative overflow-hidden border border-slate-200/80 bg-white p-1 transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            {icon}
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between gap-2">
          <p className="text-3xl font-extrabold tracking-tight text-slate-900">
            {body}
          </p>
          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
            {subtitle}
          </span>
        </div>
      </div>
    </Card>
  )
}

const AdminDashboard = async () => {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData()
  ])

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">Monitor store metrics, sales performance, and active assets.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard 
          title="Sales" 
          subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} 
          body={formatCurrency(salesData.amount)} 
          icon={(
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        />

        <DashboardCard 
          title="Customers" 
          subtitle={`${formatCurrency(userData.averageValuePerUser)} Avg`} 
          body={formatNumber(userData.usercount)} 
          icon={(
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          )}
        />

        <DashboardCard 
          title="Active Products" 
          subtitle={`${formatNumber(productData.inActiveProduct)} Inactive`} 
          body={formatNumber(productData.activeProduct)} 
          icon={(
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
        />
      </div>
    </div>
  )
}

export default AdminDashboard