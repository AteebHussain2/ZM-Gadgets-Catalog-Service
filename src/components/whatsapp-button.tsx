"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import type { CartItem } from "@/lib/types"
import { formatCurrency, priceWithDiscount } from "@/lib/format"

const WHATSAPP_NUMBER = "923062464217"

function enc(s: string) {
  return encodeURIComponent(s)
}

export function whatsappProductLink(product: {
  name: string
  slug: string
  price: number
  discount?: number | null
}) {
  const { discounted } = priceWithDiscount(product.price, product.discount)
  const productUrl = `${typeof window !== "undefined" ? window.location.origin : "https://zm-gadgets.com"}/product/${product.slug}`
  const text = `Hi! I'm interested in this product:\n\n*${product.name}*\nPrice: ${formatCurrency(discounted)}\n\nProduct Link: ${productUrl}\n\nCan you provide more details?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`
}

export function whatsappCartLink(items: CartItem[]) {
  const lines = items.map((i) => {
    const { discounted } = priceWithDiscount(i.price, i.discount)
    return `• ${i.name} - ${formatCurrency(discounted)} x ${i.quantity}`
  })
  const total = items.reduce((sum, i) => {
    const { discounted } = priceWithDiscount(i.price, i.discount)
    return sum + discounted * i.quantity
  }, 0)
  const text = `Hi! I want to place an order:\n\n${lines.join("\n")}\n\n*Total: ${formatCurrency(total)}*\n\nPlease confirm availability and delivery details.`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`
}

export function WhatsAppButton({
  href,
  children,
  className,
}: {
  href: string
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Button asChild className={className} style={{ backgroundColor: "#25D366", color: "#fff" }}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="mr-2 h-4 w-4" />
        {children ?? "Order on WhatsApp"}
      </a>
    </Button>
  )
}
