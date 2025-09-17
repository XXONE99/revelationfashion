"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Loader2 } from "lucide-react"
import { ContactInfo, ContactInfoItem } from "@/entities/ContactInfo"
import { Contact } from "@/entities/Contact"
import LoadingScreen from "@/components/loading-screen"
import { toast } from "sonner"
import { useRealtime } from "@/hooks/useRealtime"

interface ContactData {
  contactInfo: ContactInfoItem[]
  settings: Record<string, string>
}

export default function KontakPage() {
  const [contactData, setContactData] = useState<ContactData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  })

  useEffect(() => {
    loadContactData()
  }, [])

  useRealtime('contact_info', () => {
    loadContactData()
  })

  const loadContactData = async () => {
    try {
      console.log("🔍 [KONTAK] Loading contact data...")
      const data = await ContactInfo.getContactData()
      setContactData(data)
      console.log("✅ [KONTAK] Contact data loaded successfully")
    } catch (error) {
      console.error("Failed to load contact data:", error)
      // Fallback to empty data
      setContactData({ contactInfo: [], settings: {} })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await Contact.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Perusahaan: ${formData.company}\n\nPesan: ${formData.message}`,
        is_read: false
      })

      toast.success("Pesan berhasil dikirim! Kami akan segera menghubungi Anda.")
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
      })
    } catch (error) {
      console.error("Failed to send message:", error)
      toast.error("Gagal mengirim pesan. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getContactInfoByType = (type: string) => {
    return contactData?.contactInfo.find(info => info.type === type)
  }

  if (isLoading) {
    return <LoadingScreen />
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-gray-100">
                Hubungi <span className="text-emerald-600 dark:text-emerald-400">Kami</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Siap melayani kebutuhan seragam perusahaan Anda. Konsultasikan project Anda dengan tim ahli kami.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Telepon</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {getContactInfoByType('phone')?.value || '+62 821-1234-5678'}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {getContactInfoByType('phone')?.subtitle || '24/7 Customer Service'}
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Email</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {getContactInfoByType('email')?.value || 'info@laksakarya.com'}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {getContactInfoByType('email')?.subtitle || 'Response dalam 2 jam'}
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Alamat</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {getContactInfoByType('address')?.value || 'Jl. Industri No. 123'}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {getContactInfoByType('address')?.subtitle || 'Jakarta Timur 13640'}
                </p>
              </div>

              <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-100">Jam Operasional</h3>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {getContactInfoByType('hours')?.value || 'Senin - Sabtu'}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {getContactInfoByType('hours')?.subtitle || '08:00 - 17:00 WIB'}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border dark:border-gray-700">
                <h2 className="text-2xl font-bold mb-8 text-emerald-600 dark:text-emerald-400">Kirim Pesan</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Lengkap</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="nama@email.com"
                        className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">No. Telepon</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="08xx-xxxx-xxxx"
                        className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nama Perusahaan</label>
                      <Input
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="PT. Nama Perusahaan"
                        className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Pesan</label>
                    <Textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      placeholder="Jelaskan kebutuhan seragam perusahaan Anda..."
                      rows={5}
                      className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-4 text-lg font-semibold rounded-md transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      'Kirim Pesan'
                    )}
                  </Button>
                </form>
              </div>

              {/* Map Section */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <div className="h-full min-h-[500px] bg-gray-100 dark:bg-gray-700 relative">
                  <iframe
                    src={contactData?.settings.google_maps_embed_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.1944491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sBandung%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1635724000000!5m2!1sen!2sid"}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "500px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
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
