import React, { ReactNode } from "react"

type PageHeaderProps = {
  children: ReactNode
  subtitle?: string
}

export default function PageHeader({ children, subtitle }: PageHeaderProps) {
  return (
    <div className="border-b border-slate-100 pb-5 mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
        {children}
      </h1>
      {subtitle && (
        <p className="mt-2 text-slate-500 text-sm md:text-base font-normal">
          {subtitle}
        </p>
      )}
    </div>
  )
}