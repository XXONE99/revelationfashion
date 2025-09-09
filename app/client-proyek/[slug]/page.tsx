"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { LoadingScreen } from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Calendar, User, Phone, Globe, Mail } from "lucide-react"

const clientDetails = {
  "pt-rubber-pan-java": {
    title: "PT Rubber Pan Java",
    date: "30/08/2023",
    author: "Sirin",
    image: "/professional-man-in-white-shirt-smiling.jpg",
    description:
      "Proyek pembuatan seragam kantor untuk PT Rubber Pan Java dengan total 150 set kemeja formal. Menggunakan bahan cotton combed premium dengan logo perusahaan yang di-bordir dengan teknik terbaik. Spesifikasi: - Bahan: Cotton Combed 24s - Warna: Putih dan Biru Navy - Logo: Bordir di dada kiri - Waktu pengerjaan: 2 minggu - Total: 150 set kemeja",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
  },
  "pt-panarub-industry": {
    title: "PT Panarub Industry",
    date: "25/08/2023",
    author: "Sirin",
    image: "/black-leather-jacket-hanging-on-display.jpg",
    description:
      "Produksi 800 jaket sekolah dengan desain modern untuk PT Panarub Industry dengan kualitas bahan terbaik. Menggunakan bahan polyester blend yang tahan lama dan nyaman digunakan. Spesifikasi: - Bahan: Polyester Blend - Warna: Navy dan Abu-abu - Logo: Bordir dan Sablon - Waktu pengerjaan: 3 minggu - Total: 800 jaket",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
  },
  "pt-toba-pulp-lestari": {
    title: "PT Toba Pulp Lestari",
    date: "20/08/2023",
    author: "Sirin",
    image: "/blue-and-orange-sports-uniform.jpg",
    description:
      "Pembuatan seragam kerja untuk 150 karyawan PT Toba Pulp Lestari dengan bahan katun premium dan teknologi dry fit. Desain khusus untuk industri dengan standar keamanan tinggi. Spesifikasi: - Bahan: Cotton Dry Fit - Warna: Biru dan Orange - Fitur: Reflective strip - Waktu pengerjaan: 2 minggu - Total: 150 set",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
  },
}

export default function ClientDetailPage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true)

  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  })

  const detail = clientDetails[params.slug as keyof typeof clientDetails]

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!detail) {
    return <div>Client project not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Breadcrumb */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8 bg-gray-50"
        >
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Halaman Utama</span> / <span>Client & Proyek</span> /{" "}
              <span className="text-emerald-600">{detail.title}</span>
            </nav>
          </div>
        </motion.section>

        {/* Project Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-4">{detail.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{detail.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{detail.author}</span>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <img
                  src={detail.image || "/placeholder.svg"}
                  alt={detail.title}
                  className="w-full rounded-lg shadow-lg mb-6"
                />

                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">{detail.description}</p>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-lg">
                  <h3 className="font-semibold mb-4 text-lg">Informasi Pemesanan</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 block">Call / Whatsapp:</span>
                        <span className="text-emerald-600 font-medium">{detail.contact.phone}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 block">Website:</span>
                        <span className="text-blue-600 font-medium">{detail.contact.website}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 block">Email:</span>
                        <span className="text-green-600 font-medium">{detail.contact.email}</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors duration-300">
                    Konsultasi Sekarang
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Comment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 border-t pt-8"
            >
              <h3 className="text-xl font-semibold mb-6">Leave a comment</h3>
              <p className="text-sm text-gray-600 mb-6">
                Email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai *
              </p>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Comment*</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Tulis komentar Anda..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name*</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Email*</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 transition-colors duration-300"
                >
                  Post Comment
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
