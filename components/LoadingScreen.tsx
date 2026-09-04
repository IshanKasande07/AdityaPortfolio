"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLoading } from "./LoadingContext";
import { brandLogos } from "./BrandsWhoTrustUs";

/**
 * All images that must be fully decoded (GPU-ready) before the reveal
 * animation begins. This is the full inventory of above-the-fold and
 * visually-critical assets.
 */
const CRITICAL_IMAGES = [
    // Hero parallax layers (the biggest bottleneck)
    "/heroassets/Sky.webp",
    "/heroassets/Bridge Behind.webp",
    "/heroassets/Bridge.webp",
    "/heroassets/CLoud.webp",
    "/heroassets/LEft Mountaim.webp",
    "/heroassets/Right Mountaim.webp",
    "/heroassets/Bridge Bottom Cloud_.webp",
    // Brand logo (shown in navbar immediately after reveal)
    "/brandlogo/Monarch White.png",
    // Manifesto image (visible shortly after scrolling)
    "/assets/door1.jpg",
    // Preload all brand logos so the carousel is ready when scrolled to
    ...brandLogos.map(logo => logo.src)
];

/** Minimum time the loading screen is visible (ms) — prevents flash */
const MIN_DISPLAY_MS = 2500;
/** Maximum time to wait for images (ms) — don't block forever */
const MAX_WAIT_MS = 5000;

export default function LoadingScreen() {
    const { setLoadingComplete, setProgress } = useLoading();
    const [isVisible, setIsVisible] = useState(true);
    const [exiting, setExiting] = useState(false);
    const startTimeRef = useRef(Date.now());
    const completedRef = useRef(false);

    const triggerExit = useCallback(() => {
        if (completedRef.current) return;
        completedRef.current = true;

        // Ensure the progress bar shows 100% before exit
        setProgress(1);
        setExiting(true);

        // After exit animation completes, wait a tiny bit more to let the browser
        // settle before signaling RevealLayout to start the heavy clip-path animation
        setTimeout(() => {
            setIsVisible(false);
            setLoadingComplete();
        }, 800); // 600ms exit animation + 200ms buffer
    }, [setLoadingComplete, setProgress]);

    useEffect(() => {
        // Skip on mobile or if there's a hash — reveal is instant, no loading screen needed
        if (typeof window !== "undefined" && (window.innerWidth < 768 || window.location.hash)) {
            setIsVisible(false);
            setLoadingComplete();
            return;
        }

        let cancelled = false;
        let loadedCount = 0;
        const total = CRITICAL_IMAGES.length;

        const onImageDone = () => {
            loadedCount++;
            if (!cancelled) {
                setProgress(loadedCount / total);
            }
        };

        // Pre-decode all critical images
        const decodePromises = CRITICAL_IMAGES.map((src) => {
            const img = new window.Image();
            img.src = src;
            return img
                .decode()
                .then(onImageDone)
                .catch(() => {
                    // Count failed images as done to not block
                    onImageDone();
                });
        });

        // Wait for all images to decode
        const allDecoded = Promise.all(decodePromises);

        // Also enforce the minimum display time
        const minTimer = new Promise<void>((resolve) =>
            setTimeout(resolve, MIN_DISPLAY_MS)
        );

        // Maximum wait — don't block forever on slow connections
        const maxTimer = new Promise<void>((resolve) =>
            setTimeout(resolve, MAX_WAIT_MS)
        );

        // Proceed when: (all images decoded AND min time passed) OR max time exceeded
        Promise.race([
            Promise.all([allDecoded, minTimer]),
            maxTimer,
        ]).then(() => {
            if (!cancelled) {
                triggerExit();
            }
        });

        return () => {
            cancelled = true;
        };
    }, [setLoadingComplete, setProgress, triggerExit]);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    key="loading-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
                    style={{ backgroundColor: "#F8F3E6" }}
                >
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{
                            opacity: exiting ? 0 : 1,
                            scale: exiting ? 1.1 : 1,
                            y: exiting ? -20 : 0,
                        }}
                        transition={{
                            duration: exiting ? 0.5 : 0.8,
                            ease: [0.16, 1, 0.3, 1],
                        }}
                    >
                        <Image
                            src="/brandlogo/Monarch White.png"
                            alt="Monarch Media House"
                            width={100}
                            height={56}
                            className="object-contain invert opacity-80"
                            priority
                        />
                    </motion.div>

                    {/* Progress bar container */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                            opacity: exiting ? 0 : 1,
                            y: exiting ? -10 : 0,
                        }}
                        transition={{
                            duration: exiting ? 0.4 : 0.6,
                            delay: exiting ? 0 : 0.3,
                            ease: "easeOut",
                        }}
                        className="mt-8 w-[120px] md:w-[160px]"
                    >
                        {/* Track */}
                        <div
                            className="w-full h-[2px] rounded-full overflow-hidden"
                            style={{ backgroundColor: "rgba(17, 37, 14, 0.1)" }}
                        >
                            {/* Fill */}
                            <ProgressBar />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/** Separate component so it can subscribe to progress without re-rendering the whole screen */
function ProgressBar() {
    const { progress } = useLoading();

    return (
        <motion.div
            className="h-full rounded-full"
            style={{
                backgroundColor: "#11250E",
                width: `${Math.min(progress * 100, 100)}%`,
                transition: "width 0.3s ease-out",
            }}
        />
    );
}
