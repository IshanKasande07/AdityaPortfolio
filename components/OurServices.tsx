"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
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
    const textRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!sectionRef.current) return;

        const updateActiveIndex = () => {
            const targetY = window.innerHeight * 0.5;
            let closestIdx = 0;
            let minDistance = Infinity;

            textRefs.current.forEach((el, idx) => {
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const elCenter = rect.top + rect.height / 2;
                const distance = Math.abs(elCenter - targetY);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIdx = idx;
                }
            });

            setActiveIndex((prev) => (prev !== closestIdx ? closestIdx : prev));
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                onUpdate: updateActiveIndex,
                onRefresh: updateActiveIndex,
            });

            updateActiveIndex();
            setTimeout(updateActiveIndex, 100);
            setTimeout(updateActiveIndex, 500);
        }, sectionRef);

        window.addEventListener("scroll", updateActiveIndex, { passive: true });
        window.addEventListener("resize", updateActiveIndex, { passive: true });

        return () => {
            ctx.revert();
            window.removeEventListener("scroll", updateActiveIndex);
            window.removeEventListener("resize", updateActiveIndex);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="services"
            className="relative bg-background w-full"
        >
            {/* Section Header */}
            <div className="w-full max-w-[1070px] mx-auto px-6 md:px-16 pt-24 md:pt-36 pb-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 relative z-10 w-full">
                    <div className="flex flex-col items-start">
                        <div className="inline-block bg-primary text-background px-3 py-1.5 rounded-lg text-sm font-medium mb-4 shadow-sm border border-primary/10">
                            Our Expertise
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-primary tracking-tight leading-tight">
                            Our Services.
                        </h2>
                    </div>
                    <div className="md:max-w-md lg:max-w-lg md:pb-1">
                        <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed">
                            A full-stack creative arsenal built to transform your brand presence into <span className="text-primary font-medium">market authority</span>.
                        </p>
                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="relative w-full max-w-[1070px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-12 lg:gap-0">

                {/* Left Column — Scrolling Text Items */}
                <div className="lg:w-[50%] relative pl-6 md:pl-6">
                    {services.map((service, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                type="button"
                                key={idx}
                                data-cursor-hover
                                onClick={() => {
                                    textRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                ref={(el) => { textRefs.current[idx] = el; }}
                                className="w-full text-left py-6 md:py-8 border-t border-primary/10 first:border-t-0 group relative block"
                            >
                                {/* Active border animation */}
                                <div 
                                    className={`absolute top-[-1px] left-0 w-full h-[1px] bg-accent transition-transform duration-500 ease-out origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`}
                                />

                                <div className={`transition-all duration-300 group-hover:translate-x-2 ${isActive ? "opacity-100 translate-x-1" : "opacity-50 group-hover:opacity-80"}`}>
                                    {/* Number */}
                                    <span className={`text-xs md:text-sm font-mono tracking-[0.3em] uppercase mb-2 block transition-colors duration-300 group-hover:text-accent ${isActive ? "text-accent font-semibold" : "text-accent/60"}`}>
                                        {service.number}
                                    </span>

                                    {/* Title */}
                                    <h3 className={`text-xl lg:text-2xl font-display font-semibold tracking-tight leading-tight mb-2 transition-colors duration-300 ${isActive ? "text-primary" : "text-primary/70"}`}>
                                        {service.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[13px] md:text-sm text-muted font-light leading-relaxed max-w-sm">
                                        {service.desc}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                    {/* Spacer inside left column so the flex row stays tall enough for SEO to reach vertical center before unpinning */}
                    <div className="h-[30vh]" />
                </div>

                {/* Right Column — Sticky Icon Container */}
                <div className="hidden lg:block lg:w-[50%] pt-32">
                    <div
                        ref={stickyContainerRef}
                        className="sticky top-[50vh] -translate-y-1/2 ml-12 xl:ml-20"
                    >
                        {/* Large rounded container */}
                        <div
                            className="relative w-[90%] lg:w-[85%] xl:w-[400px] mx-auto aspect-[1.6/1] rounded-[20px] flex items-center justify-center"
                            style={{
                                backgroundColor: "rgba(17, 37, 14, 0.04)",
                                border: "1px solid rgba(17, 37, 14, 0.08)",
                            }}
                        >
                            {/* Horizontal icon row */}
                            <div className="flex items-end justify-center gap-3 lg:gap-5 w-full px-8 lg:px-10">
                                {services.map((service, idx) => {
                                    const IconComponent = service.icon;
                                    const isActive = idx === activeIndex;

                                    return (
                                        <motion.div
                                            key={idx}
                                            data-cursor-hover
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() => {
                                                textRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "center" });
                                            }}
                                            animate={{
                                                y: isActive ? -18 : 0,
                                                scale: isActive ? 1.15 : 1,
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 350,
                                                damping: 22,
                                                mass: 0.8,
                                            }}
                                        >
                                            {/* Icon tile */}
                                            <motion.div
                                                className="relative rounded-xl w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center shrink-0"
                                                animate={{
                                                    backgroundColor: isActive ? "#11250E" : "rgba(17, 37, 14, 0.06)",
                                                    boxShadow: isActive ? "0 12px 20px -4px rgba(17, 37, 14, 0.25)" : "0 0 0 0 transparent",
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            >
                                                <IconComponent
                                                    className="w-4 h-4 lg:w-5 lg:h-5 shrink-0 transition-colors duration-300"
                                                    style={{
                                                        color: isActive ? "#F8F3E6" : "rgba(17, 37, 14, 0.35)",
                                                    }}
                                                    strokeWidth={1.5}
                                                />
                                            </motion.div>

                                            {/* Drop shadow beneath icon */}
                                            <motion.div
                                                className="mt-2 w-10 h-2 rounded-full pointer-events-none"
                                                style={{
                                                    background: "radial-gradient(ellipse at center, rgba(17,37,14,0.2) 0%, transparent 70%)",
                                                }}
                                                animate={{
                                                    opacity: isActive ? 1 : 0,
                                                    scaleX: isActive ? 1.1 : 0.4,
                                                }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                            />
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active service label under the container with smooth cross-fade */}
                        <div className="mt-6 text-center h-6 flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="text-xs font-mono text-accent tracking-[0.3em] uppercase"
                                >
                                    {services[activeIndex].number} — {services[activeIndex].title}
                                </motion.p>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default OurServices;
