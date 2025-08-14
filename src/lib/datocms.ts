const DATO_ENDPOINT = "https://graphql.datocms.com/"
const TOKEN = process.env.DATOCMS_READONLY_TOKEN

type GraphQLResponse<T> = {
  data?: T
  errors?: { message: string }[]
}

export async function fetchDato<T>(
  query: string,
  variables?: Record<string, any>,
  options?: { revalidate?: number },
): Promise<T> {
  const res = await fetch(DATO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    // ISR
    next: { revalidate: options?.revalidate ?? 60 },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`DatoCMS request failed: ${res.status} ${res.statusText} - ${text}`)
  }

  const json = (await res.json()) as GraphQLResponse<T>
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("; "))
  }
  if (!json.data) {
    throw new Error("DatoCMS returned no data")
  }
  return json.data
}

export const queries = {
  categories: `
    query Categories {
      allCategories(first: 100) {
        id
        name
        slug
        description
        thumbnail {
          url
        }
      }
    }
  `,
  featuredProducts: `
    query FeaturedProducts {
      allProducts(filter: { featured: { eq: true } }, first: 24) {
        id
        name
        slug
        price
        discount
        stockstatus
        description
        category {
          id
          name
          slug
        }
        images {
          url
        }
        featured
      }
    }
  `,
  productsByCategory: `
    query ProductsByCategory($slug: String) {
      allProducts(
        filter: { category: { slug: { eq: $slug } } }
        first: 200
      ) {
        id
        name
        slug
        price
        discount
        stockstatus
        description
        category {
          id
          name
          slug
        }
        images {
          url
        }
        featured
      }
      category(filter: { slug: { eq: $slug } }) {
        id
        name
        slug
        description
      }
    }
  `,
  productBySlug: `
    query ProductBySlug($slug: String) {
      product(filter: { slug: { eq: $slug } }) {
        id
        name
        slug
        price
        discount
        stockstatus
        description
        category {
          id
          name
          slug
        }
        images {
          url
        }
        featured
      }
    }
  `,
  allProductSlugs: `
    query AllProductSlugs {
      allProducts(first: 1000) {
        slug
      }
    }
  `,
  allCategorySlugs: `
    query AllCategorySlugs {
      allCategories(first: 1000) {
        slug
      }
    }
  `,
  productsBySlugs: `
    query ProductsBySlugs($slugs: [String!]) {
      allProducts(filter: { slug: { in: $slugs } }, first: 200) {
        id
        name
        slug
        price
        discount
        images {
          url
        }
      }
    }
  `,
}

export async function getAllCategories() {
  return fetchDato<{ allCategories: any[] }>(queries.categories)
}

export async function getFeaturedProducts() {
  return fetchDato<{ allProducts: any[] }>(queries.featuredProducts)
}

export async function getProductsByCategory(slug: string) {
  return fetchDato<{ allProducts: any[]; category: any | null }>(
    queries.productsByCategory,
    { slug }
  )
}

export async function getProductBySlug(slug: string) {
  return fetchDato<{ product: any | null }>(queries.productBySlug, { slug })
}

export async function getAllProductSlugs() {
  return fetchDato<{ allProducts: { slug: string }[] }>(queries.allProductSlugs)
}

export async function getAllCategorySlugs() {
  return fetchDato<{ allCategories: { slug: string }[] }>(
    queries.allCategorySlugs
  )
}

export async function getProductsBySlugs(slugs: string[]) {
  return fetchDato<{ allProducts: any[] }>(queries.productsBySlugs, { slugs })
}
