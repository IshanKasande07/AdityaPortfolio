"use client";

import { motion } from "framer-motion";

export default function BackgroundCanvas() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-background">

            {/* --- Optimized Ambient Fluid Glows --- */}
            {/* 
              Instead of massively blurring moving divs with mix-blend-mode (which kills FPS),
              we use pre-rendered radial gradients with standard opacity.
            */}

            {/* Orb 1: Subtle surface light moving top left */}
            <motion.div
                animate={{
                    x: ["0%", "10%", "-5%", "5%", "0%"],
                    y: ["0%", "5%", "-10%", "5%", "0%"],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-[20%] -left-[10%] w-[60%] h-[70vw] rounded-full opacity-20 will-change-transform transform-gpu"
                style={{
                    background: "radial-gradient(circle, var(--color-surface-light) 0%, transparent 60%)"
                }}
            />

            {/* Orb 2: Very faint accent (gold) moving bottom right */}
            <motion.div
                animate={{
                    x: ["0%", "-5%", "10%", "-5%", "0%"],
                    y: ["0%", "-10%", "5%", "-5%", "0%"],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -bottom-[20%] -right-[15%] w-[70%] h-[80vw] rounded-full opacity-10 will-change-transform transform-gpu"
                style={{
                    background: "radial-gradient(circle, var(--color-accent) 0%, transparent 60%)"
                }}
            />

            {/* Orb 3: Another neutral orb for depth in center/left */}
            <motion.div
                animate={{
                    x: ["0%", "10%", "0%", "-10%", "0%"],
                    y: ["0%", "-5%", "5%", "-5%", "0%"],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-[30%] left-[20%] w-[50%] h-[60vw] rounded-full opacity-30 will-change-transform transform-gpu"
                style={{
                    background: "radial-gradient(circle, var(--color-surface) 0%, transparent 60%)"
                }}
            />

            {/* --- Static Tileable Noise Overlay --- */}
            {/* Replaced massive live SVG filter with a static tileable noise image for massive performance gains */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}
            />
        </div>
    );
}
