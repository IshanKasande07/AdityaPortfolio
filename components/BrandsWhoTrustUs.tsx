"use client";

import React from "react";
import FadeUp from "./css/FadeUp";

const brandLogos = [
    { src: "/logos/1.webp", scale: 1.5 },
    { src: "/logos/2.webp", scale: 1.5 },
    { src: "/logos/3.webp", scale: 1.5 },
    { src: "/logos/4.webp", scale: 1.5 },
    { src: "/logos/5.webp", scale: 1.5 },
    { src: "/logos/6.webp", scale: 1.5 },
    { src: "/logos/7.webp", scale: 1.5 },
    { src: "/logos/8.webp", scale: 1.5 },
    { src: "/logos/9.webp" },
    { src: "/logos/10.webp" },
    { src: "/logos/11.webp" },
    { src: "/logos/12.webp", scale: 3.0 },
    { src: "/logos/Akshay PAtra Black.webp" },
    { src: "/logos/Biosun white .png" },
    { src: "/logos/Debridge - White.png" },
    { src: "/logos/Ishita Sakuja White .png", scale: 2.0 },
    { src: "/logos/SSB White.webp" },
    { src: "/logos/Waddle White.webp" },
    { src: "/logos/decstudio.webp" },
    { src: "/logos/nugget by zomato.webp" },
    { src: "/logos/vandan white .png", scale: 2.0 }
];

const LogoCard = ({ src, isLarge, manualScale = 1 }: { src: string; isLarge: boolean; manualScale?: number }) => {
    const s = isLarge ? 1.25 * manualScale : 0.85 * manualScale;
    return (
        <div className="logo-card">
            <img
                src={src}
                alt="Trusted Brand"
                className="logo-img"
                style={{ transform: `scale(${s})` }}
                loading="eager"
                decoding="async"
            />
        </div>
    );
};

const CSSCarousel = ({ items, reverse, isLarge }: { items: { src: string; scale?: number }[]; reverse?: boolean; isLarge: boolean }) => {
    // Duplicate items for seamless loop
    const doubled = [...items, ...items];
    return (
        <div className="carousel-track-container">
            <div className={`carousel-track ${reverse ? "carousel-reverse" : ""}`}>
                {doubled.map((item, i) => (
                    <LogoCard
                        key={`${item.src}-${i}`}
                        src={item.src}
                        isLarge={isLarge}
                        manualScale={item.scale || 1}
                    />
                ))}
            </div>
        </div>
    );
};

const BrandsWhoTrustUs = () => {
    const row1 = brandLogos.slice(0, 11);
    const row2 = brandLogos.slice(11);

    return (
        <>
            <style jsx global>{`
                .carousel-track-container {
                    overflow: hidden;
                    width: 100%;
                    padding: 4px 0;
                    contain: layout style paint;
                }

                .carousel-track {
                    display: flex;
                    width: max-content;
                    animation: scroll-left 35s linear infinite;
                    will-change: transform;
                }

                .carousel-track:hover {
                    animation-play-state: paused;
                }

                .carousel-reverse {
                    animation-name: scroll-right;
                }

                @keyframes scroll-left {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                @keyframes scroll-right {
                    0% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                }

                .logo-card {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 16px;
                    border: 1px solid rgba(17, 37, 14, 0.05);
                    border-radius: 12px;
                    background: #000;
                    width: 144px;
                    height: 96px;
                    margin: 0 12px;
                }

                @media (max-width: 768px) {
                    .logo-card {
                        width: 96px;
                        height: 72px;
                        padding: 8px 12px;
                        margin: 0 8px;
                    }
                }

                .logo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    filter: brightness(0) invert(1);
                    opacity: 0.7;
                    transition: opacity 0.3s ease;
                }

                .logo-card:hover .logo-img {
                    opacity: 1;
                }
            `}</style>

            <section
                className="w-full relative pt-12 md:pt-16 pb-8 md:pb-10 bg-background z-20 overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none opacity-20"></div>

                <div className="w-full relative">
                    <FadeUp>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-12 mb-16 relative z-10 px-6 md:px-4 max-w-[1000px] mx-auto w-full">
                            <div className="flex flex-col items-start">
                                <div className="inline-block bg-primary text-background px-3 py-1.5 rounded-lg text-sm font-medium mb-6 shadow-sm border border-primary/10">
                                    Our Clients
                                </div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-primary tracking-tight leading-tight">
                                    Brands Who Trust Us.
                                </h2>
                            </div>
                            <div className="md:max-w-md lg:max-w-lg md:pb-2">
                                <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed">
                                    We collaborate with visionary companies who demand nothing less than <span className="text-primary font-medium">extraordinary</span>.
                                </p>
                            </div>
                        </div>
                    </FadeUp>

                    <div className="relative z-10 w-full max-w-[840px] mx-auto flex flex-col gap-2 mt-2 overflow-hidden">
                        {/* Left fading mask */}
                        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-[170px] bg-gradient-to-r from-background via-background/40 to-transparent z-20 pointer-events-none"></div>
                        {/* Right fading mask */}
                        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-[170px] bg-gradient-to-l from-background via-background/40 to-transparent z-20 pointer-events-none"></div>

                        {/* Row 1 scrolling left (larger row) */}
                        <CSSCarousel items={row1} isLarge={true} />

                        {/* Row 2 scrolling right */}
                        <CSSCarousel items={row2} reverse isLarge={false} />
                    </div>
                </div>
            </section>
        </>
    );
};

export default BrandsWhoTrustUs;
