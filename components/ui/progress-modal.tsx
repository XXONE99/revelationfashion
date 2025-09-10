"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

interface ProgressModalProps {
  isOpen: boolean
  progress: number
  message: string
  itemCount: number
}

export function ProgressModal({ 
  isOpen, 
  progress, 
  message, 
  itemCount 
}: ProgressModalProps) {
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
          {/* Header */}
          <div className="flex items-center space-x-3 mb-3">
            <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
            <h3 className="text-white font-medium">
              {message}
            </h3>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-green-500 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-gray-400">
            Please do not close the browser
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
