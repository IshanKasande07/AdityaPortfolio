"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useReveal } from "./RevealLayout";

const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

const smoothTransform = ([s, m]: any) => Math.round((s + m) * 10) / 10;

export default function Hero2() {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    // Strict lock state that defaults to false — prevents mouse parallax during reveal
    const [parallaxUnlocked, setParallaxUnlocked] = useState(false);
    // Detect touch devices to disable mouse parallax entirely
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        // Check for touch-primary device (mobile/tablet)
        const mql = window.matchMedia("(pointer: coarse)");
        if (mql.matches) {
            setIsTouchDevice(true);
        }
        const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        mql.addEventListener("change", handler);

        const handleTouchStart = () => {
            setIsTouchDevice(true);
        };
        window.addEventListener("touchstart", handleTouchStart, { passive: true });

        return () => {
            mql.removeEventListener("change", handler);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

    useEffect(() => {
        if (earlyReveal) {
            const startY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

            // Phase 1: Initial fade in
            headerControls.start({
                opacity: 1,
                y: startY,
                scale: 1.5,
                transition: { duration: 0.8, ease: "easeOut" },
            });

            const phaseTwo = setTimeout(() => {
                // Phase 2: Move to center
                headerControls.start({
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                });

                // Content Button fade in
                const contentTimer = setTimeout(() => {
                    contentControls.start({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    });
                }, 250);

                // Unlock mouse parallax ONLY after all animations finish
                const unlockTimer = setTimeout(() => {
                    setParallaxUnlocked(true);
                }, 1800);

                return () => {
                    clearTimeout(contentTimer);
                    clearTimeout(unlockTimer);
                }
            }, 1200);

            return () => clearTimeout(phaseTwo);
        }
    }, [earlyReveal, headerControls, contentControls]);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const skyScrollY = useTransform(scrollYProgress, [0, 1], [0, 450]);
    const bridgeBehindY = useTransform(scrollYProgress, [0, 1], [0, 370]);
    const bridgeBottomCloudY = useTransform(scrollYProgress, [0, 1], [0, 330]);
    const bridgeY = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const cloudY = useTransform(scrollYProgress, [0, 1], [0, 130]);
    const mountainsY = useTransform(scrollYProgress, [0, 1], [0, 0]);

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

    const combinedSkyY = useTransform([skyScrollY, skyMouseY], smoothTransform);
    const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], smoothTransform);
    const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], smoothTransform);
    const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], smoothTransform);
    const combinedCloudY = useTransform([cloudY, cloudMouseY], smoothTransform);
    const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], smoothTransform);
    const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], smoothTransform);

    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    const buttonSpringX = useSpring(buttonX, { stiffness: 150, damping: 15, mass: 0.1 });
    const buttonSpringY = useSpring(buttonY, { stiffness: 150, damping: 15, mass: 0.1 });

    const handlePointerMove = (e: React.PointerEvent) => {
        // No mouse parallax on touch devices or while reveal is playing
        if (isTouchDevice || !parallaxUnlocked) return;

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
            style={{ contain: "strict" }}
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
                .hero-sky-bg {
                    background-image: url('/heroassets/Sky.webp');
                }
                @media (max-width: 768px) {
                    .hero-sky-bg {
                        background-image: url('/heroassets/vertical-hero.webp');
                    }
                }
            `}</style>

            <div className="absolute inset-0 w-full h-full" style={{ transformStyle: "preserve-3d" }}>

                {/* ========== LAYER 0: Sky (deepest background) ========== */}
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none hero-sky-bg"
                    style={{
                        backgroundSize: "cover",
                        backgroundPosition: "top center",
                        backgroundRepeat: "no-repeat",
                        x: isTouchDevice ? 0 : skyMouseX,
                        y: isTouchDevice ? skyScrollY : combinedSkyY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "center",
                        willChange: "transform",
                    }}
                />

                {/* ========== LAYER 1: Bridge Behind (slowest parallax) ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : bridgeBehindMouseX,
                        y: isTouchDevice ? bridgeBehindY : combinedBridgeBehindY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[10] pointer-events-none hidden md:block"
                >
                    <img
                        src="/heroassets/Bridge Behind.webp"
                        alt=""
                        decoding="async"
                        className="absolute w-full h-full object-cover object-center"
                        style={{ top: "0" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 1.5: Bridge Bottom Cloud ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : bridgeBottomCloudMouseX,
                        y: isTouchDevice ? bridgeBottomCloudY : combinedBridgeBottomCloudY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-x-0 bottom-0 z-[15] hidden md:flex justify-center pointer-events-none"
                >
                    <img
                        src="/heroassets/Bridge Bottom Cloud_.webp"
                        alt=""
                        decoding="async"
                        className="object-contain object-bottom"
                        style={{ width: "clamp(140px, 30vw, 800px)", height: "auto", clipPath: "inset(15% 0 0 0)" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 2: Bridge (medium parallax) ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : bridgeMouseX,
                        y: isTouchDevice ? bridgeY : combinedBridgeY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 z-[20] pointer-events-none hidden md:block"
                >
                    <img
                        src="/heroassets/Bridge.webp"
                        alt=""
                        decoding="async"
                        className="absolute w-full object-cover object-bottom"
                        style={{ height: "102%", top: "2vh" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 3: Cloud (medium-fast parallax) ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : cloudMouseX,
                        y: isTouchDevice ? cloudY : combinedCloudY,
                        z: 0.01,
                        scale: 1.15,
                        transformOrigin: "center",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 -bottom-32 z-[30] pointer-events-none hidden md:block"
                >
                    <img
                        src="/heroassets/CLoud.webp"
                        alt=""
                        decoding="async"
                        draggable={false}
                        className="absolute bottom-[18vh] left-1/2 -translate-x-1/2"
                        style={{ width: "130%", height: "auto" }}
                    />
                </motion.div>

                {/* ========== LAYER 4: Left Mountain (fast parallax, bottom-left) ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedLeftMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom left",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 -bottom-20 -left-20 z-[40] pointer-events-none hidden md:block"
                >
                    <img
                        src="/heroassets/LEft Mountaim.webp"
                        alt=""
                        decoding="async"
                        draggable={false}
                        className="absolute bottom-0 left-0"
                        style={{ width: "clamp(120px, 27vw, 540px)", height: "auto", maxWidth: "none" }}
                    />
                </motion.div>

                {/* ========== LAYER 4: Right Mountain (fast parallax, bottom-right) ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedRightMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom right",
                        willChange: "transform",
                    }}
                    className="absolute inset-0 -bottom-20 -right-20 z-[40] pointer-events-none hidden md:block"
                >
                    <img
                        src="/heroassets/Right Mountaim.webp"
                        alt=""
                        decoding="async"
                        draggable={false}
                        className="absolute bottom-0 right-0"
                        style={{ width: "clamp(160px, 35vw, 700px)", height: "auto", maxWidth: "none" }}
                    />
                </motion.div>

                {/* ========== Noise overlay ========== */}
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 pointer-events-none z-[45] opacity-[0.05]"
                        style={{ transform: "translateZ(0)" }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
                        />
                    </motion.div>
                )}

                {/* ========== LAYER 5: Text Overlay + CTA (highest z) ========== */}
                <motion.div
                    style={{ y: textY, opacity: textOpacity, scale: textScale, z: 0.01 }}
                    className="absolute top-[10vh] md:top-[13vh] left-0 w-full flex flex-col items-center justify-center text-primary text-center z-[50] px-6 md:px-[5vw] pointer-events-none"
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
                            style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                        >
                            {headingLines.map((line, lineIdx) => (
                                <div key={lineIdx} className="flex flex-wrap justify-center gap-[0.3em] overflow-visible">
                                    {line.map((word, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden inline-flex relative py-1 px-1 -mx-1"
                                            style={{ transform: "translateZ(0)" }}
                                        >
                                            <span
                                                className={`word-reveal ${earlyReveal ? "playing" : ""} ${lineIdx === 1 ? "italic font-normal text-accent" : "text-primary"}`}
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

                {/* ========== CTA BUTTON ========== */}
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={contentControls}
                    style={{ y: textY, opacity: textOpacity, z: 0.01 }}
                    className="absolute bottom-[6vh] md:bottom-[8vh] left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto"
                >
                    <motion.button
                        onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" })}
                        onPointerMove={(e) => {
                            // No button hover physics on touch or during reveal
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
                        <div className="absolute inset-0 bg-[#27701B] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />
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
            </div>
        </div>
    );
}