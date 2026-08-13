"use client"

import React from 'react'
import FadeUp from './css/FadeUp'
import ContactForm from './ContactForm'

const Contact = () => {
    return (
        <>
            <div id="contact" className='w-full relative z-10'>
                <div
                    className='w-full flex flex-col items-center justify-center z-10 py-20 min-h-screen relative overflow-hidden
                        bg-background'
                >



                    <div id="contact-heading" className='w-full max-w-[80vw] md:max-w-[50vw] flex flex-col items-center justify-center text-center text-primary mt-10 relative z-10'>
                        <FadeUp>
                            <h2 className='text-3xl md:text-[3.2vw] font-display font-semibold leading-[1.1] tracking-tight'>Turn Your Expertise<br />Into Influence.</h2>
                        </FadeUp>
                        <FadeUp>
                            <p className='text-base md:text-[1.1vw] text-muted mt-4 max-w-2xl mx-auto'>Ready to build absolute authority through education? Apply for a strategy call below.</p>
                        </FadeUp>
                    </div>

                    <div className='w-full max-w-[90vw] md:max-w-[42vw] mt-10'>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
// qw4erfuaerfiubrfiubearviuarvfiauwe
