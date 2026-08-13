"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useReveal } from "./RevealLayout";

const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

const combineTransforms = ([s, m]: number[]) => s + m;

export default function Hero2() {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    const [parallaxUnlocked, setParallaxUnlocked] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia("(pointer: coarse)");
        if (mql.matches) setIsTouchDevice(true);

        const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        mql.addEventListener("change", handler);

        const handleTouchStart = () => setIsTouchDevice(true);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });

        return () => {
            mql.removeEventListener("change", handler);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

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

    // PERF: Use stiffness=1e-9 when parallax is locked so the spring solver
    // effectively never ticks (no frame budget spent on idle springs).
    const mouseSpringConfig = useMemo(() => ({
        stiffness: parallaxUnlocked ? 50 : 1e-9,
        damping: 20,
    }), [parallaxUnlocked]);
    const smoothMouseX = useSpring(mouseX, mouseSpringConfig);
    const smoothMouseY = useSpring(mouseY, mouseSpringConfig);

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

    const combinedSkyY = useTransform([skyScrollY, skyMouseY], combineTransforms);
    const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], combineTransforms);
    const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], combineTransforms);
    const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], combineTransforms);
    const combinedCloudY = useTransform([cloudY, cloudMouseY], combineTransforms);
    const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);
    const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);

    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

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

    const handlePointerMove = (e: React.PointerEvent) => {
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
            className="relative overflow-hidden bg-background z-20 w-full h-[calc(100vh-72px)] mt-[60px] mb-[12px] rounded-[16px] md:w-[calc(100%-36px)] md:h-[calc(100vh-84px)] md:mt-[66px] md:mb-[18px] md:mx-[18px] md:rounded-[20px]"
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

            {/* PERF: Removed preserve-3d — avoids forcing a 3D rendering context on the entire layer tree */}
            <div className="absolute inset-0 w-full h-full" style={{ contain: "content" }}>

                {/* ========== LAYER 0: Sky ========== */}
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
                    }}
                />

                {/* ========== LAYER 1: Bridge Behind ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : bridgeBehindMouseX,
                        y: isTouchDevice ? bridgeBehindY : combinedBridgeBehindY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "center",
                    }}
                    className="absolute inset-0 z-[10] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/Bridge Behind.webp"
                        alt="Bridge Background"
                        fill
                        priority
                        className="object-cover object-center"
                        draggable={false}
                        sizes="100vw"
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
                    }}
                    className="absolute inset-x-0 bottom-0 z-[15] hidden md:flex justify-center pointer-events-none"
                >
                    <Image
                        src="/heroassets/Bridge Bottom Cloud_.webp"
                        alt="Cloud Layer"
                        width={800}
                        height={400}
                        loading="lazy"
                        className="object-contain object-bottom"
                        style={{ width: "clamp(140px, 30vw, 800px)", height: "auto", clipPath: "inset(15% 0 0 0)" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 2: Bridge ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : bridgeMouseX,
                        y: isTouchDevice ? bridgeY : combinedBridgeY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        height: "102%",
                        top: "2vh",
                    }}
                    className="absolute left-0 w-full z-[20] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/Bridge.webp"
                        alt="Bridge Overlay"
                        fill
                        priority
                        className="object-cover object-bottom"
                        draggable={false}
                        sizes="100vw"
                    />
                </motion.div>

                {/* ========== LAYER 3: Cloud ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : cloudMouseX,
                        y: isTouchDevice ? cloudY : combinedCloudY,
                        z: 0.01,
                        scale: 1.15,
                        transformOrigin: "center",
                    }}
                    className="absolute inset-0 -bottom-32 z-[30] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/CLoud.webp"
                        alt="Cloud Overlay"
                        width={1200}
                        height={400}
                        priority
                        className="absolute bottom-[18vh] left-1/2 -translate-x-1/2"
                        style={{ width: "130%", height: "auto" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 4: Left Mountain ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedLeftMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom left",
                    }}
                    className="absolute inset-0 -bottom-20 -left-20 z-[40] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/LEft Mountaim.webp"
                        alt="Left Mountain"
                        width={600}
                        height={600}
                        priority
                        className="absolute bottom-0 left-0"
                        style={{ width: "clamp(120px, 27vw, 540px)", height: "auto", maxWidth: "none" }}
                        draggable={false}
                    />
                </motion.div>

                {/* ========== LAYER 4: Right Mountain ========== */}
                <motion.div
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedRightMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom right",
                    }}
                    className="absolute inset-0 -bottom-20 -right-20 z-[40] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/Right Mountaim.webp"
                        alt="Right Mountain"
                        width={800}
                        height={800}
                        priority
                        className="absolute bottom-0 right-0"
                        style={{ width: "clamp(160px, 35vw, 700px)", height: "auto", maxWidth: "none" }}
                        draggable={false}
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
                            style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }}
                        />
                    </motion.div>
                )}

                {/* ========== LAYER 5: Text Overlay + CTA ========== */}
                <motion.div
                    style={{ y: textY, opacity: textOpacity, scale: textScale, z: 0.01 }}
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