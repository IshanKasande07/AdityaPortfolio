"use client"

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, Brain, Heart, Zap } from "lucide-react";
import FadeUp from "./css/FadeUp";

const WhyInfotainmentWorks = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const actionWordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgLinesRef = useRef<(SVGPathElement | null)[]>([]);
  const verticalLinesRef = useRef<(HTMLDivElement | null)[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  const [cardDimensions, setCardDimensions] = useState<{ width: number, height: number }[]>([]);

  // Update card dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (cardRefs.current) {
        const dims = cardRefs.current.map(card => {
          if (card) {
            return { width: card.offsetWidth, height: card.offsetHeight };
          }
          return { width: 0, height: 0 };
        });
        setCardDimensions(dims);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    // Slight delay to ensure fonts/layout are fully rendered
    setTimeout(updateDimensions, 100);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || cardDimensions.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    let ctx = gsap.context(() => {
      // Bottom SVG Curve animation
      if (pathRef.current && svgRef.current) {
        const startPath = "M0,50 Q720,150 1440,50";
        const endPath = "M0,50 Q720,30 1440,50";

        gsap.fromTo(pathRef.current,
          { attr: { d: startPath } },
          {
            attr: { d: endPath },
            ease: "none",
            scrollTrigger: {
              trigger: svgRef.current,
              start: "top bottom",
              end: "bottom center",
              scrub: true,
            }
          }
        );
      }

      const triggerStart = "top center+=15%"; // Trigger when top of element is 15% below the center of viewport
      const triggerEnd = "bottom center+=15%"; // Finish when bottom of element is 15% below the center of viewport

      // Vertical connecting lines animation
      verticalLinesRef.current.forEach((line) => {
        if (!line || !line.parentElement) return;
        gsap.fromTo(line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: line.parentElement, // Use parent container for accurate height measurement
              start: triggerStart,
              end: triggerEnd,
              scrub: true,
            }
          }
        );
      });

      // Split tracing animations around cards
      svgLinesRef.current.forEach((path, index) => {
        if (!path) return;

        // Use the corresponding card as the trigger
        const card = cardRefs.current[Math.floor(index / 2)];
        if (!card) return;

        // Path length is critical for the drawing animation, strokeDasharray is set in inline style
        gsap.fromTo(path,
          { strokeDashoffset: 1000 }, // We use 1000 in the pathLength attribute
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: triggerStart,
              end: triggerEnd,
              scrub: true,
            }
          }
        );
      });

      // Action Words Animation
      actionWordRefs.current.forEach((word) => {
        if (!word) return;
        gsap.fromTo(word,
          { opacity: 0, y: -20, color: "rgba(255, 255, 255, 0.2)" },
          {
            opacity: 1,
            y: 0,
            color: "#FFC300",
            duration: 0.4,
            scrollTrigger: {
              trigger: word,
              start: "center center+=15%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

      // Card Content Reveal Animation (triggers mostly after line finishes tracing)
      cardRefs.current.forEach((card) => {
        if (!card) return;

        gsap.fromTo(card,
          { opacity: 0, scale: 0.95, filter: "blur(10px)" },
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              // Start revealing right after the tracing finishes
              start: "center center+=15%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, [cardDimensions]); // Re-run animations when card dimensions change

  const steps = [
    { label: "Attention", icon: <Zap className="w-5 h-5 text-accent" />, actionWord: null },
    { label: "Authority", icon: <Brain className="w-5 h-5 text-accent" />, actionWord: "Builds" },
    { label: "Trust", icon: <Heart className="w-5 h-5 text-accent" />, actionWord: "Earns" },
    { label: "Demand", icon: <Sparkles className="w-5 h-5 text-accent" />, actionWord: "Creates" },
  ];

  const addToRefs = (el: any, refArray: React.MutableRefObject<any[]>, index: number) => {
    if (el) {
      refArray.current[index] = el;
    }
  };

  return (
    <div className="h-auto w-full pt-25 pb-0 page z-30 min-h-[100vh] bg-surface relative flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col items-center gap-10 mt-10 px-[5vw] mb-20 w-full max-w-4xl mx-auto">

        {/* Header */}
        <FadeUp>
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-[4vw] font-display font-semibold text-primary tracking-tight">Why Infotainment Works</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-accent to-red-500 mx-auto mt-6 rounded-full"></div>
            <p className="max-w-2xl mx-auto mt-8 text-lg md:text-xl text-muted font-light leading-relaxed">
              Anyone can entertain. Anyone can educate. Very few can do both — <span className="text-accent font-medium">consistently</span>.
            </p>
          </div>
        </FadeUp>

        {/* Timeline Structure */}
        <div ref={containerRef} className="relative w-full flex flex-col items-center">

          {/* Initial incoming line */}
          <div className="relative w-full flex justify-center h-32">
            <div className="absolute top-0 bottom-0 w-[2px] bg-white/5"></div>
            <div ref={(el) => addToRefs(el, verticalLinesRef, 0)} className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FF5733] to-[#FFC300] origin-top shadow-[0_0_15px_rgba(255,195,0,0.5)] z-0"></div>
          </div>

          {/* Timeline Items */}
          {steps.map((step, index) => {
            const dims = cardDimensions[index] || { width: 0, height: 0 };
            const radius = 16; // border-radius of card (rounded-2xl is usually 16px or 1rem)
            const w = dims.width;
            const h = dims.height;

            // Generate SVG paths for tracing the borders
            // Left Path: Start top-center -> left -> bottom-left -> bottom-center
            const leftPathD = w > 0 ? `
              M ${w / 2} 0 
              L ${radius} 0 
              Q 0 0 0 ${radius} 
              L 0 ${h - radius} 
              Q 0 ${h} ${radius} ${h} 
              L ${w / 2} ${h}
            ` : "";

            // Right Path: Start top-center -> right -> bottom-right -> bottom-center
            const rightPathD = w > 0 ? `
              M ${w / 2} 0 
              L ${w - radius} 0 
              Q ${w} 0 ${w} ${radius} 
              L ${w} ${h - radius} 
              Q ${w} ${h} ${w - radius} ${h} 
              L ${w / 2} ${h}
            ` : "";

            return (
              <div key={index} className="relative flex flex-col items-center w-full">

                {/* Center SVG Tracing Container (placed absolutely behind the card) */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 transition-opacity duration-300 ${w > 0 ? 'opacity-100' : 'opacity-0'}`}
                  style={{ width: w || "100%", height: h || "100%" }}
                >
                  <svg className="w-full h-full absolute inset-0 overflow-visible" style={{ zIndex: -1 }}>
                    {/* Background subtle paths */}
                    <path d={leftPathD} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                    <path d={rightPathD} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

                    {/* Glowing animated paths */}
                    <path
                      ref={(el) => addToRefs(el, svgLinesRef, index * 2)}
                      d={leftPathD}
                      fill="none"
                      stroke="#FFC300"
                      strokeWidth="2"
                      pathLength="1000"
                      style={{ strokeDasharray: 1000, strokeDashoffset: 1000, filter: 'drop-shadow(0px 0px 8px rgba(255, 195, 0, 0.6))' }}
                    />
                    <path
                      ref={(el) => addToRefs(el, svgLinesRef, index * 2 + 1)}
                      d={rightPathD}
                      fill="none"
                      stroke="#FFC300"
                      strokeWidth="2"
                      pathLength="1000"
                      style={{ strokeDasharray: 1000, strokeDashoffset: 1000, filter: 'drop-shadow(0px 0px 8px rgba(255, 195, 0, 0.6))' }}
                    />
                  </svg>
                </div>

                {/* The actual card */}
                <div
                  ref={(el) => addToRefs(el, cardRefs, index)}
                  className={`p-8 md:p-10 rounded-2xl bg-surface-light/30 border border-white/5 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group transition-colors duration-500 w-full md:w-2/3 max-w-[600px] text-center flex flex-col items-center`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className={`w-12 h-12 rounded-full bg-surface-light/50 border border-white/10 flex items-center justify-center mb-4 shadow-lg z-10`}>
                    {step.icon}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-display font-semibold text-primary tracking-tight z-10">
                    {step.label}
                  </h3>
                </div>

                {/* Connecting Vertical Line & Action Word to next card */}
                {index < steps.length - 1 && (
                  <div className="relative w-full h-40 flex items-center justify-center z-10">
                    {/* Background faint line */}
                    <div className="absolute top-0 bottom-0 w-[2px] bg-white/5"></div>
                    {/* Animated vertical connecting line */}
                    <div ref={(el) => addToRefs(el, verticalLinesRef, index + 1)} className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFC300] to-[#FF5733] origin-top shadow-[0_0_15px_rgba(255,195,0,0.5)] z-0"></div>

                    {/* Action Word integrated on the line */}
                    {steps[index + 1].actionWord && (
                      <div
                        ref={(el) => addToRefs(el, actionWordRefs, index)}
                        className="bg-surface px-4 py-1 text-sm md:text-base font-mono font-medium tracking-widest uppercase border border-white/5 rounded-full shadow-[0_0_15px_rgba(255,195,0,0.2)] z-10 relative"
                      >
                        {steps[index + 1].actionWord}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final outgoing line */}
          <div className="relative w-full flex justify-center h-40">
            <div className="absolute top-0 bottom-0 w-[2px] bg-white/5"></div>
            <div ref={(el) => addToRefs(el, verticalLinesRef, steps.length)} className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#FFC300] to-[#FF5733] origin-top shadow-[0_0_15px_rgba(255,195,0,0.5)] z-0"></div>
          </div>

        </div>

      </div>

      <div className="w-full overflow-hidden leading-[0] mt-10 relative h-[100px] z-40 pointer-events-none">
        <svg ref={svgRef} viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-[100px] transform scale-105 translate-y-[2px]">
          {/* Transition into background color of the next section */}
          <path d="M0 100C0 100 360 0 720 0C1080 0 1440 100 1440 100V100H0V100Z" fill="var(--color-background)" />
          <path ref={pathRef} d="M0,50 Q720,150 1440,50" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </div>
  );
};

export default WhyInfotainmentWorks;

