import React from 'react'
import Hero2 from '@/components/Hero2'
import Contact from '@/components/Contact'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import ResultsSection from '@/components/ResultsSection'
import Footer from '@/components/Footer' // trigger HMR
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
      <RevealLayout>
        <Hero2 />
      </RevealLayout>

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

        <Footer />
      </DeferredSection>
    </RevealProvider>
  )
}

export default page

