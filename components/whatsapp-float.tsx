"use client"
import { Phone } from "lucide-react"
import { useContactInfo } from "@/hooks/useContactInfo"

export function WhatsAppFloat() {
  const { contactInfo, isLoading } = useContactInfo()
  
  // Don't show if loading or no WhatsApp number
  if (isLoading || !contactInfo.whatsapp_number) {
    return null
  }

  // Format WhatsApp number (remove spaces, +, -, etc.)
  const formattedNumber = contactInfo.whatsapp_number.replace(/[\s+\-()]/g, '')
  const whatsappUrl = `https://wa.me/${formattedNumber}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 lg:bottom-6 z-50 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white p-4 rounded-full shadow-lg transition-colors"
      aria-label="Chat WhatsApp"
    >
      <div className="relative">
        <Phone className="w-6 h-6" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-gray-200 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-green-500 dark:bg-green-600 rounded-full"></div>
        </div>
      </div>
    </a>
  )
}
