"use client"

import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { priceWithDiscount, formatCurrency } from "@/lib/format"
import { WhatsAppButton, whatsappCartLink } from "@/components/whatsapp-button"

export default function CartPage() {
  const { items, setQty, removeItem, clear } = useCart()
  const href = whatsappCartLink(items)
  const totals = items.reduce(
    (acc, i) => {
      const { discounted } = priceWithDiscount(i.price, i.discount)
      acc.qty += i.quantity
      acc.total += discounted * i.quantity
      return acc
    },
    { qty: 0, total: 0 },
  )

  return (
    <div className="py-6">
      <h1 className="mb-4 text-2xl font-bold">Your Cart</h1>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const { discounted, hasDiscount } = priceWithDiscount(item.price, item.discount)
              return (
                <div key={item.slug} className="flex gap-3 rounded-xl border p-3">
                  <div className="relative h-20 w-20 overflow-hidden rounded">
                    <Image
                      src={
                        item.imageUrl || `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(item.name)}`
                      }
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">@{item.slug}</div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeItem(item.slug)} aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
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
                          className="h-8 w-20"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <aside className="space-y-3 rounded-xl border p-4">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="flex items-center justify-between text-sm">
              <span>Items</span>
              <span>{totals.qty}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <WhatsAppButton href={href}>Order All on WhatsApp</WhatsAppButton>
              <Button variant="ghost" onClick={clear}>
                Clear Cart
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
