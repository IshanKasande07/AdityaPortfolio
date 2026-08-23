import React from 'react'
import Hero2 from '@/components/Hero2'
import Contact from '@/components/Contact'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import ResultsSection from '@/components/ResultsSection'
import SiteFooter from '@/components/SiteFooter' // trigger HMR
import PhysicsThrow from '@/components/PhysicsThrow'
import FloatingCTA from '@/components/FloatingCTA'
import RevealLayout, { RevealProvider } from '@/components/RevealLayout'
import Navbar from '@/components/Navbar'
import BrandsWhoTrustUs from '@/components/BrandsWhoTrustUs'
import OurServices from '@/components/OurServices'
import Manifesto from '@/components/Manifesto'
import DeferredSection from '@/components/DeferredSection'

const page = () => {
  return (
    <RevealProvider>
      <FloatingCTA />
      <Navbar />

      {/* Hero as one clipped card — cream border on all 4 sides */}
      {/* 
        CRITICAL PERFORMANCE HACK: 
        We wrap Hero2 in a `sticky` container that stays in the viewport forever. 
        Because it stays in the viewport, Chrome NEVER evicts the 7 heavy WebP compositor layers. 
        Instead of scrolling out of view, the rest of the page (DeferredSection) just scrolls OVER it.
        This completely eliminates the 150ms tile upload stutter.
      */}
      <div className="sticky top-0 w-full h-[100vh] z-0">
        <RevealLayout>
          <Hero2 />
        </RevealLayout>
      </div>

      {/* Below-fold sections are deferred until after the reveal animation
          completes, preventing their GSAP/ScrollTrigger/ResizeObserver init
          from competing with the hero animation for main-thread budget. */}
      <DeferredSection>
        <Manifesto />
        {/* <BrandsWhoTrustUs /> */}
        <OurServices />
        {/* <ResultsSection />
        <Contact /> */}

        {/* <PhysicsThrow /> */}

        <SiteFooter />
      </DeferredSection>
    </RevealProvider>
  )
}

export default page

