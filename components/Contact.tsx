"use client"

import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import FadeUp from './css/FadeUp'
import SectionCardLift from './css/SectionCardLift'

const Contact = () => {

    const cardRef = useRef<HTMLDivElement>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const sendData = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isSubmitting) {
            if (!name || !email || !company || !number || !message) {
                alert("Please fill all the data.");
                return
            }

            setIsSubmitting(true);

            try {
                const response = await fetch("https://monarchmediahousebackend.netlify.app/.netlify/functions/server/contactData", {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({ name, email, companyName: company, number, message })
                });

                if (response.status === 200) {
                    alert("Data sent successfully!");
                    setName("");
                    setEmail("");
                    setNumber("");
                    setCompany("");
                    setMessage("");
                } else {
                    alert("Backend Error. Please try again later.");
                }
            } catch (err) {
                console.error(err);
                alert("An error occurred. Please try again.");
            }

            setIsSubmitting(false);
        }
    }

    // Custom Input Component for the brutalist expanding border effect
    const BrutalistInput = ({ label, type = "text", value, onChange, placeholder, isTextArea = false }: any) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <div className='flex flex-col gap-2 w-full group'>
                <p className='text-sm font-mono uppercase tracking-widest text-muted group-hover:text-primary transition-colors'>{label}</p>
                <div className="relative w-full">
                    {isTextArea ? (
                        <textarea
                            value={value}
                            onChange={onChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            className='w-full bg-transparent text-primary px-0 py-3 border-b border-white/20 focus:outline-none min-h-[12vh] resize-none placeholder-white/10 transition-colors'
                        />
                    ) : (
                        <input
                            type={type}
                            value={value}
                            onChange={onChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            placeholder={placeholder}
                            className='w-full bg-transparent text-primary px-0 py-3 border-b border-white/20 focus:outline-none placeholder-white/10 transition-colors'
                        />
                    )}
                    {/* Animated expanding bottom border */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isFocused ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: "circOut" }}
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-accent origin-center"
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Transition B — Floating Card Lift outer shell */}
            <div className='w-full bg-background pt-10 relative z-50'>
                <SectionCardLift targetRef={cardRef} />
                <div
                    ref={cardRef}
                    className='w-full page flex flex-col items-center justify-center z-40 py-32 min-h-screen relative overflow-hidden
                        rounded-t-[2.5rem]
                        border-t border-l border-r border-white/10
                        bg-surface/98
                        shadow-[0_-32px_90px_-16px_rgba(0,0,0,0.7),0_-1px_0px_rgba(255,195,0,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]'
                    style={{ backdropFilter: 'blur(4px)', willChange: 'transform, filter' }}
                >
                    {/* Ambient Background Glow */}
                    <div className='absolute bottom-0 right-0 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none translate-x-1/4 translate-y-1/4'></div>

                    <div className='w-full max-w-[80vw] md:max-w-[50vw] flex flex-col items-center justify-center text-center text-primary mt-10 relative z-10'>
                        <FadeUp>
                            <h2 className='text-4xl md:text-[4vw] font-display font-semibold leading-[1.1] tracking-tight'>Turn Your Expertise<br />Into Influence.</h2>
                        </FadeUp>
                        <FadeUp>
                            <p className='text-lg md:text-[1.3vw] text-muted mt-6 max-w-2xl mx-auto'>Ready to build absolute authority through education? Apply for a strategy call below.</p>
                        </FadeUp>
                    </div>

                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        onSubmit={sendData}
                        className='w-full max-w-[90vw] md:max-w-[45vw] flex flex-col items-center justify-center gap-10 md:gap-12 mt-16 relative z-10'
                    >
                        <div className='flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-between w-full'>
                            <BrutalistInput label="Name" value={name} onChange={(e: any) => setName(e.target.value)} placeholder="John Doe" />
                            <BrutalistInput label="Email" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="john@company.com" />
                        </div>
                        <div className='flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-between w-full'>
                            <BrutalistInput label="Company" value={company} onChange={(e: any) => setCompany(e.target.value)} placeholder="Acme Corp" />
                            <BrutalistInput label="Phone Number" type="tel" value={number} onChange={(e: any) => setNumber(e.target.value)} placeholder="+1 (555) 000-0000" />
                        </div>

                        <BrutalistInput label="Project Brief" value={message} onChange={(e: any) => setMessage(e.target.value)} placeholder="Tell us about your brand, audience and content goals..." isTextArea={true} />

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='group relative w-full overflow-hidden rounded-full py-5 md:py-6 px-9 border border-white/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {/* Hover Expanding Background */}
                            <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full"></div>

                            <div className="relative z-10 flex items-center justify-center text-lg md:text-[1.2vw] font-medium text-white group-hover:text-black transition-colors duration-300">
                                {isSubmitting ? "Submitting..." : "Apply For a Strategy Call"}
                                <span className='ml-3 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-3'>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-current border-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </span>
                            </div>
                        </button>
                        <p className='text-sm md:text-[1vw] text-muted font-mono tracking-wide'>We reply to all applications within 48 hours.</p>
                    </motion.form>
                </div>
            </div>
        </>
    )
}


export default Contact
