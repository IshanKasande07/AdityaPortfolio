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

const page = () => {
  return (
    <>


      <Hero />
      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />
      {/* <FlywheelAnimation /> */}
      <Contact />
      <PhysicsThrow />
      <Footer />
    </>
  )
}

export default page
