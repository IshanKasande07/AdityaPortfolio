"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FadeUp from './css/FadeUp';
import FadeUpDelay from './css/FadeUpDelay';

const videos = [
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/5.mp4",
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/9.mp4",
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/2.mp4",
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/3.mp4",
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/4.mp4",
    "https://storage.googleapis.com/clova-assets/public/clova-website/clova2/7.mp4",
];

export default function Hero() {
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

    // Parallax: headline launches, fades, and scales away on scroll
    const { scrollY } = useScroll();
    const headlineY = useTransform(scrollY, [0, 500], [0, -220]);
    const headlineOpacity = useTransform(scrollY, [0, 350], [1, 0]);
    const headlineScale = useTransform(scrollY, [0, 500], [1, 0.85]);

    return (
        <div className="relative min-h-[750px] h-screen w-full bg-background overflow-hidden z-20">
            {/* Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Header Container */}
            <motion.div
                style={{ y: headlineY, opacity: headlineOpacity, scale: headlineScale }}
                className='absolute top-[13vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-30 px-[5vw] pointer-events-none'
            >
                <FadeUp>
                    <h1 className='text-3xl md:text-[4vw] font-display font-semibold leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4'>
                        <span className='block text-primary'>We Help Brands</span>
                        <span className='block text-primary'>Win by <span className='font-serif italic font-normal text-accent'>Educating</span></span>
                        <span className='block text-primary'>the Internet.</span>
                    </h1>
                </FadeUp>
                <FadeUpDelay>
                    <p className='text-sm md:text-[1.1vw] text-muted max-w-3xl pointer-events-auto leading-relaxed mb-1'>
                        Attention is the highest currency, we are helping you to mine it
                    </p>
                </FadeUpDelay>

                <div className='flex flex-row gap-5 items-center justify-center mt-5 pointer-events-auto'>
                    <motion.button
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
                        {/* Base Yellow Background (Fixed: Moved off the parent so it doesn't bleed through edges) */}
                        <div className="absolute inset-0 bg-accent rounded-full -z-10"></div>

                        {/* Hover Expanding Background (slide-up #27701B green) */}
                        <div className="absolute inset-0 bg-[#27701B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0"></div>

                        <div className="relative z-10 flex items-center justify-center text-base md:text-[1.1vw] font-medium text-black group-hover:text-primary transition-colors duration-300">
                            <span>Book a Call</span>

                            {/* Magnetic Arrow Shoot Container */}
                            <span className='ml-3 relative flex items-center justify-center overflow-hidden w-5 h-5'>
                                {/* First Arrow (Disappears up-right) */}
                                <span className='absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]'>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>

                                {/* Second Arrow (Enters from bottom-left) */}
                                <span className='absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-0 group-hover:translate-y-0'>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </motion.button>
                </div>
            </motion.div>

            {/* 3D Carousel Section */}
            <div
                className="absolute left-0 w-full flex justify-center pointer-events-none z-20"
                style={{ bottom: "calc(0px + 4.5vw)" }}
            >
                <motion.div
                    initial={{ scale: 1.25, filter: "blur(15px)", opacity: 0, y: 50 }}
                    animate={{ scale: 1, filter: "blur(0px)", opacity: 1, y: 0 }}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                >
                    <div
                        style={{
                            perspective: "460px",
                            transform: "scale(clamp(0.3, 100vw / 1900, 0.85))",
                            transformOrigin: "bottom center"
                        }}
                        className="relative pointer-events-auto"
                    >
                        {/* world */}
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
                            {videos.map((src, i) => {
                                const angle = (360 / videos.length) * i;
                                const scale = 1.2;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            transformStyle: "preserve-3d",
                                            transform: `
                        rotateY(${angle}deg)
                        translateZ(510px)
                        scale(${scale})
                    `,
                                        }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div style={{ transform: "rotateY(180deg)" }}>
                                            <video
                                                src={src}
                                                autoPlay
                                                loop
                                                muted
                                                playsInline
                                                className="w-[420px] h-[300px] rounded-xl object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)] select-none border border-white/10"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* The curved bottom boundary overlay - Note: Next section will be surface color */}
            <div
                className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] z-40 pointer-events-none drop-shadow-xl"
                style={{ height: "calc(100vw * 0.08)" }}
            >
                <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-full scale-105 transform translate-y-[2px]">
                    <motion.path
                        animate={{
                            d: [
                                "M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z",
                                "M0 100C0 100 360 15 720 15C1080 15 1440 100 1440 100V100H0V100Z",
                                "M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z",
                            ]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        fill="var(--color-surface)"
                    />
                </svg>
            </div>
        </div>
    );
}
