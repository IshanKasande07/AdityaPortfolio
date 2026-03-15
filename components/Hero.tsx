"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useReveal } from "./RevealLayout";

const videos = [
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/01_Origins%20x%20Nandini%20%28%20Final%20%29%20%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Bipsun%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Chatter%20Box%20v2%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Deccan%20Gymkhana%20%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Image%20Analysis%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Scaler%20Trailer%20Reel%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/electricity%20bill%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/solar%20tax%20copy.mp4",
];

export default function Hero() {
    const { revealed, earlyReveal } = useReveal();
    const headerControls = useAnimation();
    const contentControls = useAnimation();

    useEffect(() => {
        if (earlyReveal) {
            headerControls.start({
                opacity: 1,
                scale: 1.5,
                y: "25vh",
                rotateZ: 0.01,
                z: 0.01,
                transition: { duration: 0.8, ease: "easeOut" }
            });

            // Start the hold after earlyReveal fires
            const timer = setTimeout(() => {
                headerControls.start({
                    scale: 1,
                    y: 0,
                    rotateZ: 0.01,
                    z: 0.01,
                    transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                });
                contentControls.start({
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotateZ: 0.01,
                    z: 0.01,
                    transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                });
            }, 1600);

            return () => clearTimeout(timer);
        }
    }, [earlyReveal, headerControls, contentControls]);

    const rawRotation = useMotionValue(0);
    const rotation = useSpring(rawRotation, {
        stiffness: 70,
        damping: 20,
        mass: 1,
    });
    const lastX = useRef<number | null>(null);

    // Magnetic Button Parallax
    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    const buttonSpringX = useSpring(buttonX, { stiffness: 150, damping: 15, mass: 0.1 });
    const buttonSpringY = useSpring(buttonY, { stiffness: 150, damping: 15, mass: 0.1 });

    const [btnTop, setBtnTop] = useState<number | string>("auto");

    useEffect(() => {
        const updatePosition = () => {
            if (window.innerWidth >= 1440) {
                // For monitors/large screens, we need more clearance because of the border
                // 130px offset keeps it nicely above the cream border
                setBtnTop(window.innerHeight - 130);
            } else if (window.innerWidth >= 1024) {
                // For laptops, a 90px offset places it slightly higher than before
                setBtnTop(window.innerHeight - 90);
            } else {
                // On small/medium screens, clear JS height and let CSS handle absolute positioning from the bottom
                setBtnTop("auto");
            }
        };
        
        updatePosition();
        window.addEventListener('resize', updatePosition);
        return () => window.removeEventListener('resize', updatePosition);
    }, []);

    // Parallax: headline fades and sinks deeper on scroll
    const { scrollY } = useScroll();
    const headlineY = useTransform(scrollY, [0, 500], [0, 150]);
    const headlineOpacity = useTransform(scrollY, [0, 350], [1, 0]);
    const headlineScale = useTransform(scrollY, [0, 500], [1, 0.85]);

    // Parallax depth layers — "Entering the World"
    const noiseY = useTransform(scrollY, [0, 600], [0, 50]);        // L0: deepest, stays almost still relative to viewport
    const glowY = useTransform(scrollY, [0, 600], [0, 100]);        // L1: ambient gold glow sinks
    const carouselY = useTransform(scrollY, [0, 800], [0, 350]);    // L3: carousel sinks heavily, getting eclipsed by the next section

    return (
        <div id="work" className="relative min-h-[750px] h-screen w-full bg-background overflow-hidden z-20">
            {/* Noise Overlay — parallax drift */}
            <motion.div style={{ y: noiseY }} className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] will-change-transform transform-gpu" >
                <div className="absolute inset-0" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
            </motion.div>

            {/* Ambient Gold Glow — parallax drift */}
            <motion.div
                style={{ y: glowY }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none z-[5] will-change-transform transform-gpu"
            >
                <div className="w-full h-full rounded-full bg-accent/[0.03] blur-[100px]" />
            </motion.div>

            {/* Header Container */}
            <motion.div
                style={{ y: headlineY, opacity: headlineOpacity, scale: headlineScale }}
                className='absolute top-[13vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-30 px-[5vw] pointer-events-none'
            >
                {/* FIX 2: ENTRANCE WRAPPER 
                   This child div handles ONLY the initial "reveal" animation.
                   Adding 'transform-gpu' and 'backface-visibility' stops the text jitter.
                */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.5, y: "25vh", rotateZ: 0.01, z: 0.01 }}
                    animate={headerControls}
                    className="flex flex-col items-center justify-center pointer-events-none"
                    style={{
                        transformStyle: "preserve-3d",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                    }}
                >
                    <motion.div
                        className="text-3xl md:text-[4vw] font-medium leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4 flex flex-col items-center"
                        style={{ fontFamily: 'var(--font-tiempos-headline), serif' }}
                        animate={earlyReveal ? "visible" : "hidden"}
                    >
                        {/* Lines are split to prevent massive layout shifts during staggered reveal */}
                        {[
                            ["Why", "just", "create", "content", "?"],
                            ["-","Build", "Narratives"]
                        ].map((line, lineIdx) => (
                            <div key={lineIdx} className="flex flex-wrap justify-center gap-[0.3em]">
                                {line.map((word, i) => (
                                    <div key={i} className="overflow-hidden inline-block relative py-1 px-1 -mx-1">
                                        <motion.span
                                            variants={{
                                                hidden: { y: "110%", rotateX: 10 },
                                                visible: {
                                                    y: "0%",
                                                    rotateX: 0,
                                                    transition: {
                                                        duration: 1.1,
                                                        ease: [0.76, 0, 0.24, 1],
                                                        delay: (lineIdx * 0.1) + (i * 0.05) // Manual stagger for more control
                                                    }
                                                }
                                            }}
                                            className={`inline-block will-change-transform ${lineIdx === 1 ? 'italic font-normal text-accent' : 'text-primary'}`}
                                            style={{ 
                                                backfaceVisibility: "hidden", 
                                                WebkitBackfaceVisibility: "hidden",
                                                transformOrigin: "bottom center",
                                                transformStyle: "preserve-3d" 
                                            }}
                                        >
                                            {word}
                                        </motion.span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        variants={{
                            hidden: { opacity: 0, y: 15 },
                            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut", delay: 0.8 } }
                        }}
                        initial="hidden"
                        animate="visible"
                        className='text-sm md:text-[1.1vw] text-[#EFEBDF] max-w-3xl pointer-events-auto leading-relaxed mb-1'
                    >
                        Attention is the highest currency, we are helping you to mine it
                    </motion.p>
                </motion.div>
            </motion.div>

            {/* 3D Carousel Section — parallax recession */}
            <motion.div
                style={{ y: carouselY, bottom: "calc(0px + 4.5vw)" }}
                className="absolute left-0 w-full flex justify-center pointer-events-none z-20 will-change-transform transform-gpu"
            >
                <motion.div
                    initial={{ scale: 1.25, opacity: 0, y: 50, rotateZ: 0.01, z: 0.01 }}
                    animate={contentControls}
                >
                    <div
                        style={{
                            perspective: "500px",
                            transform: "scale(clamp(0.2, 100vw / 3000, 0.45))",
                            transformOrigin: "bottom center"
                        }}
                        className="relative pointer-events-auto"
                    >
                        <motion.div
                            onPointerDown={(e) => {
                                lastX.current = e.clientX;
                            }}
                            onPointerMove={(e) => {
                                if (lastX.current !== null) {
                                    const delta = e.clientX - lastX.current;
                                    rawRotation.set(rawRotation.get() + delta * 0.15);
                                    lastX.current = e.clientX;
                                }
                            }}
                            onPointerUp={() => {
                                lastX.current = null;
                            }}
                            onPointerLeave={() => {
                                lastX.current = null;
                            }}
                            style={{
                                rotateY: rotation,
                                transformStyle: "preserve-3d",
                                cursor: "grab",
                            }}
                            className="relative w-[900px] h-[520px]"
                        >
                            {/* Defer heavy video mounting until the clip-path animation is 100% complete (revealed) */}
                            {revealed && videos.map((src, i) => {
                                const angle = (360 / videos.length) * i;
                                const scale = 1.2;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            transformStyle: "preserve-3d",
                                            transform: `
                                                rotateY(${angle}deg)
                                                translateZ(550px)
                                                scale(${scale})
                                            `,
                                        }}
                                        className="absolute inset-0 flex items-center justify-center transform-gpu"
                                    >
                                        <div style={{ transform: "rotateY(180deg) translateZ(0)" }} className="transform-gpu">
                                            <video
                                                src={src}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                preload="metadata"
                                                className="w-[280px] h-[435px] rounded-xl object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)] select-none border border-white/10"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Repositioned CTA Button — dynamically placed for large screens, CSS positioned for small/med */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={contentControls}
                style={{ y: carouselY, top: btnTop }}
                className='absolute bottom-[5vw] lg:bottom-auto left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto'
            >
                <motion.button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' })}
                    onPointerMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        // Pull towards cursor, max ~12px
                        buttonX.set((e.clientX - centerX) * 0.15);
                        buttonY.set((e.clientY - centerY) * 0.15);
                    }}
                    onPointerLeave={() => {
                        buttonX.set(0);
                        buttonY.set(0);
                    }}
                    style={{ x: buttonSpringX, y: buttonSpringY }}
                    className='group relative overflow-hidden rounded-full py-4 px-10 will-change-transform'
                >
                    {/* Base Yellow Background */}
                    <div className="absolute inset-0 bg-accent rounded-full -z-10"></div>

                    {/* Hover Expanding Background */}
                    <div className="absolute inset-0 bg-[#27701B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0"></div>

                    <div className="relative z-10 flex items-center justify-center text-base md:text-[1.1vw] font-medium text-black group-hover:text-primary transition-colors duration-300">
                        <span>Book a Call</span>

                        {/* Magnetic Arrow Shoot Container */}
                        <span className='ml-3 relative flex items-center justify-center overflow-hidden w-5 h-5'>
                            {/* First Arrow */}
                            <span className='absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]'>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>

                            {/* Second Arrow */}
                            <span className='absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0 group-hover:translate-y-0'>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </span>
                    </div>
                </motion.button>
            </motion.div>


        </div>
    );
}
