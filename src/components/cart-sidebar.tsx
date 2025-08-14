"use client"

import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Trash2, ShoppingCart } from "lucide-react"
import { useCart } from "./cart-provider"
import { formatCurrency, priceWithDiscount } from "@/lib/format"
import { whatsappCartLink, WhatsAppButton } from "./whatsapp-button"
import { Input } from "@/components/ui/input"

export function CartSidebar() {
  const { items, removeItem, setQty, count } = useCart()
  const href = whatsappCartLink(items)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Open cart">
          <ShoppingCart className="h-4 w-4" />
          <span className="sr-only">Cart</span>
          {count > 0 && (
            <span className="absolute right-2 top-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#F7941D] px-1 text-[10px] font-bold text-black">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[90vw] sm:w-[500px]">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100vh-10rem)] flex-col">
          <div className="flex-1 space-y-4 overflow-auto p-2">
            {items.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
            {items.map((item) => {
              const { discounted, hasDiscount } = priceWithDiscount(item.price, item.discount)
              return (
                <div key={item.slug} className="flex gap-3 rounded-md border p-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded">
                    <Image
                      src={item.imageUrl || `/placeholder.svg?height=64&width=64&query=product image for ${item.name}`}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <div className="text-xs text-muted-foreground">@{item.slug}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.slug)} aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-semibold">{formatCurrency(discounted)}</span>
                        {hasDiscount && (
                          <span className="ml-2 text-xs text-muted-foreground line-through">
                            {formatCurrency(item.price)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Qty</span>
                        <Input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) => setQty(item.slug, Number(e.target.value))}
                          className="h-8 w-16"
                          aria-label={`Quantity for ${item.name}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 p-4">
            <WhatsAppButton href={href}>Order All on WhatsApp</WhatsAppButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
