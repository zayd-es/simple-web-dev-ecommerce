"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/formatters'
import React, { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { AddProduct, UpdateProduct } from '../../_actions/product'
import { Product } from '@/app/generated/prisma'
import Image from 'next/image'

const ProductForm = ({ product }: { product?: Product | null }) => {
  const [error, action] = useActionState(
    product == null ? AddProduct : UpdateProduct.bind(null, product.id),
    {}
  )
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents)
  
  // State د المعاينة الحالية د الصورة
  const [previewImage, setPreviewImage] = useState<string | null>(product?.imagePath ?? null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card border border-border rounded-xl shadow-sm my-6">
      <form action={action} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">Name</Label>
          <Input 
            type="text" 
            name="name" 
            id="name" 
            placeholder="e.g. Premium UI Kit" 
            className="focus-visible:ring-2"
            defaultValue={product?.name ?? ""}
          />
          {error?.name && (
            <div className="text-xs font-medium text-destructive pt-1">
              {error.name[0]}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceInCents" className="text-sm font-semibold">Price In Cents</Label>
          <Input 
            type="number"
            name="priceInCents" 
            id="priceInCents"
            value={priceInCents ?? ""}
            onChange={e => setPriceInCents(Number(e.target.value) || undefined)}
            placeholder="e.g. 2999"
            className="focus-visible:ring-2"
          />
          <div className="text-xs font-medium text-muted-foreground pt-1">
            {formatCurrency((priceInCents || 0) / 100)}
          </div>
          {error?.priceInCents && (
            <div className="text-xs font-medium text-destructive pt-1">
              {error.priceInCents[0]}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            rows={4}
            placeholder="Provide a detailed description of the product..." 
            className="resize-none focus-visible:ring-2"
            defaultValue={product?.description ?? ""}
          />
          {error?.description && (
            <div className="text-xs font-medium text-destructive pt-1">
              {error.description[0]}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="file" className="text-sm font-semibold">File</Label>
            <Input 
              type="file" 
              id="file" 
              name="file" 
              className="cursor-pointer file:text-foreground file:font-medium"
              required={product == null}
            />
            {product != null && (
              <div className="text-xs text-muted-foreground break-all pt-1">
                {product.filePath}
              </div>
            )}
            {error?.file && (
              <div className="text-xs font-medium text-destructive pt-1">
                {error.file[0]}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-sm font-semibold">Image</Label>
            <Input 
              type="file" 
              id="image" 
              name="image" 
              className="cursor-pointer file:text-foreground file:font-medium"
              required={product == null}
              onChange={handleImageChange}
            />
            
            {previewImage != null && (
              <div className="mt-2 overflow-hidden rounded-lg border border-border w-fit">
                <Image 
                  src={previewImage} 
                  height="200" 
                  width="200" 
                  alt="Product Image" 
                  className="object-cover rounded-lg aspect-square"
                />
              </div>
            )}

            {error?.image && (
              <div className="text-xs font-medium text-destructive pt-1">
                {error.image[0]}
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto px-8 font-semibold">
      {pending ? "Saving..." : "Save Product"}
    </Button>
  )
}

export default ProductForm