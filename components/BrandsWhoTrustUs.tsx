"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useScroll,
    useVelocity,
    useAnimationFrame,
    wrap
} from "framer-motion";
import FadeUp from "./css/FadeUp";

const brandLogos = [
    { src: "/logos/1.png", scale: 1.5 }, // Assuming Torq
    { src: "/logos/2.png", scale: 1.5 }, // 2.png
    { src: "/logos/3.png", scale: 1.5 }, // Assuming Cakerie
    { src: "/logos/4.png", scale: 1.5 }, // Assuming Imagination Inc
    { src: "/logos/5.png", scale: 1.5 }, // Assuming Atenx
    { src: "/logos/6.png", scale: 1.5 }, // Assuming Linkin Movies
    { src: "/logos/7.png", scale: 1.5 },
    { src: "/logos/8.png", scale: 1.5 },
    { src: "/logos/9.png" },
    { src: "/logos/10.png" },
    { src: "/logos/11.png" },
    { src: "/logos/12.png", scale: 3.0 },
    { src: "/logos/Akshay PAtra Black.png" },
    { src: "/logos/Biosun white .png" },
    { src: "/logos/Debridge - White.png" },
    { src: "/logos/Ishita Sakuja White .png", scale: 2.0 },
    { src: "/logos/SSB White.png" },
    { src: "/logos/Waddle White.png" },
    { src: "/logos/decstudio.png" },
    { src: "/logos/nugget by zomato.png" },
    { src: "/logos/vandan white .png", scale: 2.0 }
];

const MagneticLogo = ({ src, isLarge, manualScale = 1 }: any) => {
    // 60FPS math and continuous spring bounds tracking was causing severe scroll lag.
    // Replaced with highly efficient Framer Motion CSS hover states.
    return (
        <motion.div
            className="flex-shrink-0 flex flex-col items-center justify-center p-4 md:p-5 border border-white/5 rounded-2xl bg-surface-light/30 backdrop-blur-md w-32 h-24 md:w-48 md:h-32 mx-2 md:mx-3 cursor-pointer group"
            whileHover={{ scale: 1.1, borderColor: "rgba(255, 195, 0, 0.4)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            <motion.div
                className={`relative w-full h-full flex items-center justify-center transition-all duration-300 ease-out grayscale group-hover:grayscale-0 group-hover:drop-shadow-[0_0_15px_rgba(255,195,0,0.5)]`}
                style={{ transform: `scale(${isLarge ? 1.7 * manualScale : 1 * manualScale})` }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt="Trusted Brand"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 33vw, 20vw"
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

interface ParallaxCarouselProps {
    items: { src: string; scale?: number }[];
    baseVelocity: number;
}

const ParallaxCarousel = ({ items, baseVelocity = 1 }: any) => {
    // Parallax logic restored to allow scroll-based acceleration!
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

    const directionFactor = useRef<number>(1);

    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();
        baseX.set(baseX.get() + moveBy);
    });

    const duplicatedItems = [...items, ...items];

    return (
        <div
            className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-2 w-full"
        >
            <motion.div className="flex whitespace-nowrap flex-nowrap w-max will-change-transform" style={{ x }}>
                {duplicatedItems.map((item, i) => (
                    <div key={`${item.src}-${i}`}>
                        <MagneticLogo
                            src={item.src}
                            isLarge={baseVelocity < 0} // Row 1 is baseVelocity -2, make it large natively
                            manualScale={item.scale || 1}
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const BrandsWhoTrustUs = () => {
    const row1 = brandLogos.slice(0, 11);
    const row2 = brandLogos.slice(11);

    return (
        <section
            className="w-full relative pt-12 md:pt-16 pb-8 md:pb-10 bg-background z-20 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none opacity-20"></div>

            <div className="w-full relative">
                <FadeUp>
                    <div className="text-center mb-6 relative z-10 px-6">
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary tracking-tight">Brands Who Trust Us</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-accent to-red-500 mx-auto mt-4 rounded-full"></div>
                        <p className="max-w-2xl mx-auto mt-6 text-lg text-muted font-light leading-relaxed">
                            We collaborate with visionary companies who demand nothing less than <span className="text-accent font-medium">extraordinary</span>.
                        </p>
                    </div>
                </FadeUp>

                <div className="relative z-10 w-full flex flex-col gap-2 mt-2 overflow-hidden max-w-full">
                    {/* Left fading mask for smooth cutoffs at screen edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none"></div>
                    {/* Right fading mask */}
                    <div className="absolute right-0 top-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none"></div>

                    {/* Row 1 scrolling left (Making this the larger row!) */}
                    <ParallaxCarousel
                        items={row1}
                        baseVelocity={-2}
                    />

                    {/* Row 2 scrolling right */}
                    <ParallaxCarousel
                        items={row2}
                        baseVelocity={2}
                    />
                </div>
            </div>
        </section>
    );
};

export default BrandsWhoTrustUs;
