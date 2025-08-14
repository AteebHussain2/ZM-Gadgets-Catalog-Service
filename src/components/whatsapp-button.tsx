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
  price: number
  discount?: number | null
}) {
  const { discounted } = priceWithDiscount(product.price, product.discount)
  const text = `Hi I am interested in the product: ${product.name} - ${formatCurrency(discounted)}`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${enc(text)}`
}

export function whatsappCartLink(items: CartItem[]) {
  const lines = items.map((i) => {
    const { discounted } = priceWithDiscount(i.price, i.discount)
    return `- ${i.name} ${formatCurrency(discounted)} x ${i.quantity}`
  })
  const total = items.reduce((sum, i) => {
    const { discounted } = priceWithDiscount(i.price, i.discount)
    return sum + discounted * i.quantity
  }, 0)
  const text = `Hi I want to order:\n${lines.join("\n")}\n\nTotal: ${formatCurrency(total)}`
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
    <Button asChild className={className} style={{ backgroundColor: "#25D366", color: "#000" }}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="h-4 w-4" />
        {children ?? "Order on WhatsApp"}
      </a>
    </Button>
  )
}
