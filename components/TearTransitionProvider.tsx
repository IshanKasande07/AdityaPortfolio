"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import "./css/tear-transition.css";

// ─── Types ──────────────────────────────────────────────────
type TearDirection = "tr-bl" | "tl-br" | "bl-tr";

interface TearOptions {
  direction?: TearDirection;
}

interface TearTransitionContextType {
  navigateWithTear: (href: string, options?: TearOptions) => void;
}

const TearTransitionContext = createContext<TearTransitionContextType>({
  navigateWithTear: () => {},
});

export function useTearTransition() {
  return useContext(TearTransitionContext);
}

// ─── Seeded PRNG (mulberry32) ───────────────────────────────
function mulberry32(seed: number) {
  return () => {
    /* eslint-disable no-param-reassign */
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    /* eslint-enable no-param-reassign */
  };
}

// ─── Generate polygon from SVG path ───────────────────────────
// Parses the exact SVG path used in ResultsSection.tsx and maps it to
// a vertical boundary (right edge jittered around x=50%).
// The container it's applied to is 300vmax×300vmax and rotated ~53°.
function generateTearPolygonFromSVG(
  svgPath: string,
  amplitudeScale: number = 0.04,
  tileOffset: number = 0 // 0-1, shifts the starting point of each tile for variety
): string {
  // Extract all L commands: "0.0,24.1" etc.
  const lCommands = svgPath.match(/L\s*([\d.]+),([\d.]+)/g);
  if (!lCommands) return "polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)";

  // The last command is L1200,50. We discard it because it jumps Y to 50,
  // which breaks the seamless tiling with the next tile's start (Y=24.1).
  lCommands.pop();

  const edgePoints: { xPct: number; yPct: number }[] = [];
  
  // The transition container is 300vmax (huge).
  // The original SVG was designed for 100vw (1200 units).
  // To prevent the zig-zags from being stretched horizontally, we tile the path 4 times.
  const numTiles = 4;
  const tileHeightPct = 100 / numTiles;

  // tileOffset shifts the starting index into the commands array,
  // so a different section of the SVG path leads each tile.
  const offsetIdx = Math.floor(tileOffset * lCommands.length);

  for (let t = 0; t < numTiles; t++) {
    for (let i = 0; i < lCommands.length; i++) {
      const cmd = lCommands[(i + offsetIdx) % lCommands.length];
      const parts = cmd.substring(1).split(",");
      const svgX = parseFloat(parts[0]);
      const svgY = parseFloat(parts[1]);

      // SVG x (0 to 1200) maps to local tile y (0% to tileHeightPct)
      const localYPct = (i / lCommands.length) * tileHeightPct;
      const yPct = t * tileHeightPct + localYPct;

      // SVG y (~5 to ~40, center is ~25) maps to polygon x (around 50%)
      const xPct = 50 + (svgY - 25) * amplitudeScale;

      edgePoints.push({ xPct, yPct });
    }
  }

  const points: string[] = ["0% 0%"];
  for (const pt of edgePoints) {
    points.push(`${pt.xPct.toFixed(3)}% ${pt.yPct.toFixed(3)}%`);
  }
  points.push("0% 100%");

  return `polygon(${points.join(", ")})`;
}

// ─── Direction-dependent transform values ───────────────────
// "tr-bl" = sweep from top-right to bottom-left (forward):
//   Start: old page overlay covers viewport → translate in "covering" direction
//   End:   old page overlay swept off-screen
//
// The polygon clips the LEFT half of the 300vmax container.
// Rotated -53°, the "filled" left half becomes the lower-left region.
//
// For tr-bl: the overlay starts covering (filled region over viewport, shifted top-right)
// and sweeps to bottom-left (off-screen), revealing from top-right.

const ROTATION_DEG = -53;

function getTransforms(direction: TearDirection) {
  if (direction === "bl-tr") {
    // Reverse sweep: tear sweeps from bottom-left toward top-right.
    // By adding 180 to rotation, the filled half moves to the top-right side.
    return {
      rotation: ROTATION_DEG + 180, // 127
      startTx: 35,
      startTy: 0,
      endTx: -35,
      endTy: 0,
    };
  } else if (direction === "tr-bl") {
    // Forward: tear sweeps from top-right toward bottom-left.
    return {
      rotation: ROTATION_DEG,
      startTx: 35,
      startTy: 0,
      endTx: -35,
      endTy: 0,
    };
  } else {
    // Fallback (tl-br)
    return {
      rotation: -ROTATION_DEG, // 53
      startTx: -35,
      startTy: 0,
      endTx: 35,
      endTy: 0,
    };
  }
}

function makeTransformStr(
  rotation: number,
  tx: number,
  ty: number
): string {
  return `rotate(${rotation}deg) translate(${tx}%, ${ty}%)`;
}

// ─── Constants ──────────────────────────────────────────────
const TEAR_DURATION_MS = 3600;
const CORE_OFFSET_PX = 24;
// Gap between leading edge and trailing edge (as % of the 300vmax container).
// 8% of 300vmax ≈ 24vmax — large enough to see the grey zone clearly.
const GAP_PCT = 8;
// Amber strip is a narrower offset behind the grey zone
const AMBER_OFFSET_PCT = 0.3;

// ─── Provider Component ─────────────────────────────────────
export default function TearTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAnimating = useRef(false);
  const [overlayState, setOverlayState] = useState<{
    active: boolean;
    animating: boolean;
    direction: TearDirection;
  }>({ active: false, animating: false, direction: "tr-bl" });

  // Exact path data from ResultsSection.tsx (shared between both polygons)
  const exactSVGPath = "M0,50 L0.0,24.1 L6.0,26.9 L12.0,24.5 L18.0,25.5 L24.0,26.2 L30.0,29.2 L36.0,32.2 L42.0,31.5 L48.0,34.3 L54.0,36.6 L60.0,38.9 L66.0,39.6 L72.0,40.1 L78.0,40.2 L84.0,39.2 L90.0,39.3 L96.0,39.1 L102.0,38.6 L108.0,37.9 L114.0,36.7 L120.0,37.0 L126.0,37.7 L132.0,39.4 L138.0,40.9 L144.0,40.9 L150.0,41.4 L156.0,38.4 L162.0,36.0 L168.0,35.3 L174.0,33.8 L180.0,34.0 L186.0,33.6 L192.0,34.4 L198.0,31.9 L204.0,32.0 L210.0,30.5 L216.0,30.2 L222.0,26.6 L228.0,24.0 L234.0,21.2 L240.0,22.2 L246.0,19.3 L252.0,18.4 L258.0,18.9 L264.0,19.9 L270.0,18.5 L276.0,18.2 L282.0,20.0 L288.0,20.8 L294.0,20.7 L300.0,19.3 L306.0,17.3 L312.0,16.7 L318.0,20.4 L324.0,23.4 L330.0,22.6 L336.0,25.2 L342.0,23.3 L348.0,24.3 L354.0,25.9 L360.0,25.4 L366.0,25.9 L372.0,26.9 L378.0,30.0 L384.0,30.7 L390.0,31.0 L396.0,32.9 L402.0,33.5 L408.0,32.8 L414.0,32.9 L420.0,34.7 L426.0,36.0 L432.0,35.6 L438.0,36.0 L444.0,34.0 L450.0,31.7 L456.0,33.9 L462.0,35.0 L468.0,32.8 L474.0,31.4 L480.0,33.0 L486.0,29.7 L492.0,29.5 L498.0,30.1 L504.0,26.5 L510.0,25.4 L516.0,22.5 L522.0,20.4 L528.0,18.2 L534.0,15.1 L540.0,15.5 L546.0,14.3 L552.0,15.1 L558.0,16.6 L564.0,18.6 L570.0,20.1 L576.0,20.8 L582.0,22.5 L588.0,24.2 L594.0,23.9 L600.0,24.0 L606.0,22.2 L612.0,23.7 L618.0,21.2 L624.0,22.2 L630.0,22.6 L636.0,22.7 L642.0,24.4 L648.0,24.6 L654.0,25.5 L660.0,25.9 L666.0,25.7 L672.0,26.6 L678.0,27.4 L684.0,26.3 L690.0,28.3 L696.0,28.5 L702.0,30.5 L708.0,32.7 L714.0,35.2 L720.0,36.1 L726.0,33.7 L732.0,32.7 L738.0,33.5 L744.0,31.6 L750.0,34.4 L756.0,36.7 L762.0,36.4 L768.0,36.5 L774.0,36.4 L780.0,33.4 L786.0,30.2 L792.0,28.8 L798.0,28.0 L804.0,25.0 L810.0,25.0 L816.0,25.5 L822.0,22.5 L828.0,21.9 L834.0,18.3 L840.0,16.0 L846.0,18.2 L852.0,14.9 L858.0,14.0 L864.0,14.2 L870.0,15.8 L876.0,13.4 L882.0,13.7 L888.0,14.7 L894.0,15.2 L900.0,14.9 L906.0,15.2 L912.0,15.4 L918.0,14.2 L924.0,13.7 L930.0,16.3 L936.0,18.7 L942.0,16.9 L948.0,19.1 L954.0,20.0 L960.0,18.5 L966.0,17.9 L972.0,18.9 L978.0,18.4 L984.0,21.2 L990.0,24.4 L996.0,28.1 L1002.0,30.1 L1008.0,29.1 L1014.0,28.2 L1020.0,31.7 L1026.0,34.1 L1032.0,37.3 L1038.0,36.2 L1044.0,34.1 L1050.0,34.8 L1056.0,35.5 L1062.0,36.8 L1068.0,37.2 L1074.0,38.2 L1080.0,37.1 L1086.0,38.0 L1092.0,36.0 L1098.0,36.0 L1104.0,32.2 L1110.0,30.8 L1116.0,32.1 L1122.0,29.5 L1128.0,30.5 L1134.0,30.9 L1140.0,26.6 L1146.0,24.6 L1152.0,22.8 L1158.0,20.6 L1164.0,20.1 L1170.0,20.6 L1176.0,20.0 L1182.0,20.8 L1188.0,22.4 L1194.0,23.3 L1200.0,24.1 L1200,50 Z";

  // Main polygon for leading (outgoing) and grey edges — no tile offset
  const polygonString = useMemo(() => {
    return generateTearPolygonFromSVG(exactSVGPath, 0.04, 0);
  }, []);

  // Amber polygon — shifted by half a tile so indentations don't align with grey
  const amberPolygonString = useMemo(() => {
    return generateTearPolygonFromSVG(exactSVGPath, 0.04, 0.5);
  }, []);

  const prefersReducedMotion = useRef(false);
  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const navigateWithTear = useCallback(
    (href: string, options?: TearOptions) => {
      // Don't animate if already on the target path (same-page navigation)
      const targetPath = href.split("#")[0] || "/";
      if (targetPath === pathname) {
        router.push(href);
        return;
      }

      // Don't animate if reduced motion or already animating
      if (prefersReducedMotion.current || isAnimating.current) {
        router.push(href);
        return;
      }

      const direction = options?.direction ?? "tr-bl";
      isAnimating.current = true;

      // Step 1: Mount overlay in "covering" position (no transition yet)
      setOverlayState({ active: true, animating: false, direction });

      // Step 2: After two frames (to ensure mount + paint), add transition
      // and change transform to "revealed" position
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Start the visual sweep
          setOverlayState({ active: true, animating: true, direction });

          // Swap the DOM content
          const doNavigation = () => {
            router.push(href);
          };

          if (
            typeof document !== "undefined" &&
            "startViewTransition" in document
          ) {
            // Use View Transitions for clean DOM swap timing
            try {
              (document as any).startViewTransition(() => {
                doNavigation();
                return new Promise<void>((resolve) =>
                  setTimeout(resolve, 50)
                );
              });
            } catch {
              doNavigation();
            }
          } else {
            doNavigation();
          }

          // Step 3: Unmount overlay after animation completes
          setTimeout(() => {
            setOverlayState({
              active: false,
              animating: false,
              direction: "tr-bl",
            });
            isAnimating.current = false;
          }, TEAR_DURATION_MS + 150); // small buffer past animation end
        });
      });
    },
    [router, pathname]
  );

  const contextValue = React.useMemo(
    () => ({ navigateWithTear }),
    [navigateWithTear]
  );

  // ── Compute transforms ──────────────────────────────────────
  const transforms = getTransforms(overlayState.direction);
  const currentTx = overlayState.animating ? transforms.endTx : transforms.startTx;
  const currentTy = overlayState.animating ? transforms.endTy : transforms.startTy;

  // Leading edge transform — this one sweeps first
  const leadingTransform = makeTransformStr(
    transforms.rotation,
    currentTx,
    currentTy
  );

  // Trailing edge transform — lags behind the leading edge by GAP_PCT.
  // The gap is along the translate axis, so we offset toward the START.
  // For tr-bl: startTx > endTx, so trailing = currentTx + GAP_PCT
  // For bl-tr: same logic (startTx > endTx due to rotation flip)
  const trailingTx = currentTx + GAP_PCT;
  const trailingTy = currentTy;

  const greyTransform = makeTransformStr(
    transforms.rotation,
    trailingTx,
    trailingTy
  );

  // Amber core sits just slightly behind the grey zone
  const amberTx = trailingTx + AMBER_OFFSET_PCT;
  const amberTransform = makeTransformStr(
    transforms.rotation,
    amberTx,
    trailingTy
  );

  return (
    <TearTransitionContext.Provider value={contextValue}>
      {children}

      {/* ── Tear Overlay ──────────────────────────────────── */}
      {overlayState.active && (
        <div
          className={`tear-overlay${overlayState.animating ? " tear-animating" : ""}`}
          aria-hidden="true"
        >
          {/* Layer 3: Core (amber) strip — sits just behind grey zone */}
          <div
            className="tear-shape tear-core"
            style={{
              clipPath: amberPolygonString,
              transform: amberTransform,
              marginLeft: `calc(-150vmax + ${CORE_OFFSET_PX}px)`,
            }}
          />

          {/* Layer 2: Grey desaturated zone — fills the gap between edges */}
          <div
            className="tear-shape tear-grey"
            style={{
              clipPath: polygonString,
              transform: greyTransform,
            }}
          />

          {/* Layer 1: Leading edge (outgoing/old page) — on top, sweeps first */}
          <div
            className="tear-shape tear-outgoing"
            style={{
              clipPath: polygonString,
              transform: leadingTransform,
            }}
          />
        </div>
      )}
    </TearTransitionContext.Provider>
  );
}
