"use client"

import React, { useEffect, useRef, useState } from 'react'
import FadeUp from './css/FadeUp'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const goodFit = [
    "Have real expertise worth sharing.",
    "Want long term authority, not viral moments.",
    "Care about brand depth over surface metrics.",
    "Are ready to invest in their content strategy."
];

const badFit = [
    "Want random viral clips without substance.",
    "Only chase trends without a core message.",
    "Treat content as a checkbox, not a strategy.",
    "Expect overnight results without commitment."
];

const Who = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const leftCardRef = useRef<HTMLDivElement>(null);
    const rightCardRef = useRef<HTMLDivElement>(null);
    const leftItemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const rightItemsRef = useRef<(HTMLLIElement | null)[]>([]);
    const [hasRevealed, setHasRevealed] = useState(false);

    const addToRefs = (el: any, refArray: React.MutableRefObject<any[]>, index: number) => {
        if (el) {
            refArray.current[index] = el;
        }
    };

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        let ctx = gsap.context(() => {
            // Initial elegant reveal
            gsap.fromTo([leftCardRef.current, rightCardRef.current],
                { opacity: 0, y: 60, filter: "blur(15px)", scale: 0.95 },
                {
                    opacity: 0.7, // Start slightly dimmed for premium contrast later
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top center+=15%",
                    },
                    onComplete: () => setHasRevealed(true)
                }
            );

            // Set initial state for list items
            gsap.set([...leftItemsRef.current, ...rightItemsRef.current], { x: 0 });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const handleHover = (hoveredSide: 'left' | 'right' | null) => {
        if (!hasRevealed || !leftCardRef.current || !rightCardRef.current || window.innerWidth < 768) return;

        const duration = 0.5;
        const ease = "expo.out";

        if (hoveredSide === 'left') {
            // Left Card Active
            gsap.to(leftCardRef.current, { scale: 1.03, opacity: 1, filter: "blur(0px) grayscale(0%)", duration, ease, overwrite: "auto" });
            gsap.to(leftItemsRef.current, { x: 5, stagger: 0.05, duration: 0.3, ease: "power2.out", overwrite: "auto" });

            // Right Card Inactive
            gsap.to(rightCardRef.current, { scale: 0.95, opacity: 0.4, filter: "blur(6px) grayscale(70%)", duration, ease, overwrite: "auto" });
            gsap.to(rightItemsRef.current, { x: 0, duration: 0.3, overwrite: "auto" });

        } else if (hoveredSide === 'right') {
            // Right Card Active
            gsap.to(rightCardRef.current, { scale: 1.03, opacity: 1, filter: "blur(0px) grayscale(0%)", duration, ease, overwrite: "auto" });
            gsap.to(rightItemsRef.current, { x: 5, stagger: 0.05, duration: 0.3, ease: "power2.out", overwrite: "auto" });

            // Left Card Inactive
            gsap.to(leftCardRef.current, { scale: 0.95, opacity: 0.4, filter: "blur(6px) grayscale(70%)", duration, ease, overwrite: "auto" });
            gsap.to(leftItemsRef.current, { x: 0, duration: 0.3, overwrite: "auto" });

        } else {
            // Reset both to neutral
            gsap.to([leftCardRef.current, rightCardRef.current], { scale: 1, opacity: 0.7, filter: "blur(0px) grayscale(0%)", duration, ease, overwrite: "auto" });
            gsap.to([...leftItemsRef.current, ...rightItemsRef.current], { x: 0, duration: 0.3, overwrite: "auto" });
        }
    };

    return (
        <div ref={sectionRef} className='w-full page flex flex-col items-center justify-center bg-surface py-25 md:py-32 gap-16 min-h-[100vh] border-b border-white/5 z-50 relative overflow-hidden'>
            {/* Background ambient lighting */}
            <div className='absolute top-0 left-1/4 w-1/2 h-full bg-gradient-to-b from-transparent via-white/5 to-transparent blur-3xl opacity-20 pointer-events-none'></div>

            <div className='relative z-10 text-center px-[5vw] mb-4'>
                <FadeUp>
                    <h2 className='text-4xl md:text-[5vw] font-display font-semibold text-primary tracking-tight'>Who This Is For</h2>
                    <div className="w-16 md:w-24 h-1 bg-accent mx-auto mt-6 rounded-full opacity-80"></div>
                </FadeUp>
            </div>

            <div
                className='w-full max-w-[80vw] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 relative z-10'
                onMouseLeave={() => handleHover(null)}
            >
                {/* Visual Separator for Desktop */}
                <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-white/20 to-transparent -translate-x-1/2 pointer-events-none"></div>

                {/* Left Side: For Brands Who */}
                <div
                    ref={leftCardRef}
                    onMouseEnter={() => handleHover('left')}
                    className='group relative flex flex-col gap-8 md:gap-10 p-8 md:p-12 rounded-3xl border border-transparent hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-colors duration-500 cursor-default'
                >
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none blur-3xl"></div>

                    <h3 className='text-3xl md:text-[2.2vw] font-display font-medium text-primary transition-colors group-hover:text-emerald-400 duration-500 relative z-10'>
                        For brands who:
                    </h3>

                    <ul className='flex flex-col gap-6 md:gap-8 relative z-10'>
                        {goodFit.map((item, index) => (
                            <li
                                key={index}
                                ref={(el) => addToRefs(el, leftItemsRef, index)}
                                className='flex flex-row items-center gap-5 text-lg md:text-[1.2vw] text-muted group-hover:text-primary transition-colors duration-300'
                            >
                                <div className="min-w-[36px] w-[36px] h-[36px] rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-500">
                                    ✓
                                </div>
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right Side: Not For Brands Who */}
                <div
                    ref={rightCardRef}
                    onMouseEnter={() => handleHover('right')}
                    className='group relative flex flex-col gap-8 md:gap-10 p-8 md:p-12 rounded-3xl border border-transparent hover:border-red-500/20 hover:bg-red-500/[0.02] transition-colors duration-500 cursor-default'
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-red-500/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none blur-3xl"></div>

                    <h3 className='text-3xl md:text-[2.2vw] font-display font-medium text-primary transition-colors group-hover:text-red-400 duration-500 relative z-10'>
                        Not for brands who:
                    </h3>

                    <ul className='flex flex-col gap-6 md:gap-8 relative z-10'>
                        {badFit.map((item, index) => (
                            <li
                                key={index}
                                ref={(el) => addToRefs(el, rightItemsRef, index)}
                                className='flex flex-row items-center gap-5 text-lg md:text-[1.2vw] text-muted group-hover:text-primary transition-colors duration-300'
                            >
                                <div className="min-w-[36px] w-[36px] h-[36px] rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-lg leading-none pb-[2px] border border-red-500/20 group-hover:bg-red-500/20 group-hover:border-red-500/40 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-500">
                                    ×
                                </div>
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Who
