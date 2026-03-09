import React from 'react'
import Hero from '@/components/Hero'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import Footer from '@/components/Footer'
import PhysicsThrow from '@/components/PhysicsThrow'
import FloatingCTA from '@/components/FloatingCTA'
import RevealLayout from '@/components/RevealLayout'
import Navbar from '@/components/Navbar'
import BrandsWhoTrustUs from '@/components/BrandsWhoTrustUs'
import ImpactSection from '@/components/ImpactSection'

const page = () => {
  return (
    <>
      <FloatingCTA />

      {/* Navbar + Hero as one clipped card — cream border on all 4 sides */}
      <RevealLayout>
        <Navbar />
        <Hero />
      </RevealLayout>

      <BrandsWhoTrustUs />
      <ImpactSection />

      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />

      {/* Transition B — Contact card-lift (self-contained within Contact.tsx) */}
      <Contact />

      <PhysicsThrow />

      <Footer />
    </>
  )
}

export default page

