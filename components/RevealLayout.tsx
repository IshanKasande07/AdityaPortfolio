"use client";

import React, { useState, useEffect, useRef, ReactNode, createContext, useContext, useMemo } from "react";
import "./css/reveal-layout.css";
import { useLoading } from "./LoadingContext";

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

const BORDER_TOP_PX = 66;
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
    const { isLoading } = useLoading();
    const [paths, setPaths] = useState<{ start: string; end: string } | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const animatedDivRef = useRef<HTMLDivElement>(null);

    // Compute clip-path values once on mount
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            setRevealed(true);
            setEarlyReveal(true);
            return;
        }

        // Calculate clip-path values once
        const w = window.innerWidth;
        const h = window.innerHeight;
        const pillW = 120;
        const pillH = 12;

        const insetX = (w - pillW) / 2;
        const insetY = (h - pillH) / 2;

        setPaths({
            start: `inset(${insetY}px ${insetX}px ${insetY}px ${insetX}px round 100px)`,
            end: `inset(${BORDER_TOP_PX}px ${BORDER_PX}px ${BORDER_PX}px ${BORDER_PX}px round ${RADIUS})`
        });
    }, [setRevealed, setEarlyReveal]);

    // Reveal animation — only starts when loading screen is done
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile || isLoading || !paths) return;

        let cancelled = false;
        let rafId1: number;
        let rafId2: number;

        // Double-rAF guarantees the browser has painted the start clip-path
        // before we trigger the CSS transition.
        rafId1 = requestAnimationFrame(() => {
            if (cancelled) return;
            rafId2 = requestAnimationFrame(() => {
                if (cancelled) return;
                setIsExpanded(true);
            });
        });

        // Completion — use transitionend with a fallback timeout
        let completed = false;
        const markComplete = () => {
            if (completed) return;
            completed = true;
            setRevealed(true);
            setEarlyReveal(true);
        };

        const el = animatedDivRef.current;
        const onTransitionEnd = (e: TransitionEvent) => {
            if (e.propertyName === "clip-path") markComplete();
        };
        el?.addEventListener("transitionend", onTransitionEnd);

        // Fallback: 32ms rAF + 1600ms transition + 300ms buffer
        const fallbackTimer = setTimeout(markComplete, 2000);

        return () => {
            cancelled = true;
            if (rafId1) cancelAnimationFrame(rafId1);
            if (rafId2) cancelAnimationFrame(rafId2);
            clearTimeout(fallbackTimer);
            el?.removeEventListener("transitionend", onTransitionEnd);
        };
    }, [isLoading, paths, setRevealed, setEarlyReveal]);

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
            <div
                ref={animatedDivRef}
                className="reveal-animated-div"
                style={{
                    clipPath: isExpanded && paths ? paths.end : (paths ? paths.start : fallbackPath),
                    transition: paths ? "clip-path 1.6s cubic-bezier(0.65, 0, 0.35, 1)" : "none",
                    willChange: "clip-path",
                    transform: "translate3d(0, 0, 0)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    position: "relative",
                    width: "100%",
                    zIndex: 50,
                    contain: "layout paint",
                }}
            >
                {children}
            </div>
        </div>
    );
}