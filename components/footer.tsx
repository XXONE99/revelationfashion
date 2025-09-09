"use client"
import Link from "next/link"
import { Phone, Mail, Instagram, Facebook } from "lucide-react"
import { useEffect, useState } from "react"

export function Footer() {
  const [logoUrl, setLogoUrl] = useState('/placeholder-logo.png')
  const [socialMedia, setSocialMedia] = useState({
    instagram: 'https://instagram.com/revelation_konveksi',
    tiktok: 'https://tiktok.com/@revelation_konveksi',
    facebook: 'https://facebook.com/revelation.konveksi'
  })

  useEffect(() => {
    // Get settings from localStorage
    const updateSettings = () => {
      const settings = localStorage.getItem('app_settings')
      if (settings) {
        try {
          const parsedSettings = JSON.parse(settings)
          if (parsedSettings.logo_url) {
            setLogoUrl(parsedSettings.logo_url)
          }
          if (parsedSettings.instagram_url) {
            setSocialMedia(prev => ({ ...prev, instagram: parsedSettings.instagram_url }))
          }
          if (parsedSettings.tiktok_url) {
            setSocialMedia(prev => ({ ...prev, tiktok: parsedSettings.tiktok_url }))
          }
          if (parsedSettings.facebook_url) {
            setSocialMedia(prev => ({ ...prev, facebook: parsedSettings.facebook_url }))
          }
        } catch (error) {
          console.error('Error parsing app settings:', error)
        }
      }
    }

    // Initial load
    updateSettings()

    // Listen for changes
    window.addEventListener('storage', (event) => {
      if (event.key === 'app_settings_updated') {
        updateSettings()
      }
    })

    return () => {
      window.removeEventListener('storage', updateSettings)
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
            
            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-semibold text-white mb-3">Ikuti Kami</h5>
              <div className="flex space-x-4">
                <a 
                  href={socialMedia.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href={socialMedia.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                  title="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                <a 
                  href={socialMedia.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-emerald-500 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
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
