"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Loader2, X } from "lucide-react"

export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'loading'
  title: string
  message: string
  duration?: number
}

interface AdminToastProps {
  notification: ToastNotification | null
  onClose: () => void
}

export default function AdminToast({ notification, onClose }: AdminToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setIsVisible(true)
      
      // Auto close after duration (except for loading)
      if (notification.type !== 'loading' && notification.duration !== 0) {
        const timer = setTimeout(() => {
          handleClose()
        }, notification.duration || 4000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [notification])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Wait for animation to complete
  }

  const getIcon = () => {
    switch (notification?.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'loading':
        return <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (notification?.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'loading':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }
  }

  const getTitleColor = () => {
    switch (notification?.type) {
      case 'success':
        return 'text-green-800 dark:text-green-200'
      case 'error':
        return 'text-red-800 dark:text-red-200'
      case 'loading':
        return 'text-emerald-800 dark:text-emerald-200'
      default:
        return 'text-gray-800 dark:text-gray-200'
    }
  }

  const getMessageColor = () => {
    return 'text-gray-600 dark:text-gray-300'
  }

  return (
    <AnimatePresence>
      {notification && isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 300, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 300, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50 max-w-sm w-full"
        >
          <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 relative`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-semibold ${getTitleColor()}`}>
                  {notification.title}
                </h4>
                <p className={`text-xs mt-1 ${getMessageColor()}`}>
                  {notification.message}
                </p>
              </div>
              {notification.type !== 'loading' && (
                <button
                  onClick={handleClose}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
