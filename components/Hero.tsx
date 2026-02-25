"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
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

    return (
        <div className="page relative min-h-[750px] h-screen w-full bg-background overflow-hidden z-20">
            {/* Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Header Container - Positioned higher up to prevent overlap with the 3D carousel */}
            <div className='absolute top-[10vh] xl:top-[12vh] 2xl:top-[14vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-30 px-[5vw] pointer-events-none mt-4 md:mt-2'>
                <p className='font-mono text-xs md:text-[0.9vw] text-muted tracking-widest uppercase font-semibold pointer-events-auto mb-2 md:mb-3'>
                    MONARCH MEDIA HOUSE
                </p>
                <FadeUp>
                    <h1 className='text-4xl md:text-[5vw] font-display font-semibold leading-[1.05] tracking-tight pointer-events-auto mb-4 md:mb-5'>
                        <span className='block text-primary'>We Help Brands Win</span>
                        <span className='block text-primary'>by <span className='font-serif italic font-normal text-accent'>Educating</span> the Internet.</span>
                    </h1>
                </FadeUp>
                <FadeUpDelay>
                    <p className='text-sm md:text-[1.2vw] text-muted max-w-4xl pointer-events-auto leading-relaxed'>
                        Infotainment-led social content that builds authority, drives massive reach, and converts <br className="hidden md:block" /> attention in long-term growth.
                    </p>
                </FadeUpDelay>

                {/* Buttons updated to pill shapes (rounded-full) */}
                <div className='flex flex-row gap-5 items-center justify-center mt-6 md:mt-8 pointer-events-auto'>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='group px-6 py-3 md:px-[2vw] md:py-[1vw] bg-accent rounded-full text-sm md:text-[1vw] font-semibold text-black hover:bg-yellow-400 transition-all flex items-center justify-center shadow-[0_0_20px_rgba(255,195,0,0.3)]'>
                        Apply for a Strategy Call <span className='ml-2 text-black font-bold group-hover:translate-x-1 transition-transform'>↗</span>
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className='px-6 py-3 md:px-[2vw] md:py-[1vw] border border-white/20 rounded-full text-sm md:text-[1vw] font-medium text-white hover:bg-white/5 backdrop-blur-sm transition-all'>
                        See Our Work
                    </motion.button>
                </div>
            </div>

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
