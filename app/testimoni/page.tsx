import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Budi Santoso",
    position: "HR Manager • PT. Maju Bersama",
    avatar: "BS",
    rating: 5,
    text: "Kualitas seragam sangat bagus dan pelayanannya memuaskan. Tim Revelation sangat profesional dalam memenuhi kebutuhan perusahaan kami.",
  },
  {
    name: "Siti Aminah",
    position: "Owner • CV. Berkah Jaya",
    avatar: "SA",
    rating: 5,
    text: "Hasil jahitan rapi dan bahan berkualitas. Pengiriman tepat waktu sesuai deadline yang disepakati. Highly recommended!",
  },
  {
    name: "Ahmad Rifai",
    position: "Procurement Manager • PT. Teknologi Maju",
    avatar: "AR",
    rating: 4,
    text: "Pelayanan customer service yang responsif dan produk sesuai ekspektasi. Akan order lagi untuk kebutuhan seragam tahun depan.",
  },
  {
    name: "Andi Pratama",
    position: "HRD Manager • PT. Maju Sejahtera",
    avatar: "AP",
    rating: 5,
    text: "Sangat puas dengan kualitas kemeja yang diproduksi. Bahan berkualitas dan jahitan rapi. Tim Revelation sangat profesional dalam pelayanan.",
  },
  {
    name: "Sri Handayani",
    position: "Director • CV. Bumi Indah",
    avatar: "SH",
    rating: 5,
    text: "Pelayanan sangat memuaskan, produk sesuai ekspektasi. Pengerjaan tepat waktu dan harga bersaing. Recommended!",
  },
  {
    name: "Ahmad Rifai",
    position: "Procurement Manager • PT. Teknologi Maju",
    avatar: "AR",
    rating: 4,
    text: "Kualitas produk excellent, customer service responsive. Sudah beberapa kali order dan selalu puas dengan hasilnya.",
  },
]

export default function TestimoniPage() {
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
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                    </div>
                    <Quote className="w-6 h-6 text-emerald-200" />
                  </div>

                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 italic">"{testimonial.text}"</p>
                </div>
              ))}
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
