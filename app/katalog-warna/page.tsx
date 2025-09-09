"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ChevronLeft, ChevronRight } from "lucide-react"

const catalogItems = [
  {
    id: "size-chart-kemeja-kaos",
    title: "Size Chart Kemeja & Kaos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R1ha6x2Vzin15f4v1DprVKN3ZQpKOX.png",
    category: "Size Chart",
    hoverText: "SELENGKAPNYA",
  },
  {
    id: "katalog-warna-polo",
    title: "Katalog Warna Polo Shirt",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BjhJluIAZd4l2ZEgLJGPrUnV7JDpqL.png",
    category: "Katalog Warna",
    hoverText: "SELENGKAPNYA",
  },
  {
    id: "panduan-ukuran-jaket",
    title: "Panduan Ukuran Jaket",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R1ha6x2Vzin15f4v1DprVKN3ZQpKOX.png",
    category: "Size Chart",
    hoverText: "SELENGKAPNYA",
  },
  {
    id: "katalog-warna-kemeja",
    title: "Katalog Warna Kemeja",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BjhJluIAZd4l2ZEgLJGPrUnV7JDpqL.png",
    category: "Katalog Warna",
    hoverText: "SELENGKAPNYA",
  },
  {
    id: "size-chart-jaket",
    title: "Size Chart Jaket",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R1ha6x2Vzin15f4v1DprVKN3ZQpKOX.png",
    category: "Size Chart",
    hoverText: "SELENGKAPNYA",
  },
  {
    id: "katalog-warna-kaos",
    title: "Katalog Warna Kaos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BjhJluIAZd4l2ZEgLJGPrUnV7JDpqL.png",
    category: "Katalog Warna",
    hoverText: "SELENGKAPNYA",
  },
]

export default function KatalogWarnaPage() {
  const [activeTab, setActiveTab] = useState("KATALOG WARNA")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const filteredItems = catalogItems.filter((item) =>
    activeTab === "KATALOG WARNA" ? item.category === "Katalog Warna" : item.category === "Size Chart",
  )

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Katalog</h1>
              <nav className="text-sm text-gray-600">
                <span>Halaman Utama</span> / <span className="text-emerald-600">Katalog</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Catalog Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="flex border-b">
                <button
                  onClick={() => handleTabChange("KATALOG WARNA")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "KATALOG WARNA"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                >
                  KATALOG WARNA
                </button>
                <button
                  onClick={() => handleTabChange("SIZE CHART")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "SIZE CHART"
                      ? "text-emerald-600 border-b-2 border-emerald-600"
                      : "text-gray-600 hover:text-emerald-600"
                  }`}
                >
                  SIZE CHART
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {paginatedItems.map((item, index) => (
                <Link key={index} href={`/katalog-warna/${item.id}`}>
                  <div className="relative group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="bg-emerald-600 px-6 py-2 rounded text-sm font-semibold mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            {item.hoverText}
                          </div>
                          <h3 className="text-lg font-semibold transform translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold text-gray-800">{item.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === page
                          ? "text-white bg-emerald-600 hover:bg-emerald-700"
                          : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
