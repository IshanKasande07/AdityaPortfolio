# Monarch Media House — Design, Story, and Interaction Guide

This file is the design source of truth for future work in this repository. Treat it as a **continuation guide**, not a generic set of UI preferences: additions and edits must preserve the current visual world, narrative pacing, and sense of controlled premium craft.

## Project in one sentence

Monarch Media House is an **infotainment-first creative agency** that helps expert-led brands turn valuable knowledge into attention, authority, trust, demand, and long-term growth. The site should make that proposition feel like a considered journey upward—not a loud, trend-chasing agency pitch.

## The intended feeling

- **Cinematic, grounded, and quietly ambitious.** The user enters a natural world of mountains, clouds, bridges, forest, mist, sunlight, and open horizons.
- **Premium control over visual noise.** Motion and detail should feel intentional, heavy, and well damped—not playful, bouncy, or ornamental.
- **Human expertise meeting scalable distribution.** Nature imagery expresses clarity, discovery, elevation, and long-term growth; editorial typography and precise UI keep the experience contemporary and credible.
- The voice is direct and confident, occasionally conversational (“Real talk”, “We cook differently”), but never hollow or hyperbolic. It earns authority through the logic of education and evidence.

## Visual identity

### Palette

Use the design tokens from `app/globals.css`; do not revive the historical dark theme documented in `dark_mode_reference.md`.

| Role | Token / value | Use |
| --- | --- | --- |
| Canvas | `--color-background` / `#F8F3E6` | The dominant warm cream: daylight, paper, openness. |
| Alternate ground | `--color-background-alt` / `#E1D8C4` | Quiet tonal shifts only. |
| Atmosphere | `--color-mist` and `--color-mountain` | Haze, distance, sky, and supporting depth. |
| Anchor | `--color-primary` / `#11250E` | Deep forest for primary type, structure, rich contrast, and dark panels. |
| Secondary | `--color-muted` / `#524E38` | Supporting copy; keep it readable but visually recessive. |
| Signal | `--color-accent` / `#89A236` | Sunlit foliage: emphasis, progress, active states, rules, and primary CTAs. |

The core contrast is **warm cream + deep forest + restrained foliage green**. Use bright white sparingly, mostly on forest panels. Avoid introducing unrelated saturated colors; orange/red only appears as a very limited warm endpoint in a few existing decorative gradients, never as a new primary brand color.

### Surfaces, shape, and texture

- Prefer generous rounded rectangles and pills: hero/card corners are typically 16–32px; major footer and editorial containers may reach 40–60px. Use shape to soften the experience, not to make it toy-like.
- Cards are airy, low-contrast, and tactile: cream or translucent forest surfaces, hairline forest borders (`primary/10` to `primary/20`), soft shadows, and occasional backdrop blur.
- Use small, restrained grain/noise, mist, radial glows, and subtle gradient fades to remove digital flatness. Texture is atmospheric, never content-bearing or high contrast.
- Keep the centered content measure around the established `max-w-[1070px]` rhythm unless a full-bleed storytelling image deliberately needs to break it.

## Typography and hierarchy

### Type families

- **Display / editorial:** `Tiempos Headline` (`--font-tiempos-headline`). Use for cinematic, high-emotion display statements and italic emphasis. It carries the brand’s literary, crafted voice.
- **Sans / utility:** `Space Grotesk` (`--font-space-grotesk`). This is the default for navigation, body copy, labels, controls, metrics, and services. It supplies precision and modernity.
- Do not introduce a third typeface casually. `font-display`, `font-sans`, and `font-mono` currently resolve to the Space Grotesk system in global tokens; apply Tiempos explicitly where the editorial contrast matters.

### Hierarchy rules

- Headings are large, tight, and concise. Display type normally uses `leading` around 1.0–1.15 and tight tracking. Let the composition create impact rather than excessive weight or all-caps.
- Make one word or phrase the emotional focal point through **Tiempos italic + accent green**. Examples: “Build Narratives”, “door”, “ignore”, “Speak”, “authority”. Do not accent every phrase.
- Eyebrows, counters, labels, and metadata are small, uppercase, widely tracked (`~0.15–0.30em`), and lower contrast. They should frame the message, not compete with it.
- Body copy is calm, breathable, and short enough to scan. Use muted color and generous line-height; use primary-weight fragments only to emphasize the proof or outcome.
- Use metrics, numbers, and project labels as evidence—not decoration.

## Deliberate spacing and composition

- Give important sections room to arrive: home sections commonly use `py-24` through `py-40` on desktop, with responsive reductions on mobile. Do not compress the page into a dense marketing sheet.
- Within a section, preserve a clear three-level rhythm: small label-to-heading gap, moderate heading-to-supporting-copy gap, then a larger breathing gap before the next content unit.
- Use asymmetry with intention: split text/image compositions, sticky explanatory panels beside scrolling content, wide empty sky around a statement, and framed full-width scenes are all part of the language.
- Every full-bleed or high-density moment needs a quiet transition before or after it. Let cream space, a fade, a curved boundary, mist, or a rounded frame reset the eye.
- Desktop compositions may be immersive and viewport-led; mobile must retain the narrative order and breathing room, but should avoid expensive hover-only or pinned behavior.

## Images as design elements

- Photography and generated imagery are not stock filler. They establish the world and often do narrative work: the mountain bridge is the journey/connection metaphor; the door on the hill is possibility; forest light signals attention and growth; founder portraits humanize the agency; the work grid is evidence.
- Favor imagery with an editorial, cinematic grade: sunlit greens, soft cream highlights, mist, depth, gentle film grain, and composed negative space for copy.
- Build images into the layout: crop decisively, use rounded masks, gradients, cream fades, occasional saturation lift, and layered depth. Avoid placing a plain rectangular image beside text without a compositional reason.
- Preserve the hero as a layered landscape—sky, mountains, bridge, cloud, and foreground move at distinct depths. This is the visual signature of the homepage.
- Logos appear as monochrome/light marks inside dark, restrained carousel cards; their role is social proof, not a colorful logo wall.

## Buttons and small components

- Primary actions are foliage-green rounded pills with dark text. On hover, a deep forest fill rises vertically and the text reverses to light. The arrow is part of the action and may swap/slide rather than merely jump.
- Secondary actions should be quiet outline or glass-like pills with forest borders, soft blur, and accent-color hover text—not heavy filled buttons.
- Maintain the compact, precise control language: small labels, good horizontal padding, icon-and-label pairing, hairline borders, and springy-but-controlled active states.
- The persistent “Book a Call” control is a conversion anchor. Keep it centered at the bottom and allow it to transform into the contact drawer through the existing arrow-flight/trail choreography.
- Inputs are editorial and minimal: transparent fields, a thin baseline, and an accent underline that expands on focus. Do not replace them with bulky boxed form controls.
- On fine-pointer devices, interactive items participate in the custom cursor system (`data-cursor-hover` where appropriate). Never remove the native cursor on touch/coarse-pointer devices.

## Animation and micro-interaction doctrine

### Motion principles

- Motion explains depth, sequence, or response. It must never be present merely to advertise that the site can animate.
- The tempo is smooth and cinematic: use long-ish, eased entrances (roughly 0.6–1.5s), controlled scroll scrubbing, and spring damping around 20+ for interactive movement.
- Favor reveal, drift, parallax, mask/clip transitions, line drawing, and opacity/scale changes. Avoid elastic bounce, rapid looping attention grabs, and simultaneous competing effects.
- Keep no more than two visually active depth systems in a viewport at once. Motion should support reading, not make reading difficult.
- Respect the existing library split: GSAP/ScrollTrigger for pinned or scrubbed scroll narratives; Framer Motion for local component state, entrance, hover, and mouse presence. Do not apply competing transform controllers to the same element.

### Existing signature interactions to preserve

- **Opening:** preload critical imagery, then reveal the homepage from a small pill-shaped aperture into a cream-framed landscape. The opening should feel like entering a world.
- **Hero:** layered parallax responds subtly to scroll and pointer movement; display words reveal in sequence; the CTA has a small magnetic response and arrow transition.
- **Manifesto:** the statement resolves character by character as it is read; the open-door image reinforces the promise.
- **Credibility:** client logos glide continuously but pause when out of view or hovered; do not use noisy marquees.
- **Method and services:** connecting lines draw, sequential cards focus, and sticky panels let the user move through an argument instead of skimming a list.
- **Contact:** emphasized words receive gentle color/scale feedback and guide ambient glows; the desktop visual remains sticky while the form is practical and readable.
- **People and work:** founder portraits crossfade on hover; work cards reveal detail with slow image zoom; active tabs and service icons use compact spring transitions.

## Page story

The homepage must read in this order:

1. **Arrival / proposition:** enter the Monarch landscape. “Why just create content? — Build Narratives.” Attention is valuable and can be mined with intent.
2. **Belief:** “Open the door to marketing the internet can’t ignore.” Explain the agency’s combination of strategy, content, social, and growth.
3. **Proof of trust:** introduce respected client brands without interrupting the editorial mood.
4. **Method:** show the chain **Attention → Authority → Trust → Demand**. This is the intellectual heart of the brand: education and entertainment together create durable demand.
5. **Capability:** present the full-stack creative services as tools in a coherent system, not disconnected agency offerings.
6. **Results:** substantiate the promise with outcomes, charts, and performance signals.
7. **Conversion:** invite the visitor to turn expertise into influence, with an accessible strategy-call form and an assertive, human “we do it differently” message.
8. **Closing signature:** return to the landscape in the footer and restate the authority proposition.

Supporting routes continue this story:

- **Work:** an exhibition/gallery of short-form work, long-form narratives, and graphics—proof that the craft moves people and performs.
- **About:** the humans behind Monarch, its creative energy, focused direction, and “infotainment first” philosophy.
- **Contact:** the decisive conversion chapter; honest copy, practical form, and an optimistic mountain-workspace image make partnership feel possible and personal.

## Content and implementation guardrails

- Write toward education, clarity, narrative craft, authority, consistent distribution, and durable growth. Avoid empty claims about virality, disruption, or being “the best.”
- Pair an emotional promise with a concrete mechanism or proof point wherever possible.
- Keep accessibility intact: meaningful image `alt` text for content images, empty `alt` for decorative layers, keyboard-usable controls, visible focus treatment, and responsive layouts. Motion should remain restrained enough to be tolerable; do not add auto-playing visual chaos.
- Preserve loading and performance discipline. Critical hero layers are intentionally preloaded and deferred below-fold sections protect the opening animation. Animate transforms/opacity where possible, pause offscreen infinite animation, and do not add dependencies for effects already achievable with GSAP, Framer Motion, or CSS.
- Historical files and unused components contain earlier dark-mode experiments. Follow the active application tokens, assets, and components rather than copying their old palette or behavior.

## Decision test for future changes

Before shipping a visual change, ask:

1. Does this make Monarch feel more like a deliberate ascent toward authority?
2. Does it strengthen one clear focal point rather than add another competing one?
3. Does the interaction communicate feedback, depth, or story—and remain calm at rest?
4. Does it preserve the cream / forest / foliage world and the editorial-vs-technical type contrast?
5. Would the page still feel generous, legible, and intentional with the animation paused?

If any answer is no, revise or omit the change.
