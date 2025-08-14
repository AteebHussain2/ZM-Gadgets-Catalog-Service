export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  thumbnail?: { url: string } | null
}

export type Product = {
  id: string
  name: string
  slug: string
  price: number
  discount?: number | null
  stockstatus?: boolean,
  description?: string | null
  category?: { id: string; name: string; slug: string } | null
  images?: { url: string }[]
  featured?: boolean | null
}

export type CartItem = {
  id: string
  name: string
  slug: string
  price: number
  discount?: number | null
  imageUrl?: string | null
  quantity: number
}
