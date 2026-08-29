"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";

/* ── Cloud colors ─────────────────────────────────────────────────
   Subtle cream and beige tones to match the bridge bottom clouds
   and blend perfectly with the surrounding environment palette. */
const CLOUD_COLORS = [
    "#FFFFFF",   // pure white
    "#FDFDFD",   // near white 
    "#FAFAFA",   // snow white
    "#F5F5F5",   // very light gray
    "#F8F9FA",   // ghost white
    "#FFFFFF",   // pure white
];

/**
 * A wrapper around the Drei Cloud component that ties its rotation strictly
 * to the scroll progress, ensuring the animation is scrubbed.
 */
function SpinningCloud({ spinSpeed = 0.1, progressRef, ...props }: any) {
    const ref = useRef<THREE.Group>(null);
    useFrame(() => {
        if (ref.current && progressRef) {
            const p = progressRef.current;
            // Rotation is now completely tied to scroll progress!
            ref.current.rotation.z = (spinSpeed * 20) * p;
            ref.current.rotation.y = (spinSpeed * 10) * p;
        }
    });
    return <Cloud ref={ref} {...props} />;
}

/**
 * Inner scene component — lives inside the R3F Canvas context.
 * Reads cloudProgressRef.current on every frame to drive camera
 * and cloud speed without React re-renders.
 */
function CloudScene({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
    useFrame(({ camera }) => {
        const progress = progressRef.current;

        // Push camera forward: z goes from 5 → -15 over progress 0→1
        // Increased travel distance (20 units) to account for stretching the gap between clouds 1 and 2
        const targetZ = 5 - progress * 20;
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);

        // Slight upward drift as we fly through
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, progress * 2, 0.05);
    });

    // Dynamic speed: starts at 0.05, ramps up to 0.4
    // Note: reads .current each render — React doesn't re-render,
    // but R3F's useFrame runs every frame so the value is fresh.
    const cloudSpeed = 0.15; // constant gentle drift (progress drives camera instead)

    return (
        <Clouds
            material={THREE.MeshBasicMaterial}
            position={[0, 0, 0]}
            frustumCulled={false}
        >
            {/* 1. Cloud 6 (Close Right) - Z=0 */}
            <SpinningCloud progressRef={progressRef}
                seed={7}
                spinSpeed={-0.1}
                segments={1}
                concentrate="outside"
                bounds={[3, 3, 3] as any}
                growth={2}
                position={[4.5, 0, 0]}
                smallestVolume={2}
                scale={1.2}
                volume={6}
                speed={0.1}
                fade={0.1}
                color={CLOUD_COLORS[1]}
                opacity={0.95}
            />

            {/* 2. Cloud 2 (Mid Top-Right) - Z=-4.5 */}
            <SpinningCloud progressRef={progressRef}
                seed={3}
                spinSpeed={-0.08}
                segments={1}
                concentrate="outside"
                bounds={[5, 5, 5] as any}
                growth={2}
                position={[4, 2, -4.5]}
                smallestVolume={2}
                scale={1.0}
                volume={2}
                speed={0.1}
                fade={3}
                color={CLOUD_COLORS[1]}
                opacity={0.85}
            />

            {/* 4. Cloud 1 (Closest Top-Left) - Z=-7.0 */}
            <SpinningCloud progressRef={progressRef}
                seed={1}
                spinSpeed={0.05}
                segments={1}
                concentrate="inside"
                bounds={[5, 5, 5] as any}
                growth={3}
                position={[-5, 2, -7.0]}
                smallestVolume={2}
                scale={1.5}
                volume={2}
                speed={0.2}
                fade={5}
                color={CLOUD_COLORS[0]}
                opacity={0.9}
            />

            {/* 5. Cloud 3 (Mid Center-Left) - Z=-8.5 */}
            <SpinningCloud progressRef={progressRef}
                seed={4}
                spinSpeed={0.06}
                segments={1}
                concentrate="outside"
                bounds={[4, 7, 5] as any}
                growth={4}
                position={[-2, -1.5, -8.5]}
                smallestVolume={2}
                scale={0.8}
                volume={3}
                speed={0.2}
                color={CLOUD_COLORS[4]}
                opacity={0.85}
            />

            {/* 6. Cloud 4 (Far Bottom-Left) - Z=-10.0 */}
            <SpinningCloud progressRef={progressRef}
                seed={5}
                spinSpeed={-0.04}
                segments={1}
                concentrate="outside"
                bounds={[3, 3, 3] as any}
                growth={2}
                position={[-3, -2, -10.0]}
                smallestVolume={2}
                scale={0.8}
                volume={2}
                speed={0.1}
                fade={0.1}
                color={CLOUD_COLORS[3]}
                opacity={0.9}
            />

            {/* 6.5. New Cloud (Top Edge Left-Centered) - Z=-10.0 (Matching Cloud 4) */}
            <SpinningCloud progressRef={progressRef}
                seed={8}
                spinSpeed={0.04}
                segments={1}
                concentrate="inside"
                bounds={[4, 4, 4] as any}
                growth={3}
                position={[-1.5, 7.0, -10.0]} // Moved a little upwards
                smallestVolume={2}
                scale={1.2}
                volume={3}
                speed={0.15}
                fade={3}
                color={CLOUD_COLORS[3]}
                opacity={0.9}
            />

            {/* 7. Cloud 5 (Farthest Bottom-Right) - Z=-14.0 */}
            <SpinningCloud progressRef={progressRef}
                seed={6}
                spinSpeed={0.03}
                segments={1}
                concentrate="outside"
                bounds={[3, 3, 3] as any}
                growth={2}
                position={[3, -3, -14.0]}
                smallestVolume={2}
                scale={1.0}
                volume={6}
                speed={0.1}
                fade={0.1}
                color="#F8F3E6" // Updated from pure white to canvas cream
                opacity={1}
            />

            {/* --- SURROUNDING FILLER / MIST CLOUDS --- */}
            
            {/* Left Border Mist */}
            <SpinningCloud progressRef={progressRef}
                seed={101}
                spinSpeed={0.02}
                segments={1}
                concentrate="outside"
                bounds={[6, 12, 25] as any} // Stretched deep along Z-axis
                growth={4}
                position={[-12, 0, -7]} // Far left, centered in depth
                smallestVolume={1}
                scale={1}
                volume={1.5}
                speed={0.1}
                fade={15} // High fade for misty look
                color={CLOUD_COLORS[0]}
                opacity={0.4} // Low opacity
            />

            {/* Right Border Mist */}
            <SpinningCloud progressRef={progressRef}
                seed={102}
                spinSpeed={-0.02}
                segments={1}
                concentrate="outside"
                bounds={[6, 12, 25] as any}
                growth={4}
                position={[12, 0, -7]} // Far right, centered in depth
                smallestVolume={1}
                scale={1}
                volume={1.5}
                speed={0.1}
                fade={15}
                color={CLOUD_COLORS[1]}
                opacity={0.35}
            />

            {/* Bottom Border Mist */}
            <SpinningCloud progressRef={progressRef}
                seed={103}
                spinSpeed={0.01}
                segments={1}
                concentrate="outside"
                bounds={[25, 6, 25] as any} // Wide along X and Z
                growth={4}
                position={[0, -10, -7]} // Deep bottom
                smallestVolume={1}
                scale={1}
                volume={1.5}
                speed={0.1}
                fade={15}
                color={CLOUD_COLORS[3]}
                opacity={0.4}
            />

            {/* Top Right Border Mist */}
            <SpinningCloud progressRef={progressRef}
                seed={104}
                spinSpeed={-0.01}
                segments={1}
                concentrate="outside"
                bounds={[15, 10, 20] as any} // Wide along X and Z
                growth={4}
                position={[6, 4, -14.0]} // Brought closer into the visible frame
                smallestVolume={1}
                scale={1.5} // Increased scale to make it bigger
                volume={4} // Increased volume for density
                speed={0.1}
                fade={5} // Reduced fade so it doesn't wash out
                color={CLOUD_COLORS[4]}
                opacity={0.85} // Increased opacity
            />

            {/* Start Bottom-Left Border Mist */}
            <SpinningCloud progressRef={progressRef}
                seed={105}
                spinSpeed={0.02}
                segments={1}
                concentrate="outside"
                bounds={[15, 10, 15] as any} // Wide and deep
                growth={4}
                position={[-10, -8, 0]} // Near the very start (Z=0), tucked in bottom-left
                smallestVolume={1}
                scale={1}
                volume={1.5}
                speed={0.1}
                fade={15} // High fade for misty look
                color={CLOUD_COLORS[3]}
                opacity={0.35}
            />
        </Clouds>
    );
}

interface CloudPassageProps {
    /** Ref to scroll progress (0–1), read by Three.js useFrame */
    progressRef: React.MutableRefObject<number>;
}

/**
 * CloudPassage — A volumetric 3D cloud scene that serves as the
 * atmospheric interstitial between the hero bridge zoom-through
 * and the Manifesto section.
 *
 * Rendered inside a R3F Canvas with:
 * - transparent background (sky gradient shows through from parent)
 * - MeshBasicMaterial (no lighting calc = cheap GPU)
 * - progressRef read in useFrame (no React re-renders)
 */
export default function CloudPassage({ progressRef }: CloudPassageProps) {
    return (
        <div
            className="absolute inset-0"
            style={{ pointerEvents: "none" }}
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75, near: 0.01 }} // Prevent hard clipping right at the camera lens
                style={{ background: "#87CEEB" }} // DEBUG: sky blue to identify when clouds are visible
                gl={{
                    antialias: false,
                    alpha: true,
                    powerPreference: "high-performance",
                }}
                dpr={[1, 1.5]}
                frameloop="always"
            >
                <CloudScene progressRef={progressRef} />
            </Canvas>
        </div>
    );
}
