import React from 'react'
import Home from '@/components/Home'
import Contact from '@/components/Contact'
import Who from '@/components/Who'
import Solutions from '@/components/Solutions'
import ProblemsSection from '@/components/ProblemsSection'
import WhyInfotainmentWorks from '@/components/WhyInfotainmentWorks'
import Footer from '@/components/Footer'

const page = () => {
  return (
    <div className="flex flex-col items-center justify-between w-screen h-screen bg-white">  
      <Home />
      <WhyInfotainmentWorks />
      <ProblemsSection />
      <Who />
      <Contact />
      <Footer />
    </div>
  )
}

export default page
