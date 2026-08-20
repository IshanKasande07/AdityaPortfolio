"use client";

import { useState, useEffect, ReactNode } from "react";
import { useReveal } from "./RevealLayout";

/**
 * DeferredSection — A gate component that delays mounting its children
 * until after the reveal animation is complete AND the browser is idle.
 *
 * This prevents below-the-fold sections from initializing their GSAP
 * ScrollTriggers, ResizeObservers, scroll listeners, and heavy image
 * decoding during the critical reveal + parallax animation window.
 */
export default function DeferredSection({ children }: { children: ReactNode }) {
    const { revealed } = useReveal();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // On mobile, reveal is instant — mount immediately
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            setMounted(true);
            return;
        }

        if (!revealed) return;

        // Once reveal is done, wait for the browser to be idle before
        // mounting heavy below-fold sections. This gives the hero parallax
        // a clean runway to settle at 60fps.
        if ("requestIdleCallback" in window) {
            const id = (window as any).requestIdleCallback(
                () => setMounted(true),
                { timeout: 300 } // fallback: mount within 300ms max
            );
            return () => (window as any).cancelIdleCallback(id);
        } else {
            // Safari fallback — requestIdleCallback not supported
            const timer = setTimeout(() => setMounted(true), 200);
            return () => clearTimeout(timer);
        }
    }, [revealed]);

    useEffect(() => {
        if (mounted) {
            // A hardcoded 100ms timeout isn't enough for the home page because 
            // heavy images (like Brands, Results) can take longer to load and expand the DOM.
            // Using a ResizeObserver guarantees GSAP updates the footer's parallax 
            // position exactly when the page height changes.
            let ro: ResizeObserver;
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                ro = new ResizeObserver(() => {
                    ScrollTrigger.refresh();
                });
                ro.observe(document.body);
            });

            return () => {
                if (ro) ro.disconnect();
            };
        }
    }, [mounted]);

    if (!mounted) return null;

    return <>{children}</>;
}
