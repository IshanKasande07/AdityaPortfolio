"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TrendingUp, Users, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ImpactSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const arrowsRef = useRef<HTMLDivElement>(null);

    // We use an array of refs for the content blocks
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom", // Ties perfectly to the 400vh container
                    scrub: 1,
                    // No pinning used! We rely on native CSS `sticky` below. 
                    // This creates a flawless, zero-jitter scroll without fixed-to-absolute layout leaping.
                }
            });

            // Rotation: Animate the .impact-circle and .impact-arrows from rotation: 0 to rotation: 360 (linear easing) 
            tl.to([ringRef.current, arrowsRef.current], {
                rotation: 360,
                ease: "none",
                duration: 1, // Normalized to 1 for the timeline
            }, 0);

            // Content Sequence (The Cross-fade):

            // Phase 1 (Scroll 0-20%): Fade in Content 1
            tl.to(contentRefs.current[0], {
                autoAlpha: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            }, 0);

            // Phase 2 (Scroll 25-45%): Fade out Content 1 -> Fade in Content 2
            tl.to(contentRefs.current[0], {
                autoAlpha: 0,
                y: -24,
                duration: 0.2,
                ease: "power2.in"
            }, 0.25);

            tl.to(contentRefs.current[1], {
                autoAlpha: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            }, 0.25);

            // Phase 3 (Scroll 50-70%): Fade out Content 2 -> Fade in Content 3
            tl.to(contentRefs.current[1], {
                autoAlpha: 0,
                y: -24,
                duration: 0.2,
                ease: "power2.in"
            }, 0.50);

            tl.to(contentRefs.current[2], {
                autoAlpha: 1,
                y: 0,
                duration: 0.2,
                ease: "power2.out"
            }, 0.50);

            // Phase 4 (Scroll 75-100%): Fade out Content 3
            tl.to(contentRefs.current[2], {
                autoAlpha: 0,
                y: -24,
                duration: 0.25,
                ease: "power2.in"
            }, 0.75);
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const contents = [
        {
            icon: <TrendingUp className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Exponential Growth",
            desc: "We don't just increase your numbers. We multiply your market presence, turning casual viewers into loyal brand advocates.",
        },
        {
            icon: <Users className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Cult-Like Following",
            desc: "Build a community that believes in your vision. We engineer content that resonates on a deeper, emotional level.",
        },
        {
            icon: <Zap className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Unstoppable Momentum",
            desc: "Once the machine starts, it doesn't stop. We create self-sustaining growth loops that keep your brand at the forefront.",
        }
    ];

    return (
        <section id="impact" ref={containerRef} className="relative w-full h-[400vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Background Ellipse */}
                <svg
                    className="absolute w-full max-w-[1418px] opacity-40 pointer-events-none"
                    viewBox="0 0 1418 525"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <ellipse
                        cx="709"
                        cy="262.5"
                        rx="708"
                        ry="261.5"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="2"
                        strokeDasharray="0.1 3"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Rotating Ring */}
                <svg
                    ref={ringRef}
                    className="absolute w-[90vw] max-w-[542px] h-auto pointer-events-none impact-circle will-change-transform transform-gpu"
                    viewBox="0 0 542 540"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="271"
                        cy="270"
                        r="269"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="2"
                        strokeDasharray="0.1 3"
                        strokeLinecap="round"
                    />
                </svg>

                {/* Orbiting Arrows Container */}
                <div ref={arrowsRef} className="absolute w-[90vw] max-w-[542px] aspect-square rounded-full pointer-events-none impact-arrows will-change-transform transform-gpu">
                    {/* Top Arrow (0 deg) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current">
                            <path d="M8 0L16 14H0L8 0Z" />
                        </svg>
                    </div>
                    {/* Right Arrow (90 deg) */}
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-90">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current">
                            <path d="M8 0L16 14H0L8 0Z" />
                        </svg>
                    </div>
                    {/* Bottom Arrow (180 deg) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current">
                            <path d="M8 0L16 14H0L8 0Z" />
                        </svg>
                    </div>
                    {/* Left Arrow (270 deg) */}
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current">
                            <path d="M8 0L16 14H0L8 0Z" />
                        </svg>
                    </div>
                </div>

                {/* Content Stack */}
                <div className="relative z-10 w-full max-w-lg px-6 grid place-content-center h-full">
                    {contents.map((content, idx) => (
                        <div
                            key={idx}
                            ref={el => { contentRefs.current[idx] = el; }}
                            className="impact-content absolute left-0 right-0 top-1/2 -translate-y-1/2 text-center invisible opacity-0 translate-y-8"
                        >
                            {content.icon}
                            <h2 className="text-[21px] font-display font-semibold text-[#F5F5F0] mb-4 tracking-tight">
                                {content.title}
                            </h2>
                            <p className="text-[13px] text-[#9CA3AF] font-light leading-relaxed max-w-md mx-auto">
                                {content.desc}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ImpactSection;
