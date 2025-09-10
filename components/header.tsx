"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppSettings } from "@/hooks/useAppSettings"

export function Header() {
  const pathname = usePathname()
  const { appSettings, isLoading, error } = useAppSettings()

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

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
              </div>
            </div>
            <div className="hidden lg:flex space-x-8">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </header>
    )
  }

  if (error) {
    console.error('❌ [HEADER] Error loading app settings:', error)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img 
                src={appSettings.logo_url || '/placeholder-logo.png'} 
                alt={appSettings.app_name || 'Revelation'} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  console.error('❌ [HEADER] Failed to load logo:', appSettings.logo_url);
                  e.currentTarget.src = '/placeholder-logo.png';
                }}
              />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">
                {appSettings.app_name || 'REVELATION (Konveksi Bandung)'}
              </h1>
              <p className="text-xs text-emerald-600">
                {appSettings.app_subtitle || 'Jasa Pembuatan Pakaian dan Seragam'}
              </p>
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
