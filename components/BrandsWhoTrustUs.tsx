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

const MagneticLogo = ({ src, mouseX, mouseY, isLarge, manualScale = 1 }: any) => {
    const ref = useRef<HTMLDivElement>(null);

    // Create a local motion value for the rect bounds so it doesn't trigger React renders
    const rectX = useMotionValue(0);
    const rectY = useMotionValue(0);
    const rectW = useMotionValue(0);
    const rectH = useMotionValue(0);

    // We only update the bounds when the mouse actually moves, rather than 60fps regardless of interaction
    useEffect(() => {
        const updateBounds = () => {
            if (ref.current) {
                const bounds = ref.current.getBoundingClientRect();
                rectX.set(bounds.left);
                rectY.set(bounds.top);
                rectW.set(bounds.width);
                rectH.set(bounds.height);
            }
        }

        // Initial set
        updateBounds();

        // Only update on resize or scroll, NOT on a continuous RAF loop
        window.addEventListener('resize', updateBounds, { passive: true });
        return () => window.removeEventListener('resize', updateBounds);
    }, [rectX, rectY, rectW, rectH]);

    // Create localized distance calculation that evaluates quickly outside the main thread
    const distance = useTransform([mouseX, mouseY, rectX, rectY, rectW, rectH], ([mX, mY, rX, rY, rW, rH]: any) => {
        if (!rW || mX === -1000) return 1000;
        const centerX = rX + rW / 2;
        const centerY = rY + rH / 2;
        return Math.sqrt(Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2));
    });

    // Calculate 3D tilt
    const rotateX = useTransform([mouseX, mouseY, rectX, rectY, rectW, rectH], ([mX, mY, rX, rY, rW, rH]: any) => {
        if (!rW || mX === -1000) return 0;
        const centerX = rX + rW / 2;
        const centerY = rY + rH / 2;
        const dist = Math.sqrt(Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2));
        if (dist > 300) return 0;

        const dy = mY - centerY;
        return (dy / 10) * -1;
    });

    const rotateY = useTransform([mouseX, mouseY, rectX, rectY, rectW, rectH], ([mX, mY, rX, rY, rW, rH]: any) => {
        if (!rW || mX === -1000) return 0;
        const centerX = rX + rW / 2;
        const centerY = rY + rH / 2;
        const dist = Math.sqrt(Math.pow(mX - centerX, 2) + Math.pow(mY - centerY, 2));
        if (dist > 300) return 0;

        const dx = mX - centerX;
        return (dx / 10);
    });

    // Smooth pop out when nearby
    const scale = useTransform(distance, (d: any) => {
        if (d > 250) return 1;
        return 1 + ((250 - d) / 250) * 0.1;
    });

    // Opacity transitions from dim to full
    const opacity = useTransform(distance, (d: any) => {
        if (d > 200) return 0.4;
        return 0.4 + ((200 - d) / 200) * 0.6;
    });

    // Luminous Gold glow effect based on proximity
    const dropShadow = useTransform(distance, (d: any) => {
        if (d > 150) return "drop-shadow(0px 0px 0px rgba(255, 195, 0, 0))";
        const intensity = (150 - d) / 150;
        return `drop-shadow(0px 0px ${20 * intensity}px rgba(255, 195, 0, ${0.7 * intensity}))`;
    });

    // Subtle border highlight interpolation
    const borderColor = useTransform(distance, [0, 150], ["rgba(255, 195, 0, 0)", "rgba(255, 195, 0, 0.4)"]);

    const hoverImgFilter = useTransform(distance, (d: any) => {
        if (d > 150) return "grayscale(100%) brightness(1.5)";
        const intensity = (150 - d) / 150;
        return `grayscale(${100 - (intensity * 100)}%) brightness(${1.5 - (intensity * 0.5)})`;
    });

    const handleLocalMouseMove = () => {
        if (ref.current) {
            const bounds = ref.current.getBoundingClientRect();
            rectX.set(bounds.left);
            rectY.set(bounds.top);
        }
    }

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleLocalMouseMove}
            style={{
                rotateX,
                rotateY,
                scale,
                opacity,
                borderColor,
                transformPerspective: 1000,
                transformStyle: "preserve-3d",
            }}
            className="flex-shrink-0 flex flex-col items-center justify-center p-6 border border-white/5 rounded-2xl bg-surface-light/30 backdrop-blur-md will-change-transform ease-out w-40 h-28 md:w-56 md:h-36 mx-3"
        >
            <motion.div
                style={{ filter: dropShadow }}
                className={`relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out`}
            >
                {/* Apply manualScale via style to dynamically combine with hover filters */}
                <motion.div
                    style={{ filter: hoverImgFilter, transform: `scale(${isLarge ? 1.7 * manualScale : 1 * manualScale})` }}
                    className="relative w-full h-full"
                >
                    <Image
                        src={src}
                        alt="Trusted Brand"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 33vw, 20vw"
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

interface ParallaxCarouselProps {
    items: { src: string; scale?: number }[];
    baseVelocity: number;
}

const ParallaxCarousel = ({ items, baseVelocity = 1 }: any) => {
    // Parallax logic remains identical, highly performant hardware accelerated translation
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

    const localMouseX = useMotionValue(-1000);
    const localMouseY = useMotionValue(-1000);

    // Low friction spring for the magnetic effect so it feels localized and lightweight
    const smoothMouseX = useSpring(localMouseX, { damping: 40, stiffness: 300, mass: 0.1 });
    const smoothMouseY = useSpring(localMouseY, { damping: 40, stiffness: 300, mass: 0.1 });

    const handleMouseMove = (e: React.MouseEvent) => {
        localMouseX.set(e.clientX);
        localMouseY.set(e.clientY);
    };

    const handleMouseLeave = () => {
        localMouseX.set(-1000);
        localMouseY.set(-1000);
    };

    return (
        <div
            className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap perspective-[1000px] py-4 w-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div className="flex whitespace-nowrap flex-nowrap w-max will-change-transform" style={{ x }}>
                {duplicatedItems.map((item, i) => (
                    <div key={`${item.src}-${i}`} style={{ transformStyle: "preserve-3d" }}>
                        <MagneticLogo
                            src={item.src}
                            mouseX={smoothMouseX}
                            mouseY={smoothMouseY}
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
            className="w-full relative py-20 bg-background z-20 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none opacity-20"></div>

            <div className="w-full relative">
                <FadeUp>
                    <div className="text-center mb-12 relative z-10 px-6">
                        <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary tracking-tight">Brands Who Trust Us</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-accent to-red-500 mx-auto mt-4 rounded-full"></div>
                        <p className="max-w-2xl mx-auto mt-6 text-lg text-muted font-light leading-relaxed">
                            We collaborate with visionary companies who demand nothing less than <span className="text-accent font-medium">extraordinary</span>.
                        </p>
                    </div>
                </FadeUp>

                <div className="relative z-10 w-full flex flex-col gap-6 mt-6 overflow-hidden max-w-full">
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
