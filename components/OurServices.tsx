"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Share2, Film, Lightbulb, BarChart3, Search } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        icon: Share2,
        title: "Social Media Marketing",
        desc: "Dominate the feed with content that stops the scroll and builds real, lasting engagement across every platform.",
        number: "01",
    },
    {
        icon: Film,
        title: "Post Production",
        desc: "High-end visual storytelling that turns raw footage into cinematic brand experiences your audience won't forget.",
        number: "02",
    },
    {
        icon: Lightbulb,
        title: "Creative Strategy",
        desc: "Data-driven creative directions designed to align your brand perfectly with your market and audience.",
        number: "03",
    },
    {
        icon: BarChart3,
        title: "Performance Marketing",
        desc: "Aggressive, ROI-focused campaigns designed to scale your revenue and outperform competition at every level.",
        number: "04",
    },
    {
        icon: Search,
        title: "SEO",
        desc: "Master the search engine landscape and secure long-term organic growth that compounds over time.",
        number: "05",
    },
];

const OurServices = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const stickyContainerRef = useRef<HTMLDivElement>(null);
    const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Each text block triggers its corresponding icon
            textRefs.current.forEach((textEl, idx) => {
                if (!textEl) return;

                ScrollTrigger.create({
                    trigger: textEl,
                    start: "top 60%",
                    end: "bottom 40%",
                    onEnter: () => setActiveIndex(idx),
                    onEnterBack: () => setActiveIndex(idx),
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Animate icons when activeIndex changes
    useEffect(() => {
        iconRefs.current.forEach((iconEl, idx) => {
            if (!iconEl) return;

            if (idx === activeIndex) {
                // Active state — lift up, scale, darken, shadow
                gsap.to(iconEl, {
                    y: -18,
                    scale: 1.12,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-bg"), {
                    backgroundColor: "#11250E",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-svg"), {
                    color: "#F8F3E6",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-shadow"), {
                    opacity: 1,
                    scaleX: 1,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
            } else {
                // Inactive state — settle down, desaturate
                gsap.to(iconEl, {
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-bg"), {
                    backgroundColor: "rgba(17, 37, 14, 0.06)",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-svg"), {
                    color: "rgba(17, 37, 14, 0.3)",
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
                gsap.to(iconEl.querySelector(".icon-shadow"), {
                    opacity: 0,
                    scaleX: 0.6,
                    duration: 0.5,
                    ease: "power3.out",
                    overwrite: true,
                });
            }
        });
    }, [activeIndex]);

    return (
        <section
            ref={sectionRef}
            className="relative bg-background w-full"
        >
            {/* Section Header */}
            <div className="w-full max-w-[1040px] mx-auto px-6 md:px-16 pt-28 md:pt-40 pb-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-light text-primary tracking-wide leading-tight">
                    Our{" "}
                    <span className="text-accent italic font-normal drop-shadow-[0_0_12px_rgba(137,162,54,0.4)]">
                        Services
                    </span>
                </h2>
                <p className="mt-3 text-xs md:text-sm text-muted max-w-md font-light leading-relaxed">
                    A full-stack creative arsenal built to transform your brand presence.
                </p>
            </div>

            {/* Two Column Layout */}
            <div className="relative w-full max-w-[1040px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-12 lg:gap-0">

                {/* Left Column — Scrolling Text Items */}
                <div className="lg:w-[50%] relative">
                    {services.map((service, idx) => (
                        <div
                            key={idx}
                            ref={(el) => { textRefs.current[idx] = el; }}
                            className="py-8 md:py-10 border-t border-primary/10 first:border-t-0"
                        >
                            <div
                                className="transition-opacity duration-500"
                                style={{ opacity: activeIndex === idx ? 1 : 0.35 }}
                            >
                                {/* Number */}
                                <span className="text-xs md:text-sm font-mono text-accent tracking-[0.3em] uppercase mb-4 block">
                                    {service.number}
                                </span>

                                {/* Title */}
                                <h3 className="text-lg md:text-xl lg:text-2xl font-display font-semibold text-primary tracking-tight leading-tight mb-3">
                                    {service.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs md:text-sm text-muted font-light leading-relaxed max-w-sm">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column — Sticky Icon Container */}
                <div className="hidden lg:block lg:w-[50%]">
                    <div
                        ref={stickyContainerRef}
                        className="sticky top-[50vh] -translate-y-1/2 ml-12 xl:ml-20"
                    >
                        {/* Large rounded beige container — smaller size */}
                        <div
                            className="relative w-[75%] mx-auto aspect-[1.6/1] rounded-[20px] flex items-center justify-center"
                            style={{
                                backgroundColor: "rgba(17, 37, 14, 0.04)",
                                border: "1px solid rgba(17, 37, 14, 0.08)",
                            }}
                        >
                            {/* Horizontal icon row */}
                            <div className="flex items-end justify-center gap-2 lg:gap-4 xl:gap-6 w-full px-4">
                                {services.map((service, idx) => {
                                    const IconComponent = service.icon;
                                    return (
                                        <div
                                            key={idx}
                                            ref={(el) => { iconRefs.current[idx] = el; }}
                                            className="flex flex-col items-center will-change-transform"
                                            style={{ transformOrigin: "center bottom" }}
                                        >
                                            {/* Icon tile — reduced size */}
                                            <div
                                                className="icon-bg relative rounded-xl w-9 h-9 lg:w-11 lg:h-11 xl:w-12 xl:h-12 flex items-center justify-center transition-none shrink-0"
                                                style={{
                                                    backgroundColor: idx === 0
                                                        ? "#11250E"
                                                        : "rgba(17, 37, 14, 0.06)",
                                                }}
                                            >
                                                <IconComponent
                                                    className="icon-svg w-4 h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 transition-none shrink-0"
                                                    style={{
                                                        color: idx === 0
                                                            ? "#F8F3E6"
                                                            : "rgba(17, 37, 14, 0.3)",
                                                    }}
                                                    strokeWidth={1.5}
                                                />
                                            </div>

                                            {/* Drop shadow beneath icon */}
                                            <div
                                                className="icon-shadow mt-2 w-10 h-2 rounded-full"
                                                style={{
                                                    background: "radial-gradient(ellipse at center, rgba(17,37,14,0.18) 0%, transparent 70%)",
                                                    opacity: idx === 0 ? 1 : 0,
                                                    transform: idx === 0 ? "scaleX(1)" : "scaleX(0.6)",
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active service label under the container */}
                        <div className="mt-6 text-center">
                            <p
                                className="text-xs font-mono text-accent tracking-[0.3em] uppercase transition-all duration-500"
                                key={activeIndex}
                            >
                                {services[activeIndex].number} — {services[activeIndex].title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom spacer so the last item can fully scroll through */}
            <div className="h-24 md:h-32" />
        </section>
    );
};

export default OurServices;
