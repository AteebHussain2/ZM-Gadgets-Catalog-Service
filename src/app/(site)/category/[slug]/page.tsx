import { getProductsByCategory, getAllCategorySlugs } from "@/lib/datocms"
import CategoryPageClient from "./CategoryPageClient"
import type { Metadata } from "next"

export const dynamic = 'force-dynamic';
export const revalidate = 60

export async function generateStaticParams() {
  const { allCategories } = await getAllCategorySlugs().catch(() => ({ allCategories: [] as any[] }))
  return allCategories.map((c: any) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const data = await getProductsByCategory((await params).slug).catch(() => null)
  const name = data?.category?.name || (await params).slug.replace("-", " ")
  const desc = data?.category?.description || `Explore ${name} products at ZM Gadgets.`
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
  searchParams?: Promise<{ q?: string; sort?: string }>
}) {
  return <CategoryPageClient params={await params} searchParams={await searchParams} />
}
