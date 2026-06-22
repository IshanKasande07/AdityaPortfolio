import React from 'react'
import Hero2 from '@/components/Hero2'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import ResultsSection from '@/components/ResultsSection'
import Footer from '@/components/Footer'
import PhysicsThrow from '@/components/PhysicsThrow'
import FloatingCTA from '@/components/FloatingCTA'
import RevealLayout, { RevealProvider } from '@/components/RevealLayout'
import Navbar from '@/components/Navbar'
import BrandsWhoTrustUs from '@/components/BrandsWhoTrustUs'
import OurServices from '@/components/OurServices'

const page = () => {
  return (
    <RevealProvider>
      <FloatingCTA />
      <Navbar />

      {/* Hero as one clipped card — cream border on all 4 sides */}
      <RevealLayout>
        <Hero2 />
      </RevealLayout>

      <BrandsWhoTrustUs />
      <OurServices />

      <WhyInfotainmentWorks />
      <ResultsSection />
      <ProblemsSection />
      <Who />

      {/* Transition B — Contact card-lift (self-contained within Contact.tsx) */}
      <Contact />

      {/* <PhysicsThrow /> */}

      <Footer />
    </RevealProvider>
  )
}

export default page

