import React from 'react'
import PageHeader from '../../_components/PageHeader'
import db from "@/db/db"
import { DiscountCodeForm } from '../_components/DiscountCodeForm'
export default async function NewDiscountPage() {
  const products=await db.product.findMany({
    select:{id:true,
      name:true
    },
    orderBy:{name:"asc"}
  })
  return (
    <div>
      <PageHeader>
        Add Coupon
      </PageHeader>
      <DiscountCodeForm products={products} />
    </div>
  )
}