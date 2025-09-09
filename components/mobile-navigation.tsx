"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, Briefcase, Users, Star, Palette, Phone, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePWAInstall } from "@/hooks/use-pwa-install"

export function MobileNavigation() {
  const pathname = usePathname()
  const { canInstall, installApp } = usePWAInstall()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/tentang-kami", icon: User, label: "About" },
    { href: "/portofolio", icon: Briefcase, label: "Portfolio" },
    { href: "/client-proyek", icon: Users, label: "Clients" },
    { href: "/testimoni", icon: Star, label: "Reviews" },
    { href: "/katalog-warna", icon: Palette, label: "Colors" },
    { href: "/kontak", icon: Phone, label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className={cn("grid gap-1 px-2 py-2", canInstall ? "grid-cols-8" : "grid-cols-7")}>
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors",
                active ? "text-emerald-600 bg-emerald-50" : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50",
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
        
        {/* PWA Install Button */}
        {canInstall && (
          <button
            onClick={installApp}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors text-emerald-600 hover:bg-emerald-50"
          >
            <Download className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Install</span>
          </button>
        )}
      </div>
    </div>
  )
}
