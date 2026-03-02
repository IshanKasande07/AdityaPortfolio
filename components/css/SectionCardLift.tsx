"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Transition B — "Floating Card Lift" scroll entrance animation.
 * Attach this component inside a section you want to animate upward as
 * a rising card. The `targetRef` must point to the element with the
 * card styling applied.
 */
export default function SectionCardLift({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
    useEffect(() => {
        const el = targetRef?.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                el,
                {
                    y: 70,
                    scale: 0.97,
                    opacity: 0.75,
                    filter: "blur(2px)",
                },
                {
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    filter: "blur(0px)",
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 88%",
                        end: "top 40%",
                        scrub: 0.6,
                    },
                }
            );
        });

        return () => ctx.revert();
    }, [targetRef]);

    return null;
}
