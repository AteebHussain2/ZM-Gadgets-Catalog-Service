import { getProductsByCategory } from "@/lib/datocms"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const data = await getProductsByCategory((await params).slug)
    return NextResponse.json(data)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch category data", allProducts: [], category: null },
      { status: 500 },
    )
  }
}
