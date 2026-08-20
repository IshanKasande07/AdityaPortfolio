"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

const SiteFooter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    let frame: number | null = null;
    let isNearViewport = false;

    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const updateParallax = () => {
      frame = null;
      if (!isNearViewport) return;

      const rect = section.getBoundingClientRect();
      const travelDistance = window.innerHeight + rect.height;
      const progress = clamp((window.innerHeight - rect.top) / travelDistance);

      // Keep the two layers on distinct, deliberately restrained paths.
      // Unlike ScrollTrigger, this reads the footer's live geometry, so it
      // remains correct when the home page mounts deferred sections after the
      // opening reveal or when those sections change the document height.
      const backgroundY = -15 + progress * 25;
      const contentY = 5 - progress * 8;

      bg.style.transform = `translate3d(0, ${backgroundY}%, 0)`;
      content.style.transform = `translate3d(0, ${contentY}%, 0)`;
    };

    const scheduleUpdate = () => {
      if (frame === null) {
        frame = requestAnimationFrame(updateParallax);
      }
    };

    // Run only while the footer approaches the viewport. This works with the
    // Lenis native-window scroll used by the site and avoids a permanent RAF
    // loop for an off-screen footer.
    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
        if (isNearViewport) scheduleUpdate();
      },
      { rootMargin: "100% 0px" }
    );

    observer.observe(section);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    // Covers direct navigation/reloads that land near the footer.
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <footer
      ref={sectionRef}
      className="relative w-full pt-4 md:pt-8 pb-0 bg-transparent text-[#2B1B15] overflow-hidden isolate px-4 md:px-8"
    >
      {/* Main Container - fits exactly in viewport */}
      <div className="relative w-full rounded-t-[40px] md:rounded-t-[60px] bg-[#F8F3E6] overflow-hidden flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)]">
        
        {/* Background Image — moves at a different speed for parallax depth */}
        <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" style={{ top: "-15%", bottom: "-15%", height: "130%" }}>
          {/* Gradient fade from cream at top */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[#F8F3E6] via-[#F8F3E6] via-[10%] to-transparent z-20 h-[55%]" />
          
          {/* Light cream overlay across entire image for text readability */}
          <div className="absolute inset-0 bg-[#F8F3E6]/55 z-10" />
          
          <Image 
            src="/footer-bg.png" 
            alt="Footer Background" 
            fill 
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>

        {/* Content — moves at scroll speed (faster than bg) for parallax contrast */}
        <div ref={contentRef} className="relative z-20 flex flex-col justify-between h-full px-6 md:px-12 pt-10 md:pt-14 pb-4">
          
          {/* Top: Logo + Heading + Links */}
          <div>
            {/* Logo + Heading */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
               <Image 
                  src="/brandlogo/Monarch White.png" 
                  alt="Monarch Logo" 
                  width={90} 
                  height={48} 
                  className="object-contain h-10 md:h-12 w-auto invert opacity-80" 
               />
               <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-[#2B1B15]">
                  Ready to build<br/>absolute <span className="italic text-accent">authority?</span>
               </h2>
               <p className="text-sm md:text-base text-black max-w-lg mx-auto font-medium">
                 Partner with us to create infotainment-led content that drives massive reach and converts attention into long-term growth.
               </p>
            </div>

            {/* Links Columns */}
            <div className="w-full max-w-5xl mx-auto mt-20 md:mt-24 lg:mt-28">
              <div className="flex flex-row flex-wrap justify-center gap-6 md:gap-12">
                
                {/* Navigation */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2B1B15]/50">Navigation</span>
                  <a href="/" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Home</a>
                  <a href="/#work" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Work</a>
                  <a href="/about" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">About Us</a>
                  <a href="/contact" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Contact</a>
                </div>
                
                {/* Connect */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2B1B15]/50">Connect</span>
                  <a href="https://www.instagram.com/monarchmediahouse?igsh=OHdoOXZmMnB4cDQx" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Instagram</a>
                  <a href="https://www.linkedin.com/company/monarchmediahouse/" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">LinkedIn</a>
                  <a href="mailto:hello@monarchmedia.house" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Email</a>
                </div>
                
                {/* Legal */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#2B1B15]/50">Legal</span>
                  <a href="#" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Privacy Policy</a>
                  <a href="#" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Terms of Service</a>
                </div>
                
              </div>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-white/70">
            <span>© 2026 Monarch Media House. All rights reserved.</span>
            <span className="mt-2 md:mt-0">Designed for Impact.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default SiteFooter;
