"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Error404Props {
  title?: string
  message?: string
  showBackButton?: boolean
  backUrl?: string
}

export function Error404({ 
  title = "404 ERROR PAGE", 
  message = "uh-oh! Nothing here...",
  showBackButton = true,
  backUrl = "/"
}: Error404Props) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Main Illustration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Background Numbers */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl md:text-9xl font-bold text-gray-200 dark:text-gray-700 select-none">
              <span className="opacity-30">4</span>
              <span className="opacity-30">4</span>
            </div>
          </div>
          
          {/* Robot Illustration */}
          <div className="relative z-10 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Robot Body */}
              <div className="w-24 h-32 bg-blue-500 rounded-lg relative shadow-lg">
                {/* Robot Head */}
                <div className="w-16 h-16 bg-blue-600 rounded-full absolute -top-8 left-1/2 transform -translate-x-1/2 shadow-md">
                  {/* Eyes */}
                  <div className="absolute top-3 left-2 w-3 h-3 bg-orange-400 rounded-full"></div>
                  <div className="absolute top-3 right-2 w-3 h-3 bg-orange-400 rounded-full"></div>
                  
                  {/* X on face */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold">X</div>
                  
                  {/* Broken antenna */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-red-500 rounded-full"></div>
                </div>
                
                {/* Chest panel */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-orange-400 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                
                {/* Arms */}
                <div className="absolute top-6 -left-2 w-4 h-8 bg-blue-500 rounded transform rotate-12"></div>
                <div className="absolute top-6 -right-2 w-4 h-8 bg-blue-500 rounded transform -rotate-12"></div>
                
                {/* Legs */}
                <div className="absolute bottom-0 left-2 w-6 h-8 bg-blue-500 rounded transform rotate-6"></div>
                <div className="absolute bottom-0 right-2 w-6 h-8 bg-blue-500 rounded transform -rotate-6"></div>
              </div>
              
              {/* Wrench in hand */}
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-8 -left-6 w-3 h-8 bg-gray-600 rounded transform rotate-45"
              ></motion.div>
              
              {/* Scattered wires */}
              <div className="absolute -bottom-4 -left-4 w-8 h-1 bg-gray-400 rounded transform rotate-45"></div>
              <div className="absolute -bottom-2 -right-6 w-6 h-1 bg-gray-400 rounded transform -rotate-45"></div>
              
              {/* Spark */}
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute top-4 -right-8 w-2 h-2 bg-orange-400 rounded-full"
              ></motion.div>
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
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href={backUrl}>
              <Home className="w-4 h-4 mr-2" />
              GO BACK HOME
            </Link>
          </Button>
          
          {showBackButton && (
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  )
}
