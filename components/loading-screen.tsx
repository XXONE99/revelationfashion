"use client"

import { useEffect, useState } from "react"

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
        <div className="animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">REVELATION</h2>
          <p className="text-gray-600 dark:text-gray-300">Konveksi Bandung</p>
        </div>
      </div>
    </div>
  )
}