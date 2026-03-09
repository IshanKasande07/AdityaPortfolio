"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
    Share2,
    Film,
    Lightbulb,
    BarChart3,
    Search
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ImpactSection = () => {
    const containerRef = useRef<HTMLElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const arrowsRef = useRef<HTMLDivElement>(null);

    // Array of refs for the 5 content blocks
    const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.5, // Reduced scrub for more immediate response
                }
            });

            // Rotation: Continuous spin over the 500vh scroll
            tl.to([ringRef.current, arrowsRef.current], {
                rotation: 360,
                ease: "none",
                duration: 1,
            }, 0);

            // Content Sequence: 5 items spread evenly (0.0 to 1.0)
            // Each item gets a 0.2 segment of the scroll

            // Item 1: Social Media Marketing
            tl.to(contentRefs.current[0], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0);
            tl.to(contentRefs.current[0], { autoAlpha: 0, y: -20, duration: 0.08, ease: "power2.in" }, 0.12);

            // Item 2: Post Production
            tl.to(contentRefs.current[1], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.2);
            tl.to(contentRefs.current[1], { autoAlpha: 0, y: -20, duration: 0.08, ease: "power2.in" }, 0.32);

            // Item 3: Creative Strategy
            tl.to(contentRefs.current[2], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.4);
            tl.to(contentRefs.current[2], { autoAlpha: 0, y: -20, duration: 0.08, ease: "power2.in" }, 0.52);

            // Item 4: Performance Marketing
            tl.to(contentRefs.current[3], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.6);
            tl.to(contentRefs.current[3], { autoAlpha: 0, y: -20, duration: 0.08, ease: "power2.in" }, 0.72);

            // Item 5: SEO
            tl.to(contentRefs.current[4], { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" }, 0.8);
            // Stays visible until the very end to prevent the "blank screen" issue
            tl.to(contentRefs.current[4], { autoAlpha: 0, y: -20, duration: 0.05, ease: "power2.in" }, 0.95);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    const contents = [
        {
            icon: <Share2 className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Social Media Marketing",
            desc: "Dominate the feed with content that stops the scroll and builds real, lasting engagement.",
        },
        {
            icon: <Film className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Post Production",
            desc: "High-end visual storytelling that turns raw footage into cinematic brand experiences.",
        },
        {
            icon: <Lightbulb className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Creative Strategy",
            desc: "Data-driven creative directions designed to align your brand perfectly with your market.",
        },
        {
            icon: <BarChart3 className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "Performance Marketing",
            desc: "Aggressive, ROI-focused campaigns designed to scale your revenue and outperform competition.",
        },
        {
            icon: <Search className="w-12 h-12 text-accent mb-6 mx-auto" />,
            title: "SEO",
            desc: "Master the search engine landscape and secure long-term organic growth.",
        }
    ];

    return (
        <section id="impact" ref={containerRef} className="relative w-full h-[500vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* Background Ellipse */}
                <svg className="absolute w-full max-w-[1418px] opacity-40 pointer-events-none" viewBox="0 0 1418 525" fill="none">
                    <ellipse cx="709" cy="262.5" rx="708" ry="261.5" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="0.1 3" strokeLinecap="round" />
                </svg>

                {/* Rotating Ring */}
                <svg ref={ringRef} className="absolute w-[90vw] max-w-[542px] h-auto pointer-events-none impact-circle will-change-transform transform-gpu" viewBox="0 0 542 540" fill="none">
                    <circle cx="271" cy="270" r="269" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeDasharray="0.1 3" strokeLinecap="round" />
                </svg>

                {/* Orbiting Arrows Container */}
                <div ref={arrowsRef} className="absolute w-[90vw] max-w-[542px] aspect-square rounded-full pointer-events-none impact-arrows will-change-transform transform-gpu">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current"><path d="M8 0L16 14H0L8 0Z" /></svg>
                    </div>
                    <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 rotate-90">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current"><path d="M8 0L16 14H0L8 0Z" /></svg>
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-180">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current"><path d="M8 0L16 14H0L8 0Z" /></svg>
                    </div>
                    <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 -rotate-90">
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" className="text-white fill-current"><path d="M8 0L16 14H0L8 0Z" /></svg>
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