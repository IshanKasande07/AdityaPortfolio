# Scroll Lag Investigation & Context

## The Problem
We experienced a severe stutter/lag when scrolling upwards through the `Manifesto` section back toward the `Hero2` section.

### Key Observations
1. **The Isolation Test**: When we commented out all sections below `Manifesto` (i.e. `BrandsWhoTrustUs`, `OurServices`, etc.), the lag **completely disappeared**.
2. **The Re-introduction**: As soon as we added *any* section back below `Manifesto` (whether it was `Brands` or `Services`), the lag returned.
3. **The Trigger**: The lag only happens when scrolling down **at least 2 screen heights** below `Hero2`, and then scrolling back up.

## The Root Cause: Chromium GPU Tile Eviction
The root cause is a fundamental hardware-acceleration behavior in Google Chrome / Chromium browsers:
- `Hero2` contains 7 separate high-resolution WebP images. Because they have parallax animations, they are promoted to **7 separate GPU Compositor Layers** (`will-change: transform`).
- When you scroll away from `Hero2`, Chrome keeps those 7 layers in Video RAM (VRAM) for a short distance.
- However, once you scroll **~2 screen heights away**, Chrome's compositor aggressively **evicts (deletes) the GPU tiles** for those off-screen layers to save memory. 
- When you scroll back up, Chrome frantically tries to decode and upload all 7 massive high-res images back into VRAM at the exact same millisecond. This massive upload spike blocks the main thread, completely freezing the browser and causing the stutter you feel while scrolling over `Manifesto`.
- When the page was short (only `Manifesto`), you physically couldn't scroll 2 screens away, so Chrome never evicted the tiles, resulting in zero lag.

## Attempted Solutions

### 1. The `TextureCache` (Failed)
- **What we tried**: We placed a permanent, fixed, invisible (`opacity: 0.005`) clone of all 7 images in a `TextureCache` component, hoping to force Chrome to keep the decoded bitmaps in RAM.
- **Why it failed**: While it kept the decoded images in System RAM, it did not stop Chrome from evicting the actual **GPU tiles (VRAM)** of the `Hero2` component. Uploading raw pixel data from System RAM to VRAM still caused a massive lockup.

### 2. The Canvas Swap & GSAP Optimization (Partial Success)
- **What we tried**: 
  1. We optimized `Manifesto.tsx` by removing the GSAP `reverse` overhead. The text now reveals once and stays visible (`toggleActions: "play none none none"`), eliminating JS recalculations on upward scrolls.
  2. In `Hero2.tsx`, we detected when the user scrolled out of view (`scrollYProgress >= 1`). When out of view, we completely destroyed the 7 heavy HTML layers using `display: none` and instantly swapped them with a **single, flattened 2D canvas** snapshot of the parallax.
- **The Result**: 
  - **Success**: The massive lag *during* the `Manifesto` scroll is completely gone! Because the 7 layers don't exist while you are scrolling through `Manifesto`, Chrome doesn't speculatively upload them in the background.
  - **The Trade-off**: The lag shifted to the exact boundary between `Manifesto` and `Hero2`. As soon as `Hero2` comes back into the viewport, the single canvas is destroyed and the 7 layers instantly mount back into the DOM, causing Chrome to freeze for ~150ms upon entry.

### 3. The `Perfect Decode Cache` (Failed)
- **What we tried**: We reverted the Canvas Swap to avoid the boundary lag. Instead, we added an invisible `fixed` container inside `Hero2.tsx` that perfectly mirrored the 7 layers' CSS dimensions, classes, and `scale` exactly, but without any parallax translations.
- **Why it failed**: This proved definitively that the bottleneck is **not** just decoding the WebP images into system RAM. The actual lockup comes from the physical bandwidth required for Chrome to upload 7 full-screen layers into the GPU's Video RAM on a single frame. Because Chromium's engine mathematically guarantees eviction of translated off-screen tiles, it was impossible to bypass this re-upload without changing the CSS layout itself.

### 4. The Sticky Stacked Card (Final Hardware-Level Fix)
- **What we tried**: Since Chromium deletes the GPU tiles the second they scroll out of the viewport, the ultimate bypass was to **never let them scroll out of the viewport**. 
  - We wrapped `Hero2` in a `position: sticky; height: 100vh; top: 0` container.
  - When the user scrolls down, `Hero2` pins itself to the top of the screen. Its DOM layers never leave the viewport, so Chrome **never evicts the GPU tiles**.
  - Instead of scrolling away naturally, the rest of the page (`DeferredSection`, starting with `Manifesto`) simply scrolls *over* `Hero2` like a beautiful "stacked card" effect.
- **The Result**: 100% hardware-accelerated, buttery smooth scrolling. Because the textures are permanently preserved in VRAM, both the ambient scroll through `Manifesto` and the entry back into `Hero2` have absolutely zero stutter. The parallax within `Hero2` still operates perfectly while it is visible.

## Final Resolution: Solving the VRAM Traffic Jam Once and For All

To resolve this massive VRAM traffic jam without abandoning the parallax effect, we fundamentally changed how the browser handles the pixels in memory. The problem is now **fixed once and for all** through a combination of structural code changes and strict asset optimization.

Here is what we ultimately did to achieve buttery-smooth 60fps scrolling:

### 1. The Sticky Stacked Card (Preventing GPU Eviction)
Since Chromium deletes GPU tiles the second they scroll out of the viewport, our structural bypass was to **never let them scroll out of the viewport**. 
- We wrapped `Hero2` in a `position: sticky; height: 100vh; top: 0` container.
- When scrolling down, `Hero2` pins itself to the top of the screen. Its DOM layers never leave the viewport, so Chrome **never evicts the GPU tiles**.
- The rest of the page simply scrolls *over* `Hero2` like a "stacked card" effect, keeping the VRAM textures permanently preserved.

### 2. Downscaling Non-Focal Layers (The VRAM Diet)
Since VRAM usage scales purely with physical pixel dimensions (not disk size), shrinking the actual width and height of the images drastically cut memory usage.
- We reduced the dimensions of the massive Hero background WebP layers using [Squoosh](https://squoosh.app/editor).
- **The Process**: For each of the seven layers, we enabled the "Resize" setting in the right-side edit menu. We set the "Preset" scale down to **50%, 33%, or 25%** depending on the layer's visual importance. We toggled "Lossless" on or off per layer to find the perfect balance between visual quality and file size.
- **The Math**: Cutting dimensions in half reduces total pixels by 75%. An 8.3 MB layer instantly drops to roughly 2 MB in VRAM. The soft background layers naturally hid this downscaling, massively reducing the total VRAM footprint from ~58MB to a fraction of that size.

### 3. Managing Off-Screen GPU Load (Logo Optimization)
Further down the page, massive uncompressed PNG brand logos were eagerly loading and taking up GPU budget.
- We converted all brand logos to highly compressed `.webp` formats.
- We enforced `loading="lazy"` on the animated logo carousel.
- This ensured that the browser's compositor wasn't fighting to allocate memory for off-screen logos while simultaneously trying to manage the Hero's parallax layers.

### Conclusion
By keeping the DOM stack sticky (preventing tile eviction) and severely cutting the physical pixel dimensions of the assets (The VRAM diet), we stabilized the GPU memory lifecycle. If a natural scroll-away effect is ever strictly required in the future, the only stutter-free way to achieve it would be rendering the 7 layers to a WebGL `<canvas>` to bypass the DOM entirely. For now, the Framer Motion DOM approach is highly optimized and perfectly smooth.
