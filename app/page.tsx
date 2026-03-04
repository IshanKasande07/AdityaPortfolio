import React from 'react'
import Hero from '@/components/Hero'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import Footer from '@/components/Footer'
import FlywheelAnimation from '@/components/FlyWheelAnimation'
import PhysicsThrow from '@/components/PhysicsThrow'
import FloatingCTA from '@/components/FloatingCTA'

const page = () => {
  return (
    <>
      {/* Floating sticky CTA — fixed across all sections */}
      <FloatingCTA />

      <Hero />
      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />
      {/* <FlywheelAnimation /> */}

      {/* Transition B — Contact card-lift (self-contained within Contact.tsx) */}
      <Contact />

      <PhysicsThrow />

      <Footer />
    </>
  )
}

export default page
