"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Phone, Globe, Mail, AlertTriangle } from "lucide-react"
import { ColorCatalog } from "@/entities/ColorCatalog"
import LoadingScreen from "@/components/loading-screen"

export default function CatalogDetailPage({ params }: { params: { slug: string } }) {
  const [catalog, setCatalog] = useState<ColorCatalog | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCatalog()
  }, [params.slug])

  const loadCatalog = async () => {
    try {
      console.log("🔍 [CATALOG DETAIL] Loading catalog:", params.slug)
      const data = await ColorCatalog.get(params.slug)
      setCatalog(data)
      console.log("✅ [CATALOG DETAIL] Catalog loaded:", data?.title)
    } catch (error) {
      console.error("Failed to load catalog:", error)
      setCatalog(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!catalog) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Katalog tidak ditemukan</h1>
            <p className="text-gray-600 mb-6">Katalog yang Anda cari tidak tersedia.</p>
            <Button asChild>
              <a href="/katalog-warna">Kembali ke Katalog</a>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNavigation />
        <WhatsAppFloat />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Halaman Utama</span> / <span>Katalog Warna</span> /{" "}
              <span className="text-emerald-600">{catalog.title}</span>
            </nav>
          </div>
        </section>

        {/* Catalog Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Catalog Image */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">{catalog.title}</h1>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={catalog.cover_image_url || "/placeholder.svg"}
                    alt={catalog.title}
                    className="w-full h-auto object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                {/* Additional Images */}
                {catalog.images && catalog.images.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Gambar Tambahan</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {catalog.images.map((image, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${catalog.title} - ${index + 1}`}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-yellow-800 font-semibold mb-2">Disclaimer</h3>
                      <p className="text-yellow-700 text-sm leading-relaxed">
                        {catalog.type === 'color' 
                          ? "Warna pada layar mungkin sedikit berbeda dengan warna asli. Toleransi perbedaan warna 5-10%."
                          : "Gunakan panduan ini untuk memilih ukuran yang paling sesuai. Toleransi ukuran 1-2 cm."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-gray-800">Informasi Pemesanan</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Call / Whatsapp</div>
                        <div className="font-semibold text-emerald-600">+62 821-1234-5678</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Website</div>
                        <div className="font-semibold text-emerald-600">www.laksakarya.com</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Email</div>
                        <div className="font-semibold text-emerald-600">laksakaryakonveksi@gmail.com</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                    {catalog.type === 'color' ? 'Konsultasi Warna Custom' : 'Konsultasi Ukuran Custom'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Request Sample
                  </Button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-blue-800 flex items-center">
                    💡 {catalog.type === 'color' ? 'Tips Pemilihan Warna:' : 'Tips Pemilihan Ukuran:'}
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    {catalog.type === 'color' ? (
                      <>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Pilih warna sesuai dengan identitas brand</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Pertimbangkan warna yang tidak mudah kotor</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Konsultasi gratis dengan tim desainer kami</span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Ukur dengan teliti menggunakan meteran kain</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Pertimbangkan lapisan dalam jaket</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-500 mr-2 mt-1">•</span>
                          <span>Konsultasi untuk model jaket khusus</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
