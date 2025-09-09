"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Star, Phone, Globe, Mail, ChevronLeft, ChevronRight, Shield, Truck, HeadphonesIcon } from "lucide-react"

const portfolioDetails = {
  "jaket-bomber-premium": {
    title: "Jaket Bomber Premium",
    subtitle: "Event Perusahaan ABC",
    images: [
      "/premium-black-bomber-jacket-detailed-view.jpg",
      "/premium-black-bomber-jacket-back-view.jpg",
      "/premium-black-bomber-jacket-side-view.jpg",
    ],
    rating: 5.0,
    reviews: 128,
    price: "Rp 185.000",
    category: "Jacket",
    description:
      "Jaket bomber dengan desain modern untuk acara perusahaan. Bahan berkualitas tinggi dan nyaman dipakai.",
    details: {
      bahan: "Polyester blend dengan lining cotton",
      jahitan: [
        "Rapid border pasar dan aturat",
        "Rapid Sablon pasar dan aturat",
        "Kualitas bahan dan hasil Dijamin 100% memuaskan",
      ],
    },
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
  },
}

export default function PortfolioDetailPage({ params }: { params: { slug: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const detail = portfolioDetails[params.slug as keyof typeof portfolioDetails]

  if (!detail) {
    return <div>Portfolio not found</div>
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % detail.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + detail.images.length) % detail.images.length)
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
              <span className="text-emerald-600">{detail.title}</span>
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
              >
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={detail.images[currentImageIndex] || "/placeholder.svg"}
                      alt={`${detail.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {detail.images.length > 1 && (
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
              </motion.div>

              {/* Product Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">{detail.title}</h1>
                  <p className="text-gray-600">{detail.subtitle}</p>
                </div>

                <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-lg p-6 mb-6">
                  <h3 className="text-emerald-600 font-semibold mb-4 flex items-center">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full mr-2"></span>
                    Informasi Produk
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nama:</span>
                      <span className="font-medium text-blue-600">{detail.title}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Catatan:</span>
                      <span className="font-medium">{detail.subtitle}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Kategori:</span>
                      <span className="font-medium">{detail.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Estimasi Harga:</span>
                      <span className="font-bold text-emerald-600 text-lg">{detail.price}</span>
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
                      {detail.rating} ({detail.reviews} reviews)
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">{detail.title}</h3>
                  <p className="text-gray-600 mb-6">{detail.description}</p>

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
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 text-gray-800">Detail Bahan:</h4>
                  <p className="text-gray-600 mb-4">{detail.details.bahan}</p>

                  <h4 className="font-semibold mb-3 text-gray-800">Detail Jahitan:</h4>
                  <ul className="space-y-2">
                    {detail.details.jahitan.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-emerald-600 mt-1">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4 text-gray-800">Informasi Pemesanan:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="h-5 w-5 text-green-600" />
                      <span className="text-gray-700">
                        Call / Whatsapp: <span className="text-emerald-600 font-medium">{detail.contact.phone}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">
                        Website: <span className="text-emerald-600 font-medium">{detail.contact.website}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                      <Mail className="h-5 w-5 text-emerald-600" />
                      <span className="text-gray-700">
                        Email: <span className="text-emerald-600 font-medium">{detail.contact.email}</span>
                      </span>
                    </div>
                  </div>
                </div>
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
