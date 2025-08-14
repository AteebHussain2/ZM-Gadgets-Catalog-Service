"use client"

import { ProductList } from "@/components/product-list"
import { Badge } from "@/components/ui/badge"
import { Package, Filter } from "lucide-react"
import { useEffect, useState } from "react"

export default function CategoryPageClient({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { q?: string; sort?: string }
}) {
  const q = (searchParams?.q || "").toLowerCase().trim()
  const sortBy = searchParams?.sort || "newest"

  const [allProducts, setAllProducts] = useState<any[]>([])
  const [category, setCategory] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch data from our API route
        const response = await fetch(`/api/category/${params.slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch category data")
        }

        const data = await response.json()
        setAllProducts(data.allProducts || [])
        setCategory(data.category)
      } catch (error) {
        console.error("Error fetching category data:", error)
        setError("Failed to load category data")
        setAllProducts([])
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  // Filter products based on search
  const filteredProducts = q
    ? allProducts.filter((p: any) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    : allProducts

  // Sort products
  const sortedProducts = [...filteredProducts]
  switch (sortBy) {
    case "price-low":
      sortedProducts.sort((a: any, b: any) => a.price - b.price)
      break
    case "price-high":
      sortedProducts.sort((a: any, b: any) => b.price - a.price)
      break
    case "name":
      sortedProducts.sort((a: any, b: any) => a.name.localeCompare(b.name))
      break
    default: // newest
      // Already sorted by _createdAt_DESC in query
      break
  }

  const inStockCount = sortedProducts.filter((p: any) => p.stockstatus === true).length
  const featuredCount = sortedProducts.filter((p: any) => p.featured).length

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F7941D] border-t-transparent mx-auto mb-4" />
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center space-y-4">
        <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Error Loading Category</h3>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-6">
      {/* Category Header */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground">
          <span>Home</span> / <span className="text-foreground">{category?.name || params.slug.replace("-", " ")}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Package className="h-10 w-10 text-[#F7941D]" />
              {category?.name || params.slug.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </h1>
            {category?.description && <p className="text-lg text-muted-foreground max-w-2xl">{category.description}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              {sortedProducts.length} Products
            </Badge>
            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {inStockCount} In Stock
            </Badge>
            {featuredCount > 0 && (
              <Badge className="bg-gradient-to-r from-[#F7941D] to-[#FFD300] text-black">
                {featuredCount} Featured
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-muted/30 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Showing {sortedProducts.length} products</span>
          {q && <span>for "{q}"</span>}
        </div>

        <div className="flex gap-2">
          <select
            className="px-3 py-2 text-sm border rounded-lg bg-background"
            defaultValue={sortBy}
            onChange={(e) => {
              const url = new URL(window.location.href)
              url.searchParams.set("sort", e.target.value)
              window.location.href = url.toString()
            }}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <ProductList products={sortedProducts} />
      ) : (
        <div className="text-center py-20 space-y-4">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50" />
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Products Found</h3>
            <p className="text-muted-foreground">
              {q ? `No products match "${q}" in this category.` : "This category doesn't have any products yet."}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
