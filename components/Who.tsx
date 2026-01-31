import React from 'react'

const Who = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center bg-white py-15 gap-10 min-h-[80vh] border-b-2 border-black'>
        <p className='text-[4.5vw] font-bold text-black'>Who This Is For</p>
        <div className='w-[60vw] items-center flex flex-row justify-between gap-10'>
            <div className='flex flex-col gap-10'>
                <p className='text-[1.3vw] text-black'>For brands who :</p>
                <div className='flex flex-col gap-5 text-[1.1vw] text-gray-600'>
                    <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Have real expertise worth sharing.</p>
                    <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Want long term authority, not viral moments.</p>
                    <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Care about brands depth over surface metrics.</p>
                    <p className='flex flex-row gap-2'><img src="/checkmark.svg" className='w-[25px]' alt="" />Are ready to invest in their content strategy.</p>
                </div>
            </div>
            <div className='flex flex-col gap-10'>
                <p className='text-[1.3vw] text-black'>Not for brands who :</p>
                <div className='flex flex-col gap-5 text-[1.1vw] text-gray-600'>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Want random viral clips without substance.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Only chase trends without a core message.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Treat content as a checkbox, not a strategy.</p>
                    <p className='flex flex-row gap-2'><img src="/crossmark.svg" className='w-[25px]' alt="" />Expecy overnight results without commitment.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Who
