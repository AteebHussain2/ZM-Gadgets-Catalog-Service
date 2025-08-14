import { getAllCategories, getFeaturedProducts } from "@/lib/datocms"
import { CategoryMenu } from "@/components/category-menu"
import { ProductList } from "@/components/product-list"
import { WhatsAppButton } from "@/components/whatsapp-button"
import Link from "next/link"

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>
}) {
  const q = ((await searchParams)?.q || "").toLowerCase().trim()
  const [{ allCategories }, { allProducts }] = await Promise.all([
    getAllCategories().catch(() => ({ allCategories: [] as any[] })),
    getFeaturedProducts().catch(() => ({ allProducts: [] as any[] })),
  ])

  const products = q ? allProducts.filter((p: any) => p.name.toLowerCase().includes(q)) : allProducts

  return (
    <div className="space-y-10 py-6">
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-tr from-[#F7941D]/15 via-[#FFD300]/15 to-[#00AEEF]/15 p-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl">Empower Your Digital Lifestyle</h1>
          <p className="mt-3 text-muted-foreground">
            Discover curated mobiles, laptops, accessories, and exclusive deals from ZM Gadgets.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="#featured" className="rounded-md bg-[#F7941D] px-4 py-2 font-semibold text-black">
              Explore Featured
            </Link>
            <WhatsAppButton href="https://wa.me/923062464217?text=Hi%20I%20want%20to%20know%20more%20about%20ZM%20Gadgets">
              Chat on WhatsApp
            </WhatsAppButton>
          </div>
        </div>
      </section>

      <section id="categories" className="space-y-3">
        <CategoryMenu categories={allCategories} />
      </section>

      <section id="featured" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured Products</h2>
          <Link href="/category/deals" className="text-sm text-primary hover:underline">
            View Deals
          </Link>
        </div>
        <ProductList products={products} />
      </section>
    </div>
  )
}
