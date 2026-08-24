import React from 'react'
import Contact from '@/components/Contact'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import ResultsSection from '@/components/ResultsSection'
import SiteFooter from '@/components/SiteFooter' // trigger HMR
import PhysicsThrow from '@/components/PhysicsThrow'
import FloatingCTA from '@/components/FloatingCTA'
import { RevealProvider } from '@/components/RevealLayout'
import Navbar from '@/components/Navbar'
import BrandsWhoTrustUs from '@/components/BrandsWhoTrustUs'
import OurServices from '@/components/OurServices'
import Manifesto from '@/components/Manifesto'
import DeferredSection from '@/components/DeferredSection'
import HeroSection from '@/components/HeroSection'

const page = () => {
  return (
    <RevealProvider>
      <FloatingCTA />
      <Navbar />

      {/* HeroSection renders:
          1. Hero2Background (position: fixed, OUTSIDE RevealLayout — prevents VRAM eviction)
          2. RevealLayout > Hero2 (foreground text/CTA, INSIDE RevealLayout — clip-path reveal) */}
      <HeroSection />

      {/* Below-fold sections are deferred until after the reveal animation
          completes, preventing their GSAP/ScrollTrigger/ResizeObserver init
          from competing with the hero animation for main-thread budget. */}
      <DeferredSection>
        <Manifesto />
        <BrandsWhoTrustUs />
        <WhyInfotainmentWorks />

        <OurServices />
        <ResultsSection />

        {/* Transition B — Contact card-lift (self-contained within Contact.tsx) */}
        <Contact />

        {/* <PhysicsThrow /> */}

        <SiteFooter />
      </DeferredSection>
    </RevealProvider>
  )
}

export default page


