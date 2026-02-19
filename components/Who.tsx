import React from 'react'
import FadeUp from './css/FadeUp'
import RotateInLeft from "./css/RotateInLeft";
import RotateInRight from './css/RotateInRight';

const Who = () => {
  return (
    <div className='w-full page flex flex-col items-center justify-center bg-white py-15 gap-10 min-h-[100vh] border-b-2 border-black z-50'>
        <FadeUp>
            <p className='text-[4.5vw] font-medium text-black'>Who This Is For</p>
        </FadeUp>
        <div className='w-[60vw] items-center flex flex-row justify-between gap-10'>
            <RotateInLeft>
                <div className='flex flex-col gap-10'>
                    <p className='text-[1.3vw] text-black'>For brands who :</p>
                    <div className='flex flex-col gap-5 text-[1.1vw] text-gray-600'>
                        <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Have real expertise worth sharing.</p>
                        <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Want long term authority, not viral moments.</p>
                        <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Care about brands depth over surface metrics.</p>
                        <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Are ready to invest in their content strategy.</p>
                    </div>
                </div>
            </RotateInLeft>
        <RotateInRight>
            <div className='flex flex-col gap-10'>
                <p className='text-[1.3vw] text-black'>Not for brands who :</p>
                <div className='flex flex-col gap-5 text-[1.1vw] text-gray-600'>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Want random viral clips without substance.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Only chase trends without a core message.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Treat content as a checkbox, not a strategy.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Expecy overnight results without commitment.</p>
                </div>
            </div>
        </RotateInRight>
        </div>
    </div>
  )
}

export default Who
