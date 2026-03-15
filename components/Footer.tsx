"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 70,
      damping: 20
    }
  },
};

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hardware accelerated parallax move - more aggressive
      gsap.fromTo(
        videoRef.current,
        {
          yPercent: -40,
        },
        {
          yPercent: 40,
          ease: "none",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-background z-70 text-primary overflow-hidden isolate"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Top Border Shimmer */}
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="absolute top-0 left-0 h-[1px] w-[200px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50 z-30"
      />

      {/* Massive Parallax Video Mask Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden border-t border-white/5 bg-background">

        {/* 1. Underlying Parallax Video - Increased height and offset to support aggressive parallax */}
        <div
          ref={videoRef}
          className="absolute top-[-40%] left-0 w-full h-[180%] z-0 will-change-transform"
        >
          <video
            src="https://storage.googleapis.com/clova-assets/public/clova-website/clova2/5.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        {/* 2. Multiply Layer with Pure White Text & Black background */}
        <div className="absolute inset-0 z-10 bg-black flex items-center justify-center mix-blend-multiply pointer-events-none">
          <h2 className="text-white font-display font-bold text-[15vw] leading-[0.85] tracking-tighter text-center uppercase whitespace-nowrap">
            READY TO<br />
            DOMINATE?
          </h2>
        </div>
      </div>

      {/* Bottom Section: Brand, Social Links, Copyright */}
      <div className="relative z-20 w-full bg-background border-t border-white/5 py-10 md:py-15">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="w-[80vw] mx-auto px-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <motion.div
              variants={itemVariants}
              className="flex items-center"
            >
              <Image 
                src="/brandlogo/Monarch White.png" 
                alt="Monarch Media House" 
                width={120} 
                height={50} 
                className="object-contain h-12 w-auto"
              />
            </motion.div>

            {/* Social links */}
            <motion.div variants={itemVariants} className="flex items-center gap-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/monarchmediahouse?igsh=OHdoOXZmMnB4cDQx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-muted hover:text-accent transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/monarchmediahouse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-muted hover:text-accent transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>

              {/* Email */}
              <a
                href="mailto:hello@monarchmedia.house"
                aria-label="Email"
                className="text-muted hover:text-accent transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-7 h-7"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
            </motion.div>

            {/* Copyright */}
            <motion.div variants={itemVariants}>
              <p className="text-[14px] md:text-[0.9vw] text-muted-foreground">
                © 2026 Monarch Media House
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
