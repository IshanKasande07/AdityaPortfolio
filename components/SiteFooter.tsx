"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const SiteFooter = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    const content = contentRef.current;
    if (!section || !bg || !content) return;

    let ctx: gsap.Context;

    // Delay GSAP initialization slightly.
    // On the home page, the Footer mounts immediately after RevealProvider 
    // removes overflow: hidden from the body. Waiting ensures the browser has
    // restored full document scrolling before GSAP calculates offsets.
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        // Background moves slower than scroll (parallax depth effect).
        gsap.fromTo(
          bg,
          { yPercent: -15 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        // Content moves slightly faster than default for contrast
        gsap.fromTo(
          content,
          { yPercent: 5 },
          {
            yPercent: -3,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }, section);
    }, 150);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
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
            <div className="w-full max-w-5xl mx-auto mt-20 md:mt-28 lg:mt-36">
              <div className="flex flex-row flex-wrap justify-center gap-12 md:gap-32">
                
                {/* Navigation */}
                <div className="flex flex-col items-center space-y-2 text-sm">
                  <span className="text-xs font-semibold text-[#2B1B15]/50 mb-1">Navigation</span>
                  <a href="/" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Home</a>
                  <a href="/#work" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Work</a>
                  <a href="/about" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">About Us</a>
                  <a href="/contact" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Contact</a>
                </div>
                
                {/* Connect */}
                <div className="flex flex-col items-center space-y-2 text-sm">
                  <span className="text-xs font-semibold text-[#2B1B15]/50 mb-1">Connect</span>
                  <a href="https://www.instagram.com/monarchmediahouse?igsh=OHdoOXZmMnB4cDQx" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Instagram</a>
                  <a href="https://www.linkedin.com/company/monarchmediahouse/" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">LinkedIn</a>
                  <a href="mailto:hello@monarchmedia.house" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors font-medium text-center">Email</a>
                </div>
                
                {/* Legal */}
                <div className="flex flex-col items-center space-y-2 text-sm">
                  <span className="text-xs font-semibold text-[#2B1B15]/50 mb-1">Legal</span>
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
