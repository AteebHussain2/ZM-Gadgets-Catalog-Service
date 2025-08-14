import { WhatsAppButton, whatsappProductLink } from "@/components/whatsapp-button";
import { getAllProductSlugs, getProductBySlug } from "@/lib/datocms";
import { formatCurrency, priceWithDiscount } from "@/lib/format";
import { ImageGallery } from "@/components/image-gallery";
import { Badge } from "@/components/ui/badge";
import { AddToCart } from "./widgets";
import type { Metadata } from "next";
import { Suspense } from "react";

export const revalidate = 60

export async function generateStaticParams() {
  const { allProducts } = await getAllProductSlugs().catch(() => ({ allProducts: [] as any[] }))
  return allProducts.map((p: any) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProductBySlug(params.slug).catch(() => null)
  const name = data?.product?.name || params.slug
  const desc = data?.product?.description || `Buy ${name} at ZM Gadgets`
  return {
    title: `${name} — ZM Gadgets`,
    description: desc,
    openGraph: { title: `${name} — ZM Gadgets`, description: desc },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const { product } = await getProductBySlug(params.slug).catch(() => ({ product: null as any }))
  if (!product) {
    return <div className="py-10 text-sm text-muted-foreground">Product not found.</div>
  }

  const { discounted, hasDiscount, pct } = priceWithDiscount(product.price, product.discount)
  const images: string[] = (product.images || []).map((i: any) => i.url)

  return (
    <div className="grid gap-8 py-6 md:grid-cols-2">
      <ImageGallery images={images} productName={product.name} hasDiscount={hasDiscount} discountPct={pct} />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-extrabold">{formatCurrency(discounted)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.price)}</span>
          )}
          <Badge
            variant="secondary"
            className={`text-xs ${!product.stockStatus ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/15 text-amber-600 dark:text-amber-400"}`}
          >
            {!product.stockStatus ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>
        {product.description && <p className="text-sm text-muted-foreground">{product.description}</p>}
        <div className="flex gap-2">
          <WhatsAppButton href={whatsappProductLink(product)}>Order This Product on WhatsApp</WhatsAppButton>
          <Suspense fallback={null}>
            {/* Client Add to Cart button */}
            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                discount: product.discount,
                imageUrl: images[0] || null,
              }}
            />
          </Suspense>
        </div>
      </div>
    </div >
  )
}
