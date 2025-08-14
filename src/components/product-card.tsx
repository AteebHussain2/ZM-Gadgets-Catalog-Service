"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { priceWithDiscount, formatCurrency } from "@/lib/format"
import type { Product } from "@/lib/types"
import { useCart } from "./cart-provider"
import { WhatsAppButton, whatsappProductLink } from "./whatsapp-button"
import { CarrotIcon, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

export function ProductCard({
  product,
}: {
  product: Product
}) {
  const { addItem } = useCart()
  const { discounted, hasDiscount, pct } = priceWithDiscount(product.price, product.discount)

  const imageUrl = product.images?.[0]?.url

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square w-full overflow-hidden">
        <Image
          src={imageUrl || `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(product.name)}`}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {hasDiscount && (
          <div className="absolute left-2 top-2 rounded bg-[#FF4F81] px-2 py-1 text-xs font-bold text-white">
            {pct}% OFF
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <Link href={`/product/${product.slug}`} className="line-clamp-2 font-medium hover:underline">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold">{formatCurrency(discounted)}</span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className={`text-xs ${product.stockstatus ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}
          >
            {product.stockstatus ? "In Stock" : "Out Stock"}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success('Added Item to Cart!');
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
              }}
              className="text-xs"
            >
              <ShoppingCart />
            </Button>
            <WhatsAppButton href={whatsappProductLink(product)} className="text-xs">
              Contact
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </div>
  )
}
