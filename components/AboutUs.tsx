"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

function Counter({ value, direction = "up" }: { value: number; direction?: "up" | "down" }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    stiffness: 40,
    damping: 30,
  });
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value);
    }
  }, [motionValue, isInView, value, direction]);

  const displayValue = useTransform(springValue, (latest) =>
    Intl.NumberFormat("en-US").format(Math.round(latest))
  );

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function AboutUs() {
  const containerRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  // Centralized Parallax Setup to reduce CPU overhead
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start end", "end start"]
  });

  // Parallax transforms
  const yText = useTransform(scrollYProgress, [0, 1], [180, -180]);
  const xFounder1 = useTransform(scrollYProgress, [0, 1], [-120, 0]);
  const xFounder2 = useTransform(scrollYProgress, [0, 1], [120, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <section id="about" className="relative w-full pt-6 pb-24 mb-12 bg-background text-primary select-none overflow-hidden" ref={containerRef}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-accent/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-1/4 left-0 w-[40vw] h-[40vh] bg-[#5D3FD3]/5 blur-[120px] rounded-full pointer-events-none translate-y-1/2 -translate-x-1/3" />

      <div className="w-full px-8 md:px-[8vw] lg:px-[12vw] mx-auto flex flex-col gap-6 md:gap-8 relative z-10 max-w-[1400px]">

        {/* 1. "Behind the Monarch" header */}
        <div className="flex flex-col items-center justify-center text-center">
          <motion.h2
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight"
          >
            Behind the <span className="text-accent italic pr-2">Monarch</span>
          </motion.h2>
        </div>

        {/* 2. Bento Grid — Asymmetric Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="bento-grid w-full mx-auto"
        >
          {/* Card 1: Hero — wide text card */}
          <motion.div
            variants={itemVariants}
            className="bento-hero flex flex-col justify-center px-10 py-8 md:px-16 md:py-12 rounded-[2rem] bg-gradient-to-br from-primary/[0.08] to-transparent border border-primary/10 backdrop-blur-lg relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent/20 blur-[80px] rounded-full group-hover:bg-accent/30 transition-colors duration-700 pointer-events-none" />
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold mb-4 flex flex-col gap-1 tracking-tight relative z-10">
              <span>Infotainment</span>
              <span className="text-accent italic">Driven!</span>
            </h3>
            <p className="text-base md:text-lg text-primary/70 leading-relaxed max-w-xl mt-2 font-medium relative z-10">
              We take brands from ground zero to building their brand pillars, strategy and optimise for longevity. Our aim is to build a narrative around your 5 year goal!
            </p>
          </motion.div>

          {/* Card 2: Image — Dog with sunglasses (portrait, tall — spans 2 rows on desktop) */}
          <motion.div
            variants={itemVariants}
            className="bento-img1 rounded-[2rem] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)]"
          >
            <Image
              src="/bento/image.png"
              alt="Creative vibes — Dog with sunglasses at laptop"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 will-change-transform"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <span className="text-white/90 text-sm font-medium uppercase tracking-wider">Creative Energy</span>
            </div>
          </motion.div>

          {/* Card 3: Projects — dark green */}
          <motion.div
            variants={itemVariants}
            className="bento-projects flex flex-col p-6 md:p-7 rounded-[2rem] bg-[#11250E] border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(17,37,14,0.15)] justify-between"
          >
            <div>
              <h4 className="text-4xl lg:text-5xl font-display font-semibold mb-1 text-white">
                <Counter value={50} />+
              </h4>
              <span className="text-white/80 font-medium uppercase tracking-wider text-[10px] md:text-xs">Projects</span>
            </div>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed mt-4">
              Across creative strategy, Performance Marketing, SEO, Video Production and Post Production.
            </p>
          </motion.div>

          {/* Card 4: Team — purple */}
          <motion.div
            variants={itemVariants}
            className="bento-team flex flex-col p-6 md:p-7 rounded-[2rem] bg-[#5330D0] border border-[#5330D0]/50 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(83,48,208,0.4)] justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50" />
            <div className="relative z-10">
              <h4 className="text-4xl lg:text-5xl font-display font-semibold mb-1 text-white">7+</h4>
              <span className="text-white/90 font-medium uppercase tracking-wider text-[10px] md:text-xs">Team Members</span>
            </div>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed mt-4 relative z-10">
              A lean team of high performers who aim to deliver the best of the best work.
            </p>
          </motion.div>

          {/* Card 5: Clients — dark */}
          <motion.div
            variants={itemVariants}
            className="bento-clients flex flex-col p-6 md:p-7 rounded-[2rem] bg-gradient-to-tr from-[#111] to-[#1c1c1c] border border-white/5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-accent/40 justify-between"
          >
            <div>
              <h4 className="text-4xl lg:text-5xl font-display font-semibold mb-1 text-white">
                <Counter value={20} />+
              </h4>
              <span className="text-white/80 font-medium uppercase tracking-wider text-[10px] md:text-xs">Clients</span>
            </div>
            <p className="text-xs md:text-sm text-white/50 leading-relaxed mt-4">
              Across Healthcare, entertainment, AI Startups, Architects and Beyond
            </p>
          </motion.div>

          {/* Card 6: Impressions — accent glow */}
          <motion.div
            variants={itemVariants}
            className="bento-impress flex flex-col p-6 md:p-7 rounded-[2rem] bg-[#0A0A0A] border border-white/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:border-accent justify-between shadow-lg"
          >
            <div className="absolute -top-12 -right-12 p-8 opacity-20 blur-2xl rounded-full bg-accent w-40 h-40 group-hover:opacity-40 transition-opacity duration-700" />
            <div className="relative z-10">
              <h4 className="text-4xl lg:text-5xl font-display font-semibold mb-1 text-accent drop-shadow-md">
                10M+
              </h4>
              <span className="text-white/80 font-medium uppercase tracking-wider text-[10px] md:text-xs">Impressions</span>
            </div>
            <p className="text-xs md:text-sm text-white/60 leading-relaxed mt-4 relative z-10">
              Generated over 10M+ views across campaigns. Helped accounts go from 3K to 100K views in a week.
            </p>
          </motion.div>

          {/* Card 7: Image — One Way signs (wide, spans bottom on desktop) */}
          <motion.div
            variants={itemVariants}
            className="bento-img2 rounded-[2rem] relative overflow-hidden group hover:-translate-y-1 transition-all duration-500 hover:shadow-[0_16px_48px_rgba(0,0,0,0.15)]"
          >
            <Image
              src="/bento/image copy.png"
              alt="Our direction — One Way signs"
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105 will-change-transform"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="text-white/60 text-xs font-medium uppercase tracking-[0.2em]">Our Philosophy</span>
              <h4 className="text-2xl md:text-3xl font-display font-semibold text-white mt-1 tracking-tight">One Direction.<br/><span className="text-accent italic">Forward.</span></h4>
            </div>
          </motion.div>
        </motion.div>

        {/* About Us Pill */}
        <div className="flex justify-center mt-12 md:mt-24 mb-16 md:mb-24">
          <div className="px-14 py-4 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md text-lg md:text-xl uppercase tracking-[0.3em] font-semibold shadow-[0_8px_32px_rgba(17,37,14,0.08)]">
            About Us
          </div>
        </div>

        {/* 3. Co-founder photos */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full max-w-[60rem] mx-auto px-4 md:px-0 overflow-visible"
          ref={scrollTargetRef}
        >
          <motion.div style={{ x: xFounder1 }} className="will-change-transform">
            <FounderCard
              name="Asmita Jadhav"
              title="Co-founder"
              img1="/profilepics/asmita1.png"
              img2="/profilepics/asmita2.png"
            />
          </motion.div>
          <motion.div style={{ x: xFounder2 }} className="will-change-transform">
            <FounderCard
              name="Aditya Sawant"
              title="Co-founder"
              img1="/profilepics/aditya1.png"
              img2="/profilepics/aditya2.png"
            />
          </motion.div>
        </div>

        {/* 4. About Us Writeup */}
        <div className="text-center max-w-4xl mx-auto relative z-20 pb-8 pt-40 md:pt-64">
          <motion.div
            style={{ y: yText }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="will-change-transform"
          >
            <h3 className="text-xl md:text-3xl font-display font-medium leading-relaxed text-primary/90">
              Monarch Media House is an <span className="text-accent italic">Infotainment First</span> Creative agency helping brands create their distribution through organic, paid & collaborative content.
            </h3>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-8" />
            <p className="text-primary/60 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
              Our aim is to help brands adapt with the new ways of building{" "}
              <span className="text-primary font-medium">content systems and funnels</span>{" "}
              while keeping the traditional channels active. We work with{" "}
              <span className="text-primary font-medium">B2B businesses, AI startups, Architects and creators</span>{" "}
              building brands.
            </p>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto my-8" />
            <p className="text-primary/60 text-base md:text-xl leading-relaxed max-w-3xl mx-auto font-light">
              At Monarch, we don't believe in posting for the sake of posting. We focus on{" "}
              <span className="text-primary font-medium">content that educates, sparks conversation, and builds real brand presence.</span>
            </p>
            <p className="mt-6 text-sm md:text-base text-primary/70 italic font-light tracking-wide">
              Internet rewards clarity, creativity and consistency. That's what we are here to build :)
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

function FounderCard({ name, title, img1, img2 }: { name: string, title: string, img1: string, img2: string }) {
  return (
    <div className="w-full relative flex flex-col items-center group cursor-pointer">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, type: "spring", bounce: 0.4 }}
        className="w-full relative flex flex-col items-center"
      >
        <div className="relative w-[80%] max-w-[320px] aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-primary/5 border border-primary/10 mb-8 shadow-2xl transform-gpu">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent opacity-20" />

          {/* Image 1 (Fades out on hover) */}
          <Image
            src={img1}
            alt={name}
            fill
            className="object-cover object-center transition-all duration-700 ease-in-out group-hover:opacity-0 group-hover:scale-105 will-change-transform"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Image 2 (Revealed on hover) */}
          <Image
            src={img2}
            alt={name}
            fill
            className="object-cover object-center transition-all duration-700 ease-in-out opacity-0 scale-110 group-hover:opacity-100 group-hover:scale-100 will-change-transform"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none" />
          <div className="absolute inset-0 rounded-[2.5rem] border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </div>

        <div className="text-center transform transition-all duration-500 group-hover:-translate-y-3">
          <h4 className="text-3xl md:text-4xl font-display font-semibold mb-3 tracking-tight text-primary/90 group-hover:text-primary transition-colors">{name}</h4>
          <div className="flex items-center justify-center gap-4">
            <span className="w-10 h-[1px] bg-accent/40 group-hover:bg-accent/80 transition-colors duration-500" />
            <p className="text-accent uppercase tracking-[0.2em] text-sm font-medium">{title}</p>
            <span className="w-10 h-[1px] bg-accent/40 group-hover:bg-accent/80 transition-colors duration-500" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
