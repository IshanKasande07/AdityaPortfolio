// "use client";

// import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation, AnimatePresence } from "framer-motion";
// import { useRef, useEffect, useState, useMemo } from "react";
// import Image from "next/image";
// import { useReveal } from "./RevealLayout";
// import { scrollToTarget } from "@/lib/scroll";
// import "./css/reveal-layout.css";

// const headingLines = [
//     ["Why", "just", "create", "content", "?"],
//     ["-", "Build", "Narratives"],
// ];

// const combineTransforms = ([s, m]: number[]) => s + m;

// /** Canvas helper: replicates CSS object-fit: cover for drawImage */
// function drawImageCover(
//     ctx: CanvasRenderingContext2D,
//     img: HTMLImageElement,
//     dx: number, dy: number, dw: number, dh: number,
//     alignY: 'top' | 'center' | 'bottom' = 'center'
// ) {
//     const nw = img.naturalWidth;
//     const nh = img.naturalHeight;
//     if (!nw || !nh || !dw || !dh) return;

//     const srcRatio = nw / nh;
//     const dstRatio = dw / dh;

//     let sx: number, sy: number, sw: number, sh: number;

//     if (srcRatio > dstRatio) {
//         sh = nh;
//         sw = nh * dstRatio;
//         sx = (nw - sw) / 2;
//         sy = 0;
//     } else {
//         sw = nw;
//         sh = nw / dstRatio;
//         sx = 0;
//         if (alignY === 'bottom') sy = nh - sh;
//         else if (alignY === 'top') sy = 0;
//         else sy = (nh - sh) / 2;
//     }

//     ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
// }

// /** Canvas helper: replicates CSS object-fit: contain for drawImage */
// function drawImageContain(
//     ctx: CanvasRenderingContext2D,
//     img: HTMLImageElement,
//     dx: number, dy: number, dw: number, dh: number,
//     alignY: 'top' | 'center' | 'bottom' = 'center'
// ) {
//     const nw = img.naturalWidth;
//     const nh = img.naturalHeight;
//     if (!nw || !nh || !dw || !dh) return;

//     const srcRatio = nw / nh;
//     const dstRatio = dw / dh;

//     let sw: number, sh: number;

//     if (srcRatio > dstRatio) {
//         sw = dw;
//         sh = dw / srcRatio;
//     } else {
//         sh = dh;
//         sw = dh * srcRatio;
//     }

//     let rx = dx + (dw - sw) / 2;
//     let ry = dy;
//     if (alignY === 'bottom') ry += (dh - sh);
//     else if (alignY === 'center') ry += (dh - sh) / 2;

//     ctx.drawImage(img, rx, ry, sw, sh);
// }

// export default function Hero2() {
//     const { revealed, earlyReveal } = useReveal();

//     const headerControls = useAnimation();
//     const contentControls = useAnimation();
//     const containerRef = useRef<HTMLDivElement>(null);

//     const [parallaxUnlocked, setParallaxUnlocked] = useState(false);
//     const [bgSwapped, setBgSwapped] = useState(false);
//     const [isTouchDevice, setIsTouchDevice] = useState(false);
//     const posterCanvasRef = useRef<HTMLCanvasElement>(null);
//     const [posterReady, setPosterReady] = useState(false);

//     const [hasInteracted, setHasInteracted] = useState(false);
//     const nudgeControls = useAnimation();

//     useEffect(() => {
//         const handleScroll = () => {
//             if (window.scrollY > 10) {
//                 setHasInteracted(true);
//                 window.removeEventListener("scroll", handleScroll);
//             }
//         };
//         window.addEventListener("scroll", handleScroll, { passive: true });
//         window.addEventListener("pointerdown", () => setHasInteracted(true), { once: true });

//         const timer = setTimeout(() => {
//             if (!hasInteracted) {
//                 nudgeControls.start({
//                     scale: [1, 1.2, 1],
//                     transition: { duration: 0.9, ease: "easeInOut" }
//                 });
//             }
//         }, 8000);

//         return () => {
//             window.removeEventListener("scroll", handleScroll);
//             clearTimeout(timer);
//         };
//     }, [hasInteracted, nudgeControls]);

//     useEffect(() => {
//         const mql = window.matchMedia("(pointer: coarse)");
//         if (mql.matches) setIsTouchDevice(true);

//         const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
//         mql.addEventListener("change", handler);

//         const handleTouchStart = () => setIsTouchDevice(true);
//         window.addEventListener("touchstart", handleTouchStart, { passive: true });

//         return () => {
//             mql.removeEventListener("change", handler);
//             window.removeEventListener("touchstart", handleTouchStart);
//         };
//     }, []);

//     useEffect(() => {
//         if (earlyReveal) {
//             const startY = typeof window !== 'undefined' ? window.innerHeight * 0.25 : 200;

//             headerControls.start({
//                 opacity: 1,
//                 y: startY,
//                 scale: 1.5,
//                 transition: { duration: 0.8, ease: "easeOut" },
//             });

//             const bgSwapTimer = setTimeout(() => {
//                 setBgSwapped(true);
//             }, 50); // almost instant

//             const phaseTwo = setTimeout(() => {
//                 headerControls.start({
//                     y: 0,
//                     scale: 1,
//                     transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
//                 });

//                 const contentTimer = setTimeout(() => {
//                     contentControls.start({
//                         opacity: 1,
//                         y: 0,
//                         scale: 1,
//                         transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
//                     });
//                 }, 250);

//                 const unlockTimer = setTimeout(() => {
//                     setParallaxUnlocked(true);
//                 }, 1800);

//                 return () => {
//                     clearTimeout(contentTimer);
//                     clearTimeout(unlockTimer);
//                 }
//             }, 1200);

//             return () => {
//                 clearTimeout(bgSwapTimer);
//                 clearTimeout(phaseTwo);
//             };
//         }
//     }, [earlyReveal, headerControls, contentControls]);

//     const { scrollY } = useScroll();

//     const skyScrollY = useTransform(scrollY, [0, 600], [0, 450]);
//     const bridgeBehindY = useTransform(scrollY, [0, 600], [0, 370]);
//     const bridgeBottomCloudY = useTransform(scrollY, [0, 600], [0, 330]);
//     const bridgeY = useTransform(scrollY, [0, 600], [0, 250]);
//     const cloudY = useTransform(scrollY, [0, 600], [0, 130]);
//     const mountainsY = useTransform(scrollY, [0, 600], [0, 0]);

//     const mouseX = useMotionValue(0);
//     const mouseY = useMotionValue(0);

//     // PERF: Use stiffness=1e-9 when parallax is locked so the spring solver
//     // effectively never ticks (no frame budget spent on idle springs).
//     const mouseSpringConfig = useMemo(() => ({
//         stiffness: parallaxUnlocked ? 50 : 1e-9,
//         damping: 20,
//     }), [parallaxUnlocked]);
//     const smoothMouseX = useSpring(mouseX, mouseSpringConfig);
//     const smoothMouseY = useSpring(mouseY, mouseSpringConfig);

//     const skyMouseX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
//     const skyMouseY = useTransform(smoothMouseY, [-1, 1], [15, -15]);

//     const bridgeBehindMouseX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
//     const bridgeBehindMouseY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

//     const bridgeBottomCloudMouseX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
//     const bridgeBottomCloudMouseY = useTransform(smoothMouseY, [-1, 1], [-15, 15]);

//     const bridgeMouseX = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
//     const bridgeMouseY = useTransform(smoothMouseY, [-1, 1], [-25, 25]);

//     const cloudMouseX = useTransform(smoothMouseX, [-1, 1], [-35, 35]);
//     const cloudMouseY = useTransform(smoothMouseY, [-1, 1], [-35, 35]);

//     const mountainsMouseX = useTransform(smoothMouseX, [-1, 1], [-50, 50]);
//     const mountainsMouseY = useTransform(smoothMouseY, [-1, 1], [-50, 50]);

//     const combinedSkyY = useTransform([skyScrollY, skyMouseY], combineTransforms);
//     const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], combineTransforms);
//     const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], combineTransforms);
//     const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], combineTransforms);
//     const combinedCloudY = useTransform([cloudY, cloudMouseY], combineTransforms);
//     const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);
//     const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);

//     // Text & CTA uplift starts immediately from 0px and progresses smoothly over a longer scroll distance
//     const textY = useTransform(scrollY, [0, 260], [0, -200]);
//     const textOpacity = useTransform(scrollY, [0, 200], [1, 0]);
//     const textScale = useTransform(scrollY, [0, 260], [1, 0.88]);

//     const buttonX = useMotionValue(0);
//     const buttonY = useMotionValue(0);
//     // PERF: Same idle-spring trick for button hover effect
//     const buttonSpringConfig = useMemo(() => ({
//         stiffness: parallaxUnlocked ? 150 : 1e-9,
//         damping: 15,
//         mass: 0.1,
//     }), [parallaxUnlocked]);
//     const buttonSpringX = useSpring(buttonX, buttonSpringConfig);
//     const buttonSpringY = useSpring(buttonY, buttonSpringConfig);

//     const handlePointerMove = (e: React.PointerEvent) => {
//         if (isTouchDevice || !parallaxUnlocked) return;

//         const { clientX, clientY } = e;
//         const { innerWidth, innerHeight } = window;
//         const x = (clientX / innerWidth - 0.5) * 2;
//         const y = (clientY / innerHeight - 0.5) * 2;
//         mouseX.set(x);
//         mouseY.set(y);
//     };

//     // ── Poster trick ─────────────────────────────────────────────
//     // Generate a flat canvas snapshot of the parallax layers so the
//     // clip-path reveal only clips ONE GPU texture → buttery smooth.
//     useEffect(() => {
//         const isMobile = window.innerWidth < 768;
//         if (isMobile) return;

//         const container = containerRef.current;
//         const canvas = posterCanvasRef.current;
//         if (!container || !canvas) return;

//         let cancelled = false;

//         const generate = async () => {
//             // Collect all <img> elements tagged as poster layers
//             const imgs = Array.from(
//                 container.querySelectorAll<HTMLImageElement>('[data-poster-layer] img')
//             );

//             // Wait for sky and other images to decode
//             const skyImg = new window.Image();
//             skyImg.src = '/heroassets/Sky.webp';

//             await Promise.all([
//                 skyImg.decode().catch(() => {}),
//                 ...imgs.map(img => img.decode().catch(() => {}))
//             ]);

//             if (cancelled) return;

//             const rect = container.getBoundingClientRect();
//             const w = rect.width;
//             const h = rect.height;

//             canvas.width = w;
//             canvas.height = h;

//             const ctx = canvas.getContext('2d', { alpha: false });
//             if (!ctx) return;

//             // Draw Sky matching its actual scaled bounding rect
//             const skyDiv = container.querySelector('.hero-sky-bg');
//             if (skyDiv && skyImg.naturalWidth) {
//                 const skyRect = skyDiv.getBoundingClientRect();
//                 drawImageCover(
//                     ctx, 
//                     skyImg, 
//                     skyRect.left - rect.left, 
//                     skyRect.top - rect.top, 
//                     skyRect.width, 
//                     skyRect.height, 
//                     'top'
//                 );
//             }

//             // Draw layers 1-6
//             for (const img of imgs) {
//                 if (!img.naturalWidth) continue;

//                 // getBoundingClientRect captures all CSS scale() and transform origins perfectly
//                 const imgRect = img.getBoundingClientRect();
//                 const dx = imgRect.left - rect.left;
//                 const dy = imgRect.top - rect.top;
//                 const dw = imgRect.width;
//                 const dh = imgRect.height;

//                 // Check class names to perfectly mirror CSS object-fit rules
//                 const isCover = img.classList.contains('object-cover');
//                 const isContain = img.classList.contains('object-contain');
//                 const alignY = img.classList.contains('object-bottom') ? 'bottom' :
//                                img.classList.contains('object-top') ? 'top' : 'center';

//                 ctx.save();

//                 // Mirror the inline clip-path (specifically for Layer 1.5 cloud cutoff)
//                 if (img.style.clipPath && img.style.clipPath.includes('inset')) {
//                     const match = img.style.clipPath.match(/inset\(([\d.]+)%/);
//                     if (match) {
//                         const topPct = parseFloat(match[1]) / 100;
//                         ctx.beginPath();
//                         ctx.rect(dx, dy + dh * topPct, dw, dh * (1 - topPct));
//                         ctx.clip();
//                     }
//                 }

//                 if (isCover) {
//                     drawImageCover(ctx, img, dx, dy, dw, dh, alignY);
//                 } else if (isContain) {
//                     drawImageContain(ctx, img, dx, dy, dw, dh, alignY);
//                 } else {
//                     ctx.drawImage(img, dx, dy, dw, dh);
//                 }

//                 ctx.restore();
//             }

//             if (!cancelled) setPosterReady(true);
//         };

//         generate();
//         return () => { cancelled = true; };
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     // Free canvas memory once the real layers take over
//     useEffect(() => {
//         if (bgSwapped && posterCanvasRef.current) {
//             const c = posterCanvasRef.current;
//             c.width = 0;
//             c.height = 0;
//         }
//     }, [bgSwapped]);

//     // During reveal: show poster canvas, hide real parallax layers.
//     // After reveal: hide poster, show real layers.
//     const showPoster = posterReady && !bgSwapped;
//     const layerVisibility = (!posterReady || bgSwapped) ? 'visible' as const : 'hidden' as const;

//     return (
//         <div
//             ref={containerRef}
//             id="work"
//             className="relative overflow-hidden bg-background z-20 w-full h-[calc(100vh-72px)] mt-[60px] mb-[12px] rounded-[16px] md:w-[calc(100%-36px)] md:h-[calc(100vh-84px)] md:mt-[66px] md:mb-[18px] md:mx-[18px] md:rounded-[20px]"
//             onPointerMove={handlePointerMove}
//             onPointerLeave={() => {
//                 mouseX.set(0);
//                 mouseY.set(0);
//             }}
//             style={{ contain: "strict" }}
//         >
//             {/* Inline <style> removed — now in css/reveal-layout.css (parsed once, no mount-time CSSOM recalc) */}

//             {/* PERF: Removed preserve-3d — avoids forcing a 3D rendering context on the entire layer tree */}
//             <div className="absolute inset-0 w-full h-full" style={{ contain: "content" }}>

//                 {/* Poster canvas — single flat texture for smooth clip-path reveal */}
//                 <canvas
//                     ref={posterCanvasRef}
//                     style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         width: '100%',
//                         height: '100%',
//                         zIndex: 44,
//                         display: showPoster ? 'block' : 'none',
//                         pointerEvents: 'none' as const,
//                     }}
//                 />

//                 {/* ========== LAYER 0: Sky ========== */}
//                 <motion.div
//                     className="absolute inset-0 z-0 pointer-events-none hero-sky-bg"
//                     style={{
//                         backgroundSize: "cover",
//                         backgroundPosition: "top center",
//                         backgroundRepeat: "no-repeat",
//                         x: isTouchDevice ? 0 : skyMouseX,
//                         y: isTouchDevice ? skyScrollY : combinedSkyY,
//                         z: 0.01,
//                         scale: 1.05,
//                         transformOrigin: "center",
//                         visibility: layerVisibility,
//                     }}
//                 />

//                 {/* ========== LAYER 1: Bridge Behind ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : bridgeBehindMouseX,
//                         y: isTouchDevice ? bridgeBehindY : combinedBridgeBehindY,
//                         z: 0.01,
//                         scale: 1.05,
//                         transformOrigin: "center",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute inset-0 z-[10] pointer-events-none hidden md:block"
//                 >
//                     <Image
//                         src="/heroassets/Bridge Behind.webp"
//                         alt="Bridge Background"
//                         fill
//                         priority
//                         className="object-cover object-center"
//                         draggable={false}
//                         sizes="100vw"
//                     />
//                 </motion.div>

//                 {/* ========== LAYER 1.5: Bridge Bottom Cloud ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : bridgeBottomCloudMouseX,
//                         y: isTouchDevice ? bridgeBottomCloudY : combinedBridgeBottomCloudY,
//                         z: 0.01,
//                         scale: 1.05,
//                         transformOrigin: "bottom center",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute inset-x-0 bottom-0 z-[15] hidden md:flex justify-center pointer-events-none"
//                 >
//                     <Image
//                         src="/heroassets/Bridge Bottom Cloud_.webp"
//                         alt="Cloud Layer"
//                         width={800}
//                         height={400}
//                         priority
//                         className="object-contain object-bottom"
//                         style={{ width: "clamp(140px, 30vw, 800px)", height: "auto", clipPath: "inset(15% 0 0 0)" }}
//                         draggable={false}
//                     />
//                 </motion.div>

//                 {/* ========== LAYER 2: Bridge ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : bridgeMouseX,
//                         y: isTouchDevice ? bridgeY : combinedBridgeY,
//                         z: 0.01,
//                         scale: 1.05,
//                         transformOrigin: "bottom center",
//                         height: "102%",
//                         top: "2vh",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute left-0 w-full z-[20] pointer-events-none hidden md:block"
//                 >
//                     <Image
//                         src="/heroassets/Bridge.webp"
//                         alt="Bridge Overlay"
//                         fill
//                         priority
//                         className="object-cover object-bottom"
//                         draggable={false}
//                         sizes="100vw"
//                     />
//                 </motion.div>

//                 {/* ========== LAYER 3: Cloud ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : cloudMouseX,
//                         y: isTouchDevice ? cloudY : combinedCloudY,
//                         z: 0.01,
//                         scale: 1.15,
//                         transformOrigin: "center",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute inset-0 -bottom-32 z-[30] pointer-events-none hidden md:block"
//                 >
//                     <Image
//                         src="/heroassets/CLoud.webp"
//                         alt="Cloud Overlay"
//                         width={1200}
//                         height={400}
//                         priority
//                         className="absolute bottom-[18vh] left-1/2 -translate-x-1/2"
//                         style={{ width: "130%", height: "auto" }}
//                         draggable={false}
//                     />
//                 </motion.div>

//                 {/* ========== LAYER 4: Left Mountain ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : mountainsMouseX,
//                         y: isTouchDevice ? mountainsY : combinedLeftMountainY,
//                         z: 0.01,
//                         scale: 1.2,
//                         transformOrigin: "bottom left",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute inset-0 -bottom-20 -left-20 z-[40] pointer-events-none hidden md:block"
//                 >
//                     <Image
//                         src="/heroassets/LEft Mountaim.webp"
//                         alt="Left Mountain"
//                         width={600}
//                         height={600}
//                         priority
//                         className="absolute bottom-0 left-0"
//                         style={{ width: "clamp(120px, 27vw, 540px)", height: "auto", maxWidth: "none" }}
//                         draggable={false}
//                     />
//                 </motion.div>

//                 {/* ========== LAYER 4: Right Mountain ========== */}
//                 <motion.div
//                     data-poster-layer
//                     style={{
//                         x: isTouchDevice ? 0 : mountainsMouseX,
//                         y: isTouchDevice ? mountainsY : combinedRightMountainY,
//                         z: 0.01,
//                         scale: 1.2,
//                         transformOrigin: "bottom right",
//                         visibility: layerVisibility,
//                     }}
//                     className="absolute inset-0 -bottom-20 -right-20 z-[40] pointer-events-none hidden md:block"
//                 >
//                     <Image
//                         src="/heroassets/Right Mountaim.webp"
//                         alt="Right Mountain"
//                         width={800}
//                         height={800}
//                         priority
//                         className="absolute bottom-0 right-0"
//                         style={{ width: "clamp(160px, 35vw, 700px)", height: "auto", maxWidth: "none" }}
//                         draggable={false}
//                     />
//                 </motion.div>

//                 {/* ========== Noise overlay ========== */}
//                 {revealed && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ duration: 0.6 }}
//                         className="absolute inset-0 pointer-events-none z-[45] opacity-[0.05]"
//                         style={{ transform: "translateZ(0)", willChange: "transform" }}
//                     >
//                         <div
//                             style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }}
//                         />
//                     </motion.div>
//                 )}

//                 {/* ========== LAYER 5: Text Overlay + CTA ========== */}
//                 <motion.div
//                     style={{ y: textY, opacity: textOpacity, scale: textScale, z: 0.01, willChange: "transform, opacity" }}
//                     className="absolute top-[6vh] md:top-[8vh] left-0 w-full flex flex-col items-center justify-center text-primary text-center z-[50] px-6 md:px-[5vw] pointer-events-none"
//                 >
//                     <motion.div
//                         initial={{ opacity: 0, y: "25vh", scale: 1.5 }}
//                         animate={headerControls}
//                         style={{
//                             transformOrigin: "top center",
//                             willChange: "transform, opacity",
//                             WebkitFontSmoothing: "antialiased",
//                         }}
//                         className="w-full flex flex-col items-center justify-center pointer-events-none"
//                     >
//                         <div
//                             className="text-[8vw] sm:text-[5.5vw] md:text-[4vw] font-medium leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4 flex flex-col items-center"
//                             style={{ fontFamily: "var(--font-tiempos-headline), serif", display: "swap" }}
//                         >
//                             {headingLines.map((line, lineIdx) => (
//                                 <div key={lineIdx} className="flex flex-wrap justify-center gap-[0.3em] overflow-visible">
//                                     {line.map((word, i) => (
//                                         <div
//                                             key={i}
//                                             className="overflow-hidden inline-flex relative py-2 pl-1 pr-3 -mx-1"
//                                             style={{ transform: "translateZ(0)" }}
//                                         >
//                                             <span
//                                                 className={`word-reveal ${earlyReveal ? "playing" : ""} ${lineIdx === 1 ? "italic font-light text-accent" : "font-semibold text-[#1e3a18]"}`}
//                                                 style={{ animationDelay: `${lineIdx * 0.1 + i * 0.04}s` }}
//                                             >
//                                                 {word}
//                                             </span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ))}
//                         </div>

//                         <p className={`subtitle-reveal ${earlyReveal ? "playing" : ""} text-xs sm:text-sm md:text-[1.1vw] text-[#F8F3E6] max-w-[90vw] md:max-w-3xl pointer-events-auto leading-relaxed mb-1 px-4 md:px-0`}>
//                             Attention is the highest currency, we are helping you to mine it
//                         </p>
//                     </motion.div>
//                 </motion.div>

//                 <motion.div
//                     initial={{ opacity: 0, y: 20, scale: 0.95 }}
//                     animate={contentControls}
//                     style={{ y: textY, opacity: textOpacity, z: 0.01, willChange: "transform, opacity" }}
//                     className="absolute bottom-[6vh] md:bottom-[8vh] left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto"
//                 >
//                     <motion.button
//                         onClick={() => scrollToTarget("contact")}
//                         onPointerEnter={() => setHasInteracted(true)}
//                         onPointerMove={(e) => {
//                             if (isTouchDevice || !parallaxUnlocked) return;
//                             const rect = e.currentTarget.getBoundingClientRect();
//                             buttonX.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
//                             buttonY.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
//                         }}
//                         onPointerLeave={() => {
//                             buttonX.set(0);
//                             buttonY.set(0);
//                         }}
//                         style={{ x: buttonSpringX, y: buttonSpringY }}
//                         animate={nudgeControls}
//                         whileTap={{ scale: 0.9 }}
//                         className="group relative overflow-hidden rounded-full py-3 px-8 md:py-4 md:px-10 will-change-transform"
//                     >
//                         <div className="absolute inset-0 bg-accent rounded-full -z-10" />
//                         <div className="absolute inset-0 bg-[#1e3a18] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />
//                         <div className="relative z-10 flex items-center justify-center text-sm md:text-[1.1vw] font-medium text-black group-hover:text-white transition-colors duration-300">
//                             <span>Book a Call</span>
//                             <span className="ml-3 relative flex items-center justify-center overflow-hidden w-5 h-5">
//                                 <span className="absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
//                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                         <path d="M5 12h14M12 5l7 7-7 7" />
//                                     </svg>
//                                 </span>
//                                 <span className="absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
//                                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
//                                         <path d="M5 12h14M12 5l7 7-7 7" />
//                                     </svg>
//                                 </span>
//                             </span>
//                         </div>
//                     </motion.button>
//                 </motion.div>

//                 <AnimatePresence>
//                     {earlyReveal && !isTouchDevice && (
//                         <motion.div
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
//                             transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
//                             style={{ y: textY, opacity: textOpacity, willChange: "transform, opacity" }}
//                             className="absolute bottom-[6vh] md:bottom-[8vh] right-[6vw] md:right-[4vw] z-[100] hidden md:flex items-center gap-4 pointer-events-none"
//                         >
//                             <span className="text-xs uppercase tracking-[0.25em] text-[#F8F3E6]/80 font-bold mt-[2px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
//                                 Move cursor to explore
//                             </span>
//                             <div className="w-16 h-[2px] bg-[#F8F3E6]/20 relative overflow-hidden">
//                                 <motion.div
//                                     className="absolute top-0 left-0 h-full w-6 bg-[#F8F3E6]/90"
//                                     animate={{
//                                         x: [0, 40, 0],
//                                     }}
//                                     transition={{
//                                         duration: 2.5,
//                                         repeat: Infinity,
//                                         ease: "easeInOut"
//                                     }}
//                                 />
//                             </div>
//                         </motion.div>
//                     )}
//                 </AnimatePresence>

//             </div>
//         </div>
//     );
// }

"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, useAnimation, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useReveal } from "./RevealLayout";
import { scrollToTarget } from "@/lib/scroll";
import CloudPassage from "./CloudPassage";
import "./css/reveal-layout.css";

gsap.registerPlugin(ScrollTrigger);


const headingLines = [
    ["Why", "just", "create", "content", "?"],
    ["-", "Build", "Narratives"],
];

const combineTransforms = ([s, m]: number[]) => s + m;

/** Canvas helper: replicates CSS object-fit: cover for drawImage */
function drawImageCover(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    dx: number, dy: number, dw: number, dh: number,
    alignY: 'top' | 'center' | 'bottom' = 'center'
) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh || !dw || !dh) return;

    const srcRatio = nw / nh;
    const dstRatio = dw / dh;

    let sx: number, sy: number, sw: number, sh: number;

    if (srcRatio > dstRatio) {
        sh = nh;
        sw = nh * dstRatio;
        sx = (nw - sw) / 2;
        sy = 0;
    } else {
        sw = nw;
        sh = nw / dstRatio;
        sx = 0;
        if (alignY === 'bottom') sy = nh - sh;
        else if (alignY === 'top') sy = 0;
        else sy = (nh - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

/** Canvas helper: replicates CSS object-fit: contain for drawImage */
function drawImageContain(
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    dx: number, dy: number, dw: number, dh: number,
    alignY: 'top' | 'center' | 'bottom' = 'center'
) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh || !dw || !dh) return;

    const srcRatio = nw / nh;
    const dstRatio = dw / dh;

    let sw: number, sh: number;

    if (srcRatio > dstRatio) {
        sw = dw;
        sh = dw / srcRatio;
    } else {
        sh = dh;
        sw = dh * srcRatio;
    }

    let rx = dx + (dw - sw) / 2;
    let ry = dy;
    if (alignY === 'bottom') ry += (dh - sh);
    else if (alignY === 'center') ry += (dh - sh) / 2;

    ctx.drawImage(img, rx, ry, sw, sh);
}

export default function Hero2() {
    const { revealed, earlyReveal } = useReveal();

    const headerControls = useAnimation();
    const contentControls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);

    const [parallaxUnlocked, setParallaxUnlocked] = useState(false);
    const [bgSwapped, setBgSwapped] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const posterCanvasRef = useRef<HTMLCanvasElement>(null);
    const [posterReady, setPosterReady] = useState(false);

    const [hasInteracted, setHasInteracted] = useState(false);
    const nudgeControls = useAnimation();

    // ── Bridge zoom + cloud passage ──────────────────────────────
    const parallaxLayersRef = useRef<HTMLDivElement>(null);
    const bridgeZoomRef = useRef<HTMLDivElement>(null);    // GSAP scales this
    const bridgeBehindZoomRef = useRef<HTMLDivElement>(null); // GSAP scales this (parallax)
    const bottomCloudZoomRef = useRef<HTMLDivElement>(null);  // GSAP parallax
    const foregroundCloudZoomRef = useRef<HTMLDivElement>(null); // GSAP parallax
    const leftMountainZoomRef = useRef<HTMLDivElement>(null); // GSAP parallax
    const rightMountainZoomRef = useRef<HTMLDivElement>(null); // GSAP parallax
    const cloudContainerRef = useRef<HTMLDivElement>(null);
    const creamOverlayRef = useRef<HTMLDivElement>(null);
    const skyZoomRef = useRef<HTMLDivElement>(null); // New ref for fading the sky
    const cloudPassageContainerRef = useRef<HTMLDivElement>(null);
    const cloudTextRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef(0);
    const [isDesktop, setIsDesktop] = useState(false);       // gate for Three.js

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setHasInteracted(true);
                window.removeEventListener("scroll", handleScroll);
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("pointerdown", () => setHasInteracted(true), { once: true });

        const timer = setTimeout(() => {
            if (!hasInteracted) {
                nudgeControls.start({
                    scale: [1, 1.2, 1],
                    transition: { duration: 0.9, ease: "easeInOut" }
                });
            }
        }, 8000);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(timer);
        };
    }, [hasInteracted, nudgeControls]);

    useEffect(() => {
        const mql = window.matchMedia("(pointer: coarse)");
        if (mql.matches) setIsTouchDevice(true);

        const handler = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);
        mql.addEventListener("change", handler);

        const handleTouchStart = () => setIsTouchDevice(true);
        window.addEventListener("touchstart", handleTouchStart, { passive: true });

        return () => {
            mql.removeEventListener("change", handler);
            window.removeEventListener("touchstart", handleTouchStart);
        };
    }, []);

    useEffect(() => {
        if (earlyReveal) {

            const bgSwapTimer = setTimeout(() => {
                setBgSwapped(true);
            }, 50); // almost instant

            const phaseTwo = setTimeout(() => {
                headerControls.start({
                    y: 0,
                    scale: 1,
                    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                });

                const contentTimer = setTimeout(() => {
                    contentControls.start({
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
                    });
                }, 250);

                const unlockTimer = setTimeout(() => {
                    setParallaxUnlocked(true);
                }, 1800);

                return () => {
                    clearTimeout(contentTimer);
                    clearTimeout(unlockTimer);
                }
            }, 1200);

            return () => {
                clearTimeout(bgSwapTimer);
                clearTimeout(phaseTwo);
            };
        }
    }, [earlyReveal, headerControls, contentControls]);

    const { scrollY } = useScroll();

    // Scroll-based layer drift DISABLED — layers stay at rest so the
    // GSAP-pinned bridge zoom can run without competing transforms.
    // Mouse parallax still provides depth on pointer movement.
    const skyScrollY = useTransform(scrollY, [0, 600], [0, 0]);
    const bridgeBehindY = useTransform(scrollY, [0, 600], [0, 0]);
    const bridgeBottomCloudY = useTransform(scrollY, [0, 600], [0, 0]);
    const bridgeY = useTransform(scrollY, [0, 600], [0, 0]);
    const cloudY = useTransform(scrollY, [0, 600], [0, 0]);
    const mountainsY = useTransform(scrollY, [0, 600], [0, 0]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // PERF: Use stiffness=1e-9 when parallax is locked so the spring solver
    // effectively never ticks (no frame budget spent on idle springs).
    const mouseSpringConfig = useMemo(() => ({
        stiffness: parallaxUnlocked ? 50 : 1e-9,
        damping: 20,
    }), [parallaxUnlocked]);
    const smoothMouseX = useSpring(mouseX, mouseSpringConfig);
    const smoothMouseY = useSpring(mouseY, mouseSpringConfig);

    const skyMouseX = useTransform(smoothMouseX, [-1, 1], [15, -15]);
    const skyMouseY = useTransform(smoothMouseY, [-1, 1], [15, -15]);

    const bridgeBehindMouseX = useTransform(smoothMouseX, [-1, 1], [-10, 10]);
    const bridgeBehindMouseY = useTransform(smoothMouseY, [-1, 1], [-10, 10]);

    const bridgeBottomCloudMouseX = useTransform(smoothMouseX, [-1, 1], [-15, 15]);
    const bridgeBottomCloudMouseY = useTransform(smoothMouseY, [-1, 1], [-15, 15]);

    const bridgeMouseX = useTransform(smoothMouseX, [-1, 1], [-25, 25]);
    const bridgeMouseY = useTransform(smoothMouseY, [-1, 1], [-25, 25]);

    const cloudMouseX = useTransform(smoothMouseX, [-1, 1], [-35, 35]);
    const cloudMouseY = useTransform(smoothMouseY, [-1, 1], [-35, 35]);

    const mountainsMouseX = useTransform(smoothMouseX, [-1, 1], [-50, 50]);
    const mountainsMouseY = useTransform(smoothMouseY, [-1, 1], [-50, 50]);

    const combinedSkyY = useTransform([skyScrollY, skyMouseY], combineTransforms);
    const combinedBridgeBehindY = useTransform([bridgeBehindY, bridgeBehindMouseY], combineTransforms);
    const combinedBridgeBottomCloudY = useTransform([bridgeBottomCloudY, bridgeBottomCloudMouseY], combineTransforms);
    const combinedBridgeY = useTransform([bridgeY, bridgeMouseY], combineTransforms);
    const combinedCloudY = useTransform([cloudY, cloudMouseY], combineTransforms);
    const combinedLeftMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);
    const combinedRightMountainY = useTransform([mountainsY, mountainsMouseY], combineTransforms);

    // Text fades out quickly on scroll so it clears the view for the bridge zoom
    const textY = useTransform(scrollY, [0, 260], [0, -200]);
    const textOpacity = useTransform(scrollY, [0, 150], [1, 0]);
    const textScale = useTransform(scrollY, [0, 260], [1, 0.88]);

    const buttonX = useMotionValue(0);
    const buttonY = useMotionValue(0);
    // PERF: Same idle-spring trick for button hover effect
    const buttonSpringConfig = useMemo(() => ({
        stiffness: parallaxUnlocked ? 150 : 1e-9,
        damping: 15,
        mass: 0.1,
    }), [parallaxUnlocked]);
    const buttonSpringX = useSpring(buttonX, buttonSpringConfig);
    const buttonSpringY = useSpring(buttonY, buttonSpringConfig);

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isTouchDevice || !parallaxUnlocked) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;
        mouseX.set(x);
        mouseY.set(y);
    };

    // ── Poster trick ─────────────────────────────────────────────
    // Generate a flat canvas snapshot of the parallax layers so the
    // clip-path reveal only clips ONE GPU texture → buttery smooth.
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const container = containerRef.current;
        const canvas = posterCanvasRef.current;
        if (!container || !canvas) return;

        let cancelled = false;

        const generate = async () => {
            // Collect all <img> elements tagged as poster layers
            const imgs = Array.from(
                container.querySelectorAll<HTMLImageElement>('[data-poster-layer] img')
            );

            // Wait for sky and other images to decode
            const skyImg = new window.Image();
            skyImg.src = '/heroassets/Sky.webp';

            await Promise.all([
                skyImg.decode().catch(() => { }),
                ...imgs.map(img => img.decode().catch(() => { }))
            ]);

            if (cancelled) return;

            const rect = container.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;

            canvas.width = w;
            canvas.height = h;

            const ctx = canvas.getContext('2d', { alpha: false });
            if (!ctx) return;

            // Draw Sky matching its actual scaled bounding rect
            const skyDiv = container.querySelector('.hero-sky-bg');
            if (skyDiv && skyImg.naturalWidth) {
                const skyRect = skyDiv.getBoundingClientRect();
                drawImageCover(
                    ctx,
                    skyImg,
                    skyRect.left - rect.left,
                    skyRect.top - rect.top,
                    skyRect.width,
                    skyRect.height,
                    'top'
                );
            }

            // Draw layers 1-6
            for (const img of imgs) {
                if (!img.naturalWidth) continue;

                // getBoundingClientRect captures all CSS scale() and transform origins perfectly
                const imgRect = img.getBoundingClientRect();
                const dx = imgRect.left - rect.left;
                const dy = imgRect.top - rect.top;
                const dw = imgRect.width;
                const dh = imgRect.height;

                // Check class names to perfectly mirror CSS object-fit rules
                const isCover = img.classList.contains('object-cover');
                const isContain = img.classList.contains('object-contain');
                const alignY = img.classList.contains('object-bottom') ? 'bottom' :
                    img.classList.contains('object-top') ? 'top' : 'center';

                ctx.save();

                // Mirror the inline clip-path (specifically for Layer 1.5 cloud cutoff)
                if (img.style.clipPath && img.style.clipPath.includes('inset')) {
                    const match = img.style.clipPath.match(/inset\(([\d.]+)%/);
                    if (match) {
                        const topPct = parseFloat(match[1]) / 100;
                        ctx.beginPath();
                        ctx.rect(dx, dy + dh * topPct, dw, dh * (1 - topPct));
                        ctx.clip();
                    }
                }

                if (isCover) {
                    drawImageCover(ctx, img, dx, dy, dw, dh, alignY);
                } else if (isContain) {
                    drawImageContain(ctx, img, dx, dy, dw, dh, alignY);
                } else {
                    ctx.drawImage(img, dx, dy, dw, dh);
                }

                ctx.restore();
            }

            if (!cancelled) setPosterReady(true);
        };

        generate();
        return () => { cancelled = true; };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Free canvas memory once the real layers take over
    useEffect(() => {
        if (bgSwapped && posterCanvasRef.current) {
            const c = posterCanvasRef.current;
            c.width = 0;
            c.height = 0;
        }
    }, [bgSwapped]);

    // ── Desktop detection for Three.js gate ────────────────────────
    useEffect(() => {
        const mql = window.matchMedia("(min-width: 768px)");
        setIsDesktop(mql.matches);
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, []);

    // ── GSAP ScrollTrigger: Pin hero + scale ONLY the bridge ───────
    //
    // Scroll parallax is disabled (all scroll Y transforms = 0).
    // `start: "top top"` pins the hero at the viewport top.
    // The pin extends 1200px — enough for text fade + bridge zoom +
    // cloud reveal + cream flash exit.
    //
    // ONLY the bridge layer scales (via bridgeZoomRef). All other
    // layers stay at their resting positions with mouse parallax.
    //
    // As the bridge scales, its transparent arch opening grows,
    // revealing the 3D cloud scene positioned behind it (z-[12]).
    //
    useEffect(() => {
        if (!revealed || typeof window === "undefined") return;
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const container = containerRef.current;
        const bridgeEl = bridgeZoomRef.current;
        const bridgeBehindEl = bridgeBehindZoomRef.current;
        const bottomCloudEl = bottomCloudZoomRef.current;
        const foregroundCloudEl = foregroundCloudZoomRef.current;
        const leftMountainEl = leftMountainZoomRef.current;
        const rightMountainEl = rightMountainZoomRef.current;
        const creamEl = creamOverlayRef.current;
        if (!container || !bridgeEl || !bridgeBehindEl || !bottomCloudEl || !foregroundCloudEl || !leftMountainEl || !rightMountainEl || !creamEl) return;

        // Wait a frame for layout to settle after reveal
        const rafId = requestAnimationFrame(() => {
            // ── Build the scrubbed timeline ─────────────────────────
            const tl = gsap.timeline({ paused: true });

            // Phase 1 (0%–20%): Text fades out via Framer Motion (scrollY 0–150)
            // GSAP does nothing here — the text transforms handle it.

            // Phase 2 (5%–55%): Bridge scales up from 1.05 → 28
            // The arch opening grows, revealing the sky/clouds behind
            const skyEl = skyZoomRef.current;
            if (skyEl) {
                tl.fromTo(skyEl,
                    { opacity: 1 },
                    {
                        opacity: 0,
                        ease: "power2.inOut",
                        duration: 0.54, // Fades out over 54% of the scroll (1.5× of previous)
                    },
                    0.05
                );
            }

            tl.fromTo(bridgeEl,
                { scale: 1.05, yPercent: 0 },
                {
                    scale: 28, // Massively increased so edges completely leave the screen
                    yPercent: -15, // Drift upward to center the arch in the viewport
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Parallax zoom for the Bridge Behind layer (scales slightly slower/less)
            tl.fromTo(bridgeBehindEl,
                { scale: 1.05, yPercent: 0 },
                {
                    scale: 18, // Scaled up proportionally
                    yPercent: -10, // Less drift
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Parallax zoom for Layer 1.5 (Bottom Cloud)
            tl.fromTo(bottomCloudEl,
                { scale: 1.05, yPercent: 0 },
                {
                    scale: 25,
                    yPercent: 900, // Strong downward (+y) drift while scaling up
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Fade out the bottom cloud 1.5x faster than it scales
            tl.fromTo(bottomCloudEl,
                { opacity: 1 },
                {
                    opacity: 0,
                    ease: "power2.inOut",
                    duration: 0.33,
                },
                0.05
            );

            // Parallax zoom for Layer 3 (Foreground Cloud)
            tl.fromTo(foregroundCloudEl,
                { scale: 1.15, yPercent: 0 },
                {
                    scale: 40, // Scaled way up to clear the viewport
                    yPercent: 35,
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Parallax zoom for Left Mountain
            tl.fromTo(leftMountainEl,
                { scale: 1.2, xPercent: 0, yPercent: 0 },
                {
                    scale: 20,
                    xPercent: -2200, // Massive push to counteract 20x bottom-left scaling
                    yPercent: 1500,
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Parallax zoom for Right Mountain
            tl.fromTo(rightMountainEl,
                { scale: 1.2, xPercent: 0, yPercent: 0 },
                {
                    scale: 20,
                    xPercent: 2200, // Massive push to counteract 20x bottom-right scaling
                    yPercent: 1500,
                    ease: "power2.inOut",
                    duration: 0.50,
                },
                0.05
            );

            // Fade in cloud passage during the bridge zoom (when sky fades out)
            const cloudPassageEl = cloudPassageContainerRef.current;
            if (cloudPassageEl) {
                tl.fromTo(cloudPassageEl,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.125, ease: "power2.inOut" },
                    0.05
                );
            }

            // Fade in the cloud test text right after the zoom completes
            const cloudTextEl = cloudTextRef.current;
            if (cloudTextEl) {
                tl.fromTo(cloudTextEl,
                    { opacity: 0, scale: 0.9, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.1, ease: "power2.out" },
                    0.55
                );
            }

            // Phase 4 (95%–100%): Cream flash removed to allow seamless transition to next section

            // ── Create the ScrollTrigger ────────────────────────────
            const mt = parseFloat(window.getComputedStyle(container).marginTop) || 0;
            const st = ScrollTrigger.create({
                trigger: container,
                start: `top-=${mt} top`,
                end: `+=${window.innerHeight * 3.75}`, // 1.5x of previous 2.5 (takes 1.5x more scrolling to complete)
                pin: true,
                pinType: "transform",
                pinSpacing: true,
                scrub: 0.5,
                animation: tl,
                onUpdate: (self) => {
                    const p = self.progress;
                    progressRef.current = p;

                    // Update parallax scales safely via CSS variables or ref
                    if (posterReady && !bgSwapped && p > 0.05) {
                        setBgSwapped(true);
                    }
                },
            });

            ScrollTrigger.refresh();
        });

        return () => {
            cancelAnimationFrame(rafId);
            ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === containerRef.current) trigger.kill();
            });
        };
    }, [revealed]); // eslint-disable-line react-hooks/exhaustive-deps

    // During reveal: show poster canvas, hide real parallax layers.
    // After reveal: hide poster, show real layers.
    const showPoster = posterReady && !bgSwapped;
    const layerVisibility = (!posterReady || bgSwapped) ? 'visible' as const : 'hidden' as const;

    return (
        <div
            ref={containerRef}
            id="work"
            className="relative overflow-hidden bg-background z-20 w-full h-[calc(100vh-72px)] mt-[60px] mb-[12px] rounded-[16px] md:w-[calc(100%-36px)] md:h-[calc(100vh-84px)] md:mt-[66px] md:mb-[18px] md:mx-[18px] md:rounded-[20px]"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => {
                mouseX.set(0);
                mouseY.set(0);
            }}
            style={{ contain: "strict" }}
        >
            {/* Inline <style> removed — now in css/reveal-layout.css (parsed once, no mount-time CSSOM recalc) */}

            {/* PERF: Removed preserve-3d — avoids forcing a 3D rendering context on the entire layer tree */}
            <div className="absolute inset-0 w-full h-full" style={{ contain: "content" }}>

                {/* Poster canvas — single flat texture for smooth clip-path reveal */}
                <canvas
                    ref={posterCanvasRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 44,
                        display: showPoster ? 'block' : 'none',
                        pointerEvents: 'none' as const,
                    }}
                />



                {/* ========== LAYER 0: Sky ========== */}
                <div ref={skyZoomRef} className="absolute inset-0 z-0 pointer-events-none">
                    <motion.div
                        className="absolute inset-0 pointer-events-none hero-sky-bg"
                        style={{
                            backgroundSize: "cover",
                            backgroundPosition: "top center",
                            backgroundRepeat: "no-repeat",
                            x: isTouchDevice ? 0 : skyMouseX,
                            y: isTouchDevice ? skyScrollY : combinedSkyY,
                            z: 0.01,
                            scale: 1.05,
                            transformOrigin: "center",
                            visibility: layerVisibility,
                        }}
                    />
                </div>

                {/* ========== LAYER 0.5: Cloud Passage ========== */}
                <div
                    ref={cloudPassageContainerRef}
                    className="absolute inset-0 z-[5] pointer-events-none"
                    style={{ opacity: 0, visibility: layerVisibility }}
                >
                    <CloudPassage progressRef={progressRef} />
                    <div ref={cloudTextRef} className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                        <h1 className="text-white text-6xl font-bold drop-shadow-md mix-blend-difference text-center">
                            3D Cloud Passage Test<br />
                            <span className="text-2xl mt-4 block">Scroll down to fly through</span>
                        </h1>
                    </div>
                </div>

                {/* ========== LAYER 1: Bridge Behind ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeBehindMouseX,
                        y: isTouchDevice ? bridgeBehindY : combinedBridgeBehindY,
                        z: 0.01,
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 z-[10] pointer-events-none hidden md:block"
                >
                    <div ref={bridgeBehindZoomRef} className="absolute inset-0" style={{ transformOrigin: "50% 65%", transform: "scale(1.05)" }}>
                        <Image
                            src="/heroassets/Bridge Behind.webp"
                            alt="Bridge Background"
                            fill
                            priority
                            className="object-cover object-center"
                            draggable={false}
                            sizes="100vw"
                        />
                    </div>
                </motion.div>

                {/* ========== LAYER 1.5: Bridge Bottom Cloud ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeBottomCloudMouseX,
                        y: isTouchDevice ? bridgeBottomCloudY : combinedBridgeBottomCloudY,
                        z: 0.01,
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-x-0 bottom-0 z-[15] hidden md:flex justify-center pointer-events-none"
                >
                    <div ref={bottomCloudZoomRef} className="w-full h-full flex justify-center" style={{ transformOrigin: "50% 65%", transform: "scale(1.05)" }}>
                        <Image
                            src="/heroassets/Bridge Bottom Cloud_.webp"
                            alt="Cloud Layer"
                            width={800}
                            height={400}
                            priority
                            className="object-contain object-bottom"
                            style={{ width: "clamp(140px, 30vw, 800px)", height: "auto", clipPath: "inset(15% 0 0 0)" }}
                            draggable={false}
                        />
                    </div>
                </motion.div>

                {/* ========== LAYER 2: Bridge ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeMouseX,
                        y: isTouchDevice ? bridgeY : combinedBridgeY,
                        z: 0.01,
                        height: "102%",
                        top: "2vh",
                        visibility: layerVisibility,
                    }}
                    className="absolute left-0 w-full z-[20] pointer-events-none hidden md:block"
                >
                    <div ref={bridgeZoomRef} className="absolute inset-0" style={{ transformOrigin: "50% 65%", transform: "scale(1.05)" }}>
                        <Image
                            src="/heroassets/Bridge.webp"
                            alt="Bridge Overlay"
                            fill
                            priority
                            className="object-cover object-bottom"
                            draggable={false}
                            sizes="100vw"
                        />
                    </div>
                </motion.div>

                {/* ========== LAYER 3: Cloud ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : cloudMouseX,
                        y: isTouchDevice ? cloudY : combinedCloudY,
                        z: 0.01,
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-32 z-[30] pointer-events-none hidden md:block"
                >
                    <div ref={foregroundCloudZoomRef} className="absolute inset-0" style={{ transformOrigin: "50% 65%", transform: "scale(1.15)" }}>
                        <Image
                            src="/heroassets/CLoud.webp"
                            alt="Cloud Overlay"
                            width={1200}
                            height={400}
                            priority
                            className="absolute bottom-[18vh] left-1/2 -translate-x-1/2"
                            style={{ width: "130%", height: "auto" }}
                            draggable={false}
                        />
                    </div>
                </motion.div>

                {/* ========== LAYER 4: Left Mountain ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedLeftMountainY,
                        z: 0.01,
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-20 -left-20 z-[40] pointer-events-none hidden md:block"
                >
                    <div ref={leftMountainZoomRef} className="absolute inset-0" style={{ transformOrigin: "bottom left", transform: "scale(1.2)" }}>
                        <Image
                            src="/heroassets/LEft Mountaim.webp"
                            alt="Left Mountain"
                            width={600}
                            height={600}
                            priority
                            className="absolute bottom-0 left-0"
                            style={{ width: "clamp(120px, 27vw, 540px)", height: "auto", maxWidth: "none" }}
                            draggable={false}
                        />
                    </div>
                </motion.div>

                {/* ========== LAYER 4: Right Mountain ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedRightMountainY,
                        z: 0.01,
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-20 -right-20 z-[40] pointer-events-none hidden md:block"
                >
                    <div ref={rightMountainZoomRef} className="absolute inset-0" style={{ transformOrigin: "bottom right", transform: "scale(1.2)" }}>
                        <Image
                            src="/heroassets/Right Mountaim.webp"
                            alt="Right Mountain"
                            width={800}
                            height={800}
                            priority
                            className="absolute bottom-0 right-0"
                            style={{ width: "clamp(160px, 35vw, 700px)", height: "auto", maxWidth: "none" }}
                            draggable={false}
                        />
                    </div>
                </motion.div>



                {/* ========== Cream overlay for hard cut ========== */}
                <div
                    ref={creamOverlayRef}
                    className="absolute inset-0 z-[46] pointer-events-none"
                    style={{
                        backgroundColor: "#F8F3E6",
                        opacity: 0,
                        visibility: "hidden",
                    }}
                />

                {/* ========== Noise overlay ========== */}
                {revealed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 pointer-events-none z-[45] opacity-[0.05]"
                        style={{ transform: "translateZ(0)", willChange: "transform" }}
                    >
                        <div
                            style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\"0 0 200 200\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Cfilter id=\\"noiseFilter\\"%3E%3CfeTurbulence type=\\"fractalNoise\\" baseFrequency=\\"0.65\\" numOctaves=\\"3\\" stitchTiles=\\"stitch\\"/%3E%3C/filter%3E%3Crect width=\\"100%25\\" height=\\"100%25\\" filter=\\"url(%23noiseFilter)\\"/%3E%3C/svg%3E")' }}
                        />
                    </motion.div>
                )}



                {/* ========== LAYER 5: Text Overlay + CTA ========== */}
                <motion.div
                    style={{ y: textY, opacity: textOpacity, scale: textScale, z: 0.01, willChange: "transform, opacity" }}
                    className="absolute top-[6vh] md:top-[8vh] left-0 w-full flex flex-col items-center justify-center text-primary text-center z-[50] px-6 md:px-[5vw] pointer-events-none"
                >
                    <motion.div
                        initial={{ opacity: 1, y: "25vh", scale: 1.5 }}
                        animate={headerControls}
                        style={{
                            transformOrigin: "top center",
                            willChange: "transform, opacity",
                            WebkitFontSmoothing: "antialiased",
                        }}
                        className="w-full flex flex-col items-center justify-center pointer-events-none"
                    >
                        <div
                            className="text-[8vw] sm:text-[5.5vw] md:text-[4vw] font-medium leading-[1.1] tracking-tight pointer-events-auto mb-3 md:mb-4 flex flex-col items-center"
                            style={{ fontFamily: "var(--font-tiempos-headline), serif" }}
                        >
                            {headingLines.map((line, lineIdx) => (
                                <div key={lineIdx} className="flex flex-wrap justify-center gap-[0.3em] overflow-visible">
                                    {line.map((word, i) => (
                                        <div
                                            key={i}
                                            className="overflow-hidden inline-flex relative py-2 pl-1 pr-3 -mx-1"
                                            style={{ transform: "translateZ(0)" }}
                                        >
                                            <span
                                                className={`word-reveal ${earlyReveal ? "playing" : ""} ${lineIdx === 1 ? "italic font-light text-accent" : "font-semibold text-[#1e3a18]"}`}
                                                style={{ animationDelay: `${lineIdx * 0.1 + i * 0.04}s` }}
                                            >
                                                {word}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <p className={`subtitle-reveal ${earlyReveal ? "playing" : ""} text-xs sm:text-sm md:text-[1.1vw] text-[#F8F3E6] max-w-[90vw] md:max-w-3xl pointer-events-auto leading-relaxed mb-1 px-4 md:px-0`}>
                            Attention is the highest currency, we are helping you to mine it
                        </p>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={contentControls}
                    style={{ y: textY, opacity: textOpacity, z: 0.01, willChange: "transform, opacity" }}
                    className="absolute bottom-[6vh] md:bottom-[8vh] left-0 w-full flex flex-col items-center justify-center z-[100] pointer-events-auto"
                >
                    <motion.button
                        onClick={() => scrollToTarget("contact")}
                        onPointerEnter={() => setHasInteracted(true)}
                        onPointerMove={(e) => {
                            if (isTouchDevice || !parallaxUnlocked) return;
                            const rect = e.currentTarget.getBoundingClientRect();
                            buttonX.set((e.clientX - (rect.left + rect.width / 2)) * 0.15);
                            buttonY.set((e.clientY - (rect.top + rect.height / 2)) * 0.15);
                        }}
                        onPointerLeave={() => {
                            buttonX.set(0);
                            buttonY.set(0);
                        }}
                        style={{ x: buttonSpringX, y: buttonSpringY }}
                        animate={nudgeControls}
                        whileTap={{ scale: 0.9 }}
                        className="group relative overflow-hidden rounded-full py-3 px-8 md:py-4 md:px-10 will-change-transform"
                    >
                        <div className="absolute inset-0 bg-accent rounded-full -z-10" />
                        <div className="absolute inset-0 bg-[#1e3a18] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] rounded-full z-0" />
                        <div className="relative z-10 flex items-center justify-center text-sm md:text-[1.1vw] font-medium text-black group-hover:text-white transition-colors duration-300">
                            <span>Book a Call</span>
                            <span className="ml-3 relative flex items-center justify-center overflow-hidden w-5 h-5">
                                <span className="absolute inset-0 flex items-center justify-center -rotate-45 transition-transform duration-700 group-hover:translate-x-[150%] group-hover:-translate-y-[150%]">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                                <span className="absolute inset-0 flex items-center justify-center -rotate-45 -translate-x-[150%] translate-y-[150%] transition-transform duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </span>
                            </span>
                        </div>
                    </motion.button>
                </motion.div>

                <AnimatePresence>
                    {earlyReveal && !isTouchDevice && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                            style={{ y: textY, opacity: textOpacity, willChange: "transform, opacity" }}
                            className="absolute bottom-[6vh] md:bottom-[8vh] right-[6vw] md:right-[4vw] z-[100] hidden md:flex items-center gap-4 pointer-events-none"
                        >
                            <span className="text-xs uppercase tracking-[0.25em] text-[#F8F3E6]/80 font-bold mt-[2px]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Move cursor to explore
                            </span>
                            <div className="w-16 h-[2px] bg-[#F8F3E6]/20 relative overflow-hidden">
                                <motion.div
                                    className="absolute top-0 left-0 h-full w-6 bg-[#F8F3E6]/90"
                                    animate={{
                                        x: [0, 40, 0],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}

// trigger deploy