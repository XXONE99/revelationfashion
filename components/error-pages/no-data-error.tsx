"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Plus, Home } from "lucide-react"
import Link from "next/link"

interface NoDataErrorProps {
  title?: string
  message?: string
  showRefreshButton?: boolean
  showAddButton?: boolean
  onRefresh?: () => void
  onAdd?: () => void
  addButtonText?: string
}

export function NoDataError({ 
  title = "No Data Found!",
  message = "There's nothing to show here yet.",
  showRefreshButton = true,
  showAddButton = false,
  onRefresh,
  onAdd,
  addButtonText = "Add New Item"
}: NoDataErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Background Circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-blue-200 dark:bg-blue-800/20 rounded-full opacity-40"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-200 dark:bg-blue-800/20 rounded-full opacity-30"></div>
        </div>

        {/* Main Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          <div className="flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Broken Paper */}
              <div className="relative">
                {/* Main paper */}
                <div className="w-32 h-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg relative">
                  {/* Folded corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-gray-100 dark:bg-gray-600 transform rotate-45 origin-top-right"></div>
                  
                  {/* Sad face */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full absolute top-0 left-0"></div>
                    <div className="w-2 h-2 bg-gray-600 dark:bg-gray-300 rounded-full absolute top-0 right-0"></div>
                    <div className="w-6 h-1 bg-gray-600 dark:bg-gray-300 rounded-full absolute top-3 left-1/2 transform -translate-x-1/2"></div>
                  </div>
                  
                  {/* Error lines */}
                  <div className="absolute top-16 left-2 w-6 h-0.5 bg-red-400 rounded-full transform rotate-12"></div>
                  <div className="absolute top-20 left-4 w-4 h-0.5 bg-red-400 rounded-full transform -rotate-12"></div>
                  <div className="absolute top-24 left-1 w-5 h-0.5 bg-red-400 rounded-full transform rotate-6"></div>
                  
                  {/* Tear line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 dark:bg-gray-500 transform -translate-y-1/2">
                    <div className="absolute left-0 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-2 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-4 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-6 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-8 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-10 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-12 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-14 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-16 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-18 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-20 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-22 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-24 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-26 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                    <div className="absolute left-28 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform rotate-12"></div>
                    <div className="absolute left-30 w-2 h-0.5 bg-gray-300 dark:bg-gray-500 transform -rotate-12"></div>
                  </div>
                  
                  {/* X mark */}
                  <div className="absolute bottom-4 left-2 w-4 h-4 text-red-500">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 transform rotate-45"></div>
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 transform -rotate-45"></div>
                  </div>
                </div>
                
                {/* Magnifying glass */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-8 -right-8 w-8 h-8 bg-gray-600 dark:bg-gray-400 rounded-full border-2 border-white dark:border-gray-600"
                >
                  <div className="absolute bottom-0 right-0 w-4 h-1 bg-gray-600 dark:bg-gray-400 transform rotate-45 origin-bottom-right"></div>
                </motion.div>
                
                {/* Broken lines below */}
                <div className="absolute -bottom-4 left-4 w-16 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                <div className="absolute -bottom-6 left-6 w-12 h-0.5 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2"
        >
          {title}
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-600 dark:text-gray-400 mb-8"
        >
          {message}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {showRefreshButton && (
            <Button 
              onClick={onRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          )}
          
          {showAddButton && (
            <Button 
              onClick={onAdd}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              {addButtonText}
            </Button>
          )}
          
          <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
