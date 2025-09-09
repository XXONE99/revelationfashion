"use client"

import React, { useState, useEffect } from "react";
import { Product } from "@/entities/Product";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, Link as LinkIcon } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MobileNavigation } from "@/components/mobile-navigation";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { LoadingScreen } from "@/components/loading-screen";
import Lightbox from "@/components/portfolio/Lightbox";
import Pagination from "@/components/common/Pagination";

export default function Portfolio() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    console.log("🔍 [PORTFOLIO] Loading products...");
    try {
      // Try to load from database first
      const data = await Product.list();
      console.log("🔍 [PORTFOLIO] Database products:", data.length);
      const publishedProducts = data.filter(product => product.is_published);
      console.log("🔍 [PORTFOLIO] Published products:", publishedProducts.length);
      
      // If no products in database, use sample data
      if (publishedProducts.length === 0) {
        console.log("🔍 [PORTFOLIO] Using sample data...");
        const sampleProducts: Product[] = [
          {
            id: "jaket-bomber-premium",
            name: "Jaket Bomber Premium",
            description: "Jaket bomber berkualitas tinggi dengan logo custom",
            category: "jacket",
            images: ["/premium-black-bomber-jacket-with-company-logo.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "jaket-varsity-custom",
            name: "Jaket Varsity Custom",
            description: "Jaket varsity dengan desain merah putih",
            category: "jacket",
            images: ["/custom-varsity-jacket-red-white.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "kemeja-formal-putih",
            name: "Kemeja Formal Putih",
            description: "Kemeja formal putih untuk seragam kantor",
            category: "shirt",
            images: ["/formal-white-shirt-office-uniform.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "kemeja-batik-modern",
            name: "Kemeja Batik Modern",
            description: "Kemeja batik dengan desain modern",
            category: "shirt",
            images: ["/modern-batik-shirt-corporate.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "polo-shirt-corporate",
            name: "Polo Shirt Corporate",
            description: "Polo shirt untuk seragam perusahaan",
            category: "uniform-set",
            images: ["/corporate-polo-shirts-various-colors-with-embroide.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "polo-shirt-sport",
            name: "Polo Shirt Sport",
            description: "Polo shirt dengan teknologi dri-fit",
            category: "uniform-set",
            images: ["/sport-polo-shirt-dri-fit.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "celana-formal-hitam",
            name: "Celana Formal Hitam",
            description: "Celana formal hitam untuk seragam kantor",
            category: "pants",
            images: ["/formal-black-pants-office.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: "celana-chino-navy",
            name: "Celana Chino Navy",
            description: "Celana chino navy untuk tampilan casual",
            category: "pants",
            images: ["/navy-chino-pants-casual.jpg"],
            is_published: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setProducts(sampleProducts);
        console.log("✅ [PORTFOLIO] Sample products loaded:", sampleProducts.length);
      } else {
        setProducts(publishedProducts);
        console.log("✅ [PORTFOLIO] Database products loaded:", publishedProducts.length);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      // Fallback to sample data if database fails
      const sampleProducts: Product[] = [
        {
          id: "jaket-bomber-premium",
          name: "Jaket Bomber Premium",
          description: "Jaket bomber berkualitas tinggi dengan logo custom",
          category: "jacket",
          images: ["/premium-black-bomber-jacket-with-company-logo.jpg"],
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "kemeja-formal-putih",
          name: "Kemeja Formal Putih",
          description: "Kemeja formal putih untuk seragam kantor",
          category: "shirt",
          images: ["/formal-white-shirt-office-uniform.jpg"],
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setProducts(sampleProducts);
      console.log("✅ [PORTFOLIO] Fallback products loaded:", sampleProducts.length);
    } finally {
      setIsLoading(false);
      console.log("✅ [PORTFOLIO] Loading completed");
    }
  };

  const filters = [
    { key: "all", label: "Semua" },
    { key: "shirt", label: "Kemeja" },
    { key: "jacket", label: "Jaket" },
    { key: "uniform-set", label: "Polo Shirt" },
    { key: "pants", label: "Celana" }
  ];

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

  const getProductImage = (product: Product) => {
    return product.images && product.images.length > 0 ? product.images[0] : "";
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-12 bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Portofolio</h1>
            <div className="text-sm text-gray-500 flex items-center gap-2">
              <Link href="/" className="hover:text-emerald-600">Halaman Utama</Link>
              <span>/</span>
              <span className="font-medium text-gray-800">Portofolio</span>
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
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {filter.label.toUpperCase()}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-64 rounded-md"></div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative block overflow-hidden rounded-md cursor-pointer"
                  >
                    <img
                      src={getProductImage(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://images.unsplash.com/photo-1581375074612-d1fd0e661aeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/60 transition-all duration-300"></div>
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <h3 className="font-bold text-lg">{product.name}</h3>
                      <p className="text-sm capitalize">{product.category}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          onClick={() => openLightbox(product)}
                          className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                        <Link 
                          href={`/portofolio/${product.id}`}
                          className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-all duration-200"
                        >
                          <LinkIcon className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
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
