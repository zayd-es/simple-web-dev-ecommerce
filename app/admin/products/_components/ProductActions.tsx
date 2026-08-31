"use client"
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React, { useTransition } from 'react'
import { DeleteProduct, ToggleProductAvailability } from '../../_actions/product';

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) { 
    const[isPending,startTransaction]=useTransition()
    
    const handleToggle=()=>{
            startTransaction(async()=>{
                await ToggleProductAvailability(id,!isAvailableForPurchase)
            })

    }
    return (
        <DropdownMenuItem disabled={isPending} onClick={handleToggle}>
{isAvailableForPurchase?"Deactivate":"Activate"}
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
  const [isPending, startTransaction] = useTransition()

  const handleDelete = () => {
    startTransaction(async () => {
      await DeleteProduct(id)
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

