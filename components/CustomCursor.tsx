"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // Smooth spring follow
    const x = useSpring(cursorX, { stiffness: 500, damping: 30, mass: 0.4 });
    const y = useSpring(cursorY, { stiffness: 500, damping: 30, mass: 0.4 });

    useEffect(() => {
        const move = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const over = (e: MouseEvent) => {
            const el = e.target as HTMLElement;
            const isInteractive = el.closest(
                'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover]'
            );
            setIsHovering(!!isInteractive);
        };

        const leave = () => setIsVisible(false);
        const enter = () => setIsVisible(true);

        document.addEventListener("mousemove", move);
        document.addEventListener("mouseover", over);
        document.addEventListener("mouseleave", leave);
        document.addEventListener("mouseenter", enter);
        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseover", over);
            document.removeEventListener("mouseleave", leave);
            document.removeEventListener("mouseenter", enter);
        };
    }, [cursorX, cursorY, isVisible]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
            style={{
                x,
                y,
                translateX: "-50%",
                translateY: "-50%",
                opacity: isVisible ? 1 : 0,
                width: isHovering ? 21 : 16,
                height: isHovering ? 21 : 16,
                backgroundColor: isHovering ? "#FFC300" : "#FFFFFF",
                transition:
                    "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), background-color 0.25s ease, opacity 0.25s ease",
            }}
        />
    );
};

export default CustomCursor;

