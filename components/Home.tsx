import React from 'react'
import FadeUp from './css/FadeUp'
import FadeUpDelay from './css/FadeUpDelay'

const Home = () => {
  return (
    <div className='page w-full relative min-h-[100vh] flex flex-col items-center justify-center bg-background py-[15vh] px-[16vw] gap-25 z-5'>
      <div className='w-full flex flex-col items-center justify-center gap-15 text-primary text-center z-10 mt-15'>
        <p className='text-[1vw] text-gray-400 tracking-widest'>MONARCH MEDIA HOUSE</p>
        <FadeUp>
          <p className='text-[5.5vw] font-medium leading-tight tracking-tight'>We Help Brands Win <br /> by <span className='font-normal italic'>Educating</span> the Internet</p>
        </FadeUp>
        <FadeUpDelay>
          <p className='text-[1.5vw]'>Infotainment-led social content that builds authority, drives massive reach, and converts <br />
            attention in long-term growth.</p>
        </FadeUpDelay>
      </div>
      <div className='w-full flex flex-row gap-5 items-center justify-center z-10'>
        <button className='group px-9 py-5 bg-primary text-[1.1vw] text-background hover:bg-primary/85'>Apply for a Strategy Call <span className='ml-2 inline-block transition-transform group-hover:translate-x-2 duration-300'>🡪</span></button>
        <button className='px-9 py-5 border-1 border-gray-400 text-[1.1vw] text-primary'>See Our Work</button>
      </div>
      <div className='h-[50vh] bg-gradient-to-t from-primary/10 to-black absolute bottom-0 w-screen'></div>

    </div>
  )
}

export default Home
