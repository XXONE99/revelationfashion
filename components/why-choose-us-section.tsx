"use client"

import { Shirt, Users, Award, Clock, Shield, Truck } from "lucide-react"
import { motion } from "framer-motion"

export function WhyChooseUsSection() {
  const benefits = [
    {
      icon: Shirt,
      title: "Desain Custom",
      description: "Desain seragam sesuai keinginan dengan berbagai pilihan model dan warna.",
    },
    {
      icon: Users,
      title: "Konsultasi Gratis",
      description: "Tim ahli kami siap memberikan konsultasi terbaik untuk kebutuhan seragam Anda.",
    },
    {
      icon: Award,
      title: "Kualitas Premium",
      description: "Menggunakan bahan berkualitas tinggi dengan jahitan rapi dan tahan lama.",
    },
    {
      icon: Clock,
      title: "Pengerjaan Cepat",
      description: "Proses produksi yang efisien dengan waktu pengerjaan sesuai deadline.",
    },
    {
      icon: Shield,
      title: "Garansi Kualitas",
      description: "Memberikan jaminan kualitas untuk setiap produk yang kami hasilkan.",
    },
    {
      icon: Truck,
      title: "Kirim Seluruh Indonesia",
      description: "Melayani pengiriman ke seluruh nusantara dengan packaging aman.",
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mengapa Memilih Kami?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Komitmen kami adalah memberikan pelayanan terbaik dengan kualitas produk yang unggul dan kepuasan pelanggan
            yang maksimal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={index}
                className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-xl hover:bg-white transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
