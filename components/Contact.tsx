"use client"

import React from 'react'
import FadeUp from './css/FadeUp'
import ContactForm from './ContactForm'

const Contact = () => {
    return (
        <>
            <div id="contact" className='w-full relative z-50'>
                <div
                    className='w-full flex flex-col items-center justify-center z-40 py-32 min-h-screen relative overflow-hidden
                        bg-surface'
                >
                    {/* Ambient Background Glow */}
                    <div className='absolute bottom-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 translate-y-1/4'></div>

                    <div id="contact-heading" className='w-full max-w-[80vw] md:max-w-[50vw] flex flex-col items-center justify-center text-center text-primary mt-10 relative z-10'>
                        <FadeUp>
                            <h2 className='text-4xl md:text-[4vw] font-display font-semibold leading-[1.1] tracking-tight'>Turn Your Expertise<br />Into Influence.</h2>
                        </FadeUp>
                        <FadeUp>
                            <p className='text-lg md:text-[1.3vw] text-muted mt-6 max-w-2xl mx-auto'>Ready to build absolute authority through education? Apply for a strategy call below.</p>
                        </FadeUp>
                    </div>

                    <div className='w-full max-w-[90vw] md:max-w-[45vw] mt-16'>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
// qw4erfuaerfiubrfiubearviuarvfiauwe
