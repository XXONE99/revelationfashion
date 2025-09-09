"use client"
import Link from "next/link"
import { Phone, Mail } from "lucide-react"
import { useEffect, useState } from "react"

export function Footer() {
  const [logoUrl, setLogoUrl] = useState('/placeholder-logo.png')

  useEffect(() => {
    // Get logo from localStorage
    const updateLogo = () => {
      const settings = localStorage.getItem('app_settings')
      if (settings) {
        try {
          const parsedSettings = JSON.parse(settings)
          if (parsedSettings.logo_url) {
            setLogoUrl(parsedSettings.logo_url)
          }
        } catch (error) {
          console.error('Error parsing app settings:', error)
        }
      }
    }

    // Initial load
    updateLogo()

    // Listen for changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'app_settings_updated') {
        updateLogo()
      }
    })

    return () => {
      window.removeEventListener('storage', updateLogo)
    }
  }, [])

  return (
    <footer className="bg-gray-900 text-white py-12 mb-16 lg:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={logoUrl} alt="Revelation" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-bold text-white">REVELATION (Konveksi Bandung)</h3>
                <p className="text-sm text-emerald-400">Jasa Pembuatan Pakaian dan Seragam Profesional</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Spesialis pembuatan seragam kantor, seragam sekolah, dan pakaian kerja berkualitas tinggi. Melayani
              seluruh Indonesia dengan pengalaman lebih dari 10 tahun.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 transition-colors">
                  Seragam Kantor
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 transition-colors">
                  Seragam Sekolah
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 transition-colors">
                  Pakaian Kerja
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-500 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Kontak Kami</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-500" />
                <span>+62 813-1260-0281</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-500" />
                <span>revelation.fash@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 REVELATION (Konveksi Bandung). All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
