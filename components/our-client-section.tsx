"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { OurClient } from "@/entities/OurClient"
import { ChevronLeft, ChevronRight } from "lucide-react"

// CSS untuk scroll horizontal
const scrollStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scroll-container {
    scroll-snap-type: x mandatory;
  }
  
  .scroll-item {
    scroll-snap-align: start;
  }
`

export function OurClientSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [clients, setClients] = useState<OurClient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await OurClient.list()
        setClients(data.filter(client => client.is_published))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch clients:', error)
        setIsLoading(false)
      }
    }
    fetchClients()
  }, [])

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 5) // Add small threshold
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      })
    }
  }

  // Handle wheel scroll for horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (scrollRef.current) {
      e.preventDefault()
      scrollRef.current.scrollBy({
        left: e.deltaY > 0 ? 100 : -100,
        behavior: 'smooth'
      })
    }
  }

  // Auto scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (scrollContainer && clients.length > 6) {
      const handleScroll = () => checkScrollPosition()
      
      scrollContainer.addEventListener('scroll', handleScroll)
      checkScrollPosition() // Initial check
      
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
    }
  }, [clients])

  if (isLoading) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (clients.length === 0) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Client</h2>
            <p className="text-gray-600">Tidak ada klien tersedia</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollStyles }} />
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
          {/* Desktop: Grid layout untuk data sedikit, horizontal scroll untuk data banyak */}
          <div className="hidden md:block">
            {clients.length <= 6 ? (
              // Grid layout untuk data sedikit (≤6)
              <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    className="w-40 h-28 flex items-center justify-center p-4 bg-gray-50 rounded-lg grayscale hover:grayscale-0 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <img
                      src={client.logo_url || "/placeholder-64.png"}
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
            ) : (
              // Horizontal scroll untuk data banyak (>6)
              <div className="relative group">
                <div
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth cursor-grab active:cursor-grabbing scroll-container"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollBehavior: "smooth"
                  }}
                  onWheel={handleWheel}
                >
                  {clients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      className="flex-shrink-0 w-40 h-28 flex items-center justify-center p-4 bg-gray-50 rounded-lg grayscale hover:grayscale-0 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group scroll-item"
                      initial={{ opacity: 0, x: 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      <img
                        src={client.logo_url || "/placeholder-64.png"}
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
                
                {/* Scroll buttons */}
                {canScrollLeft && (
                  <motion.button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 z-10"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-emerald-600" />
                  </motion.button>
                )}
                
                {canScrollRight && (
                  <motion.button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 z-10"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-5 h-5 text-emerald-600" />
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Mobile: Horizontal scroll untuk semua data */}
          <div className="md:hidden">
            <div className="relative group">
              <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth cursor-grab active:cursor-grabbing scroll-container"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth"
                }}
                onWheel={handleWheel}
              >
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center p-3 bg-gray-50 rounded-lg grayscale hover:grayscale-0 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer group scroll-item"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <img
                      src={client.logo_url || "/placeholder-64.png"}
                      alt={client.name}
                      className="max-h-12 max-w-full w-auto object-contain transition-all duration-300 group-hover:brightness-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder-120x80.png"
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Mobile scroll indicators */}
              {canScrollLeft && (
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-emerald-600/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </motion.div>
              )}
              
              {canScrollRight && (
                <motion.div
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-emerald-600/80 backdrop-blur-sm rounded-full p-2 shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <ChevronRight className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
