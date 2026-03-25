"use client";

import React, { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { motion } from "framer-motion";

interface RevealContextType {
    revealed: boolean;
    earlyReveal: boolean;
    setRevealed: (v: boolean) => void;
}

const RevealContext = createContext<RevealContextType>({
    revealed: false,
    earlyReveal: false,
    setRevealed: () => { },
});

export function useReveal() {
    return useContext(RevealContext);
}

interface RevealLayoutProps {
    children: ReactNode;
}

const BORDER_PX = 7;
const RADIUS = "20px";
const CREAM = "#EFEBDF";

export function RevealProvider({ children }: { children: ReactNode }) {
    const [revealed, setRevealed] = useState(false);
    const [earlyReveal, setEarlyReveal] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = CREAM;
        document.documentElement.style.backgroundColor = CREAM;

        // PERF FIX #1: Lock scroll for the entire reveal animation duration.
        //
        // Without this, Lenis + all useScroll hooks (headlineY, carouselY, glowY,
        // noiseY, velocityFactor in brands, FloatingCTA spring) are all computing
        // on every scroll event *during* the most expensive paint phase.
        // Locking scroll silences every one of those RAF callbacks for 1.6s.
        document.body.style.overflowY = "hidden";

        const timer = setTimeout(() => {
            setEarlyReveal(true);
        }, 1100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (revealed) {
            document.body.style.backgroundColor = "#0A0A0E";
            document.documentElement.style.backgroundColor = "#0A0A0E";
            // Restore scroll after the clip-path animation has fully completed.
            document.body.style.overflowY = "";
        }
    }, [revealed]);

    return (
        <RevealContext.Provider value={{ revealed, earlyReveal, setRevealed }}>
            {children}
        </RevealContext.Provider>
    );
}

export default function RevealLayout({ children }: RevealLayoutProps) {
    const { setRevealed } = useReveal();

    return (
        // PERF FIX #2: contain: "layout" on the outer shell.
        //
        // CSS Containment tells the browser: "nothing inside this element affects
        // layout outside it." Without this, every clip-path geometry change forces
        // the browser to run a full document layout pass to check whether sibling
        // nodes (BrandsWhoTrustUs, ImpactSection, etc.) might have shifted.
        // With "layout" containment, those passes are skipped entirely.
        <div
            className="relative w-full overflow-hidden"
            style={{
                backgroundColor: CREAM,
                minHeight: "100vh",
                contain: "layout",
            }}
        >
            <motion.div
                initial={{
                    clipPath: "inset(49.99% 49.9% 49.99% 49.9% round 9999px)",
                }}
                animate={{
                    clipPath: `inset(${BORDER_PX}px ${BORDER_PX}px ${BORDER_PX}px ${BORDER_PX}px round ${RADIUS})`,
                }}
                transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
                onAnimationComplete={() => setRevealed(true)}
                style={{
                    // PERF FIX #3: will-change: clip-path promotes this element to its
                    // own compositor layer. The browser pre-allocates a GPU texture for
                    // it so clip-path mutations don't invalidate the parent layer.
                    willChange: "clip-path",

                    // PERF FIX #4: transform: translateZ(0) forces hardware rasterization
                    // of this layer so the GPU compositor handles frame compositing,
                    // not the CPU paint thread.
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",

                    position: "relative",
                    width: "100%",
                    zIndex: 50,

                    // PERF FIX #5: contain: "paint layout" on the animated element itself.
                    //
                    // "paint" containment means: repaints that happen INSIDE this element
                    // (heading animation, glow, noise) do NOT propagate outside it.
                    // Without this, every frame of the clip-path animation triggers a
                    // full-document paint invalidation — the browser repaints your navbar,
                    // brands section, everything, on every frame of the reveal.
                    //
                    // "layout" containment (repeated here for the child context) ensures
                    // the clipped content's layout is isolated from the document flow.
                    contain: "paint layout",
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}