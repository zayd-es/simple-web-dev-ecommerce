import { Nav, NavLink } from "@/components/Navbar"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Nav>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/products">Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 my-6 flex-1">
        {children}
      </div>
    </div>
  )
}