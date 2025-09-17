"use client"
import Link from "next/link"
import { Phone, Mail, Instagram, Facebook } from "lucide-react"
import { useAppSettings } from "@/hooks/useAppSettings"
import { useContactInfo } from "@/hooks/useContactInfo"

export function Footer() {
  const { appSettings, isLoading: appSettingsLoading, error: appSettingsError } = useAppSettings()
  const { contactInfo, isLoading: contactInfoLoading, error: contactInfoError } = useContactInfo()
  
  const isLoading = appSettingsLoading || contactInfoLoading
  const error = appSettingsError || contactInfoError

  if (isLoading) {
    return (
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gray-700 dark:bg-gray-800 rounded-full animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-700 dark:bg-gray-800 rounded w-48 animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-full animate-pulse"></div>
                <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-3/4 animate-pulse"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 dark:bg-gray-800 rounded w-20 animate-pulse mb-4"></div>
              <div className="space-y-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-24 animate-pulse"></div>
                ))}
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-700 dark:bg-gray-800 rounded w-24 animate-pulse mb-4"></div>
              <div className="space-y-3">
                <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-gray-700 dark:bg-gray-800 rounded w-40 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }

  if (error) {
    console.error('❌ [FOOTER] Error loading app settings:', error)
  }

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 mb-16 lg:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={appSettings.logo_url || '/placeholder-logo.png'} 
                  alt={appSettings.app_name || 'Revelation'} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    console.error('❌ [FOOTER] Failed to load logo:', appSettings.logo_url);
                    e.currentTarget.src = '/placeholder-logo.png';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-white dark:text-gray-100">
                  {appSettings.app_name || 'REVELATION (Konveksi Bandung)'}
                </h3>
                <p className="text-sm text-emerald-400 dark:text-emerald-300">
                  {appSettings.app_subtitle || 'Jasa Pembuatan Pakaian dan Seragam Profesional'}
                </p>
              </div>
            </div>
            <p className="text-gray-300 dark:text-gray-400 mb-4 leading-relaxed">
              {appSettings.app_description || 'Spesialis pembuatan seragam kantor, seragam sekolah, dan pakaian kerja berkualitas tinggi. Melayani seluruh Indonesia dengan pengalaman lebih dari 10 tahun.'}
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-100 mb-4">Layanan</h4>
            <ul className="space-y-2 text-gray-300 dark:text-gray-400">
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Seragam Kantor
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Seragam Sekolah
                </Link>
              </li>
              <li>
                <Link href="/portofolio" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  Pakaian Kerja
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white dark:text-gray-100 mb-4">Kontak Kami</h4>
            <div className="space-y-3 text-gray-300 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>{contactInfo.phone || '+62 813-1260-0281'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
                <span>{contactInfo.email || 'revelation.fash@gmail.com'}</span>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="mt-6">
              <h5 className="font-semibold text-white dark:text-gray-100 mb-3">Ikuti Kami</h5>
              <div className="flex space-x-4">
                {contactInfo.instagram_url && (
                <a 
                    href={contactInfo.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                )}
                {contactInfo.tiktok_url && (
                <a 
                    href={contactInfo.tiktok_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  title="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
                )}
                {contactInfo.facebook_url && (
                <a 
                    href={contactInfo.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 dark:text-gray-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  title="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; 2024 {appSettings.app_name || 'REVELATION (Konveksi Bandung)'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
