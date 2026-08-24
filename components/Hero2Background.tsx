"use client";

import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, memo } from "react";
import Image from "next/image";
import { useReveal } from "./RevealLayout";
import "./css/reveal-layout.css";

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

interface Hero2BackgroundProps {
    /** Simulates the container scrolling away: 0 → -containerHeight */
    containerScrollY: MotionValue<number>;
    /** Per-layer scroll parallax offsets */
    skyScrollY: MotionValue<number>;
    bridgeBehindY: MotionValue<number>;
    bridgeBottomCloudY: MotionValue<number>;
    bridgeY: MotionValue<number>;
    cloudY: MotionValue<number>;
    mountainsY: MotionValue<number>;
    /** Per-layer mouse parallax offsets */
    skyMouseX: MotionValue<number>;
    skyMouseY: MotionValue<number>;
    bridgeBehindMouseX: MotionValue<number>;
    bridgeBehindMouseY: MotionValue<number>;
    bridgeBottomCloudMouseX: MotionValue<number>;
    bridgeBottomCloudMouseY: MotionValue<number>;
    bridgeMouseX: MotionValue<number>;
    bridgeMouseY: MotionValue<number>;
    cloudMouseX: MotionValue<number>;
    cloudMouseY: MotionValue<number>;
    mountainsMouseX: MotionValue<number>;
    mountainsMouseY: MotionValue<number>;
    /** Combined scroll+mouse Y values per layer */
    combinedSkyY: MotionValue<number>;
    combinedBridgeBehindY: MotionValue<number>;
    combinedBridgeBottomCloudY: MotionValue<number>;
    combinedBridgeY: MotionValue<number>;
    combinedCloudY: MotionValue<number>;
    combinedLeftMountainY: MotionValue<number>;
    combinedRightMountainY: MotionValue<number>;
    /** Whether the device is touch */
    isTouchDevice: boolean;
    /** Whether the poster→real-layer swap has occurred */
    bgSwapped: boolean;
    /** Whether poster is ready to display */
    posterReady: boolean;
    /** Callback when poster generation completes */
    onPosterReady: () => void;
}

function Hero2Background({
    containerScrollY,
    skyScrollY,
    bridgeBehindY,
    bridgeBottomCloudY,
    bridgeY,
    cloudY,
    mountainsY,
    skyMouseX,
    skyMouseY,
    bridgeBehindMouseX,
    bridgeBehindMouseY,
    bridgeBottomCloudMouseX,
    bridgeBottomCloudMouseY,
    bridgeMouseX,
    bridgeMouseY,
    cloudMouseX,
    cloudMouseY,
    mountainsMouseX,
    mountainsMouseY,
    combinedSkyY,
    combinedBridgeBehindY,
    combinedBridgeBottomCloudY,
    combinedBridgeY,
    combinedCloudY,
    combinedLeftMountainY,
    combinedRightMountainY,
    isTouchDevice,
    bgSwapped,
    posterReady,
    onPosterReady,
}: Hero2BackgroundProps) {
    const { revealed, clipPath, clipTransition } = useReveal();
    const layersRef = useRef<HTMLDivElement>(null);
    const posterCanvasRef = useRef<HTMLCanvasElement>(null);

    // During reveal: show poster canvas, hide real parallax layers.
    // After reveal: hide poster, show real layers.
    const showPoster = posterReady && !bgSwapped;
    const layerVisibility = (!posterReady || bgSwapped) ? 'visible' as const : 'hidden' as const;

    // ── Poster trick ─────────────────────────────────────────────
    // Generate a flat canvas snapshot of the parallax layers so the
    // clip-path reveal only clips ONE GPU texture → buttery smooth.
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        if (isMobile) return;

        const container = layersRef.current;
        const canvas = posterCanvasRef.current;
        if (!container || !canvas) return;

        let cancelled = false;

        const generate = async () => {
            const imgs = Array.from(
                container.querySelectorAll<HTMLImageElement>('[data-poster-layer] img')
            );

            const skyImg = new window.Image();
            skyImg.src = '/heroassets/Sky.webp';

            await Promise.all([
                skyImg.decode().catch(() => {}),
                ...imgs.map(img => img.decode().catch(() => {}))
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

                const imgRect = img.getBoundingClientRect();
                const dx = imgRect.left - rect.left;
                const dy = imgRect.top - rect.top;
                const dw = imgRect.width;
                const dh = imgRect.height;

                const isCover = img.classList.contains('object-cover');
                const isContain = img.classList.contains('object-contain');
                const alignY = img.classList.contains('object-bottom') ? 'bottom' :
                               img.classList.contains('object-top') ? 'top' : 'center';

                ctx.save();

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

            if (!cancelled) onPosterReady();
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

    return (
        <motion.div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                clipPath,
                transition: clipTransition,
                y: containerScrollY,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}
        >
            {/* Inner sizing — matches Hero2 foreground dimensions */}
            <div
                ref={layersRef}
                className="relative w-full h-[calc(100vh-72px)] mt-[60px] mb-[12px] rounded-[16px] md:w-[calc(100%-36px)] md:h-[calc(100vh-84px)] md:mt-[66px] md:mb-[18px] md:mx-[18px] md:rounded-[20px] overflow-hidden"
                style={{ contain: "content" }}
            >
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
                <motion.div
                    className="absolute inset-0 z-0 pointer-events-none hero-sky-bg"
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

                {/* ========== LAYER 1: Bridge Behind ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeBehindMouseX,
                        y: isTouchDevice ? bridgeBehindY : combinedBridgeBehindY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "center",
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 z-[10] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/Bridge Behind.webp"
                        alt="Bridge Background"
                        fill
                        priority
                        className="object-cover object-center"
                        draggable={false}
                        sizes="100vw"
                    />
                </motion.div>

                {/* ========== LAYER 1.5: Bridge Bottom Cloud ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeBottomCloudMouseX,
                        y: isTouchDevice ? bridgeBottomCloudY : combinedBridgeBottomCloudY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-x-0 bottom-0 z-[15] hidden md:flex justify-center pointer-events-none"
                >
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
                </motion.div>

                {/* ========== LAYER 2: Bridge ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : bridgeMouseX,
                        y: isTouchDevice ? bridgeY : combinedBridgeY,
                        z: 0.01,
                        scale: 1.05,
                        transformOrigin: "bottom center",
                        height: "102%",
                        top: "2vh",
                        visibility: layerVisibility,
                    }}
                    className="absolute left-0 w-full z-[20] pointer-events-none hidden md:block"
                >
                    <Image
                        src="/heroassets/Bridge.webp"
                        alt="Bridge Overlay"
                        fill
                        priority
                        className="object-cover object-bottom"
                        draggable={false}
                        sizes="100vw"
                    />
                </motion.div>

                {/* ========== LAYER 3: Cloud ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : cloudMouseX,
                        y: isTouchDevice ? cloudY : combinedCloudY,
                        z: 0.01,
                        scale: 1.15,
                        transformOrigin: "center",
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-32 z-[30] pointer-events-none hidden md:block"
                >
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
                </motion.div>

                {/* ========== LAYER 4: Left Mountain ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedLeftMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom left",
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-20 -left-20 z-[40] pointer-events-none hidden md:block"
                >
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
                </motion.div>

                {/* ========== LAYER 4: Right Mountain ========== */}
                <motion.div
                    data-poster-layer
                    style={{
                        x: isTouchDevice ? 0 : mountainsMouseX,
                        y: isTouchDevice ? mountainsY : combinedRightMountainY,
                        z: 0.01,
                        scale: 1.2,
                        transformOrigin: "bottom right",
                        visibility: layerVisibility,
                    }}
                    className="absolute inset-0 -bottom-20 -right-20 z-[40] pointer-events-none hidden md:block"
                >
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
                </motion.div>

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
                            style={{ backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox=\\\\"0 0 200 200\\\\" xmlns=\\\\"http://www.w3.org/2000/svg\\\\"%3E%3Cfilter id=\\\\"noiseFilter\\\\"%3E%3CfeTurbulence type=\\\\"fractalNoise\\\\" baseFrequency=\\\\"0.65\\\\" numOctaves=\\\\"3\\\\" stitchTiles=\\\\"stitch\\\\"/%3E%3C/filter%3E%3Crect width=\\\\"100%25\\\\" height=\\\\"100%25\\\\" filter=\\\\"url(%23noiseFilter)\\\\"/%3E%3C/svg%3E")' }}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default memo(Hero2Background);
