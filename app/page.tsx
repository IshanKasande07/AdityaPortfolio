import React from 'react'
import Hero from '@/components/Hero'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import Footer from '@/components/Footer'
import FlywheelAnimation from '@/components/FlyWheelAnimation'
import PhysicsThrow from '@/components/PhysicsThrow'
import PageStack from '@/components/css/PageStack'
import NoiseDivider from '@/components/NoiseDivider'

const page = () => {
  return (
    <>
      {/* Transition C — Scroll Overlap Stack (desktop-only, ≥1024px) */}
      <PageStack />

      <Hero />
      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />
      {/* <FlywheelAnimation /> */}

      {/* Transition B — Contact card-lift (self-contained within Contact.tsx) */}
      <Contact />

      {/* Transition D — Kinetic Noise Bleed between Contact and PhysicsThrow */}
      <NoiseDivider
        fromColor="var(--color-background)"
        toColor="var(--color-surface)"
        height="110px"
        accentOpacity={0.1}
      />

      <PhysicsThrow />

      {/* Transition D — Kinetic Noise Bleed between PhysicsThrow and Footer */}
      <NoiseDivider
        fromColor="var(--color-surface)"
        toColor="var(--color-background)"
        height="90px"
        accentOpacity={0.08}
      />

      <Footer />
    </>
  )
}

export default page
