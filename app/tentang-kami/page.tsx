"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { LoadingScreen } from "@/components/loading-screen"
import { Clock, Users, Award, Target, Shield, Zap, Check } from "lucide-react"

export default function TentangKamiPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Tentang <span className="text-emerald-600">Revelation</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Spesialis konveksi seragam dengan pengalaman lebih dari 10 tahun dalam melayani kebutuhan seragam
                berkualitas tinggi untuk berbagai industri.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Perjalanan Kami</h2>
                <p className="text-gray-600 mb-4">
                  Didirikan pada tahun 2014, Revelation telah melayani ribuan kepercayaan untuk kebutuhan seragam
                  berkualitas tinggi. Dengan tim berpengalaman dan teknologi modern, kami terus mengembangkan inovasi
                  dalam industri konveksi.
                </p>
                <p className="text-gray-600 mb-4">
                  Dengan komitmen pada kualitas dan inovasi, kami terus mengembangkan teknologi produksi dan metode
                  untuk memenuhi standar internasional sambil mempertahankan nilai-nilai tradisional craftmanship.
                </p>
                <p className="text-gray-600">
                  Kepercayaan klien adalah aset terbesar kami. Setiap produk yang kami hasilkan melewati quality control
                  ketat untuk memastikan kepuasan maksimal.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <img
                  src="/modern-textile-factory-with-workers-and-sewing-mac.jpg"
                  alt="Perjalanan Kami"
                  className="rounded-lg shadow-lg w-full"
                />
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          className="py-16 bg-gray-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Nilai-Nilai Kami</h2>
              <p className="text-gray-600">Prinsip yang menjadi fondasi dalam setiap aspek bisnis kami.</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Ketepatan Waktu",
                  desc: "Kami menjunjung tinggi komitmen waktu agar proyek selesai sesuai dengan jadwal yang disepakati.",
                },
                {
                  icon: Users,
                  title: "Kemitraan Berkelanjutan",
                  desc: "Tidak hanya berfokus pada transaksi, tapi juga membangun hubungan jangka panjang dengan pelanggan, supplier, dan mitra kerja.",
                },
                {
                  icon: Target,
                  title: "Pemberdayaan SDM Lokal",
                  desc: "Turut serta dalam memberdayakan tenaga kerja lokal dengan memberikan pelatihan di bidang konveksi.",
                },
                {
                  icon: Award,
                  title: "Kualitas Utama",
                  desc: "Mengutamakan detail dan standar tinggi dalam setiap produk.",
                },
                {
                  icon: Shield,
                  title: "Pelayanan Profesional",
                  desc: "Memberikan pelayanan terbaik, responsif, dan solusi terbaik untuk memenuhi kebutuhan pelanggan.",
                },
                {
                  icon: Zap,
                  title: "Kepercayaan & Transparansi",
                  desc: "Hubungan dengan pelanggan dibangun atas dasar kepercayaan, dan komitmen jangka panjang.",
                },
                {
                  icon: Target,
                  title: "Inovasi & Kreativitas",
                  desc: "Selalu mengikuti tren mode dan menghadirkan produk dengan desain yang sesuai dengan kebutuhan pelanggan.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Layanan Lengkap Kami</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Konveksi Seragam Kantor",
                  items: [
                    "Kemeja formal pria & wanita",
                    "Blazer dan jas kantor",
                    "Celana bahan formal",
                    "Dress dan rok kerja",
                    "Aksesoris pendukung",
                  ],
                },
                {
                  title: "Seragam Industri & Lapangan",
                  items: [
                    "Wearpack safety",
                    "Seragam laboratorium",
                    "Pakaian kerja konstruksi",
                    "Seragam medis",
                    "APD khusus industri",
                  ],
                },
                {
                  title: "Custom Design & Branding",
                  items: [
                    "Desain logo perusahaan",
                    "Bordir dan sablon",
                    "Konsultasi pemilihan bahan",
                    "Fitting dan alterasi",
                    "Packaging eksklusif",
                  ],
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg border border-gray-200"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        className="flex items-center text-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
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
