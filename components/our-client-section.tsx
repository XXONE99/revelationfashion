"use client"

import { motion } from "framer-motion"
import { useRef } from "react"

export function OurClientSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const clients = [
    { name: "Toba Pulp Lestari", logo: "/toba-pulp-lestari-logo.jpg" },
    { name: "Garuda Indonesia", logo: "/garuda-indonesia-logo.jpg" },
    { name: "RPJ", logo: "/rpj-company-logo.jpg" },
    { name: "PT Mandiri", logo: "/bank-mandiri-logo.jpg" },
    { name: "Telkom Indonesia", logo: "/telkom-indonesia-logo.jpg" },
    { name: "PLN", logo: "/pln-logo.jpg" },
    { name: "Pertamina", logo: "/pertamina-logo.png" },
    { name: "BCA", logo: "/bca-bank-logo.jpg" },
    { name: "BNI", logo: "/bni-bank-logo.jpg" },
    { name: "BRI", logo: "/bri-bank-logo.jpg" },
    { name: "Astra", logo: "/astra-company-logo.jpg" },
    { name: "Corporate Client", logo: "/generic-corporate-logo.png" },
  ]

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Client</h2>
          <div className="w-16 h-1 bg-emerald-600 mx-auto"></div>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {clients.map((client, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-36 h-24 flex items-center justify-center p-4 bg-gray-50 rounded-lg grayscale hover:grayscale-0 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <img
                  src={client.logo || "/placeholder-64.png"}
                  alt={client.name}
                  className="max-h-16 max-w-full w-auto object-contain transition-all duration-300 group-hover:brightness-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder-120x80.png"
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
