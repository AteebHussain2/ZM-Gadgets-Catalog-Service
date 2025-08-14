import { getProductsByCategory, getAllCategorySlugs } from "@/lib/datocms"
import { ProductList } from "@/components/product-list"
import type { Metadata } from "next"

export const revalidate = 60

export async function generateStaticParams() {
  const { allCategories } = await getAllCategorySlugs().catch(() => ({ allCategories: [] as any[] }))
  return allCategories.map((c: any) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProductsByCategory(params.slug).catch(() => null)
  const name = data?.category?.name || params.slug
  const desc = data?.category?.description || `Explore ${name} at ZM Gadgets.`
  return {
    title: `${name} — ZM Gadgets`,
    description: desc,
    openGraph: { title: `${name} — ZM Gadgets`, description: desc },
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams?: Promise<{ q?: string }>
}) {
  const q = ((await searchParams)?.q || "").toLowerCase().trim()
  const { allProducts, category } = await getProductsByCategory((await params).slug).catch(() => ({
    allProducts: [] as any[],
    category: null as any,
  }))

  const products = q ? allProducts.filter((p: any) => p.name.toLowerCase().includes(q)) : allProducts

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold">{category?.name || (await params).slug}</h1>
        {category?.description && <p className="text-muted-foreground">{category.description}</p>}
      </div>
      <ProductList products={products} />
    </div>
  )
}
