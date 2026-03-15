"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

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

    useEffect(() => {
        springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Intl.NumberFormat("en-US").format(
                    Math.round(latest)
                );
            }
        });
    }, [springValue]);

    return <span ref={ref} />;
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
            className="w-full py-12 md:py-16 bg-background border-y border-white/5 relative overflow-hidden"
        >
            {/* Subtle radial glow matching the site aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="w-full max-w-[1536px] mx-auto px-[6%] relative z-10">
                {/* Heading */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-8 md:mb-12"
                >
                    <h2 className="text-3xl md:text-5xl lg:text-5xl font-display font-semibold text-primary tracking-tight">
                        Results That Speak
                    </h2>
                </motion.div>

                {/* Metrics Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 text-center"
                >
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            variants={itemVariants}
                            className="flex flex-col items-center justify-center p-2 md:p-4"
                        >
                            <h3 className="text-4xl md:text-5xl lg:text-[4vw] font-display font-semibold text-accent mb-3 tracking-tighter shrink-0 flex items-end">
                                <Counter value={stat.value} />
                                <span className="ml-[2px]">{stat.suffix}</span>
                            </h3>
                            <p className="text-sm md:text-base text-muted uppercase tracking-[0.2em] font-medium mt-2">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
