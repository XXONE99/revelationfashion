"use client"

import { Users } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Stats } from "@/entities/Stats"
import * as LucideIcons from 'lucide-react'
import { useRealtime } from "@/hooks/useRealtime"

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [stats, setStats] = useState<Stats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await Stats.list('order')
        setStats(data.filter(stat => stat.is_published))
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Realtime updates for stats
  useRealtime('stats', () => {
    const fetchStats = async () => {
      try {
        const data = await Stats.list('order')
        setStats(data.filter(stat => stat.is_published))
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    fetchStats()
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  if (isLoading) {
    return (
      <section ref={sectionRef} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 dark:border-emerald-400 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  if (stats.length === 0) {
    return (
      <section ref={sectionRef} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">Dipercaya oleh Ribuan Klien</h2>
            <p className="text-gray-600 dark:text-gray-300">Tidak ada statistik tersedia</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-4">Dipercaya oleh Ribuan Klien</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Pengalaman bertahun-tahun dan kepercayaan klien membuat kami menjadi pilihan utama untuk kebutuhan seragam
            berkualitas tinggi.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            return (
              <motion.div
                key={stat.id}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon && stat.icon.startsWith('lucide:') ? (
                    (() => {
                      const IconComponent = LucideIcons[stat.icon.replace('lucide:', '') as keyof typeof LucideIcons] as any;
                      return IconComponent ? <IconComponent className="h-8 w-8 text-emerald-600 dark:text-emerald-400" /> : <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />;
                    })()
                  ) : stat.icon ? (
                    <img src={stat.icon} alt={stat.title} className="h-8 w-8 object-contain"/>
                  ) : (
                    <Users className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 text-emerald-600 dark:text-emerald-400">
                  <CountUp end={parseInt(stat.value)} duration={2} start={isVisible} suffix={stat.suffix || ""} />
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.title}</div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CountUp({
  end,
  duration,
  start,
  suffix = "",
}: { end: number; duration: number; start: boolean; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number
    let animationFrame: number

    const easeOutQuart = (t: number): number => {
      return 1 - Math.pow(1 - t, 4)
    }

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)

      const easedProgress = easeOutQuart(progress)
      setCount(Math.floor(easedProgress * end))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, 200)

    return () => {
      cancelAnimationFrame(animationFrame)
      clearTimeout(timeoutId)
    }
  }, [end, duration, start])

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}
