"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Star, Phone, Globe, Mail, ChevronLeft, ChevronRight, Shield, Truck, HeadphonesIcon } from "lucide-react"
import { Product } from "@/entities/Product"
import { LoadingScreen } from "@/components/loading-screen"

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadProduct()
  }, [params.slug])

  const loadProduct = async () => {
    try {
      console.log("🔍 [PORTFOLIO DETAIL] Loading product with ID:", params.slug)
      const data = await Product.list()
      const foundProduct = data.find(p => p.id === params.slug)
      
      if (foundProduct) {
        setProduct(foundProduct)
        console.log("✅ [PORTFOLIO DETAIL] Product found:", foundProduct.name)
      } else {
        console.log("❌ [PORTFOLIO DETAIL] Product not found")
        setProduct(null)
      }
    } catch (error) {
      console.error("Failed to load product:", error)
      setProduct(null)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Portfolio not found</h1>
            <p className="text-gray-600 mb-6">Produk yang Anda cari tidak ditemukan.</p>
            <Button asChild>
              <a href="/portofolio">Kembali ke Portofolio</a>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNavigation />
        <WhatsAppFloat />
      </div>
    )
  }

  const nextImage = () => {
    const images = product.images || []
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    const images = product.images || []
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Halaman Utama</span> / <span>Portofolio</span> /{" "}
              <span className="text-emerald-600">{product.name}</span>
            </nav>
          </div>
        </section>

        {/* Product Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-24 self-start"
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-xl shadow-xl">
                    <img
                      src={product.images?.[currentImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover will-change-transform"
                    />
                  </div>

                  {(product.images?.length || 0) > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {(product.images?.length || 0) > 1 && (
                  <div className="mt-4 grid grid-cols-5 gap-3">
                    {product.images!.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${currentImageIndex === idx ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-gray-200 hover:border-emerald-300'}`}
                        aria-label={`Thumbnail ${idx + 1}`}
                      >
                        <img src={img} alt={`${product.name} ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-gray-600">{product.description}</p>
                </div>

                <motion.div 
                  className="bg-gradient-to-br from-emerald-50 to-white/60 border border-emerald-100 rounded-xl p-6 mb-6 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-emerald-600 font-semibold mb-4 flex items-center">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
                    Informasi Produk
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium text-blue-600">{product.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deskripsi:</span>
                      <span className="font-medium">{product.description || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium capitalize">{product.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimasi Harga:</span>
                      <span className="font-bold text-emerald-600 text-lg">Hubungi untuk harga</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mt-4 pt-4 border-t border-emerald-200">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      5.0 (Kualitas Terjamin)
                    </span>
                  </div>
                </motion.div>

                {/* Description */}
                <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                  <h3 className="text-xl font-semibold mb-3">{product.name}</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-blue-600">Garansi Kualitas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <Truck className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="text-sm font-medium text-green-600">Gratis Ongkir</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 mx-auto">
                        <HeadphonesIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-purple-600">Konsultasi Gratis</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-8">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 py-3">Pesan Sekarang</Button>
                    <Button
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent px-8"
                    >
                      Konsultasi
                    </Button>
                  </div>
                </motion.div>

                <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}>
                  <h4 className="font-semibold mb-3 text-gray-800">Detail Bahan:</h4>
                  <p className="text-gray-600 mb-4">Bahan berkualitas tinggi dan tahan lama</p>

                  <h4 className="font-semibold mb-3 text-gray-800">Keunggulan Produk:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>Kualitas bahan dan hasil dijamin 100% memuaskan</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>Jahitan rapi dan tahan lama</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-600">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>Desain modern dan trendy</span>
                    </li>
                  </ul>
                </motion.div>

                <motion.div className="border-t pt-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <h4 className="font-semibold mb-4 text-gray-800">Informasi Pemesanan:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Call / Whatsapp: <span className="text-emerald-600 font-medium">+62 821-1234-5678</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">
                        Website: <span className="text-emerald-600 font-medium">www.laksakarya.com</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <span className="text-gray-700">
                        Email: <span className="text-emerald-600 font-medium">laksakaryakonveksi@gmail.com</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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
