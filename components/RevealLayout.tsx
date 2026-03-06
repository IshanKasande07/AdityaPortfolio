"use client";

import React, { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { motion } from "framer-motion";

interface RevealContextType {
    revealed: boolean;
    earlyReveal: boolean;
}

const RevealContext = createContext<RevealContextType>({ revealed: false, earlyReveal: false });

export function useReveal() {
    return useContext(RevealContext);
}

interface RevealLayoutProps {
    children: ReactNode;
}

// Uniform cream border on all 4 sides — Navbar lives INSIDE the card
const BORDER_PX = 7;
const RADIUS = "20px";
const CREAM = "#F0EDE8";

export default function RevealLayout({ children }: RevealLayoutProps) {
    const [revealed, setRevealed] = useState(false);
    const [earlyReveal, setEarlyReveal] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = CREAM;
        document.documentElement.style.backgroundColor = CREAM;

        const timer = setTimeout(() => {
            setEarlyReveal(true);
        }, 1100);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (revealed) {
            document.body.style.backgroundColor = "#0A0A0E";
            document.documentElement.style.backgroundColor = "#0A0A0E";
        }
    }, [revealed]);

    return (
        /*
         * Outer shell: cream — all 4 sides visible as a premium bordered card.
         * The Navbar is INSIDE the clip, so it reveals as part of the hero card
         * (matching IntegratedBio's design exactly).
         */
        <div
            className="relative w-full overflow-hidden"
            style={{ backgroundColor: CREAM, minHeight: "100vh" }}
        >
            {/*
       * position:fixed during animation → clip-path % is viewport-relative
       * so the pill is exactly centred in the viewport.
       * position:absolute children (Navbar) ARE clipped by this clip-path.
       * After animation → position:relative restores normal document flow.
       */}
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
                    willChange: "clip-path, transform",
                    transform: "translateZ(0)",
                    position: revealed ? "relative" : "fixed",
                    inset: revealed ? "auto" : 0,
                    margin: revealed ? `${BORDER_PX}px` : undefined,
                    width: revealed ? `calc(100% - ${BORDER_PX * 2}px)` : "100%",
                    borderRadius: revealed ? RADIUS : undefined,
                    overflow: "hidden",
                    zIndex: revealed ? "auto" : 50,
                }}
            >
                <RevealContext.Provider value={{ revealed, earlyReveal }}>
                    {children}
                </RevealContext.Provider>
            </motion.div>

            {!revealed && <div style={{ height: "100vh" }} />}
        </div>
    );
}
