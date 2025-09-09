"use client"

import { Users, Shield, Lightbulb } from "lucide-react"
import { motion } from "framer-motion"

export function ServicesSection() {
  const services = [
    {
      icon: Users,
      title: "Pelayanan Profesional",
      description: "Memberikan pelayanan ramah, responsif, dan solusi terbaik untuk setiap kebutuhan pelanggan.",
    },
    {
      icon: Shield,
      title: "Kepercayaan & Transparansi",
      description: "Hubungan dengan pelanggan dibangun atas dasar kejujuran, keterbukaan, dan komitmen jangka panjang.",
    },
    {
      icon: Lightbulb,
      title: "Inovasi & Kreativitas",
      description:
        "Selalu mengikuti tren mode dan menghadirkan produk dengan desain yang sesuai kebutuhan serta keinginan pelanggan.",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <motion.div
                  className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
