import { Nav, NavLink } from "@/components/Navbar"

export const dynamic = "force-dynamic"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
        <NavLink href="/admin/discount-codes">Coupon</NavLink>
      </Nav>
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">{children}</main>
    </div>
  )
}