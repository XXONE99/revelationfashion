"use client"

import { Header } from "@/components/header"
import { HeroSlider } from "@/components/hero-slider"
import { StatsSection } from "@/components/stats-section"
import { OurClientSection } from "@/components/our-client-section"
import { WhyChooseUsSection } from "@/components/why-choose-us-section"
import { Footer } from "@/components/footer"
import { MobileNavigation } from "@/components/mobile-navigation"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import LoadingScreen from "@/components/loading-screen"
import { ParallaxSection } from "@/components/parallax-section"
import { motion } from "framer-motion"
import { useRealtime } from "@/hooks/useRealtime"

export default function HomePage() {
  return (
    <>
      <LoadingScreen />
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <main>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2 }}>
            <HeroSlider />
          </motion.div>

          <ParallaxSection speed={0.3}>
            <StatsSection />
          </ParallaxSection>

          <ParallaxSection speed={0.4}>
            <OurClientSection />
          </ParallaxSection>

          <ParallaxSection speed={0.3}>
            <WhyChooseUsSection />
          </ParallaxSection>
        </main>
        <Footer />
        <MobileNavigation />
        <WhatsAppFloat />
      </div>
    </>
  )
}
