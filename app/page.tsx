import React from 'react'
import Home from '@/components/Home'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import Footer from '@/components/Footer'
import FlywheelAnimation from '@/components/FlyWheelAnimation'
import ThreeDCarousel from '@/components/ThreeDCarousal'
import PhysicsThrow from '@/components/PhysicsThrow'
import PageStack from '@/components/css/PageStack'

const page = () => {
  return (
    <>

      <PageStack />

      <Home />
      <ThreeDCarousel />
      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />
      <Contact />
      <div className='w-full min-h-[100vh] page z-70'></div>
      <Footer />
    </>
  )
}

export default page
