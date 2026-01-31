import React from 'react'

const Home = () => {
  return (
    <div className='w-full relative min-h-screen flex flex-col items-center justify-center bg-black py-[15vh] px-[16vw] gap-25'>
        <div className='w-full flex flex-col items-center justify-center gap-15 text-white text-center z-10 mt-15'>
          <p className='text-[1vw]'>MONARCH MEDIA HOUSE</p>
          <p className='text-[5.5vw] font-bold leading-tight tracking-tight'>We Help Brands Win <br /> by Educating the Internet</p>
          <p className='text-[1.5vw]'>Infotainment-led social content that builds authority, drives massive reach, and converts <br />
             attention in long-term growth.</p>
        </div>
        <div className='w-full flex flex-row gap-5 items-center justify-center z-10'>
          <button className='group px-9 py-5 bg-white text-[1.1vw] text-black hover:bg-white/85'>Apply for a Strategy Call <span className='ml-2 inline-block transition-transform group-hover:translate-x-2 duration-300'>🡪</span></button>
          <button className='px-9 py-5 border-1 border-gray-400 text-[1.1vw] text-white'>See Our Work</button>
        </div>
        <div className='h-[50vh] bg-gradient-to-t from-white/10 to-black absolute bottom-0 w-screen'></div>

    </div>
  )
}

export default Home
