"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { priceWithDiscount, formatCurrency } from "@/lib/format"
import type { Product } from "@/lib/types"
import { useCart } from "./cart-provider"
import { WhatsAppButton, whatsappProductLink } from "./whatsapp-button"
import { Heart, ShoppingCart, Star } from "lucide-react"

export function ProductCard({
  product,
}: {
  product: Product
}) {
  const { addItem } = useCart()
  const { discounted, hasDiscount, pct } = priceWithDiscount(product.price, product.discount)

  const imageUrl = product.images?.[0]?.url

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square w-full overflow-hidden">
        <Image
          src={imageUrl || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {hasDiscount && (
          <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#FF4F81] to-[#FF6B9D] px-3 py-1 text-xs font-bold text-white shadow-lg">
            -{pct}% OFF
          </div>
        )}
        {product.featured && (
          <div className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFD300] p-2 shadow-lg">
            <Star className="h-3 w-3 text-black fill-current" />
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 bottom-3 opacity-0 transition-all duration-300 group-hover:opacity-100 bg-white/90 hover:bg-white h-8 w-8"
        >
          <Heart className="h-3 w-3" />
        </Button>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Link
            href={`/product/${product.slug}`}
            className="line-clamp-2 font-semibold text-sm hover:text-[#F7941D] transition-colors"
          >
            {product.name}
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-[#F7941D]">{formatCurrency(discounted)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`text-xs font-medium ${product.stockstatus ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
          >
            {product.stockstatus ? "✓ In Stock" : "✗ Out of Stock"}
          </Badge>

          {product.category && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-xs text-muted-foreground hover:text-[#F7941D] transition-colors"
            >
              {product.category.name}
            </Link>
          )}
        </div>

        {/* Changed to flex-col for better mobile experience */}
        <div className="mt-auto flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addItem(
                {
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  discount: product.discount ?? undefined,
                  imageUrl,
                },
                1,
              )
            }
            className="w-full text-xs hover:bg-[#F7941D] hover:text-white hover:border-[#F7941D] transition-all h-8"
            disabled={!product.stockstatus}
          >
            <ShoppingCart className="mr-1 h-3 w-3" />
            Add to Cart
          </Button>

          <WhatsAppButton href={whatsappProductLink(product)} className="w-full text-xs h-8">
            WhatsApp
          </WhatsAppButton>
        </div>
      </div>
    </div>
  )
}
