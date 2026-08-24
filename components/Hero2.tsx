"use client";

import { motion, useMotionValue, useSpring, useAnimation, AnimatePresence, MotionValue } from "framer-motion";
import { useRef, useEffect, useState, useMemo, RefObject } from "react";
import { useReveal } from "./RevealLayout";
import "./css/reveal-layout.css";

const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

interface Hero2Props {
    spacerRef: RefObject<HTMLDivElement | null>;
    textY: MotionValue<number>;
    textOpacity: MotionValue<number>;
    textScale: MotionValue<number>;
    scrollYProgress: MotionValue<number>;
    isTouchDevice: boolean;
    parallaxUnlocked: boolean;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerLeave: () => void;
}

export default function Hero2({
    spacerRef,
    textY,
    textOpacity,
    textScale,
    scrollYProgress,
    isTouchDevice,
    parallaxUnlocked,
    onPointerMove,
    onPointerLeave,
}: Hero2Props) {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();

    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    // PERF: Same idle-spring trick for button hover effect
    const buttonSpringConfig = useMemo(() => ({
        stiffness: parallaxUnlocked ? 150 : 1e-9,
        damping: 15,
        mass: 0.1,
    }), [parallaxUnlocked]);
    const buttonSpringX = useSpring(buttonX, buttonSpringConfig);
    const buttonSpringY = useSpring(buttonY, buttonSpringConfig);

    // ── Reveal animation sequence ────────────────────────────────
    useEffect(() => {
        if (earlyReveal) {
            const startY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

            headerControls.start({
                opacity: 1,
                y: startY,
                scale: 1.5,
                transition: { duration: 0.8, ease: "easeOut" },
            });

            const phaseTwo = setTimeout(() => {
                headerControls.start({
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                });

                const contentTimer = setTimeout(() => {
                    contentControls.start({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    });
                }, 250);

                return () => {
                    clearTimeout(contentTimer);
                }
            }, 1200);

            return () => {
                clearTimeout(phaseTwo);
            };
        }
    }, [earlyReveal, headerControls, contentControls]);

    return (
        <div
            ref={spacerRef}
            id="work"
            className="relative overflow-hidden bg-transparent z-20 w-full h-[calc(100vh-72px)] mt-[60px] mb-[12px] rounded-[16px] md:w-[calc(100%-36px)] md:h-[calc(100vh-84px)] md:mt-[66px] md:mb-[18px] md:mx-[18px] md:rounded-[20px]"
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            {/* ========== LAYER 5: Text Overlay + CTA ========== */}
            <motion.div
                style={{ y: textY, opacity: textOpacity, scale: textScale, z: 0.01, willChange: "transform, opacity" }}
                className="absolute top-[6vh] md:top-[8vh] left-0 w-full flex flex-col items-center justify-center text-primary text-center z-[50] px-6 md:px-[5vw] pointer-events-none"
            >
                <motion.div
                    initial={{ opacity: 0, y: "25vh", scale: 1.5 }}
                    animate={headerControls}
                    style={{
                        transformOrigin: "top center",
                        willChange: "transform, opacity",
                        WebkitFontSmoothing: "antialiased",
                    }}
                    className="w-full flex flex-col items-center justify-center pointer-events-none"
                >
                    <div
                        className="text-[8vw] sm:text-[5.5vw] md:text-[4vw] font-medium leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4 flex flex-col items-center"
                        style={{ fontFamily: "var(--font-tiempos-headline), serif", display: "swap" }}
                    >
                        {headingLines.map((line, lineIdx) => (
                            <div key={lineIdx} className="flex flex-wrap justify-center gap-[0.3em] overflow-visible">
                                {line.map((word, i) => (
                                    <div
                                        key={i}
                                        className="overflow-hidden inline-flex relative py-2 pl-1 pr-3 -mx-1"
                                        style={{ transform: "translateZ(0)" }}
                                    >
                                        <span
                                            className={`word-reveal ${earlyReveal ? "playing" : ""} ${lineIdx === 1 ? "italic font-light text-accent" : "font-semibold text-[#1e3a18]"}`}
                                            style={{ animationDelay: `${lineIdx * 0.1 + i * 0.04}s` }}
                                        >
                                            {word}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                    <p className={`subtitle-reveal ${earlyReveal ? "playing" : ""} text-xs sm:text-sm md:text-[1.1vw] text-[#F8F3E6] max-w-[90vw] md:max-w-3xl pointer-events-auto leading-relaxed mb-1 px-4 md:px-0`}>
                        Attention is the highest currency, we are helping you to mine it
                    </p>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={contentControls}
                style={{ y: textY, opacity: textOpacity, z: 0.01, willChange: "transform, opacity" }}
                className="absolute bottom-[6vh] md:bottom-[8vh] left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto"
            >
                <motion.button
                    onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" })}
                    onPointerMove={(e) => {
                        if (isTouchDevice || !parallaxUnlocked) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        buttonX.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
                        buttonY.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
                    }}
                    onPointerLeave={() => {
                        buttonX.set(0);
                        buttonY.set(0);
                    }}
                    style={{ x: buttonSpringX, y: buttonSpringY }}
                    className="group relative overflow-hidden rounded-full py-3 px-8 md:py-4 md:px-10"
                >
                    <div className="absolute inset-0 bg-accent rounded-full -z-10" />
                    <div className="absolute inset-0 bg-[#1e3a18] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />
                    <div className="relative z-10 flex items-center justify-center text-sm md:text-[1.1vw] font-medium text-black group-hover:text-white transition-colors duration-300">
                        <span>Book a Call</span>
                        <span className="ml-3 relative flex items-center justify-center overflow-hidden w-5 h-5">
                            <span className="absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                            <span className="absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </span>
                        </span>
                    </div>
                </motion.button>
            </motion.div>

            <AnimatePresence>
                {earlyReveal && !isTouchDevice && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                        style={{ y: textY }}
                        className="absolute bottom-[6vh] md:bottom-[8vh] right-[6vw] md:right-[4vw] z-[100] hidden md:flex items-center gap-4 pointer-events-none"
                    >
                        <span className="text-xs uppercase tracking-[0.25em] text-[#F8F3E6]/80 font-bold mt-[2px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Move cursor to explore
                        </span>
                        <div className="w-16 h-[2px] bg-[#F8F3E6]/20 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 h-full w-6 bg-[#F8F3E6]/90"
                                animate={{
                                    x: [0, 40, 0],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}