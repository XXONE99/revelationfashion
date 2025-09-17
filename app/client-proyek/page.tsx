"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import LoadingScreen from "@/components/loading-screen"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { ProjectPost } from "@/entities/ProjectPost"
import { useRealtime } from "@/hooks/useRealtime"

const ITEMS_PER_PAGE = 3

export default function ClientProyekPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [projects, setProjects] = useState<ProjectPost[]>([])

  useEffect(() => {
    loadProjects()
  }, [])

  useRealtime('project_posts', () => {
    loadProjects()
  })

  const loadProjects = async () => {
    try {
      console.log("🔍 [CLIENT PROYEK] Loading projects...")
      const data = await ProjectPost.list()
      const publishedProjects = data.filter(project => project.is_published)
      setProjects(publishedProjects)
      console.log("✅ [CLIENT PROYEK] Projects loaded:", publishedProjects.length)
    } catch (error) {
      console.error("Failed to load projects:", error)
      setProjects([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "ALL" || project.category.toUpperCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories from projects
  const categories = Array.from(new Set(projects.map(p => p.category.toUpperCase())))
    .map(cat => ({
      name: cat,
      count: projects.filter(p => p.category.toUpperCase() === cat).length
    }))

  // Get recent posts (latest 3 projects)
  const recentPosts = projects.slice(0, 3).map(project => ({
    title: project.title,
    date: new Date(project.created_at).toLocaleDateString('id-ID'),
    image: project.images?.[0] || "/placeholder.svg"
  }))

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentProjects = filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="py-12 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Client & Proyek</h1>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Halaman Utama</Link>
                <span>/</span>
                <span className="font-medium text-gray-800 dark:text-gray-200">Client & Proyek</span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-8"
                >
                  {currentProjects.length > 0 ? (
                    currentProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="md:flex">
                          <div className="md:w-1/3 p-4">
                            <img
                              src={project.images?.[0] || "/placeholder.svg"}
                              alt={project.title}
                              className="w-full h-48 md:h-56 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="md:w-2/3 p-6">
                            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{project.title}</h2>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-4">
                              <span className="flex items-center gap-1">📅 {new Date(project.created_at).toLocaleDateString('id-ID')}</span>
                              <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded text-xs font-medium">
                                {project.category}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{project.description}</p>
                            <Link href={`/client-proyek/${project.id}`}>
                              <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white transition-colors duration-300">
                                Read More
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchTerm || selectedCategory !== "ALL" 
                          ? "Tidak ada proyek yang sesuai dengan filter" 
                          : "Belum ada proyek yang tersedia"
                        }
                      </p>
                    </div>
                  )}
                </motion.div>

                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex justify-center items-center gap-4 mt-12"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className={currentPage === page ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600" : ""}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-1"
              >
                <div className="space-y-8">
                  {/* Search */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Search</h3>
                    <div className="relative">
                      <Input
                        placeholder="Search projects..."
                        className="pr-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Button size="sm" className="absolute right-1 top-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600">
                        <Search className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Kategori</h3>
                    <ul className="space-y-2">
                      <li
                        className={`flex justify-between cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${selectedCategory === "ALL" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-600 dark:text-gray-300"}`}
                        onClick={() => setSelectedCategory("ALL")}
                      >
                        <span>SEMUA</span>
                        <span className="text-gray-400 dark:text-gray-500">({projects.length})</span>
                      </li>
                      {categories.map((category, index) => (
                        <li
                          key={index}
                          className={`flex justify-between cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors ${selectedCategory === category.name ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-gray-600 dark:text-gray-300"}`}
                          onClick={() => setSelectedCategory(category.name)}
                        >
                          <span>{category.name}</span>
                          <span className="text-gray-400 dark:text-gray-500">({category.count})</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recent Posts */}
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border dark:border-gray-700">
                    <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Recent Posts</h3>
                    <div className="space-y-4">
                      {recentPosts.map((post, index) => (
                        <motion.div key={index} whileHover={{ x: 5 }} className="flex gap-3 cursor-pointer">
                          <img
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="text-sm font-medium hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors dark:text-gray-200">{post.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{post.date}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
