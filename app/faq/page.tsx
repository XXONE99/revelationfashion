import { Metadata } from 'next'
import FAQSEO from '@/components/seo/FAQSEO'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"

export const metadata: Metadata = {
  title: 'FAQ - Pertanyaan Umum | REVELATION Konveksi Bandung',
  description: 'Pertanyaan umum seputar jasa konveksi seragam kantor, sekolah, dan pakaian kerja. Temukan jawaban lengkap di sini.',
  keywords: [
    'faq konveksi',
    'pertanyaan konveksi',
    'tanya jawab seragam',
    'konveksi bandung faq',
    'jasa pembuatan seragam faq'
  ]
}

const faqs = [
  {
    question: "Berapa lama waktu pengerjaan seragam?",
    answer: "Waktu pengerjaan seragam bervariasi tergantung jumlah dan kompleksitas desain. Untuk seragam kantor standar, kami membutuhkan 7-14 hari kerja. Sedangkan untuk seragam sekolah dengan jumlah besar, estimasi 2-3 minggu."
  },
  {
    question: "Apakah menyediakan jasa desain seragam?",
    answer: "Ya, kami menyediakan jasa desain seragam gratis untuk setiap pesanan. Tim desainer kami akan membantu membuat desain yang sesuai dengan kebutuhan dan identitas perusahaan atau sekolah Anda."
  },
  {
    question: "Berapa minimum order untuk konveksi?",
    answer: "Minimum order kami adalah 12 pcs untuk seragam kantor dan 24 pcs untuk seragam sekolah. Namun, untuk order custom dengan desain khusus, minimum order bisa disesuaikan dengan kebutuhan."
  },
  {
    question: "Apakah menyediakan jasa pengiriman ke seluruh Indonesia?",
    answer: "Ya, kami melayani pengiriman ke seluruh Indonesia. Biaya pengiriman akan disesuaikan dengan lokasi dan berat paket. Untuk area Jabodetabek, pengiriman gratis untuk order minimal 50 pcs."
  },
  {
    question: "Bagaimana sistem pembayaran yang tersedia?",
    answer: "Kami menerima pembayaran melalui transfer bank, e-wallet (GoPay, OVO, DANA), dan COD untuk area tertentu. Pembayaran dilakukan 50% DP saat order dan 50% sisanya saat seragam selesai."
  },
  {
    question: "Apakah menyediakan jasa perbaikan atau penyesuaian ukuran?",
    answer: "Ya, kami menyediakan jasa perbaikan dan penyesuaian ukuran gratis selama 30 hari setelah seragam diterima. Jika ada ketidaksesuaian ukuran atau kerusakan, silakan hubungi customer service kami."
  },
  {
    question: "Bahan apa saja yang tersedia untuk seragam?",
    answer: "Kami menyediakan berbagai jenis bahan berkualitas seperti Cotton Combed, Cotton Pique, Drill, Oxford, dan bahan premium lainnya. Semua bahan telah melalui quality control untuk memastikan kenyamanan dan ketahanan."
  },
  {
    question: "Bagaimana cara menghitung biaya konveksi?",
    answer: "Biaya konveksi dihitung berdasarkan jenis bahan, jumlah pesanan, kompleksitas desain, dan finishing. Kami akan memberikan quotation detail setelah konsultasi desain. Harga sudah termasuk bahan, jahitan, dan finishing."
  }
]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <FAQSEO faqs={faqs} />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">
                <span className="text-gray-900 dark:text-gray-100">Pertanyaan</span> <span className="text-emerald-600 dark:text-emerald-400">Umum</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Temukan jawaban untuk pertanyaan yang sering diajukan tentang jasa konveksi kami
              </p>
            </div>
          </div>
        </section>

        {/* FAQ List */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border dark:border-gray-700 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Masih Ada Pertanyaan?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Tim customer service kami siap membantu menjawab pertanyaan Anda
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="https://wa.me/6281312600281"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 transition-colors"
                  >
                    Chat WhatsApp
                  </a>
                  <a
                    href="/kontak"
                    className="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 dark:border-emerald-400 text-base font-medium rounded-md text-emerald-600 dark:text-emerald-400 bg-white dark:bg-gray-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    Hubungi Kami
                  </a>
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
