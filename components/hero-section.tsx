import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/modern-warehouse-with-yellow-boxes-and-industrial-.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Pengiriman Seluruh Indonesia</h1>
        <p className="text-lg md:text-xl mb-8 text-balance max-w-2xl mx-auto">
          Melayani seluruh nusantara dengan sistem pengiriman terpercaya dan packaging yang aman untuk produk Anda.
        </p>
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg font-semibold">
          Baca More
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white">
        <p className="text-sm">Selengkapnya</p>
      </div>
    </section>
  )
}
