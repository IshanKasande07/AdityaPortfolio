---
name: Monarch Media House
description: A cinematic editorial system that turns expertise into authority through a refined natural world.
colors:
  warm-daylight: "#F8F3E6"
  quiet-parchment: "#E1D8C4"
  highland-mist: "#DDE6EA"
  distant-mountain: "#9CB6C4"
  deep-forest: "#11250E"
  mid-forest: "#435D20"
  rocky-muted: "#524E38"
  sunlit-foliage: "#89A236"
typography:
  display:
    fontFamily: "Tiempos Headline, Georgia, serif"
    fontSize: "clamp(3rem, 8vw, 7.2rem)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Tiempos Headline, Georgia, serif"
    fontSize: "clamp(2.25rem, 5vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Space Grotesk, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  control: "12px"
  frame-sm: "16px"
  frame-md: "24px"
  frame-lg: "32px"
  feature: "40px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
  section-sm: "96px"
  section-lg: "160px"
components:
  button-primary:
    backgroundColor: "{colors.sunlit-foliage}"
    textColor: "{colors.deep-forest}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-primary-hover:
    backgroundColor: "{colors.deep-forest}"
    textColor: "{colors.warm-daylight}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "16px 32px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.deep-forest}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  nav-pill:
    backgroundColor: "transparent"
    textColor: "{colors.deep-forest}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "8px 24px"
  input-editorial:
    backgroundColor: "transparent"
    textColor: "{colors.deep-forest}"
    typography: "{typography.body}"
    rounded: "0px"
    padding: "10px 0"
  card-editorial:
    backgroundColor: "{colors.warm-daylight}"
    textColor: "{colors.deep-forest}"
    rounded: "{rounded.frame-lg}"
    padding: "32px"
---

# Design System: Monarch Media House

## Overview

**Creative North Star: "The Editorial Wilderness"**

Monarch lives in an editorial wilderness: a cultivated natural world of mountains, forest, mist, bridges, sunlight, and open horizons. The atmosphere is cinematic and quietly ambitious, but never untamed. Generous cream space and precise typographic framing give every image, statement, and interaction the feeling of a considered ascent.

The system pairs literary emotion with technical control. Tiempos Headline carries the high-emotion moments, while Space Grotesk makes navigation, evidence, forms, and supporting copy feel contemporary and exact. Components are refined and restrained: soft silhouettes, hairline structure, ambient depth, and motion that reveals sequence or physical response without becoming playful.

**Key Characteristics:**

- Warm, daylight-led canvases anchored by deep forest contrast.
- Cinematic landscape imagery composed as narrative infrastructure, not stock decoration.
- Editorial serif focal phrases inside an otherwise precise sans-serif system.
- Generous pacing, asymmetric storytelling, and calm transitions between dense moments.
- Tactile pills and framed surfaces with restrained blur, grain, and ambient depth.

## Colors

The palette feels like sunlight passing through a highland forest: warm paper at the surface, cool atmospheric distance, and concentrated green signals.

### Primary

- **Deep Forest** (`deep-forest`): The structural anchor for body text, dark panels, navigation states, and high-contrast framing.
- **Sunlit Foliage** (`sunlit-foliage`): The scarce signal for primary actions, progress, emphasized words, and active states.

### Secondary

- **Mid Forest** (`mid-forest`): Supporting foliage depth, subdued green surfaces, and the darker side of restrained decorative transitions.

### Tertiary

- **Highland Mist** (`highland-mist`): Atmospheric separation, cloud tones, and quiet supporting depth.
- **Distant Mountain** (`distant-mountain`): Recessive landscape structure and cool haze.

### Neutral

- **Warm Daylight** (`warm-daylight`): The dominant canvas and the light text color on forest surfaces.
- **Quiet Parchment** (`quiet-parchment`): Alternate section ground and subtle tonal resets.
- **Rocky Muted** (`rocky-muted`): Supporting copy and metadata that should recede without losing legibility.

### Named Rules

**The Canopy Rule.** Deep Forest and Warm Daylight establish the world; Sunlit Foliage is a controlled break in the canopy, not a fill color for every surface.

**The Atmospheric Distance Rule.** Mist and mountain tones create depth or separation only. They do not compete with the primary forest-and-cream hierarchy.

## Typography

**Display Font:** Tiempos Headline (with Georgia and serif fallbacks)  
**Body Font:** Space Grotesk (with Arial and sans-serif fallbacks)  
**Label/Mono Font:** Space Grotesk (with monospace fallback where code-like utility treatment is required)

**Character:** Tiempos makes the brand feel authored, human, and cinematic; Space Grotesk keeps the system credible, direct, and operational. Their contrast is strongest when the serif is reserved for emotional focal points rather than applied indiscriminately.

### Hierarchy

- **Display** (medium, fluid oversized scale, tight leading): Hero propositions and cinematic statements; usually one short phrase per line.
- **Headline** (medium, fluid large scale, tight leading): Section openings, portfolio narratives, and conversion statements.
- **Title** (medium, compact line height): Card titles, service names, and evidence-led subheads.
- **Body** (regular, readable line height): Supporting explanations, generally kept to a calm measure of roughly 55–72 characters.
- **Label** (semibold, wide tracking, uppercase): Eyebrows, counters, metadata, tabs, and proof markers.

### Named Rules

**The One Poetic Voice Rule.** Give one word or phrase the emotional spotlight through Tiempos italic and Sunlit Foliage; the surrounding sentence stays composed.

**The Quiet Evidence Rule.** Labels and metrics are small, widely tracked, and exact. They frame proof without shouting over the story.

## Layout

The recurring desktop content measure is a centered 1070px container with 64px horizontal insets; mobile reduces those insets to 24px. Important sections breathe with roughly 96–160px vertical spacing, and dense or full-bleed storytelling moments are buffered by cream space, mist, fades, or rounded framing.

Composition favors intentional asymmetry: sticky explanations beside scrolling content, landscape scenes with negative space for copy, split editorial layouts, and wide statement fields. Twelve-column grids appear in evidence-heavy areas such as the bento layout, while narrative sections can break the central measure when imagery needs to become environmental.

At the 768px breakpoint, multi-column structures collapse into a single narrative sequence, large paddings contract, and hover- or pin-dependent storytelling yields to readable flow. The mobile order must preserve the argument even when the desktop composition changes materially.

**The Clearing Rule.** Every immersive or information-dense scene needs a quiet visual clearing before or after it.

**The Ascent Rule.** Page rhythm should feel like progressive elevation: proposition, belief, proof, method, capability, results, conversion, and a final return to landscape.

## Elevation & Depth

Depth is layered rather than glossy. Tonal separation, translucent cream or forest surfaces, decisive image crops, mist, and restrained backdrop blur do most of the work. Shadows are ambient and low-opacity at rest; stronger shadows belong to hovered work, featured media, floating controls, or clearly elevated overlays.

### Shadow Vocabulary

- **Navigation Haze** (`0 4px 24px rgba(17, 37, 14, 0.08)`): A soft lift beneath glass-like navigation pills.
- **Editorial Lift** (`0 8px 32px rgba(17, 37, 14, 0.08)`): Quiet separation for restrained cards and badges.
- **Media Float** (`0 20px 50px rgba(17, 37, 14, 0.10)`): Framed featured work and presentation surfaces.
- **Deep Feature** (`0 20px 60px -15px rgba(17, 37, 14, 0.30)`): Phone mockups, hero media, or isolated high-focus objects only.

### Named Rules

**The Ambient-First Rule.** At rest, depth should feel like atmosphere around an object, never a hard drop shadow pasted beneath it.

**The Two-Depth Rule.** Keep no more than two visually active depth systems in one viewport so motion and layering continue to support reading.

## Shapes

The form language moves from compact 12–16px control corners to 24–32px editorial frames, with 40–60px reserved for major media or deliberately expressive silhouettes. Pills are used for navigation, actions, tabs, and compact proof markers. Hairline Deep Forest borders at low opacity provide structure without turning surfaces into boxes.

Images are clipped decisively into soft frames and may use asymmetric corner treatments when the composition benefits. Large rounded forms should feel architectural and landscape-like, never toy-like.

**The Soft Structure Rule.** Radius softens substantial editorial surfaces; it does not excuse nesting rounded cards inside rounded cards.

## Components

### Buttons

- **Shape:** Full pill silhouette with compact, balanced horizontal padding.
- **Primary:** Sunlit Foliage with Deep Forest text and an arrow integrated into the action.
- **Hover / Focus:** A Deep Forest layer rises vertically, text reverses to Warm Daylight, and the arrow slides or swaps. Keyboard focus remains visibly outlined; press feedback compresses to approximately 97% scale.
- **Secondary / Ghost:** Transparent or softly blurred pills with a low-opacity Deep Forest border; hover either shifts the text to Sunlit Foliage or fills with Deep Forest.

### Chips

- **Style:** Compact pill group on a transparent, blurred shell with a hairline border.
- **State:** The selected tab receives a moving Deep Forest capsule with Warm Daylight text; unselected labels remain muted and sharpen on hover.

### Cards / Containers

- **Corner Style:** Editorial frames generally use the 24–32px range; featured media may reach 40px.
- **Background:** Warm cream, translucent cream, or Deep Forest depending on narrative emphasis.
- **Shadow Strategy:** Flat or lightly lifted at rest; image and work surfaces gain slow zoom and ambient lift on hover.
- **Border:** Deep Forest at approximately 10–20% opacity on light surfaces; white at very low opacity on dark surfaces.
- **Internal Padding:** Usually 24–32px, increasing to 48–64px for major editorial containers.

### Inputs / Fields

- **Style:** Transparent, square-edged fields with small uppercase labels and a single low-opacity baseline.
- **Focus:** A 2px Sunlit Foliage underline expands across the field; the outline is never replaced by a bulky box.
- **Error / Disabled:** Maintain readable text contrast and communicate state without shifting the field geometry.

### Navigation

Desktop navigation uses floating glass-like pill groups with 14px medium-weight labels, low-opacity borders, and soft ambient shadow. The brand mark anchors the left edge while the conversion action anchors the right. Mobile becomes a full-height Deep Forest overlay with large, generously spaced links and a Warm Daylight conversion pill.

### Persistent Conversion Control

The bottom-centered “Book a Call” control is a signature component. Its foliage label and arrow pill behave as one action, respond with controlled magnetic movement on fine pointers, and transform into the contact drawer through the established arrow-flight choreography.

### Landscape Frames

Hero, portfolio, and closing scenes use large rounded or full-bleed masks, composed negative space, low-contrast grain, layered imagery, and restrained parallax. Copy is positioned as part of the scene rather than placed in an unrelated adjacent rectangle.

## Do's and Don'ts

### Do:

- **Do** preserve the Warm Daylight, Deep Forest, and Sunlit Foliage hierarchy across every route.
- **Do** pair an emotional promise with a concrete mechanism, metric, or piece of evidence.
- **Do** use Tiempos italic for one emotional focal phrase while Space Grotesk carries navigation and explanation.
- **Do** let important sections arrive with generous space and give dense moments a quiet transition.
- **Do** animate transforms, opacity, masks, line drawing, and layered depth with smooth, damped timing.
- **Do** retain native cursor behavior on touch and coarse-pointer devices and visible focus treatment for keyboard users.

### Don't:

- **Don't** revive the historical dark theme or turn Deep Forest into the default page canvas.
- **Don't** introduce unrelated saturated colors; limited warm endpoints may appear only inside an established decorative gradient.
- **Don't** use loud trend-chasing agency tropes, empty virality claims, or decorative motion without narrative purpose.
- **Don't** stack multiple competing parallax, pinning, and hover systems in the same viewport.
- **Don't** compress the site into a dense marketing sheet or place uncomposed stock imagery beside copy.
- **Don't** apply elastic bounce, rapid looping attention grabs, heavy boxed inputs, or generic card grids.
