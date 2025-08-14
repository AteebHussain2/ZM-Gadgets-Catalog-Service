import Image from "next/image"
import Link from "next/link"
import type { Category } from "@/lib/types"

export function CategoryMenu({
  categories = [] as Category[],
}: {
  categories?: Category[]
}) {
  if (!categories?.length) return null
  return (
    <div className="not-prose">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Browse Categories</h2>
        <Link href="/#categories" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group relative flex min-w-[140px] flex-col overflow-hidden rounded-xl border"
          >
            <div className="relative h-24 w-full">
              <Image
                src={
                  c.thumbnail?.url ||
                  `/placeholder.svg?height=96&width=160&query=${encodeURIComponent(c.name + " category")}`
                }
                alt={c.name}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-2 text-sm font-medium">{c.name}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
