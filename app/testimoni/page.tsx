"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Star, Quote } from "lucide-react"
import { Testimonial } from "@/entities/Testimonial"
import { LoadingScreen } from "@/components/loading-screen"
import { getInitialsFromName } from "@/lib/utils"

export default function TestimoniPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTestimonials()
  }, [])

  const loadTestimonials = async () => {
    try {
      console.log("🔍 [TESTIMONI] Loading testimonials...")
      const data = await Testimonial.list()
      const publishedTestimonials = data.filter(testimonial => testimonial.is_published)
      setTestimonials(publishedTestimonials)
      console.log("✅ [TESTIMONI] Testimonials loaded:", publishedTestimonials.length)
    } catch (error) {
      console.error("Failed to load testimonials:", error)
      setTestimonials([])
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <LoadingScreen />
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Testimoni <span className="text-emerald-600">Klien</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Kepercayaan dan kepuasan klien adalah prioritas utama kami. Simak testimoni dari berbagai perusahaan
                yang telah bekerja sama dengan kami.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            {testimonials.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-4">
                      {testimonial.avatar_url && /^https?:\/\//i.test(testimonial.avatar_url) ? (
                        <img 
                          src={testimonial.avatar_url} 
                          alt={testimonial.client_name}
                          className="w-12 h-12 rounded-full object-cover mr-4"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold mr-4 ${testimonial.avatar_url && /^https?:\/\//i.test(testimonial.avatar_url) ? 'hidden' : ''}`}>
                        {getInitialsFromName(testimonial.client_name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{testimonial.client_name}</h3>
                        <p className="text-sm text-gray-600">{testimonial.company}</p>
                      </div>
                      <Quote className="w-6 h-6 text-emerald-200" />
                    </div>

                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Belum ada testimoni yang tersedia</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileNavigation />
      <WhatsAppFloat />
    </div>
  )
}
