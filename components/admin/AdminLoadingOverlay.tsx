"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface AdminLoadingOverlayProps {
  isVisible: boolean
  title?: string
  message?: string
}

export default function AdminLoadingOverlay({ 
  isVisible, 
  title = "Memproses...", 
  message = "Mohon tunggu sebentar" 
}: AdminLoadingOverlayProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true)
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false)
      }, 300) // Wait for exit animation
      return () => clearTimeout(timer)
    }
  }, [isVisible])

  if (!shouldRender) return null

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">REVELATION</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">{title}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{message}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
