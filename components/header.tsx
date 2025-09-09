"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Menu, X } from 'lucide-react'

export function Header() {
  // const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Halaman Utama" },
    { href: "/tentang-kami", label: "Tentang Kami" },
    { href: "/portofolio", label: "Portofolio" },
    { href: "/client-proyek", label: "Client & Proyek" },
    { href: "/testimoni", label: "Testimoni" },
    { href: "/katalog-warna", label: "Katalog Warna" },
    { href: "/faq", label: "FAQ" },
    { href: "/kontak", label: "Kontak" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src={typeof window !== 'undefined' && localStorage.getItem('app_logo_url') ? localStorage.getItem('app_logo_url') as string : '/placeholder-logo.png'} alt="Revelation" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">REVELATION (Konveksi Bandung)</h1>
              <p className="text-xs text-emerald-600">Jasa Pembuatan Pakaian dan Seragam</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors text-sm font-medium ${
                  isActive(item.href)
                    ? "text-emerald-600 border-b-2 border-emerald-600 pb-1"
                    : "text-gray-700 hover:text-emerald-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile navigation is now handled by the bottom navbar component */}
        </div>
      </div>
    </header>
  )
}
