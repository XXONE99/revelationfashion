"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import LoadingScreen from "@/components/loading-screen"
import { Button } from "@/components/ui/button"
import { Calendar, User, Phone, Globe, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { ProjectPost } from "@/entities/ProjectPost"

export default function ClientDetailPage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<ProjectPost | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    loadProject()
  }, [params.slug])

  // Auto-play carousel
  useEffect(() => {
    if (!project?.images || project.images.length <= 1 || !isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % project.images!.length)
    }, 3000) // Change image every 3 seconds

    return () => clearInterval(interval)
  }, [project?.images, isAutoPlaying])

  // Resume auto-play after user interaction
  useEffect(() => {
    if (!isAutoPlaying) {
      const resumeTimer = setTimeout(() => {
        setIsAutoPlaying(true)
      }, 5000) // Resume auto-play after 5 seconds of no interaction

      return () => clearTimeout(resumeTimer)
    }
  }, [isAutoPlaying])

  const loadProject = async () => {
    try {
      console.log("🔍 [CLIENT DETAIL] Loading project:", params.slug)
      const data = await ProjectPost.get(params.slug)
      setProject(data)
      console.log("✅ [CLIENT DETAIL] Project loaded:", data?.title)
    } catch (error) {
      console.error("Failed to load project:", error)
      setProject(null)
    } finally {
      setIsLoading(false)
    }
  }

  const nextImage = () => {
    const images = project?.images || []
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
  }

  const prevImage = () => {
    const images = project?.images || []
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsAutoPlaying(false) // Stop auto-play when user manually navigates
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Proyek tidak ditemukan</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Proyek yang Anda cari tidak tersedia.</p>
            <Button asChild>
              <a href="/client-proyek">Kembali ke Client & Proyek</a>
            </Button>
          </div>
        </main>
        <Footer />
        <MobileNavigation />
        <WhatsAppFloat />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {/* Breadcrumb */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-8 bg-gray-50 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600 dark:text-gray-300">
              <span>Halaman Utama</span> / <span>Client & Proyek</span> /{" "}
              <span className="text-emerald-600 dark:text-emerald-400">{project.title}</span>
            </nav>
          </div>
        </motion.section>

        {/* Project Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-4 dark:text-gray-100">{project.title}</h1>
              <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(project.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{project.category}</span>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
              >
                {/* Main Carousel */}
                <div className="relative mb-6">
                  <div className="w-full h-96 overflow-hidden rounded-lg shadow-lg bg-gray-100 dark:bg-gray-800">
                    <img
                      src={project.images?.[currentImageIndex] || "/placeholder.svg"}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain will-change-transform"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                  </div>

                  {(project.images?.length || 0) > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronLeft className="h-5 w-5 text-white" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <ChevronRight className="h-5 w-5 text-white" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Navigation */}
                {project.images && project.images.length > 1 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Gambar Tambahan</h3>
                    <div className="grid grid-cols-5 gap-3">
                      {project.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => handleThumbnailClick(index)}
                          className={`relative w-full h-20 overflow-hidden rounded-lg border transition-all bg-gray-100 dark:bg-gray-800 ${currentImageIndex === index ? 'ring-2 ring-emerald-500 dark:ring-emerald-400 border-emerald-500 dark:border-emerald-400' : 'border-gray-200 dark:border-gray-600 hover:border-emerald-300 dark:hover:border-emerald-400'}`}
                          aria-label={`Thumbnail ${index + 1}`}
                        >
                          <img
                            src={image}
                            alt={`${project.title} - ${index + 1}`}
                            className="absolute inset-0 w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/placeholder.svg";
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prose max-w-none">
                  <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">{project.description}</p>
                </div>
              </motion.div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
                  <h3 className="font-semibold mb-4 text-lg dark:text-gray-100">Informasi Pemesanan</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block">Call / Whatsapp:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">+62 821-1234-5678</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Globe className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block">Website:</span>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">www.laksakarya.com</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <span className="text-gray-600 dark:text-gray-300 block">Email:</span>
                        <span className="text-green-600 dark:text-green-400 font-medium">laksakaryakonveksi@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors duration-300">
                    Konsultasi Sekarang
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Comment Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 border-t pt-8"
            >
              <h3 className="text-xl font-semibold mb-6 dark:text-gray-100">Leave a comment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Email Anda tidak akan dipublikasikan. Ruas yang wajib ditandai *
              </p>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Comment*</label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                    placeholder="Tulis komentar Anda..."
                  ></textarea>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name*</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Email*</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-gray-800 hover:bg-gray-900 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-8 py-3 transition-colors duration-300"
                >
                  Post Comment
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
