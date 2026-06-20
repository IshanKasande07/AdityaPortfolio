import React from 'react';

interface NoiseDividerProps {
    fromColor?: string;
    toColor?: string;
    height?: string;
    accentOpacity?: number;
}

/**
 * Transition D — "Kinetic Noise Bleed"
 * An animated scrolling noise-texture band with a faint gold glow center line.
 * Pure CSS animation — zero runtime JS cost.
 */
export default function NoiseDivider({
    fromColor = 'var(--color-background)',
    toColor = 'var(--color-background)',
    height = '100px',
    accentOpacity = 0.12,
}: NoiseDividerProps) {
    return (
        <div
            className="w-full relative overflow-hidden pointer-events-none select-none"
            style={{ height, isolation: 'isolate' }}
        >
            {/* Bottom gradient bridge between sections */}
            <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(to bottom, ${fromColor}, ${toColor})` }}
            />

            {/* Scrolling noise texture overlay — same texture as Hero */}
            <div
                className="absolute inset-0 opacity-[0.22] mix-blend-overlay noise-scroll"
                style={{
                    backgroundImage: 'url("data:image/svg+xml;utf8,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E")',
                    backgroundSize: '200px 200px',
                    willChange: 'background-position',
                }}
            />

            {/* Gold glow band at the center of the divider */}
            <div
                className="absolute left-0 right-0 h-[1px]"
                style={{
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(to right, transparent, rgba(255,195,0,${accentOpacity}), rgba(255,87,51,${accentOpacity * 0.8}), transparent)`,
                    boxShadow: `0 0 18px 4px rgba(255,195,0,${accentOpacity * 0.5})`,
                }}
            />

            {/* Very faint secondary glow echo 8px below for depth */}
            <div
                className="absolute left-0 right-0 h-[1px]"
                style={{
                    top: 'calc(50% + 8px)',
                    transform: 'translateY(-50%)',
                    background: `linear-gradient(to right, transparent, rgba(255,195,0,${accentOpacity * 0.4}), transparent)`,
                }}
            />
        </div>
    );
}
