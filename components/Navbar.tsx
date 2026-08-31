"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Nav({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Brand / Admin Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-slate-900 text-xs font-black text-white shadow-sm">
            ADM
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            Control Center
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {children}
        </nav>
      </div>
    </header>
  )
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  const isActive = pathname === props.href

  return (
    <Link
      {...props}
      className={cn(
        "inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200",
        isActive
          ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    />
  )
}