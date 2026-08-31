import React from 'react'
import PageHeader from '../../../_components/PageHeader'
import ProductForm from '../../_components/ProductForm'
import db from "@/db/db"

const EditProductPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params

  const product = await db.product.findUnique({
    where: { id },
  })

  return (
    <div>
      <PageHeader>Edit Product</PageHeader>
      <ProductForm product={product} />
    </div>
  )
}

export default EditProductPage