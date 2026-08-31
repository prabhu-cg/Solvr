import { AIPositioningSection } from '@/components/marketing/ai-positioning-section'
import { FAQSection } from '@/components/marketing/faq-section'
import { FeaturesSection } from '@/components/marketing/features-section'
import { FinalCTA } from '@/components/marketing/final-cta'
import { Footer } from '@/components/marketing/footer'
import { Hero } from '@/components/marketing/hero'
import { MarketingNav } from '@/components/marketing/marketing-nav'
import { ProcessSection } from '@/components/marketing/process-section'

export function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingNav />
      <main className="flex-1">
        <Hero />
        <ProcessSection />
        <FeaturesSection />
        <AIPositioningSection />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
