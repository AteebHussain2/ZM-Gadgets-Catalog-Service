import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { CartProvider } from "@/components/cart-provider"

export const metadata: Metadata = {
  title: "ZM Gadgets — Empower Your Digital Lifestyle",
  description: "Explore mobiles, laptops, and accessories at ZM Gadgets.",
  openGraph: {
    title: "ZM Gadgets",
    description: "Empower Your Digital Lifestyle",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZM Gadgets",
    description: "Empower Your Digital Lifestyle",
  },
}

export const revalidate = 60

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <main className="container mx-auto px-4">{children}</main>
            <Footer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
