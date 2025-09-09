"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PortfolioModalProps {
  isOpen: boolean
  onClose: () => void
  image: string
  title: string
}

export function PortfolioModal({ isOpen, onClose, image, title }: PortfolioModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-4xl max-h-[90vh] w-full">
        <Button
          variant="ghost"
          size="sm"
          className="absolute -top-12 right-0 text-white hover:text-gray-300"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
        <img
          src={image || "/placeholder-800x600.png"}
          alt={title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  )
}
