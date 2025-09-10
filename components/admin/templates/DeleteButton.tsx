"use client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
  onDelete: () => void
  itemName: string
  itemType?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function DeleteButton({ 
  onDelete, 
  itemName, 
  itemType = "item", 
  size = "sm",
  variant = "destructive"
}: DeleteButtonProps) {
  return (
    <Button 
      size={size}
      variant={variant}
      onClick={onDelete}
      className="bg-emerald-600 hover:bg-emerald-700 text-white"
    >
      <Trash2 className="w-4 h-4 mr-1" />
      Hapus
    </Button>
  )
}
