"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import TornEdge from "./css/TornEdge";

function Counter({ value, direction = "up" }: { value: number; direction?: "up" | "down" }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const springValue = useSpring(motionValue, {
        stiffness: 40,
        damping: 30,
    });
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    useEffect(() => {
        if (isInView) {
            motionValue.set(direction === "down" ? 0 : value);
        }
    }, [motionValue, isInView, value, direction]);

    const displayValue = useTransform(springValue, (latest) =>
        Intl.NumberFormat("en-US").format(Math.round(latest))
    );

    return <motion.span ref={ref} className="tabular-nums">{displayValue}</motion.span>;
}

export default function ResultsSection() {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-20%" });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring" as const, stiffness: 100, damping: 20 },
        },
    };

    // The data points requested by the user
    const stats = [
        { value: 10, suffix: "M+", label: "Views" },
        { value: 1200, suffix: "+", label: "Creatives" },
        { value: 20, suffix: "+", label: "Brands" },
        { value: 150, suffix: "%", label: "Traffic Growth" },
    ];

    return (
        <section
            id="results"
            ref={containerRef}
            className="w-full py-24 md:py-32 bg-surface relative z-20"
        >
            {/* Ground: L3 forest. Tears into cream above (OurServices) and into
                rust below (Contact). Both edges are forest-filled, so the
                neighbouring ground shows through the tear.
                Do NOT add overflow-hidden to this section — the edges sit
                outside its box and would be clipped. */}
            <TornEdge edge="top" />

            {/* Warm dusk glow, anchored to the bottom edge like the last light
                behind the ridge — reads as depth rather than a floating blob.
                Clipped by its own wrapper so the 140px blur can't bleed past
                the section; the section itself must stay unclipped or the torn
                edges (which sit outside its box) would be cut off. */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3 w-[120%] h-[65%] bg-saffron/[0.09] blur-[140px] rounded-[50%]" />
            </div>

            <div className="w-full max-w-[1070px] mx-auto px-6 md:px-16 relative z-10">
                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col items-start max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-saffron/10 border border-saffron/25 text-saffron text-[10px] md:text-xs font-mono uppercase tracking-widest mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-saffron animate-pulse" />
                        Impact &amp; Scale
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-background tracking-tight leading-tight">
                        Results That <span className="text-saffron italic">Speak.</span>
                    </h2>
                    <p className="text-sm md:text-base text-mist/70 mt-4 max-w-lg leading-relaxed">
                        We don't just talk about growth. We engineer it. Here's a snapshot of the tangible value we've delivered.
                    </p>
                </motion.div>

                {/* Metrics — four across on desktop, split by hairline rules so the
                    numbers carry the section instead of a grid of boxes. */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 md:gap-x-0"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-start md:px-6 md:first:pl-0 md:border-l md:border-mist/15 md:first:border-l-0 group"
                        >
                            <h3 className="font-display font-semibold text-saffron mb-2 tracking-tighter flex items-end leading-none">
                                <span className="text-5xl md:text-6xl lg:text-7xl">
                                    <Counter value={stat.value} />
                                </span>
                                <span className="ml-0.5 text-2xl md:text-3xl lg:text-4xl">{stat.suffix}</span>
                            </h3>
                            <p className="text-xs md:text-sm text-mist/60 group-hover:text-mist transition-colors duration-300 uppercase tracking-[0.2em] font-medium">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <TornEdge edge="bottom" />
        </section>
    );
}
