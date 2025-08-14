import { Badge } from "@/components/ui/badge"
import { getAllProductSlugs, getProductBySlug, getRelatedProducts } from "@/lib/datocms"
import { formatCurrency, priceWithDiscount } from "@/lib/format"
import type { Metadata } from "next"
import { WhatsAppButton, whatsappProductLink } from "@/components/whatsapp-button"
import { Suspense } from "react"
import { AddToCart } from "./widgets"
import { ImageGallery } from "./image-gallery"
import { ProductList } from "@/components/product-list"
import { Separator } from "@/components/ui/separator"
import { Star, Shield, Truck, MessageCircle } from "lucide-react"

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
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
      </div>
    )
  }

  const { discounted, hasDiscount, pct } = priceWithDiscount(product.price, product.discount)
  const images: string[] = (product.images || []).map((i: any) => i.url)

  // Get related products using category ID
  const relatedProductsData = product.category?.id
    ? await getRelatedProducts(product.category.id, product.slug).catch(() => ({ allProducts: [] }))
    : { allProducts: [] }

  return (
    <div className="space-y-12 py-6">
      {/* Product Details */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ImageGallery images={images} productName={product.name} hasDiscount={hasDiscount} discountPct={pct} />

        <div className="space-y-6">
          {/* Breadcrumb */}
          {product.category && (
            <div className="text-sm text-muted-foreground">
              <span>Home</span> / <span>{product.category.name}</span> /{" "}
              <span className="text-foreground">{product.name}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {product.featured && (
                <Badge className="bg-gradient-to-r from-[#F7941D] to-[#FFD300] text-black">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  Featured
                </Badge>
              )}
              <Badge
                variant="secondary"
                className={`${product.stockstatus ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}
              >
                {product.stockstatus ? "✓ In Stock" : "✗ Out of Stock"}
              </Badge>
            </div>

            <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-[#F7941D]">{formatCurrency(discounted)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                  <Badge className="bg-[#FF4F81] text-white">Save {pct}%</Badge>
                </>
              )}
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="text-center space-y-1">
              <Shield className="h-6 w-6 mx-auto text-[#F7941D]" />
              <p className="text-xs font-medium">Warranty</p>
            </div>
            <div className="text-center space-y-1">
              <Truck className="h-6 w-6 mx-auto text-[#00AEEF]" />
              <p className="text-xs font-medium">Fast Delivery</p>
            </div>
            <div className="text-center space-y-1">
              <MessageCircle className="h-6 w-6 mx-auto text-[#25D366]" />
              <p className="text-xs font-medium">24/7 Support</p>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Suspense fallback={null}>
                <AddToCart
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    discount: product.discount,
                    imageUrl: images[0] || null,
                  }}
                  disabled={!product.stockstatus}
                />
              </Suspense>

              <WhatsAppButton href={whatsappProductLink(product)} className="flex-1">
                Order via WhatsApp
              </WhatsAppButton>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              💬 Get instant support and product details via WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProductsData.allProducts.length > 0 && (
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">You Might Also Like</h2>
            <p className="text-muted-foreground">Similar products in {product.category?.name}</p>
          </div>
          <ProductList products={relatedProductsData.allProducts} />
        </section>
      )}
    </div>
  )
}
