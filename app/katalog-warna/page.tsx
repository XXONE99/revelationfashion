"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ColorCatalog } from "@/entities/ColorCatalog"
import LoadingScreen from "@/components/loading-screen"
import { useRealtime } from "@/hooks/useRealtime"

export default function KatalogWarnaPage() {
  const [activeTab, setActiveTab] = useState("KATALOG WARNA")
  const [currentPage, setCurrentPage] = useState(1)
  const [catalogs, setCatalogs] = useState<ColorCatalog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null)
  const isTouchOrSmall = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(hover: none)').matches || window.innerWidth < 1024
  }

  const itemsPerPage = 3

  useEffect(() => {
    loadCatalogs()
  }, [])

  useRealtime('color_catalogs', () => {
    loadCatalogs()
  })

  const loadCatalogs = async () => {
    try {
      console.log("🔍 [KATALOG WARNA] Loading catalogs...")
      const data = await ColorCatalog.list()
      const publishedCatalogs = data.filter(catalog => catalog.is_published)
      setCatalogs(publishedCatalogs)
      console.log("✅ [KATALOG WARNA] Catalogs loaded:", publishedCatalogs.length)
    } catch (error) {
      console.error("Failed to load catalogs:", error)
      setCatalogs([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = catalogs.filter((item) =>
    activeTab === "KATALOG WARNA" ? item.type === "color" : item.type === "size",
  )

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Katalog</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Halaman Utama</Link>
                <span>/</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">Katalog</span>
              </div>
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
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  KATALOG WARNA
                </button>
                <button
                  onClick={() => handleTabChange("SIZE CHART")}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === "SIZE CHART"
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400"
                      : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                >
                  SIZE CHART
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {paginatedItems.length > 0 ? (
                paginatedItems.map((item) => (
                  <Link key={item.id} href={`/katalog-warna/${item.id}`} onClick={(e)=>{ if(isTouchOrSmall() && activeOverlayId !== item.id){ e.preventDefault(); setActiveOverlayId(item.id); }}}>
                    <div className="relative group cursor-pointer" onClick={()=>{ if(isTouchOrSmall()){ setActiveOverlayId(prev=> prev===item.id? null : item.id) } }}>
                      <div className="relative overflow-hidden rounded-lg shadow-lg">
                        <img
                          src={item.cover_image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                        <div className={`absolute inset-0 ${activeOverlayId === item.id ? 'bg-black/60 opacity-100' : 'bg-black/60 opacity-0 md:group-hover:opacity-100'} transition-opacity flex items-center justify-center`}>
                          <div className="text-white text-center">
                            <div className="bg-emerald-600 dark:bg-emerald-500 px-6 py-2 rounded text-sm font-semibold mb-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                              SELENGKAPNYA
                            </div>
                            <h3 className="text-lg font-semibold transform translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{item.title}</h3>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    {activeTab === "KATALOG WARNA" 
                      ? "Belum ada katalog warna yang tersedia" 
                      : "Belum ada size chart yang tersedia"
                    }
                  </p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          ? "text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                          : "text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
