import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { CartSidebar } from "./cart-sidebar"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getAllCategories } from "@/lib/datocms"

export default async function Navbar() {
  const { allCategories } = await getAllCategories().catch(() => ({ allCategories: [] as any[] }))
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md"
            style={{ background: "linear-gradient(135deg,#F7941D,#FFD300)" }}
          >
            <span className="text-xs font-extrabold text-black">ZM</span>
          </div>
          <span className="text-base font-bold">ZM Gadgets</span>
        </Link>
        <form action="/" className="hidden min-w-0 flex-1 items-center gap-2 sm:flex">
          <div className="relative w-full max-w-xl">
            <Input name="q" placeholder="Search products..." className="pl-8" />
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </form>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <CartSidebar />
        </div>
      </div>
      <nav className="hidden border-t sm:block">
        <div className="container mx-auto flex items-center gap-4 overflow-x-auto px-4 py-2">
          {allCategories?.slice(0, 8).map((c: any) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
