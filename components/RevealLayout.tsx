"use client";

import React, { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { motion } from "framer-motion";

interface RevealContextType {
    revealed: boolean;
    earlyReveal: boolean;
    setRevealed: (v: boolean) => void;
}

const RevealContext = createContext<RevealContextType>({ revealed: false, earlyReveal: false, setRevealed: () => { } });

export function useReveal() {
    return useContext(RevealContext);
}

interface RevealLayoutProps {
    children: ReactNode;
}

// Uniform cream border on all 4 sides — Navbar lives INSIDE the card
const BORDER_PX = 7;
const RADIUS = "20px";
const CREAM = "#EFEBDF";

// Provider: wraps the entire page so any component can read reveal state
export function RevealProvider({ children }: { children: ReactNode }) {
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
        <RevealContext.Provider value={{ revealed, earlyReveal, setRevealed }}>
            {children}
        </RevealContext.Provider>
    );
}

// Layout: just the clip-path animation shell — wraps only the Hero
export default function RevealLayout({ children }: RevealLayoutProps) {
    const { setRevealed } = useReveal();

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ backgroundColor: CREAM, minHeight: "100vh" }}
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
                    willChange: "clip-path, transform",
                    transform: "translateZ(0)",
                    position: "relative",
                    width: "100%",
                    zIndex: 50,
                }}
            >
                {children}
            </motion.div>
        </div>
    );
}
