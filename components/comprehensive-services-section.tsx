"use client"

import { Check } from "lucide-react"
import { motion } from "framer-motion"

export function ComprehensiveServicesSection() {
  const serviceCategories = [
    {
      title: "Konveksi Seragam Kantor",
      services: [
        "Kemeja formal pria & wanita",
        "Blazer dan jas kantor",
        "Celana bahan formal",
        "Dress dan rok kerja",
        "Aksesoris pendukung",
      ],
    },
    {
      title: "Seragam Industri & Lapangan",
      services: [
        "Wearpack safety",
        "Seragam laboratorium",
        "Pakaian kerja konstruksi",
        "Seragam medis",
        "APD khusus industri",
      ],
    },
    {
      title: "Custom Design & Branding",
      services: [
        "Desain logo perusahaan",
        "Bordir dan sablon",
        "Konsultasi pemilihan bahan",
        "Fitting dan alterasi",
        "Packaging eksklusif",
      ],
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Layanan Lengkap Kami</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-lg p-6 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <motion.h3
                className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                viewport={{ once: true }}
              >
                {category.title}
              </motion.h3>
              <ul className="space-y-3">
                {category.services.map((service, serviceIndex) => (
                  <motion.li
                    key={serviceIndex}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 + serviceIndex * 0.05 + 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.div whileHover={{ scale: 1.2, rotate: 360 }} transition={{ duration: 0.3 }}>
                      <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                      {service}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
