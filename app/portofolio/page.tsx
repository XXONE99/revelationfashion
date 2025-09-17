"use client"

import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/entities/Product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Link as LinkIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import LoadingScreen from "@/components/loading-screen";
import Lightbox from "@/components/portfolio/Lightbox";
import Pagination from "@/components/common/Pagination";
import { useRealtime } from "@/hooks/useRealtime";

export default function Portfolio() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);
  const [hoverIndex, setHoverIndex] = useState<Record<string, number>>({});
  const hoverTimersRef = useRef<Record<string, any>>({});
  const itemsPerPage = 6;
  const HOVER_INTERVAL_MS = 3000;

  useEffect(() => {
    loadProducts();
  }, []);

  // Realtime refresh on products changes
  useRealtime('products', () => {
    loadProducts();
  })

  const loadProducts = async () => {
    console.log("🔍 [PORTFOLIO] Loading products...");
    try {
      // Try to load from database first
      const data = await Product.list();
      console.log("🔍 [PORTFOLIO] Database products:", data.length);
      const publishedProducts = data.filter(product => product.is_published);
      console.log("🔍 [PORTFOLIO] Published products:", publishedProducts.length);
      
      setProducts(publishedProducts);
      console.log("✅ [PORTFOLIO] Database products loaded:", publishedProducts.length);
    } catch (error) {
      console.error("Failed to load products:", error);
      // On error, show empty list; no dummy
      setProducts([]);
    } finally {
      setIsLoading(false);
      console.log("✅ [PORTFOLIO] Loading completed");
    }
  };

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return [
      { key: "all", label: "Semua" },
      ...categories.map(cat => ({
        key: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    ];
  };

  const filters = getUniqueCategories();

  const filteredProducts = activeFilter === "all" 
    ? products 
    : products.filter(product => product.category === activeFilter);

  console.log("🔍 [PORTFOLIO] Current products:", products.length);
  console.log("🔍 [PORTFOLIO] Filtered products:", filteredProducts.length);
  console.log("🔍 [PORTFOLIO] Active filter:", activeFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const openLightbox = (product: Product) => {
    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "";
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  const isTouchOrSmall = () => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none)').matches || window.innerWidth < 1024; // treat tablet/mobile as touch
  };

  const handleCardClick = (productId: string) => {
    if (isTouchOrSmall()) {
      setActiveOverlayId(prev => (prev === productId ? null : productId));
    }
  };

  const getProductImage = (product: Product) => {
    const idx = hoverIndex[product.id] ?? 0;
    const list = product.images && product.images.length > 0 ? product.images : [];
    return list[idx] || list[0] || "";
  };

  const startHoverLoop = (product: Product) => {
    const list = product.images || [];
    if (!list || list.length <= 1) return;
    // Hindari membuat interval ganda
    if (hoverTimersRef.current[product.id]) return;
    hoverTimersRef.current[product.id] = setInterval(() => {
      setHoverIndex(prev => {
        const current = prev[product.id] ?? 0;
        const next = (current + 1) % list.length;
        return { ...prev, [product.id]: next };
      });
    }, HOVER_INTERVAL_MS);
  };

  const stopHoverLoop = (product: Product) => {
    const timer = hoverTimersRef.current[product.id];
    if (timer) {
      clearInterval(timer);
      delete hoverTimersRef.current[product.id];
    }
    // reset kembali ke sampul
    setHoverIndex(prev => ({ ...prev, [product.id]: 0 }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Portofolio</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
              <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400">Halaman Utama</Link>
              <span>/</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">Portofolio</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => handleFilterChange(filter.key)}
                className={`px-5 py-2 text-sm rounded-md font-semibold transition-all duration-300 ${
                  activeFilter === filter.key
                    ? "bg-emerald-600 dark:bg-emerald-500 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {filter.label.toUpperCase()}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">{/* skeleton masonry */}
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="mb-6 break-inside-avoid animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md h-64"></div>
              ))}
            </div>
          ) : currentProducts.length > 0 ? (
            <>
              <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
                {currentProducts.map((product, index) => {
                  const sizeClass = (() => {
                    const sizes = [
                      'h-56', // small
                      'h-72', // medium
                      'h-96', // tall
                      'h-80', // mid-tall
                    ]
                    return sizes[index % sizes.length]
                  })()
                  return (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25 }}
                      className="mb-6 break-inside-avoid rounded-md overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg border dark:border-gray-700"
                      onClick={() => handleCardClick(product.id)}
                    >
                      <div 
                        className={`relative w-full ${sizeClass}`}
                        onMouseEnter={() => startHoverLoop(product)}
                        onMouseLeave={() => stopHoverLoop(product)}
                      >
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={getProductImage(product) || "placeholder"}
                            src={getProductImage(product) || "/placeholder.svg"}
                            alt={product.name}
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.995 }}
                            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                            className="absolute inset-0 w-full h-full object-cover will-change-transform"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1581375074612-d1fd0e661aeb?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                        </AnimatePresence>
                        <div className={`absolute inset-0 transition-all duration-300 ${activeOverlayId === product.id ? 'bg-black/60' : 'bg-black/10 md:bg-black/10 md:group-hover:bg-black/60'}`}></div>
                        <div className={`absolute inset-0 p-4 flex flex-col justify-end text-white transition-all duration-300 transform ${activeOverlayId === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0'}`}>
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <p className="text-sm capitalize">{product.category}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openLightbox(product); }}
                              className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                            <Link 
                              href={`/portofolio/${product.id}`}
                              className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                              onClick={(e) => { if (isTouchOrSmall() && activeOverlayId !== product.id) { e.preventDefault(); setActiveOverlayId(product.id); } }}
                            >
                              <LinkIcon className="w-5 h-5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {activeFilter === "all" ? "Belum ada produk yang tersedia" : "Tidak ada produk dalam kategori ini"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {activeFilter === "all" 
                    ? "Produk akan muncul di sini setelah admin menambahkan produk baru."
                    : `Tidak ada produk dalam kategori "${filters.find(f => f.key === activeFilter)?.label}".`
                  }
                </p>
                {activeFilter !== "all" && (
                  <button
                    onClick={() => handleFilterChange("all")}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                  >
                    Lihat Semua Produk
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />

      <Lightbox 
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageUrl={selectedImage}
      />
    </div>
  );
}
