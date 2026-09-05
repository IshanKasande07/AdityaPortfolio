"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";

interface AnimatedSVGTextProps {
    text: string;
    className?: string;
    fillColor?: string;
    strokeColor?: string;
    delay?: number;
    italic?: boolean;
    inView?: boolean;
}

export default function AnimatedSVGText({ 
    text, 
    className = "", 
    fillColor = "#F8F3E6", 
    strokeColor = "#F8F3E6",
    delay = 0,
    italic = false,
    inView = true
}: AnimatedSVGTextProps) {
    const textRef = useRef<SVGTextElement>(null);

    useEffect(() => {
        const textElement = textRef.current;
        if (!textElement) return;

        const dashValue = 1200;

        // Reset to initial state
        gsap.set(textElement, {
            strokeDasharray: dashValue,
            strokeDashoffset: dashValue,
            fill: "transparent",
            stroke: strokeColor,
            strokeWidth: 1.5,
        });

        if (!inView) return;

        const tl = gsap.timeline({ delay: delay });

        // Phase 1: Concurrent Draw (Animate offset to 0)
        tl.to(textElement, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power3.inOut",
        });

        // Phase 2: Solid Fill (Fade in the fill, fade out the stroke)
        tl.to(textElement, {
            fill: fillColor,
            stroke: "transparent",
            duration: 0.8,
            ease: "power2.out",
        }, "-=0.3");

        return () => {
            tl.kill();
        };
    }, [fillColor, strokeColor, delay, inView]);

    return (
        <svg 
            className={`w-full h-auto overflow-visible ${className}`} 
            viewBox="0 0 600 100" 
            preserveAspectRatio="xMinYMid meet"
        >
            <text
                ref={textRef}
                x="0"
                y="75%"
                textAnchor="start"
                className={`font-medium ${italic ? 'italic' : ''}`}
                style={{ 
                    fontFamily: "var(--font-tiempos-headline), serif",
                    fontSize: "80px",
                }}
            >
                {text}
            </text>
        </svg>
    );
}
