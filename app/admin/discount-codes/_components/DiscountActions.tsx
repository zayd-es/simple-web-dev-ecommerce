"use client"

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteDiscountCode, toggleDiscountCodeActive } from '../../_actions/discountCodes'

export function ActiveToggleDropdownItem({
  id,
  isActive,
}: {
  id: string
  isActive: boolean
}) { 
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
    
  const handleToggle = () => {
    startTransition(async () => {
      await toggleDiscountCodeActive(id, !isActive)
      router.refresh() 
    })
  }

  return (
    <DropdownMenuItem disabled={isPending} onClick={handleToggle}>
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  )
}

export function DeleteDropDownItem({
  id,
  disabled,
}: {
  id: string
  disabled: boolean
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteDiscountCode(id)
      router.refresh() 
    })
  }

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={handleDelete}
    >
      Delete
    </DropdownMenuItem>
  )
}