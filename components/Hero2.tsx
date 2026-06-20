"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useReveal } from "./RevealLayout";

const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

export default function Hero2() {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);
    const stickyRef = useRef<HTMLDivElement>(null);

    const [parallaxReady, setParallaxReady] = useState(false);

    // Entry animation — same phasing as original Hero.tsx
    useEffect(() => {
        if (earlyReveal) {
            const startY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

            // Phase 1: Heading fades in at center-ish, scaled up
            headerControls.start({
                opacity: 1,
                y: startY,
                scale: 1.5,
                transition: { duration: 0.8, ease: "easeOut" },
            });

            // Phase 2: Heading moves to final position
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

                const parallaxTimer = setTimeout(() => {
                    setParallaxReady(true);
                }, 1600);

                return () => {
                    clearTimeout(contentTimer);
                    clearTimeout(parallaxTimer);
                };
            }, 1200);

            return () => clearTimeout(phaseTwo);
        }
    }, [earlyReveal, headerControls, contentControls]);

    // Scroll-based parallax — tracks the outer 200vh container
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Each layer moves at a different speed
    // Sky: no transform (the background itself)
    const skyScrollY = useTransform(scrollYProgress, [0, 1], [0, 450]);
    const bridgeBehindY = useTransform(scrollYProgress, [0, 1], [0, 370]);
    const bridgeBottomCloudY = useTransform(scrollYProgress, [0, 1], [0, 330]);
    const bridgeY = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const cloudY = useTransform(scrollYProgress, [0, 1], [0, 130]);
    const mountainsY = useTransform(scrollYProgress, [0, 1], [0, 0]); // static relative to container

    // Mouse Parallax
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    const skyMouseX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
    const skyMouseY = useTransform(smoothMouseY, [-1, 1], [15, -15]);

    const bridgeBehindMouseX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
    const bridgeBehindMouseY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

    const bridgeBottomCloudMouseX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
    const bridgeBottomCloudMouseY = useTransform(smoothMouseY, [-1, 1], [-15, 15]);

    const bridgeMouseX = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
    const bridgeMouseY = useTransform(smoothMouseY, [-1, 1], [-25, 25]);

    const cloudMouseX = useTransform(smoothMouseX, [-1, 1], [-35, 35]);
    const cloudMouseY = useTransform(smoothMouseY, [-1, 1], [-35, 35]);

    const mountainsMouseX = useTransform(smoothMouseX, [-1, 1], [-50, 50]);
    const mountainsMouseY = useTransform(smoothMouseY, [-1, 1], [-50, 50]);

    // Combined Y transforms (Scroll + Mouse)
    const combinedSkyY = useTransform([skyScrollY, skyMouseY], ([s, m]) => s + m);
    const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], ([s, m]) => s + m);
    const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], ([s, m]) => s + m);
    const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], ([s, m]) => s + m);
    const combinedCloudY = useTransform([cloudY, cloudMouseY], ([s, m]) => s + m);
    const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], ([s, m]) => s + m);
    const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], ([s, m]) => s + m);

    // Text parallax — moves fastest and fades out
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

    // CTA button
    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    const buttonSpringX = useSpring(buttonX, { stiffness: 150, damping: 15, mass: 0.1 });
    const buttonSpringY = useSpring(buttonY, { stiffness: 150, damping: 15, mass: 0.1 });

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!parallaxReady) return;
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <div
            ref={containerRef}
            id="work"
            className="relative w-full h-screen overflow-hidden bg-background z-20"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
        >
            <style>{`
                @keyframes wordReveal {
                    from { transform: translateY(120%); opacity: 0; }
                    to   { transform: translateY(0%);   opacity: 1; }
                }
                @keyframes subtitleReveal {
                    from { transform: translateY(15px); opacity: 0; }
                    to   { transform: translateY(0px);  opacity: 1; }
                }
                .word-reveal {
                    display: inline-block;
                    opacity: 0;
                    will-change: transform, opacity;
                    animation: wordReveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    animation-play-state: paused;
                }
                .word-reveal.playing {
                    animation-play-state: running;
                }
                .subtitle-reveal {
                    opacity: 0;
                    will-change: transform, opacity;
                    animation: subtitleReveal 0.8s ease-out 0.6s forwards;
                    animation-play-state: paused;
                }
                .subtitle-reveal.playing {
                    animation-play-state: running;
                }
            `}</style>

            {/* Parallax Scene Wrapper */}
            <div className="absolute inset-0 w-full h-full">
                    {/* ========== LAYER 0: Sky (deepest background) ========== */}
                    <motion.div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: "url('/heroassets/Sky.png')",
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                            backgroundRepeat: "no-repeat",
                            x: parallaxReady ? skyMouseX : 0,
                            y: parallaxReady ? combinedSkyY : 0,
                            scale: 1.05,
                            transformOrigin: "center",
                            willChange: "transform",
                        }}
                    />

                {/* ========== LAYER 1: Bridge Behind (slowest parallax) ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? bridgeBehindMouseX : 0,
                        y: parallaxReady ? combinedBridgeBehindY : 0,
                        scale: 1.05,
                        transformOrigin: "center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[10]"
                >
                    <img
                        src="/heroassets/Bridge Behind.png"
                        alt=""
                        className="absolute w-full h-full object-cover object-center"
                        style={{ top: "0" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 1.5: Bridge Bottom Cloud ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? bridgeBottomCloudMouseX : 0,
                        y: parallaxReady ? combinedBridgeBottomCloudY : 0,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-x-0 bottom-0 z-[15] flex justify-center pointer-events-none"
                >
                    <img
                        src="/heroassets/Bridge Bottom Cloud_.png"
                        alt=""
                        className="object-contain object-bottom"
                        style={{ width: "25vw", height: "auto" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 2: Bridge (medium parallax) ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? bridgeMouseX : 0,
                        y: parallaxReady ? combinedBridgeY : 0,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[20]"
                >
                    <img
                        src="/heroassets/Bridge.png"
                        alt=""
                        className="absolute w-full object-cover object-bottom"
                        style={{ height: "102%", top: "2vh" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 3: Cloud (medium-fast parallax) ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? cloudMouseX : 0,
                        y: parallaxReady ? combinedCloudY : 0,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[30]"
                >
                    <img
                        src="/heroassets/CLoud.png"
                        alt=""
                        draggable={false}
                        className="absolute bottom-0 left-0 w-full"
                        style={{
                            height: "auto",
                        }}
                    />
                </motion.div>

                {/* ========== LAYER 4: Left Mountain (fast parallax, bottom-left) ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? mountainsMouseX : 0,
                        y: parallaxReady ? combinedLeftMountainY : 0,
                        scale: 1.1,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[40]"
                >
                    <img
                        src="/heroassets/LEft Mountaim.png"
                        alt=""
                        draggable={false}
                        className="absolute bottom-0 left-0"
                        style={{
                            width: "22vw",
                            height: "auto",
                            maxWidth: "none",
                        }}
                    />
                </motion.div>

                {/* ========== LAYER 4: Right Mountain (fast parallax, bottom-right) ========== */}
                <motion.div
                    style={{
                        x: parallaxReady ? mountainsMouseX : 0,
                        y: parallaxReady ? combinedRightMountainY : 0,
                        scale: 1.1,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[40]"
                >
                    <img
                        src="/heroassets/Right Mountaim.png"
                        alt=""
                        draggable={false}
                        className="absolute bottom-0 right-0"
                        style={{
                            width: "22vw",
                            height: "auto",
                            maxWidth: "none",
                        }}
                    />
                </motion.div>

                {/* ========== Noise overlay (from original Hero) ========== */}
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 pointer-events-none z-[45] opacity-[0.05] will-change-transform"
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                            }}
                        />
                    </motion.div>
                )}

                {/* ========== LAYER 5: Text Overlay + CTA (highest z) ========== */}
                <motion.div
                    style={parallaxReady ? {
                        y: textY,
                        opacity: textOpacity,
                        scale: textScale,
                    } : undefined}
                    className="absolute top-[13vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-[50] px-[5vw] pointer-events-none"
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
                            className="text-3xl md:text-[4vw] font-medium leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4 flex flex-col items-center"
                            style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                        >
                            {headingLines.map((line, lineIdx) => (
                                <div
                                    key={lineIdx}
                                    className="flex flex-wrap justify-center gap-[0.3em] overflow-visible"
                                >
                                    {line.map((word, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden inline-flex relative py-1 px-1 -mx-1"
                                            style={{ WebkitTransform: "translateZ(0)" }}
                                        >
                                            <span
                                                className={`word-reveal ${earlyReveal ? "playing" : ""} ${lineIdx === 1
                                                    ? "italic font-normal text-accent"
                                                    : "text-primary"
                                                    }`}
                                                style={{
                                                    animationDelay: `${lineIdx * 0.1 + i * 0.04}s`,
                                                }}
                                            >
                                                {word}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <p
                            className={`subtitle-reveal ${earlyReveal ? "playing" : ""} text-sm md:text-[1.1vw] text-[#EFEBDF] max-w-3xl pointer-events-auto leading-relaxed mb-1`}
                        >
                            Attention is the highest currency, we are helping you to mine it
                        </p>
                    </motion.div>
                </motion.div>

                {/* ========== CTA BUTTON ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={contentControls}
                    style={parallaxReady ? {
                        y: textY,
                        opacity: textOpacity,
                    } : undefined}
                    className="absolute bottom-[8vh] left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto will-change-transform"
                >
                    <motion.button
                        onClick={() =>
                            document.getElementById("contact")?.scrollIntoView({ behavior: "instant" })
                        }
                        onPointerMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            buttonX.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
                            buttonY.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
                        }}
                        onPointerLeave={() => {
                            buttonX.set(0);
                            buttonY.set(0);
                        }}
                        style={{ x: buttonSpringX, y: buttonSpringY }}
                        className="group relative overflow-hidden rounded-full py-4 px-10 will-change-transform"
                    >
                        <div className="absolute inset-0 bg-accent rounded-full -z-10" />
                        <div className="absolute inset-0 bg-[#27701B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />
                        <div className="relative z-10 flex items-center justify-center text-base md:text-[1.1vw] font-medium text-black group-hover:text-primary transition-colors duration-300">
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
            </div>
        </div>
    );
}
