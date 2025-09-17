"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { HeroSlide } from "@/entities/HeroSlide"
import { useRealtime } from "@/hooks/useRealtime"

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const data = await HeroSlide.list('order')
        setSlides(data.filter(slide => slide.is_published))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch hero slides:', error)
        setIsLoading(false)
      }
    }
    fetchSlides()
  }, [])

  // Realtime updates for hero slides
  useRealtime('hero_slides', () => {
    const fetchSlides = async () => {
      try {
        const data = await HeroSlide.list('order')
        setSlides(data.filter(slide => slide.is_published))
      } catch (error) {
        console.error('Failed to fetch hero slides:', error)
      }
    }
    fetchSlides()
  })

  useEffect(() => {
    if (slides.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (isLoading) {
    return (
      <section className="relative h-[600px] overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400"></div>
      </section>
    )
  }

  if (slides.length === 0) {
    return (
      <section className="relative h-[600px] overflow-hidden bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-300 mb-2">Tidak ada slide tersedia</h2>
          <p className="text-gray-500 dark:text-gray-400">Silakan tambahkan slide di halaman admin</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${slides[currentSlide].image_url}')` }}
          >
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
          </div>

          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold mb-6 text-balance dark:text-gray-100"
              >
                {slides[currentSlide].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-lg md:text-xl mb-8 text-balance max-w-2xl mx-auto dark:text-gray-200"
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              {slides[currentSlide].button_text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Button
                    size="lg"
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                      if (slides[currentSlide].button_link) {
                        window.open(slides[currentSlide].button_link, '_blank')
                      }
                    }}
                  >
                    {slides[currentSlide].button_text}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 dark:bg-gray-200/20 dark:hover:bg-gray-200/30 text-white dark:text-gray-200 p-2 rounded-full transition-all duration-300"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronLeft className="w-6 h-6" />
      </motion.button>
      <motion.button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 dark:bg-gray-200/20 dark:hover:bg-gray-200/30 text-white dark:text-gray-200 p-2 rounded-full transition-all duration-300"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
      >
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white dark:bg-gray-200 scale-125" : "bg-white/50 dark:bg-gray-200/50 hover:bg-white/70 dark:hover:bg-gray-200/70"
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white dark:text-gray-200 mt-8"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <p className="text-sm">Selengkapnya</p>
      </motion.div>
    </section>
  )
}
