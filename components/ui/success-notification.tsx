"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X } from "lucide-react"

interface SuccessNotificationProps {
  isOpen: boolean
  onClose: () => void
  message: string
  itemCount?: number
  itemType?: string
}

export function SuccessNotification({ 
  isOpen, 
  onClose, 
  message, 
  itemCount = 1,
  itemType = "item"
}: SuccessNotificationProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, x: 100, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gray-800 rounded-lg shadow-2xl border border-gray-700 p-4 w-80"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <p className="text-white font-medium">
                  {message}
                </p>
                {itemCount > 0 && (
                  <p className="text-gray-300 text-sm">
                    {itemCount} {itemType}{itemCount > 1 ? 's' : ''} deleted successfully
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
