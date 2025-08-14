"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"

export function AddToCart({
  product,
}: {
  product: {
    id: string
    slug: string
    name: string
    price: number
    discount?: number | null
    imageUrl?: string | null
  }
}) {
  const { addItem } = useCart()
  return (
    <Button
      variant="outline"
      onClick={() =>
        addItem(
          {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            discount: product.discount ?? undefined,
            imageUrl: product.imageUrl ?? undefined,
          },
          1,
        )
      }
    >
      Add to Cart
    </Button>
  )
}
