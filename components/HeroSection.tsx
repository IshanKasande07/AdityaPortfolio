"use client";

import { useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";
import Hero2 from "./Hero2";
import Hero2Background from "./Hero2Background";
import RevealLayout from "./RevealLayout";
import { useReveal } from "./RevealLayout";

const combineTransforms = ([s, m]: number[]) => s + m;

/**
 * HeroSection — orchestrator that owns the single shared scroll listener
 * and mouse tracking, then distributes motion values to both:
 *   • Hero2Background (position: fixed, outside RevealLayout)
 *   • Hero2 (foreground text/CTA, inside RevealLayout)
 */
export default function HeroSection() {
    const { earlyReveal } = useReveal();

    const spacerRef = useRef<HTMLDivElement>(null);
    const [parallaxUnlocked, setParallaxUnlocked] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [bgSwapped, setBgSwapped] = useState(false);
    const [posterReady, setPosterReady] = useState(false);

    // ── Container height for the scroll-away transform ───────────
    const [containerHeight, setContainerHeight] = useState(0);
    useEffect(() => {
        const updateHeight = () => {
            if (spacerRef.current) {
                setContainerHeight(spacerRef.current.offsetHeight);
            }
        };
        updateHeight();
        window.addEventListener("resize", updateHeight);
        return () => window.removeEventListener("resize", updateHeight);
    }, []);

    // ── Touch device detection ───────────────────────────────────
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

    // ── Unlock parallax after reveal settles ─────────────────────
    useEffect(() => {
        if (earlyReveal) {
            const bgSwapTimer = setTimeout(() => {
                setBgSwapped(true);
            }, 50);

            const unlockTimer = setTimeout(() => {
                setParallaxUnlocked(true);
            }, 3000); // ~1200ms phase-two delay + 1800ms unlock

            return () => {
                clearTimeout(bgSwapTimer);
                clearTimeout(unlockTimer);
            };
        }
    }, [earlyReveal]);

    // ── Scroll tracking (single listener for entire hero) ────────
    const { scrollYProgress } = useScroll({
        target: spacerRef,
        offset: ["start start", "end start"],
    });

    // ── Base scroll-away transform ───────────────────────────────
    // Simulates the container scrolling upward: 0 → -containerHeight
    const containerScrollY = useTransform(
        scrollYProgress,
        [0, 1],
        [0, -containerHeight]
    );

    // ── Per-layer scroll parallax offsets ─────────────────────────
    const skyScrollY = useTransform(scrollYProgress, [0, 1], [0, 450]);
    const bridgeBehindY = useTransform(scrollYProgress, [0, 1], [0, 370]);
    const bridgeBottomCloudY = useTransform(scrollYProgress, [0, 1], [0, 330]);
    const bridgeY = useTransform(scrollYProgress, [0, 1], [0, 250]);
    const cloudY = useTransform(scrollYProgress, [0, 1], [0, 130]);
    const mountainsY = useTransform(scrollYProgress, [0, 1], [0, 0]);

    // ── Mouse tracking ───────────────────────────────────────────
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

    // ── Per-layer mouse parallax offsets ──────────────────────────
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

    // ── Combined scroll + mouse Y ────────────────────────────────
    const combinedSkyY = useTransform([skyScrollY, skyMouseY], combineTransforms);
    const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], combineTransforms);
    const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], combineTransforms);
    const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], combineTransforms);
    const combinedCloudY = useTransform([cloudY, cloudMouseY], combineTransforms);
    const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);
    const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);

    // ── Text overlay transforms ──────────────────────────────────
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -200]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
    const textScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.85]);

    // ── Pointer move handler (shared across the hero area) ───────
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (isTouchDevice || !parallaxUnlocked) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
    }, [isTouchDevice, parallaxUnlocked, mouseX, mouseY]);

    const handlePointerLeave = useCallback(() => {
        mouseX.set(0);
        mouseY.set(0);
    }, [mouseX, mouseY]);

    const handlePosterReady = useCallback(() => {
        setPosterReady(true);
    }, []);

    return (
        <>
            {/* ── Fixed background (OUTSIDE RevealLayout) ──────────── */}
            <Hero2Background
                containerScrollY={containerScrollY}
                skyScrollY={skyScrollY}
                bridgeBehindY={bridgeBehindY}
                bridgeBottomCloudY={bridgeBottomCloudY}
                bridgeY={bridgeY}
                cloudY={cloudY}
                mountainsY={mountainsY}
                skyMouseX={skyMouseX}
                skyMouseY={skyMouseY}
                bridgeBehindMouseX={bridgeBehindMouseX}
                bridgeBehindMouseY={bridgeBehindMouseY}
                bridgeBottomCloudMouseX={bridgeBottomCloudMouseX}
                bridgeBottomCloudMouseY={bridgeBottomCloudMouseY}
                bridgeMouseX={bridgeMouseX}
                bridgeMouseY={bridgeMouseY}
                cloudMouseX={cloudMouseX}
                cloudMouseY={cloudMouseY}
                mountainsMouseX={mountainsMouseX}
                mountainsMouseY={mountainsMouseY}
                combinedSkyY={combinedSkyY}
                combinedBridgeBehindY={combinedBridgeBehindY}
                combinedBridgeBottomCloudY={combinedBridgeBottomCloudY}
                combinedBridgeY={combinedBridgeY}
                combinedCloudY={combinedCloudY}
                combinedLeftMountainY={combinedLeftMountainY}
                combinedRightMountainY={combinedRightMountainY}
                isTouchDevice={isTouchDevice}
                bgSwapped={bgSwapped}
                posterReady={posterReady}
                onPosterReady={handlePosterReady}
            />

            {/* ── Foreground (INSIDE RevealLayout) ─────────────────── */}
            <RevealLayout>
                <Hero2
                    spacerRef={spacerRef}
                    textY={textY}
                    textOpacity={textOpacity}
                    textScale={textScale}
                    scrollYProgress={scrollYProgress}
                    isTouchDevice={isTouchDevice}
                    parallaxUnlocked={parallaxUnlocked}
                    onPointerMove={handlePointerMove}
                    onPointerLeave={handlePointerLeave}
                />
            </RevealLayout>
        </>
    );
}
