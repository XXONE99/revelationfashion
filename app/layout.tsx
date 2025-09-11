import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { FaviconManager } from "@/components/FaviconManager"
import { ConditionalThemeProvider } from "@/components/conditional-theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "REVELATION - Konveksi Bandung | Jasa Pembuatan Seragam Profesional",
  description:
    "Spesialis konveksi seragam kantor, sekolah, dan pakaian kerja berkualitas tinggi. Melayani seluruh Indonesia dengan pengalaman lebih dari 10 tahun. Harga terjangkau, kualitas terjamin.",
  keywords: [
    "konveksi bandung",
    "jasa pembuatan seragam",
    "seragam kantor",
    "seragam sekolah", 
    "pakaian kerja",
    "konveksi jaket",
    "konveksi polo shirt",
    "baju seragam perusahaan",
    "konveksi murah bandung",
    "jasa jahit seragam",
    "konveksi berkualitas",
    "pembuatan baju seragam",
    "konveksi online",
    "seragam custom",
    "konveksi terpercaya"
  ],
  authors: [{ name: "REVELATION Konveksi Bandung" }],
  creator: "REVELATION Konveksi Bandung",
  publisher: "REVELATION Konveksi Bandung",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://revelationfashion.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "REVELATION - Konveksi Bandung | Jasa Pembuatan Seragam Profesional",
    description: "Spesialis konveksi seragam kantor, sekolah, dan pakaian kerja berkualitas tinggi. Melayani seluruh Indonesia dengan pengalaman lebih dari 10 tahun.",
    url: 'https://revelation-konveksi.com',
    siteName: 'REVELATION Konveksi Bandung',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'REVELATION Konveksi Bandung - Jasa Pembuatan Seragam Profesional',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'REVELATION - Konveksi Bandung | Jasa Pembuatan Seragam Profesional',
    description: 'Spesialis konveksi seragam kantor, sekolah, dan pakaian kerja berkualitas tinggi. Melayani seluruh Indonesia.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/placeholder-logo.png",
    shortcut: "/placeholder-logo.png",
    apple: "/placeholder-logo.png",
  },
  generator: "Next.js",
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body 
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}
        suppressHydrationWarning
      >
        {/* Favicon dari localStorage (jika ada) - Client Side Only */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                try {
                  const logo = localStorage.getItem('app_logo_url');
                  if (logo) {
                    console.log('🔍 [FAVICON] Setting favicon from localStorage:', logo);
                    const ensureLink = (rel) => {
                      let link = document.querySelector('link[rel="' + rel + '"]');
                      if (!link) { 
                        link = document.createElement('link'); 
                        link.rel = rel; 
                        document.head.appendChild(link); 
                      }
                      link.href = logo;
                    };
                    ensureLink('icon');
                    ensureLink('shortcut icon');
                    ensureLink('apple-touch-icon');
                  } else {
                    console.log('⚠️ [FAVICON] No logo found in localStorage');
                  }
                } catch (e) {
                  console.error('❌ [FAVICON] Error setting favicon:', e);
                }
              })();
            `,
          }}
        />
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "REVELATION Konveksi Bandung",
              "description": "Spesialis konveksi seragam kantor, sekolah, dan pakaian kerja berkualitas tinggi. Melayani seluruh Indonesia dengan pengalaman lebih dari 10 tahun.",
              "url": "https://revelation-konveksi.com",
              "logo": "https://revelation-konveksi.com/placeholder-logo.png",
              "image": "https://revelation-konveksi.com/og-image.jpg",
              "telephone": "+62-813-1260-0281",
              "email": "revelation.fash@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Jl. Mawar No. 123",
                "addressLocality": "Bandung",
                "addressRegion": "Jawa Barat",
                "addressCountry": "ID"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "-6.2088",
                "longitude": "106.8456"
              },
              "openingHours": "Mo-Sa 09:00-17:00",
              "priceRange": "$$",
              "serviceArea": {
                "@type": "Country",
                "name": "Indonesia"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Layanan Konveksi",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Konveksi Seragam Kantor",
                      "description": "Pembuatan seragam kantor berkualitas tinggi dengan bahan premium"
                    }
                  },
                  {
                    "@type": "Offer", 
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Konveksi Seragam Sekolah",
                      "description": "Seragam sekolah dengan desain modern dan nyaman"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service", 
                      "name": "Konveksi Pakaian Kerja",
                      "description": "Pakaian kerja dan seragam industri dengan standar internasional"
                    }
                  }
                ]
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              },
              "sameAs": [
                "https://www.instagram.com/revelation_konveksi",
                "https://www.facebook.com/revelation.konveksi"
              ]
            })
          }}
        />
        
        <FaviconManager />
        <ConditionalThemeProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster position="top-right" richColors />
        </ConditionalThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
