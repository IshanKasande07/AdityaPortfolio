"use client";

import React from "react";
import Image from "next/image";
import FooterArrival from "./FooterArrival";

const SiteFooter = () => {


  return (
    <FooterArrival>
    <footer
      className="site-footer bridge-footer relative w-full text-[#F8F3E6]"
    >
      {/* Main Container - fits exactly in viewport */}
      <div className="footer-frame relative w-full flex flex-col">
        
        {/* Content — moves at scroll speed (faster than bg) for parallax contrast */}
        <div className="footer-content relative z-20 flex flex-1 flex-col justify-between gap-12 px-6 md:px-12 pt-10 md:pt-14 pb-16 md:pb-8">
          
          {/* Top: Logo + Heading + Links */}
          <div>
            {/* Logo + Heading */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-3">
               <Image 
                  src="/brandlogo/Monarch White.png" 
                  alt="Monarch Logo" 
                  width={90} 
                  height={48} 
                  className="object-contain h-10 md:h-12 w-auto"
               />
               <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.15] tracking-tight text-[#F8F3E6]">
                  <span className="block overflow-hidden pb-1"><span data-footer-line className="block">Ready to build</span></span>
                  <span className="block overflow-hidden pb-1"><span data-footer-line className="block">absolute <span className="italic text-accent">authority?</span></span></span>
               </h2>
               <p data-footer-reveal className="text-sm md:text-base text-[#F8F3E6]/90 max-w-lg mx-auto font-medium">
                 Partner with us to create infotainment-led content that drives massive reach and converts attention into long-term growth.
               </p>
            </div>

            {/* Links Columns */}
            <div className="w-full max-w-5xl mx-auto mt-10 md:mt-24 lg:mt-28">
              <div className="footer-links flex flex-row flex-wrap justify-center gap-6 md:gap-12" data-footer-reveal>
                
                {/* Navigation */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F8F3E6]/70">Navigation</span>
                  <a href="/" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Home</a>
                  <a href="/work" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Work</a>
                  <a href="/about" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">About Us</a>
                  <a href="/contact" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Contact</a>
                </div>
                
                {/* Connect */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F8F3E6]/70">Connect</span>
                  <a href="https://www.instagram.com/monarchmediahouse?igsh=OHdoOXZmMnB4cDQx" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Instagram</a>
                  <a href="https://www.linkedin.com/company/monarchmediahouse/" target="_blank" rel="noopener noreferrer" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">LinkedIn</a>
                  <a href="mailto:hello@monarchmedia.house" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Email</a>
                </div>
                
                {/* Legal */}
                <div className="flex min-w-[200px] flex-col items-center space-y-3 rounded-[32px] border border-[#11250E]/10 bg-white/[0.02] px-8 py-8 text-sm shadow-[0_8px_32px_rgba(17,37,14,0.03)] backdrop-blur-[2px]">
                  <span className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#F8F3E6]/70">Legal</span>
                  <a href="#" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Privacy Policy</a>
                  <a href="#" className="border-b border-dotted border-[#2B1B15]/30 pb-0.5 w-fit hover:text-accent hover:border-accent transition-colors duration-300 btn-press font-medium text-center">Terms of Service</a>
                </div>
                
              </div>
            </div>
          </div>

          {/* Bottom: Copyright */}
          <div data-footer-reveal className="w-full flex flex-col md:flex-row justify-between items-center text-xs text-[#F8F3E6]/70">
            <span>© 2026 Monarch Media House. All rights reserved.</span>
            <span className="mt-2 md:mt-0">Designed for Impact.</span>
          </div>
        </div>

      </div>
    </footer>
    </FooterArrival>
  );
};

export default SiteFooter;
