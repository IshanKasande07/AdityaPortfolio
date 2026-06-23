"use client";

import React, { useState, useEffect, ReactNode, createContext, useContext, useMemo } from "react";

interface RevealContextType {
    revealed: boolean;
    earlyReveal: boolean;
    setRevealed: (v: boolean) => void;
    setEarlyReveal: (v: boolean) => void;
}

const RevealContext = createContext<RevealContextType>({
    revealed: false,
    earlyReveal: false,
    setRevealed: () => { },
    setEarlyReveal: () => { },
});

export function useReveal() {
    return useContext(RevealContext);
}

interface RevealLayoutProps {
    children: ReactNode;
}

const BORDER_PX = 18;
const RADIUS = "20px";
const CREAM = "#F8F3E6";

export function RevealProvider({ children }: { children: ReactNode }) {
    const [revealed, setRevealed] = useState(false);
    const [earlyReveal, setEarlyReveal] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setRevealed(true);
            setEarlyReveal(true);
            document.body.style.backgroundColor = CREAM;
            document.documentElement.style.backgroundColor = CREAM;
            return;
        }

        document.body.style.backgroundColor = CREAM;
        document.documentElement.style.backgroundColor = CREAM;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.body.style.pointerEvents = "none";
    }, []);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        if (revealed) {
            document.body.style.backgroundColor = CREAM;
            document.documentElement.style.backgroundColor = CREAM;

            document.body.style.paddingRight = "0px";
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.style.pointerEvents = "";

            setTimeout(() => {
                import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                    ScrollTrigger.refresh();
                });
            }, 100);
        }
    }, [revealed]);

    const contextValue = useMemo(() => ({
        revealed, earlyReveal, setRevealed, setEarlyReveal
    }), [revealed, earlyReveal]);

    return (
        <RevealContext.Provider value={contextValue}>
            {children}
        </RevealContext.Provider>
    );
}

export default function RevealLayout({ children }: RevealLayoutProps) {
    const { setRevealed, setEarlyReveal } = useReveal();
    const [paths, setPaths] = useState<{ start: string, end: string } | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setRevealed(true);
            setEarlyReveal(true);
            return;
        }

        // 1. Calculate exact mathematical pixels to prevent unit-mismatch snapping
        const w = window.innerWidth;
        const h = window.innerHeight;
        const pillW = 120;
        const pillH = 12;

        const insetX = (w - pillW) / 2;
        const insetY = (h - pillH) / 2;

        setPaths({
            start: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round 100px)`,
            end: `inset(${BORDER_PX}px ${BORDER_PX}px ${BORDER_PX}px ${BORDER_PX}px round ${RADIUS})`
        });

        // 2. The Decode Buffer
        // Wait 400ms before changing the state. This gives Next.js the time to decode 
        // the heavy background images in Hero2 WITHOUT dropping animation frames.
        const startTimer = setTimeout(() => {
            setIsExpanded(true);
        }, 400);

        // 3. Mark as complete (400ms buffer + 1600ms CSS duration)
        const completeTimer = setTimeout(() => {
            setRevealed(true);
            setEarlyReveal(true);
        }, 2000);

        return () => {
            clearTimeout(startTimer);
            clearTimeout(completeTimer);
        };
    }, [setRevealed, setEarlyReveal]);

    // Fallback for the very first SSR frame before the JS math runs
    const fallbackPath = "inset(49.5% 45% 49.5% 45% round 100px)";

    return (
        <div
            className="reveal-parent-container relative w-full overflow-hidden"
            style={{
                backgroundColor: CREAM,
                minHeight: "100vh",
                contain: "layout",
            }}
        >
            <style>{`
                @media (max-width: 768px) {
                    .reveal-parent-container {
                        background-color: #F8F3E6 !important;
                        contain: none !important;
                    }
                    .reveal-animated-div {
                        clip-path: none !important;
                        transition: none !important;
                        transform: none !important;
                        will-change: auto !important;
                    }
                }
            `}</style>

            {/* OPTIMIZATION: Removed <motion.div> to strictly enforce CSS Engine transition */}
            <div
                className="reveal-animated-div"
                style={{
                    clipPath: isExpanded && paths ? paths.end : (paths ? paths.start : fallbackPath),
                    // Only apply the CSS transition AFTER the start path is painted to the DOM
                    transition: paths ? "clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1)" : "none",
                    willChange: "clip-path",
                    transform: "translate3d(0, 0, 0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    position: "relative",
                    width: "100%",
                    zIndex: 50,
                    contain: "paint layout",
                }}
            >
                {children}
            </div>
        </div>
    );
}