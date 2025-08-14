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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="relative aspect-square w-full overflow-hidden">
              <Image
                src={
                  c.thumbnail?.url ||
                  `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(c.name + " category") || "/placeholder.svg"}`
                }
                alt={c.name}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-semibold text-white text-sm">{c.name}</h3>
                {c.description && <p className="text-xs text-white/80 line-clamp-2 mt-1">{c.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
