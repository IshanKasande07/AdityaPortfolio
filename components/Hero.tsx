"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useReveal } from "./RevealLayout";

const videos = [
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/01_Origins%20x%20Nandini%20%28%20Final%20%29%20%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Bipsun%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Chatter%20Box%20v2%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Deccan%20Gymkhana%20%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Image%20Analysis%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/Scaler%20Trailer%20Reel%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/electricity%20bill%20copy.mp4",
    "https://glq1banjnszesnxr.public.blob.vercel-storage.com/solar%20tax%20copy.mp4",
];

const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

export default function Hero() {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    // FIX — parallax gate: stays false during entire entry animation,
    // flips true only after Phase 2 finishes (1200ms delay + 1500ms duration).
    // While false, the scroll transform style is not attached to the element
    // so those useTransform subscriptions cost nothing during the move.
    const [parallaxReady, setParallaxReady] = useState(false);

    useEffect(() => {
        if (earlyReveal) {
            const startY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

            // Phase 1
            headerControls.start({
                opacity: 1,
                y: startY,
                scale: 1.5,
                transition: { duration: 0.8, ease: "easeOut" },
            });

            // Phase 2 — starts at 1200ms (words done at ~1110ms)
            const phaseTwo = setTimeout(() => {
                headerControls.start({
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                });

                // Carousel + button — offset 250ms so compositor isn't
                // bootstrapping new layers at frame 0 of the heading move
                const contentTimer = setTimeout(() => {
                    contentControls.start({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    });
                }, 250);

                // FIX — attach parallax only after Phase 2 is fully complete.
                // 1500ms = Phase 2 duration. Small 100ms buffer for safety.
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

    const rawRotation = useMotionValue(0);
    const rotation = useSpring(rawRotation, { stiffness: 70, damping: 20, mass: 1 });
    const lastX = useRef<number | null>(null);

    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    const buttonSpringX = useSpring(buttonX, { stiffness: 150, damping: 15, mass: 0.1 });
    const buttonSpringY = useSpring(buttonY, { stiffness: 150, damping: 15, mass: 0.1 });

    useEffect(() => {
        const updatePosition = () => {
            const vh = window.innerHeight;
            const vw = window.innerWidth;
            if (vw >= 1440) {
                containerRef.current?.style.setProperty("--btn-top", `${vh - 130}px`);
                containerRef.current?.style.setProperty("--btn-bottom", `auto`);
            } else if (vw >= 1024) {
                containerRef.current?.style.setProperty("--btn-top", `${vh - 90}px`);
                containerRef.current?.style.setProperty("--btn-bottom", `auto`);
            } else {
                containerRef.current?.style.setProperty("--btn-top", `auto`);
                containerRef.current?.style.setProperty("--btn-bottom", `5vw`);
            }
        };
        updatePosition();
        window.addEventListener("resize", updatePosition);
        return () => window.removeEventListener("resize", updatePosition);
    }, []);

    const { scrollY } = useScroll();
    const headlineY = useTransform(scrollY, [0, 500], [0, 150]);
    const headlineOpacity = useTransform(scrollY, [0, 350], [1, 0]);
    const headlineScale = useTransform(scrollY, [0, 500], [1, 0.85]);
    const noiseY = useTransform(scrollY, [0, 600], [0, 50]);
    const glowY = useTransform(scrollY, [0, 600], [0, 100]);
    const carouselY = useTransform(scrollY, [0, 800], [0, 350]);

    return (
        <div
            ref={containerRef}
            id="work"
            className="relative min-h-[750px] h-screen w-full bg-background overflow-hidden z-20"
        >
            <style>{`
                @keyframes wordReveal {
                    from { transform: translateY(120%); opacity: 0; }
                    to   { transform: translateY(0%);   opacity: 1; }
                }
                /* FIX — subtitle uses same mechanism as words: CSS keyframe,
                   runs off main thread, zero Framer Motion overhead,
                   completely invisible to parent headerControls compositor layer */
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
                    /* delay 0.6s matches original motion.p variant delay exactly */
                    animation: subtitleReveal 0.8s ease-out 0.6s forwards;
                    animation-play-state: paused;
                }
                .subtitle-reveal.playing {
                    animation-play-state: running;
                }
            `}</style>

            {revealed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    style={{ y: noiseY }}
                    className="absolute inset-0 pointer-events-none z-10 opacity-[0.05] will-change-transform"
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
                        }}
                    />
                </motion.div>
            )}

            {revealed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.0 }}
                    style={{ y: glowY }}
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none z-[5] will-change-transform"
                >
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(255,195,0,0.055) 0%, rgba(255,195,0,0.015) 45%, transparent 70%)",
                        }}
                    />
                </motion.div>
            )}

            {/* Scroll Parallax Wrapper
                FIX — parallaxReady gates the style prop entirely.
                During entry animation: no style → no useTransform subscriptions
                being evaluated on every frame while headerControls is moving.
                After entry completes: style snaps in — scroll parallax works
                exactly as before, user hasn't scrolled yet so no visual pop. */}
            <motion.div
                style={parallaxReady ? {
                    y: headlineY,
                    opacity: headlineOpacity,
                    scale: headlineScale,
                } : undefined}
                className="absolute top-[13vh] left-0 w-full flex flex-col items-center justify-center text-white text-center z-30 px-[5vw] pointer-events-none"
            >
                {/* One motion.div, one controller, one GPU layer */}
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

                    {/* FIX — plain <p> with CSS animation instead of motion.p.
                        Exact same values: duration 0.8s, ease-out, delay 0.6s.
                        Triggered by earlyReveal class swap, not a JS animation instance.
                        No Framer Motion child inside an animating parent = no conflict. */}
                    <p
                        className={`subtitle-reveal ${earlyReveal ? "playing" : ""} text-sm md:text-[1.1vw] text-[#EFEBDF] max-w-3xl pointer-events-auto leading-relaxed mb-1`}
                    >
                        Attention is the highest currency, we are helping you to mine it
                    </p>
                </motion.div>
            </motion.div>

            {/* 3D CAROUSEL */}
            <motion.div
                style={{ y: carouselY, bottom: "calc(0px + 4.5vw)" }}
                className="absolute left-0 w-full flex justify-center pointer-events-none z-20 will-change-transform"
            >
                <motion.div
                    initial={{ scale: 1.25, opacity: 0, y: 50 }}
                    animate={contentControls}
                    style={{ transformStyle: "preserve-3d" }}
                >
                    <div
                        style={{
                            perspective: "500px",
                            transform: "scale(clamp(0.2, 100vw / 3000, 0.45))",
                            transformOrigin: "bottom center",
                            contain: "layout",
                        }}
                        className="relative pointer-events-auto"
                    >
                        <motion.div
                            onPointerDown={(e) => { lastX.current = e.clientX; }}
                            onPointerMove={(e) => {
                                if (lastX.current !== null) {
                                    const delta = e.clientX - lastX.current;
                                    rawRotation.set(rawRotation.get() + delta * 0.15);
                                    lastX.current = e.clientX;
                                }
                            }}
                            onPointerUp={() => { lastX.current = null; }}
                            onPointerLeave={() => { lastX.current = null; }}
                            style={{
                                rotateY: rotation,
                                transformStyle: "preserve-3d",
                                cursor: "grab",
                            }}
                            className="relative w-[900px] h-[520px] will-change-transform"
                        >
                            {revealed &&
                                videos.map((src, i) => {
                                    const angle = (360 / videos.length) * i;
                                    return (
                                        <div
                                            key={i}
                                            style={{
                                                transformStyle: "preserve-3d",
                                                transform: `rotateY(${angle}deg) translateZ(550px) scale(1.2)`,
                                            }}
                                            className="absolute inset-0 flex items-center justify-center"
                                        >
                                            <div style={{ transform: "rotateY(180deg) translateZ(0)" }}>
                                                <video
                                                    src={src}
                                                    autoPlay
                                                    loop
                                                    muted
                                                    playsInline
                                                    preload="none"
                                                    disablePictureInPicture
                                                    className="w-[280px] h-[435px] rounded-xl object-cover shadow-[0_0_30px_rgba(0,0,0,0.8)] select-none border border-white/10"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>

            {/* CTA BUTTON */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={contentControls}
                style={{
                    y: carouselY,
                    top: "var(--btn-top)",
                    bottom: "var(--btn-bottom)",
                }}
                className="absolute left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto will-change-transform"
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
    );
}