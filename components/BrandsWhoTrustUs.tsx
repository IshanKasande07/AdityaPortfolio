"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeUp from "./css/FadeUp";
import TornEdge from "./css/TornEdge";

gsap.registerPlugin(ScrollTrigger);

/**
 * Every logo in /public/logos is white-on-transparent art. 19 of the 21 are
 * already pure white, so the old `filter: brightness(0) invert(1)` was a
 * no-op on them — and it *destroyed* the two that shipped with a baked-in
 * opaque plate (logos/1 and Akshay PAtra Black), flattening them into solid
 * white blobs. Those two now point at knockout versions where the plate has
 * been ramped out to alpha 0. Originals are left on disk untouched.
 *
 * `scale` values are hand-tuned per logo and assume the ORIGINAL canvas
 * size, so the knockout files are deliberately uncropped.
 *
 * `name` feeds the alt text. Four logos (1, 2, 3, 11) are unidentified, so
 * they stay decorative until we have real brand names for them.
 */
export const brandLogos = [
    { src: "/logos/1-knockout.webp", scale: 1.5 },
    { src: "/logos/2.webp", scale: 1.5 },
    { src: "/logos/3.webp", scale: 1.5 },
    { src: "/logos/4.webp", scale: 1.5, name: "Imagination Inc" },
    { src: "/logos/5.webp", scale: 1.5, name: "ira" },
    { src: "/logos/6.webp", scale: 1.5, name: "Origins Nutra" },
    { src: "/logos/7.webp", scale: 1.5, name: "Atenx" },
    { src: "/logos/8.webp", scale: 1.5, name: "Linkin Moves" },
    { src: "/logos/9.webp", name: "TORQ" },
    { src: "/logos/10.webp", name: "Cakerie" },
    { src: "/logos/11.webp" },
    { src: "/logos/12.webp", scale: 3.0, name: "Vamnaya" },
    { src: "/logos/akshaya-patra-knockout.webp", name: "Akshaya Patra" },
    { src: "/logos/Biosun white.webp", name: "Biosun" },
    { src: "/logos/Debridge - White.webp", name: "deBridge" },
    { src: "/logos/Ishita Sakuja White.webp", scale: 2.0, name: "Ishita Sakuja Image Consultancy" },
    { src: "/logos/SSB White.webp", name: "Scaler School of Business" },
    { src: "/logos/Waddle White.webp", name: "Waddle & Roo" },
    { src: "/logos/decstudio.webp", name: "decstudio" },
    { src: "/logos/nugget by zomato.webp", name: "Nugget by Zomato" },
    { src: "/logos/vandan white.webp", scale: 2.0, name: "Vandan" }
];

type Logo = { src: string; scale?: number; name?: string };

const LogoSlot = ({
    src,
    name,
    isLarge,
    manualScale = 1,
    duplicate = false,
}: {
    src: string;
    name?: string;
    isLarge: boolean;
    manualScale?: number;
    duplicate?: boolean;
}) => {
    const s = (isLarge ? 1.25 : 0.85) * manualScale * 1.2;
    return (
        <div className={`logo-slot${duplicate ? " logo-dupe" : ""}`}>
            <img
                src={src}
                /* The second pass through the list is the seamless-loop copy,
                   so it must not be announced twice. */
                alt={duplicate ? "" : name ?? ""}
                className="logo-img"
                style={{ transform: `scale(${s})` }}
                loading="lazy"
                decoding="async"
            />
        </div>
    );
};

const LogoMarquee = React.forwardRef<
    HTMLDivElement,
    { items: Logo[]; isLarge: boolean }
>(({ items, isLarge }, ref) => (
    <div className="logo-marquee">
        <div ref={ref} className="logo-track">
            {items.map((item, i) => (
                <LogoSlot
                    key={`a-${item.src}-${i}`}
                    src={item.src}
                    name={item.name}
                    isLarge={isLarge}
                    manualScale={item.scale || 1}
                />
            ))}
            {items.map((item, i) => (
                <LogoSlot
                    key={`b-${item.src}-${i}`}
                    src={item.src}
                    name={item.name}
                    isLarge={isLarge}
                    manualScale={item.scale || 1}
                    duplicate
                />
            ))}
        </div>
    </div>
));
LogoMarquee.displayName = "LogoMarquee";

const BrandsWhoTrustUs = () => {
    const row1 = brandLogos.slice(0, 11);
    const row2 = brandLogos.slice(11);

    const containerRef = useRef<HTMLElement>(null);
    const track1Ref = useRef<HTMLDivElement>(null);
    const track2Ref = useRef<HTMLDivElement>(null);

    // Mutable refs for the animation loop — no re-renders needed.
    const xPos1 = useRef(0);
    const xPos2 = useRef(0);
    const scrollVelocity = useRef(0);
    const rafId = useRef(0);
    // +1 = default (row1 left, row2 right). Flips to -1 when scrolling up,
    // so the idle drift follows the last scroll direction.
    const driftDirection = useRef(1);

    // Constant drift so the rows are always alive, even at rest.
    const BASE_SPEED = 0.5; // px per frame

    const animate = useCallback(() => {
        const t1 = track1Ref.current;
        const t2 = track2Ref.current;
        if (!t1 || !t2) return;

        // Each track is duplicated content, so half-width is the seamless
        // reset point.
        const halfWidth1 = t1.scrollWidth / 2;
        const halfWidth2 = t2.scrollWidth / 2;

        // Update drift direction from scroll velocity before it decays.
        if (scrollVelocity.current > 0.5) {
            driftDirection.current = 1;   // scrolling down → default dirs
        } else if (scrollVelocity.current < -0.5) {
            driftDirection.current = -1;  // scrolling up → reverse dirs
        }

        // Smoothly decay toward zero so the tracks coast to a stop.
        scrollVelocity.current *= 0.92;

        // Clamp tiny residual to zero to avoid sub-pixel jitter at rest.
        if (Math.abs(scrollVelocity.current) < 0.05) {
            scrollVelocity.current = 0;
        }

        // Base drift follows the last scroll direction.
        // Scroll velocity layers on top for speed-dependent boost.
        const drift = BASE_SPEED * driftDirection.current;
        xPos1.current -= drift + scrollVelocity.current;
        xPos2.current += drift + scrollVelocity.current;

        // Seamless wrap: when the offset exceeds half the track, snap back.
        if (xPos1.current <= -halfWidth1) xPos1.current += halfWidth1;
        if (xPos1.current >= 0) xPos1.current -= halfWidth1;

        if (xPos2.current <= -halfWidth2) xPos2.current += halfWidth2;
        if (xPos2.current >= 0) xPos2.current -= halfWidth2;

        gsap.set(t1, { x: xPos1.current, force3D: true });
        gsap.set(t2, { x: xPos2.current, force3D: true });

        rafId.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const section = containerRef.current;
        if (!section) return;

        // Initialise row 2 offset so it starts shifted (visual stagger).
        const t2 = track2Ref.current;
        if (t2) {
            xPos2.current = -(t2.scrollWidth / 2) * 0.3;
        }

        // ScrollTrigger feeds scroll velocity into the shared ref.
        const trigger = ScrollTrigger.create({
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                // self.getVelocity() returns px/s — scale it down to a
                // comfortable per-frame displacement.
                scrollVelocity.current = self.getVelocity() / 300;
            },
        });

        // Kick off the rAF loop.
        rafId.current = requestAnimationFrame(animate);

        return () => {
            trigger.kill();
            cancelAnimationFrame(rafId.current);
        };
    }, [animate]);

    return (
        <>
            <style jsx global>{`
                .logo-marquee {
                    overflow: hidden;
                    width: 100%;
                    contain: layout style paint;
                }

                .logo-track {
                    display: flex;
                    width: max-content;
                    will-change: transform;
                }

                /* No tile, no border, no filter. The section ground is forest
                   and the logos are already white-on-transparent, so they sit
                   on their native background. */
                .logo-slot {
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-sizing: border-box;
                    padding: 12px 16px;
                    width: 136px;
                    height: 90px;
                    margin: 0 10px;
                }

                @media (max-width: 768px) {
                    .logo-slot {
                        width: 96px;
                        height: 70px;
                        padding: 8px 12px;
                        margin: 0 6px;
                    }
                }

                /* Pure crisp white — no dimming. */
                .logo-img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    opacity: 1;
                    filter: brightness(1.15);
                    transition: opacity 0.3s ease, filter 0.3s ease;
                }

                .logo-slot:hover .logo-img {
                    filter: brightness(1.3) drop-shadow(0 0 8px rgba(255, 255, 255, 0.25));
                }

                @media (prefers-reduced-motion: reduce) {
                    .logo-track { transform: none !important; }
                    .logo-marquee { overflow-x: auto; }
                    .logo-dupe { display: none; }
                }
            `}</style>

            <section
                ref={containerRef}
                className="w-full relative pt-8 md:pt-10 pb-20 md:pb-28 bg-surface z-20"
            >


                <FadeUp>
                    {/* Stacked, not split. A big headline on the left with a small
                        explainer paragraph on the right is banned as a section
                        header — it is the single most recognisable template tell. */}
                    <div className="w-full max-w-[1070px] mx-auto px-6 md:px-16 relative z-10">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium text-background tracking-tight leading-tight">
                            Brands Who Trust Us.
                        </h2>
                        <p className="mt-4 max-w-[52ch] text-base md:text-lg text-mist/70 font-light leading-relaxed">
                            Food and beverage, healthcare, AI startups, architecture studios.
                            We build the <span className="text-accent">content engine</span> behind each of them.
                        </p>
                    </div>
                </FadeUp>

                <FadeUp delay={0.15} className="mt-12 md:mt-16 w-full max-w-[1070px] mx-auto px-6 md:px-16">
                    <div className="relative z-10 w-full flex flex-col gap-4 md:gap-6">
                        {/* Edge fades hide the loop seam. Forest now, not cream. */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-surface via-surface/70 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-surface via-surface/70 to-transparent z-20 pointer-events-none" />

                        <LogoMarquee ref={track1Ref} items={row1} isLarge={true} />
                        <LogoMarquee ref={track2Ref} items={row2} isLarge={false} />
                    </div>
                </FadeUp>

                <TornEdge edge="bottom" />
            </section>
        </>
    );
};

export default BrandsWhoTrustUs;
