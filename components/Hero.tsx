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
        <div className="relative min-h-[750px] h-screen w-full bg-background overflow-hidden z-20">
            {/* Noise Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

            {/* Header Container */}
            <div className='absolute top-[13vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-30 px-[5vw] pointer-events-none'>
                <FadeUp>
                    <h1 className='text-3xl md:text-[4vw] font-display font-semibold leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4'>
                        <span className='block text-primary'>We Help Brands</span>
                        <span className='block text-primary'>Win by <span className='font-serif italic font-normal text-accent'>Educating</span></span>
                        <span className='block text-primary'>the Internet.</span>
                    </h1>
                </FadeUp>
                <FadeUpDelay>
                    <p className='text-sm md:text-[1.1vw] text-muted max-w-3xl pointer-events-auto leading-relaxed mb-1'>
                        Infotainment-led social content that builds authority, drives massive reach, and converts attention into long-term growth.
                    </p>
                </FadeUpDelay>

                <div className='flex flex-row gap-5 items-center justify-center mt-5 pointer-events-auto'>
                    <button className='group relative overflow-hidden rounded-full py-4 px-10 border border-white/20'>
                        {/* Hover Expanding Background */}
                        <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full"></div>
                        <div className="relative z-10 flex items-center justify-center text-base md:text-[1.1vw] font-medium text-white group-hover:text-black transition-colors duration-300">
                            Book a Call
                            <span className='ml-3 flex items-center justify-center transition-transform duration-500 group-hover:translate-x-3'>
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </span>
                        </div>
                    </button>
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
