import { Facebook, Instagram, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="mt-12 border-t">
      <div className="container mx-auto grid gap-6 px-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ background: "linear-gradient(135deg,#00AEEF,#FF4F81)" }}
            >
              <span className="text-xs font-extrabold text-black">ZM</span>
            </div>
            <span className="text-base font-bold">ZM Gadgets</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Empower Your Digital Lifestyle</p>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <ul className="mt-2 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> <a href="tel:+923062464217">+92 306 246 4217</a>
            </li>
            <li className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />{" "}
              <a href="https://wa.me/923062464217" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Follow</h3>
          <div className="mt-2 flex gap-3">
            <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 border-t py-4 text-center text-sm text-muted-foreground">
        <span>© {new Date().getFullYear()} BrandNest</span>
        <span className="text-primary">Developed with <span className="text-rose-400 dark:text-rose-600">❤</span> by <a className="" href="https://brandnest.vercel.app/"><span className="font-bold text-blue-400 dark:text-blue-600">Brand</span><span className="font-bold text-yellow-400 dark:text-yellow-600">Nest</span></a></span>
      </div>
    </footer>
  )
}
