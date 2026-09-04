"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import React, { useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { addDiscountCode } from "../../_actions/discountCodes"
import { Checkbox } from "@/components/ui/checkbox"
import { DiscountCodeType } from "@/app/generated/prisma"

export function DiscountCodeForm({
  products,
}: {
  products: { name: string; id: string }[]
}) {
  const [data, action] = useActionState(addDiscountCode as any, {} as any)
  const error = data

  const [allProducts, setAllProducts] = useState(true)
  const today = new Date()
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset())

  return (
    <form action={action} className="space-y-8">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input type="text" id="code" name="code" required />
        {error?.fieldErrors?.code && (
          <div className="text-destructive text-sm">
            {error.fieldErrors.code[0]}
          </div>
        )}
      </div>

      <div className="space-y-2 gap-8 flex items-baseline">
        <div className="space-y-2">
          <Label htmlFor="discountType">Discount Type</Label>
          <RadioGroup
            id="discountType"
            name="discountType"
            defaultValue={DiscountCodeType.PERCENTAGE}
          >
            <div className="flex gap-2 items-center">
              <RadioGroupItem
                id="percentage"
                value={DiscountCodeType.PERCENTAGE}
              />
              <Label htmlFor="percentage">Percentage</Label>
            </div>
            <div className="flex gap-2 items-center">
              <RadioGroupItem id="fixed" value={DiscountCodeType.FIXED} />
              <Label htmlFor="fixed">Fixed</Label>
            </div>
          </RadioGroup>
          {error?.fieldErrors?.discountType && (
            <div className="text-destructive text-sm">
              {error.fieldErrors.discountType[0]}
            </div>
          )}
        </div>

        <div className="space-y-2 flex-grow">
          <Label htmlFor="discountAmount">Discount Amount</Label>
          <Input
            type="number"
            id="discountAmount"
            name="discountAmount"
            required
          />
          {error?.fieldErrors?.discountAmount && (
            <div className="text-destructive text-sm">
              {error.fieldErrors.discountAmount[0]}
            </div>
          )}
        </div>
      </div>

      {/* Limit Input */}
      <div className="space-y-2">
        <Label htmlFor="limit">Limit</Label>
        <Input type="number" id="limit" name="limit" />
        <div className="text-muted-foreground text-xs">
          Leave blank for infinite uses
        </div>
        {error?.fieldErrors?.limit && (
          <div className="text-destructive text-sm">
            {error.fieldErrors.limit[0]}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expiration</Label>
        <Input
          type="datetime-local"
          id="expiresAt"
          name="expiresAt"
          className="w-max"
          min={today.toJSON().split(":").slice(0, -1).join(":")}
        />
        <div className="text-muted-foreground text-xs">
          Leave blank for no expiration
        </div>
        {error?.fieldErrors?.expiresAt && (
          <div className="text-destructive text-sm">
            {error.fieldErrors.expiresAt[0]}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label>Allowed Products</Label>

        <div className="flex gap-2 items-center">
          <Checkbox
            id="allProducts"
            checked={allProducts}
            onCheckedChange={(e) => setAllProducts(e === true)}
          />
          <input
            type="hidden"
            name="allProducts"
            value={allProducts.toString()}
          />
          <Label htmlFor="allProducts">All Products</Label>
        </div>

        {products.map((product) => (
          <div key={product.id} className="flex gap-2 items-center pl-4">
            <Checkbox
              id={product.id}
              name="productIds"
              disabled={allProducts}
              value={product.id}
            />
            <Label htmlFor={product.id}>{product.name}</Label>
          </div>
        ))}

        {error?.fieldErrors?.allProducts && (
          <div className="text-destructive text-sm">
            {error.fieldErrors.allProducts[0]}
          </div>
        )}
        {error?.fieldErrors?.productIds && (
          <div className="text-destructive text-sm">
            {error.fieldErrors.productIds[0]}
          </div>
        )}
      </div>

      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save"}
    </Button>
  )
}