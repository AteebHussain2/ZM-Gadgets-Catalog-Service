"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { useState } from "react"

export function AddToCart({
  product,
  disabled = false,
}: {
  product: {
    id: string
    slug: string
    name: string
    price: number
    discount?: number | null
    imageUrl?: string | null
  }
  disabled?: boolean
}) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (disabled) return

    setIsAdding(true)
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        discount: product.discount ?? undefined,
        imageUrl: product.imageUrl ?? undefined,
      },
      quantity,
    )

    // Visual feedback
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <div className="flex-1 space-y-4">
      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={disabled}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="px-4 py-2 min-w-[3rem] text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => setQuantity(quantity + 1)}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding || disabled}
        className="w-full bg-gradient-to-r from-[#F7941D] to-[#FFD300] text-black font-semibold hover:from-[#E8850C] hover:to-[#F0C000] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        {disabled ? "Out of Stock" : isAdding ? "Adding..." : `Add ${quantity} to Cart`}
      </Button>
    </div>
  )
}
