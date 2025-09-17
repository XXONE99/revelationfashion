"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { OurClient } from "@/entities/OurClient"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRealtime } from "@/hooks/useRealtime"

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
  const mobileScrollRef = useRef<HTMLDivElement>(null)
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

  // Realtime updates for clients
  useRealtime('our_clients', () => {
    const fetchClients = async () => {
      try {
        const data = await OurClient.list()
        setClients(data.filter(client => client.is_published))
      } catch (error) {
        console.error('Failed to fetch clients:', error)
      }
    }
    fetchClients()
  })

  // Check scroll position
  const checkScrollPosition = () => {
    const container = scrollRef.current || mobileScrollRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setCanScrollLeft(scrollLeft > 5) // Add small threshold
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
    }
  }

  // Scroll functions
  const scrollLeft = () => {
    const container = scrollRef.current || mobileScrollRef.current
    if (container) {
      const scrollAmount = 200 // Reduced scroll amount for smoother navigation
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    const container = scrollRef.current || mobileScrollRef.current
    if (container) {
      const scrollAmount = 200 // Reduced scroll amount for smoother navigation
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      })
    }
  }


  // Handle mouse enter/leave to control scroll behavior
  const handleMouseEnter = () => {
    // Add event listener to prevent vertical scroll when hovering
    const handleWheelPrevent = (e: WheelEvent) => {
      const container = scrollRef.current || mobileScrollRef.current
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container
        const canScrollHorizontally = scrollWidth > clientWidth
        
        if (canScrollHorizontally) {
          e.preventDefault()
          e.stopPropagation()
          container.scrollBy({
            left: e.deltaY > 0 ? 100 : -100,
            behavior: 'smooth'
          })
        }
      }
    }
    
    document.addEventListener('wheel', handleWheelPrevent, { passive: false })
    
    // Store the handler for cleanup
    ;(document as any).__wheelHandler = handleWheelPrevent
  }

  const handleMouseLeave = () => {
    // Remove the wheel event listener
    const handler = (document as any).__wheelHandler
    if (handler) {
      document.removeEventListener('wheel', handler)
      delete (document as any).__wheelHandler
    }
  }

  // Auto scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    const mobileContainer = mobileScrollRef.current
    
    const handleScroll = () => checkScrollPosition()
    
    if (scrollContainer && clients.length > 6) {
      scrollContainer.addEventListener('scroll', handleScroll)
    }
    
    if (mobileContainer) {
      mobileContainer.addEventListener('scroll', handleScroll)
    }
    
    checkScrollPosition() // Initial check
    
    // Check scroll position after a delay to ensure DOM is ready
    const timeoutId = setTimeout(checkScrollPosition, 100)
    
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      if (mobileContainer) {
        mobileContainer.removeEventListener('scroll', handleScroll)
      }
      clearTimeout(timeoutId)
    }
  }, [clients])

  // Check scroll position when window resizes
  useEffect(() => {
    const handleResize = () => {
      setTimeout(checkScrollPosition, 100)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cleanup: restore body scroll when component unmounts
  useEffect(() => {
    return () => {
      // Clean up any remaining wheel event listener
      const handler = (document as any).__wheelHandler
      if (handler) {
        document.removeEventListener('wheel', handler)
        delete (document as any).__wheelHandler
      }
    }
  }, [])

  if (isLoading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (clients.length === 0) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Our Client</h2>
            <p className="text-gray-600 dark:text-gray-300">Tidak ada klien tersedia</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: scrollStyles }} />
      <section 
        className="py-16 bg-white dark:bg-gray-900 overflow-hidden text-gray-900 dark:text-gray-100"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container mx-auto px-4 text-gray-900 dark:text-gray-100">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">Our Client</h2>
          <div className="w-16 h-1 bg-emerald-600 dark:bg-emerald-400 mx-auto"></div>
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
                    className="w-40 h-28 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg grayscale hover:grayscale-0 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group"
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
                >
                  {clients.map((client, index) => (
                    <motion.div
                      key={client.id}
                      className="flex-shrink-0 w-40 h-28 flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg grayscale hover:grayscale-0 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group scroll-item"
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
                
                {/* Scroll buttons - Always visible for better UX */}
                <motion.button
                  onClick={scrollLeft}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 z-10 border border-emerald-100 dark:border-emerald-800 ${
                    !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: canScrollLeft ? 1 : 0.5, x: 0 }}
                  whileHover={canScrollLeft ? { scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" } : {}}
                  whileTap={canScrollLeft ? { scale: 0.9 } : {}}
                  disabled={!canScrollLeft}
                >
                  <ChevronLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </motion.button>
                
                <motion.button
                  onClick={scrollRight}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl transition-all duration-300 z-10 border border-emerald-100 dark:border-emerald-800 ${
                    !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-600'
                  }`}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: canScrollRight ? 1 : 0.5, x: 0 }}
                  whileHover={canScrollRight ? { scale: 1.1, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" } : {}}
                  whileTap={canScrollRight ? { scale: 0.9 } : {}}
                  disabled={!canScrollRight}
                >
                  <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile: Horizontal scroll untuk semua data */}
          <div className="md:hidden">
            <div className="relative group">
              <div
                ref={mobileScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 px-2 scroll-smooth cursor-grab active:cursor-grabbing scroll-container"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth"
                }}
              >
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    className="flex-shrink-0 w-32 h-20 flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg grayscale hover:grayscale-0 hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer group scroll-item"
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
              
              {/* Mobile scroll buttons */}
              <motion.button
                onClick={scrollLeft}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-emerald-600/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 z-10 border border-emerald-500/20 ${
                  !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-emerald-600'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: canScrollLeft ? 1 : 0.5, scale: 1 }}
                whileHover={canScrollLeft ? { scale: 1.1, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" } : {}}
                whileTap={canScrollLeft ? { scale: 0.9 } : {}}
                disabled={!canScrollLeft}
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </motion.button>
              
              <motion.button
                onClick={scrollRight}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-emerald-600/90 backdrop-blur-sm rounded-full p-2 shadow-lg transition-all duration-300 z-10 border border-emerald-500/20 ${
                  !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:bg-emerald-600'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: canScrollRight ? 1 : 0.5, scale: 1 }}
                whileHover={canScrollRight ? { scale: 1.1, boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)" } : {}}
                whileTap={canScrollRight ? { scale: 0.9 } : {}}
                disabled={!canScrollRight}
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
