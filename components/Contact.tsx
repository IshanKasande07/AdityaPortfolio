"use client"

import React from 'react'
import FadeUp from './css/FadeUp'
import ContactForm from './ContactForm'
import styles from './Contact.module.css'

const Contact = () => {
    return (
        <>
            <div id="contact" className={styles.section}>
                <div
                    className={styles.content}
                >



                    <div id="contact-heading" className='w-full max-w-[720px] flex flex-col items-center justify-center text-center text-primary relative z-10'>
                        <FadeUp>
                            <h2 style={{ fontFamily: 'var(--font-tiempos-headline), Georgia, serif' }} className='text-[clamp(36px,4.5vw,60px)] font-normal leading-[1.08] tracking-[-0.025em]'>Turn your expertise<br />into <em className='text-accent'>influence.</em></h2>
                        </FadeUp>
                        <FadeUp>
                            <p className='text-base leading-relaxed text-muted mt-6 max-w-[44ch] mx-auto'>Ready to build absolute authority through education? Apply for a strategy call below.</p>
                        </FadeUp>
                    </div>

                    <div className='w-full max-w-[600px] mt-12 md:mt-16'>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Contact
// qw4erfuaerfiubrfiubearviuarvfiauwe

