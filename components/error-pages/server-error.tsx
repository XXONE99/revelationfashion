"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { RefreshCw, Home, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface ServerErrorProps {
  title?: string
  message?: string
  showRefreshButton?: boolean
  onRefresh?: () => void
  errorCode?: string
}

export function ServerError({ 
  title = "500 SERVER ERROR",
  message = "Oops! Something went wrong on our end.",
  showRefreshButton = true,
  onRefresh,
  errorCode = "500"
}: ServerErrorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full opacity-30"></div>
          <div className="absolute top-40 right-16 w-16 h-16 bg-red-200 dark:bg-red-800/20 rounded-full opacity-40"></div>
          <div className="absolute bottom-40 left-20 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full opacity-50"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-red-200 dark:bg-red-800/20 rounded-full opacity-30"></div>
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
              {/* Server/Computer Illustration */}
              <div className="relative">
                {/* Main server body */}
                <div className="w-32 h-40 bg-gray-700 dark:bg-gray-600 rounded-lg shadow-lg relative">
                  {/* Screen */}
                  <div className="absolute top-4 left-4 right-4 h-16 bg-black rounded">
                    {/* Error screen content */}
                    <div className="p-2 text-green-400 text-xs font-mono">
                      <div>ERROR {errorCode}</div>
                      <div>Internal Server Error</div>
                      <div>Status: FAILED</div>
                      <div>Time: {new Date().toLocaleTimeString()}</div>
                    </div>
                  </div>
                  
                  {/* Status lights */}
                  <div className="absolute top-24 left-4 flex gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Error icon on screen */}
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-6 right-6 w-4 h-4 text-red-500"
                  >
                    <AlertTriangle className="w-full h-full" />
                  </motion.div>
                  
                  {/* Buttons */}
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                    <div className="w-6 h-2 bg-gray-500 rounded"></div>
                    <div className="w-6 h-2 bg-gray-500 rounded"></div>
                    <div className="w-6 h-2 bg-gray-500 rounded"></div>
                  </div>
                </div>
                
                {/* Cables */}
                <div className="absolute -bottom-2 left-2 w-1 h-8 bg-gray-500 rounded"></div>
                <div className="absolute -bottom-2 left-4 w-1 h-8 bg-gray-500 rounded"></div>
                <div className="absolute -bottom-2 left-6 w-1 h-8 bg-gray-500 rounded"></div>
                <div className="absolute -bottom-2 right-2 w-1 h-8 bg-gray-500 rounded"></div>
                <div className="absolute -bottom-2 right-4 w-1 h-8 bg-gray-500 rounded"></div>
                
                {/* Sparks */}
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-2 -right-2 w-3 h-3 text-yellow-400"
                >
                  <div className="w-full h-full bg-yellow-400 rounded-full"></div>
                </motion.div>
                
                <motion.div
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-4 -left-2 w-2 h-2 text-yellow-400"
                >
                  <div className="w-full h-full bg-yellow-400 rounded-full"></div>
                </motion.div>
                
                {/* Error messages floating */}
                <motion.div
                  animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-500 text-xs font-mono"
                >
                  ERROR
                </motion.div>
                
                <motion.div
                  animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute -top-12 right-4 text-red-500 text-xs font-mono"
                >
                  FAIL
                </motion.div>
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

        {/* Error Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-8"
        >
          <div className="inline-block bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-4 py-2 rounded-lg font-mono text-sm">
            Error Code: {errorCode}
          </div>
        </motion.div>

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
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button asChild variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </motion.div>

        {/* Additional Help Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xs text-gray-500 dark:text-gray-400 mt-6"
        >
          If this problem persists, please contact our support team.
        </motion.p>
      </div>
    </div>
  )
}
