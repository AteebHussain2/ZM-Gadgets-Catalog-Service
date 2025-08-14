import { getAllCategories, getFeaturedProducts, getAllProducts } from "@/lib/datocms"
import { CategoryMenu } from "@/components/category-menu"
import { ProductList } from "@/components/product-list"
import { WhatsAppButton } from "@/components/whatsapp-button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Package } from "lucide-react"

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const q = ((await searchParams)?.q || "").toLowerCase().trim()
  const [{ allCategories }, { allProducts: featuredProducts }, { allProducts }] = await Promise.all([
    getAllCategories().catch(() => ({ allCategories: [] as any[] })),
    getFeaturedProducts().catch(() => ({ allProducts: [] as any[] })),
    getAllProducts().catch(() => ({ allProducts: [] as any[] })),
  ])

  const searchResults = q
    ? allProducts.filter(
      (p: any) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.name.toLowerCase().includes(q),
    )
    : null

  const regularProducts = allProducts.filter((p: any) => !p.featured)

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F7941D]/20 via-[#FFD300]/20 to-[#00AEEF]/20 p-8 md:p-12">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-[#F7941D] text-black font-semibold">
              <Sparkles className="mr-1 h-3 w-3" />
              Premium Quality
            </Badge>
            <Badge variant="outline" className="border-[#00AEEF] text-[#00AEEF]">
              Fast Delivery
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-[#F7941D] to-[#00AEEF] bg-clip-text text-transparent">
            Empower Your Digital Lifestyle
          </h1>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
            Discover premium china made gadgets, home appliances, cosmetics, and exclusive deals. Quality products
            with unbeatable prices and instant online ordering.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="#featured"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFD300] px-8 py-4 font-bold text-black shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <TrendingUp className="h-5 w-5" />
              Explore Featured
            </Link>

            <WhatsAppButton href="https://wa.me/923062464217?text=Hi%20I%20want%20to%20know%20more%20about%20ZM%20Gadgets">
              <Package className="mr-2 h-4 w-4" />
              Get Instant Quote
            </WhatsAppButton>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-[#F7941D]/30 to-[#FFD300]/30 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-gradient-to-br from-[#00AEEF]/30 to-[#FF4F81]/30 blur-3xl"></div>
      </section>

      {/* Search Results */}
      {searchResults && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results for "{q}"</h2>
            <Badge variant="outline">{searchResults.length} products found</Badge>
          </div>
          <ProductList products={searchResults} />
        </section>
      )}

      {/* Categories */}
      {!searchResults && (
        <section id="categories" className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          <CategoryMenu categories={allCategories} />
        </section>
      )}

      {/* Featured Products */}
      {!searchResults && featuredProducts.length > 0 && (
        <section id="featured" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-[#F7941D]" />
                Featured Products
              </h2>
              <p className="text-muted-foreground">Hand-picked premium products just for you</p>
            </div>
            <Link href="/category/deals" className="text-sm text-[#F7941D] hover:underline font-medium">
              View All Deals →
            </Link>
          </div>
          <ProductList products={featuredProducts} />
        </section>
      )}

      {/* All Products */}
      {!searchResults && regularProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold">All Products</h2>
              <p className="text-muted-foreground">Explore our complete collection</p>
            </div>
            <Badge variant="outline">{regularProducts.length} products available</Badge>
          </div>
          <ProductList products={regularProducts} />
        </section>
      )}

      {/* Trust Indicators */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#F7941D] to-[#FFD300] flex items-center justify-center">
            <Package className="h-8 w-8 text-black" />
          </div>
          <h3 className="font-semibold">Premium Quality</h3>
          <p className="text-sm text-muted-foreground">Authentic products with warranty</p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FF4F81] flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold">Best Prices</h3>
          <p className="text-sm text-muted-foreground">Competitive pricing guaranteed</p>
        </div>

        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold">Instant Support</h3>
          <p className="text-sm text-muted-foreground">WhatsApp support 24/7</p>
        </div>
      </section>
    </div>
  )
}
