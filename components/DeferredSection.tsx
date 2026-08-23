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
            let timeoutId: ReturnType<typeof setTimeout>;
            
            import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
                // Initial refresh to calculate pins after mounting
                ScrollTrigger.refresh();
                
                // Refresh once fonts are loaded (prevents layout shift bugs)
                if (document.fonts) {
                    document.fonts.ready.then(() => {
                        ScrollTrigger.refresh();
                    });
                }

                // Refresh when all images and resources are fully loaded
                const handleLoad = () => {
                    ScrollTrigger.refresh();
                };
                
                if (document.readyState === "complete") {
                    handleLoad();
                } else {
                    window.addEventListener("load", handleLoad);
                }

                return () => {
                    window.removeEventListener("load", handleLoad);
                };
            });
        }
    }, [mounted]);

    if (!mounted) return null;

    return <>{children}</>;
}
