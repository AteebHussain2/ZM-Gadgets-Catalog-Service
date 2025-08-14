import type { Product } from "@/lib/types"
import { ProductCard } from "./product-card"

export function ProductList({ products = [] as Product[] }) {
  if (!products?.length) {
    return <div className="text-sm text-muted-foreground">No products found.</div>
  }
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
