"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import LoadingScreen from "@/components/loading-screen"
import { Check } from "lucide-react"
import { AboutContent } from "@/entities/AboutContent"
import { Value } from "@/entities/Value"
import * as LucideIcons from 'lucide-react'
import { useRealtime } from "@/hooks/useRealtime"

export default function TentangKamiPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [storyData, setStoryData] = useState<{ title: string, content: string, image_url: string }>({ 
    title: "", 
    content: "", 
    image_url: "" 
  })
  const [values, setValues] = useState<Value[]>([])

  useEffect(() => {
    loadData()
  }, [])

  useRealtime('about_content', () => {
    loadData()
  })

  useRealtime('about_values', () => {
    loadData()
  })

  const loadData = async () => {
    try {
      console.log("🔍 [TENTANG KAMI] Loading data...")
      
      // Load story data
      const storyContent = await AboutContent.filter({ section: 'story' })
      if (storyContent.length > 0) {
        const story = storyContent[0]
        setStoryData({
          title: story.title || "Perjalanan Kami",
          content: story.content || "",
          image_url: story.image_url || "/modern-textile-factory-with-workers-and-sewing-mac.jpg"
        })
      }

      // Load values data
      const valuesData = await Value.list('order')
      const publishedValues = valuesData.filter(value => value.is_published)
      setValues(publishedValues)
      
      console.log("✅ [TENTANG KAMI] Data loaded successfully")
    } catch (error) {
      console.error("❌ [TENTANG KAMI] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <motion.section
          className="py-16 bg-gray-50 dark:bg-gray-800"
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
              <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-gray-100">
                Tentang <span className="text-emerald-600 dark:text-emerald-400">Revelation</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
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
                <h2 className="text-3xl font-bold mb-6 text-emerald-600 dark:text-emerald-400">{storyData.title}</h2>
                {storyData.content ? (
                  <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    {storyData.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-600 dark:text-gray-300 space-y-4">
                    <p>
                      Didirikan pada tahun 2014, Revelation telah melayani ribuan kepercayaan untuk kebutuhan seragam
                      berkualitas tinggi. Dengan tim berpengalaman dan teknologi modern, kami terus mengembangkan inovasi
                      dalam industri konveksi.
                    </p>
                    <p>
                      Dengan komitmen pada kualitas dan inovasi, kami terus mengembangkan teknologi produksi dan metode
                      untuk memenuhi standar internasional sambil mempertahankan nilai-nilai tradisional craftmanship.
                    </p>
                    <p>
                      Kepercayaan klien adalah aset terbesar kami. Setiap produk yang kami hasilkan melewati quality control
                      ketat untuk memastikan kepuasan maksimal.
                    </p>
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="max-w-xl md:max-w-lg lg:max-w-xl mx-auto">
                  <div className="grid grid-cols-4 gap-2 md:gap-3">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const rows = 4
                      const cols = 4
                      const row = Math.floor(i / cols)
                      const col = i % cols
                      // Sedikit variasi rotasi/offset agar terasa geometrik namun tetap terbaca
                      const rotation = ((row + col) % 2 === 0 ? -1 : 1) * 0.6
                      const translateX = ((col % 2) ? 0.5 : -0.5)
                      const translateY = ((row % 2) ? -0.5 : 0.5)
                      return (
                        <div
                          key={i}
                          className="w-full aspect-square rounded md:rounded-md"
                          style={{
                            backgroundImage: `url(${storyData.image_url})`,
                            backgroundSize: `${cols * 100}% ${rows * 100}%`,
                            backgroundPosition: `${(col / (cols - 1)) * 100}% ${(row / (rows - 1)) * 100}%`,
                            backgroundRepeat: 'no-repeat',
                            // Hilangkan border/shadow putih, berikan transform halus
                            transform: `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`,
                            transition: 'transform 300ms ease',
                          }}
                          aria-label={storyData.title}
                          onMouseEnter={(e) => {
                            const target = e.currentTarget as HTMLDivElement
                            target.style.transform = `translate(0%, 0%) rotate(0deg)`
                          }}
                          onMouseLeave={(e) => {
                            const target = e.currentTarget as HTMLDivElement
                            target.style.transform = `translate(${translateX}%, ${translateY}%) rotate(${rotation}deg)`
                          }}
                        ></div>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <motion.section
          className="py-16 bg-gray-50 dark:bg-gray-800"
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
              <h2 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Nilai-Nilai Kami</h2>
              <p className="text-gray-600 dark:text-gray-300">Prinsip yang menjadi fondasi dalam setiap aspek bisnis kami.</p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8">
              {values.length > 0 ? (
                values.map((value, index) => {
                  const IconComponent = value.icon && value.icon.startsWith('lucide:') 
                    ? LucideIcons[value.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any
                    : null;
                  
                  return (
                    <motion.div
                      key={value.id}
                      className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        {IconComponent ? (
                          <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        ) : value.icon ? (
                          <img src={value.icon} alt={value.title} className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{value.description}</p>
                    </motion.div>
                  );
                })
              ) : (
                // Fallback dummy data if no values in database
                [
                  {
                    icon: "Clock",
                    title: "Ketepatan Waktu",
                    desc: "Kami menjunjung tinggi komitmen waktu agar proyek selesai sesuai dengan jadwal yang disepakati.",
                  },
                  {
                    icon: "Users",
                    title: "Kemitraan Berkelanjutan",
                    desc: "Tidak hanya berfokus pada transaksi, tapi juga membangun hubungan jangka panjang dengan pelanggan, supplier, dan mitra kerja.",
                  },
                  {
                    icon: "Target",
                    title: "Pemberdayaan SDM Lokal",
                    desc: "Turut serta dalam memberdayakan tenaga kerja lokal dengan memberikan pelatihan di bidang konveksi.",
                  },
                  {
                    icon: "Award",
                    title: "Kualitas Utama",
                    desc: "Mengutamakan detail dan standar tinggi dalam setiap produk.",
                  },
                ].map((item, index) => {
                  const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as any;
                  return (
                    <motion.div
                      key={index}
                      className="text-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        {IconComponent ? (
                          <IconComponent className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">V</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
                    </motion.div>
                  );
                })
              )}
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
              <h2 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Layanan Lengkap Kami</h2>
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
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <h3 className="text-xl font-semibold mb-4 dark:text-gray-100">{service.title}</h3>
                  <ul className="space-y-3">
                    {service.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        className="flex items-center text-gray-600 dark:text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + itemIndex * 0.05 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-5 h-5 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
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
