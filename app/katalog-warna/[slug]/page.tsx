import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Phone, Globe, Mail, AlertTriangle } from "lucide-react"

const catalogDetails = {
  "size-chart-kemeja-kaos": {
    title: "Size Chart Kemeja & Kaos",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R1ha6x2Vzin15f4v1DprVKN3ZQpKOX.png",
    disclaimer: "Gunakan panduan ini untuk memilih ukuran yang paling sesuai. Toleransi ukuran 1-2 cm.",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
    tips: [
      "Pertimbangkan identitas brand perusahaan",
      "Pilih warna yang mudah perawatan",
      "Konsultasikan dengan tim kami untuk saran terbaik",
    ],
  },
  "katalog-warna-polo": {
    title: "Katalog Warna Polo Shirt",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-BjhJluIAZd4l2ZEgLJGPrUnV7JDpqL.png",
    disclaimer: "Warna pada layar mungkin sedikit berbeda dengan warna asli. Toleransi perbedaan warna 5-10%.",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
    tips: [
      "Pilih warna sesuai dengan identitas brand",
      "Pertimbangkan warna yang tidak mudah kotor",
      "Konsultasi gratis dengan tim desainer kami",
    ],
  },
  "panduan-ukuran-jaket": {
    title: "Panduan Ukuran Jaket",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-R1ha6x2Vzin15f4v1DprVKN3ZQpKOX.png",
    disclaimer: "Ukuran dapat bervariasi tergantung model jaket. Konsultasikan untuk hasil terbaik.",
    contact: {
      phone: "+62 821-1234-5678",
      website: "www.laksakarya.com",
      email: "laksakaryakonveksi@gmail.com",
    },
    tips: [
      "Ukur dengan teliti menggunakan meteran kain",
      "Pertimbangkan lapisan dalam jaket",
      "Konsultasi untuk model jaket khusus",
    ],
  },
}

export default function CatalogDetailPage({ params }: { params: { slug: string } }) {
  const detail = catalogDetails[params.slug as keyof typeof catalogDetails]

  if (!detail) {
    return <div>Catalog not found</div>
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Breadcrumb */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="text-sm text-gray-600">
              <span>Halaman Utama</span> / <span>Katalog Warna</span> /{" "}
              <span className="text-emerald-600">{detail.title}</span>
            </nav>
          </div>
        </section>

        {/* Catalog Detail */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Catalog Image */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6">{detail.title}</h1>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <img
                    src={detail.image || "/placeholder.svg"}
                    alt={detail.title}
                    className="w-full h-auto object-contain"
                  />
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-yellow-800 font-semibold mb-2">Disclaimer</h3>
                      <p className="text-yellow-700 text-sm leading-relaxed">{detail.disclaimer}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold mb-4 text-gray-800">Informasi Pemesanan</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Call / Whatsapp</div>
                        <div className="font-semibold text-emerald-600">{detail.contact.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Website</div>
                        <div className="font-semibold text-emerald-600">{detail.contact.website}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="text-sm">
                        <div className="text-gray-600">Email</div>
                        <div className="font-semibold text-emerald-600">{detail.contact.email}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all">
                    Konsultasi Warna Custom
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-white font-semibold py-3 rounded-lg transition-all"
                  >
                    Request Sample
                  </Button>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-blue-800 flex items-center">💡 Tips Pemilihan Warna:</h4>
                  <ul className="space-y-2 text-sm text-blue-700">
                    {detail.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
