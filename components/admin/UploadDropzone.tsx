"use client"

import { useCallback, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { uploadImageToStorage } from "@/lib/supabase/storage"
import { toast } from "sonner"
import { Loader2, UploadCloud, X } from "lucide-react"

interface UploadDropzoneProps {

  bucket: string
  pathPrefix?: string
  multiple?: boolean
  className?: string
  onUploaded: (urls: string[]) => void
  label?: string
  accept?: string
  maxFiles?: number
}

export default function UploadDropzone({ 
  bucket, 
  pathPrefix, 
  multiple = true, 
  className, 
  onUploaded, 
  label = "Seret & lepas atau klik untuk unggah",
  accept = "image/*",
  maxFiles
}: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [previews, setPreviews] = useState<string[]>([])

  const handleFiles = useCallback(async (files: File[]) => {
    if (maxFiles && files.length > maxFiles) {
      toast.error(`Maksimal ${maxFiles} file.`)
      return
    }
    if (files.length === 0) return

    setIsUploading(true)
    setProgress(0)

    try {
      const total = files.length
      const urls: string[] = []
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        const objectUrl = URL.createObjectURL(file)
        setPreviews(prev => [...prev, objectUrl])
        const url = await uploadImageToStorage({ bucket, file, pathPrefix })
        urls.push(url)
        const pct = Math.round(((index + 1) / total) * 100)
        setProgress(pct)
      }
      onUploaded(urls)
      toast.success("Upload selesai")
    } catch (error) {
      console.error("Upload error", error)
      toast.error("Gagal mengunggah file")
    } finally {
      setIsUploading(false)
      // biarkan preview tetap untuk konteks; akan hilang saat parent merender list terbaru
      setTimeout(() => setPreviews([]), 1500)
    }
  }, [bucket, pathPrefix, onUploaded, maxFiles])

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files
    const files = fileList ? Array.from(fileList) : []
    handleFiles(files)
  }, [handleFiles])

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const dt = e.dataTransfer
    const files = dt.files ? Array.from(dt.files) : []
    handleFiles(files)
  }, [handleFiles])

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDragging) setIsDragging(true)
  }, [isDragging])

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple={multiple}
        accept={accept}
        onChange={onInputChange}
      />

      <motion.div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          "relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 cursor-pointer",
          "bg-white/60 dark:bg-gray-900/40 border-gray-300 dark:border-gray-700",
          isDragging && "border-emerald-500/70 bg-emerald-50/50 dark:bg-emerald-900/10"
        )}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <UploadCloud className="w-8 h-8 text-emerald-600" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Format: JPG, PNG, WEBP • Maks 10MB</p>
        </div>

        <AnimatePresence>
          {isUploading && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
              <div className="mt-3 w-2/3">
                <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-2 bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-300 text-center">{progress}%</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Preview sementara */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div 
            className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {previews.map((src, idx) => (
              <motion.div key={idx} className="relative group" initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
                <img src={src} alt="preview" className="h-24 w-full object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
                <button
                  type="button"
                  className="absolute top-1 right-1 p-1 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition"
                  onClick={(e) => { e.stopPropagation(); setPreviews(prev => prev.filter((_, i) => i !== idx)) }}
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


