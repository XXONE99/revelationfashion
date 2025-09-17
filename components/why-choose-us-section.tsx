"use client"

import { Users } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Service } from "@/entities/Service"
import * as LucideIcons from 'lucide-react'

export function WhyChooseUsSection() {
  const [benefits, setBenefits] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await Service.list('order')
        setBenefits(data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch services:', error)
        setIsLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (benefits.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">Mengapa Memilih Kami?</h2>
            <div className="flex justify-center">
              <div className="max-w-sm">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Tidak ada layanan tersedia</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">Mengapa Memilih Kami?</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Komitmen kami adalah memberikan pelayanan terbaik dengan kualitas produk yang unggul dan kepuasan pelanggan
            yang maksimal.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            return (
              <motion.div
                key={benefit.id}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 text-center hover:shadow-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 transition-colors duration-300"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {benefit.icon && benefit.icon.startsWith('lucide:') ? (
                    (() => {
                      const IconComponent = LucideIcons[benefit.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                      return IconComponent ? <IconComponent className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" /> : <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />;
                    })()
                  ) : benefit.icon ? (
                    <img src={benefit.icon} alt={benefit.title} className="h-8 w-8 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300"/>
                  ) : (
                    <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400 group-hover:text-white dark:group-hover:text-black transition-colors duration-300" />
                  )}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
