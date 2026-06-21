# Aditya Portfolio - Dark Mode Theme Reference

This document serves as a historical reference for the dark mode theme used across the Aditya Portfolio website prior to the light theme transition.

## CSS Variables (from globals.css)
The global CSS defined the following core color variables for dark mode:

```css
@theme {
  --color-background: #0A0A0E;
  --color-surface: #13131A;
  --color-surface-light: #1C1C26;
  --color-primary: #FFFFFF;
  --color-muted: #94A3B8;
  --color-accent: #FFC300;
}
```

## Theme Usage

* **Background (`bg-background` / `#0A0A0E`)**:
    * Used as the default body background color.
    * Applied to the main sections of the website, including Hero, Who, Problems, Results, PhysicsThrow, and Footer sections.
    * The RevealLayout component briefly set the document background to `#0A0A0E` after the reveal animation.

* **Surface (`bg-surface` / `#13131A`)**:
    * Used for card backgrounds and elevated elements where a slight contrast against the main background was needed.
    * Specific usage in `WhyInfotainmentWorks` (e.g., `bg-surface/60` for feature cards, `bg-surface` for text badges).

* **Surface Light (`bg-surface-light` / `#1C1C26`)**:
    * Used for lighter elevated areas, hover states, and layered components.
    * Noted usage in `Who` section (glassmorphic panels `bg-surface-light/15`), `ProblemsSection` (cards `bg-surface-light/10`), and `WhyInfotainmentWorks`.

* **Primary Text (`text-primary` / `#FFFFFF`)**:
    * The main text color for maximum contrast against dark backgrounds.

* **Accent (`text-accent`, `bg-accent` / `#FFC300`)**:
    * A vibrant yellow/gold used for highlights, calls to action, gradients, glow effects (e.g., blur in `ResultsSection`), floating CTA buttons, and interactive elements.

* **Muted Text (`text-muted` / `#94A3B8`)**:
    * A slate gray used for secondary text, descriptions, and less prominent information.

## Notable Hardcoded Colors
* `bg-black`: Used heavily in `ThreeDCarousal`, `Home`, `ImpactSection`, `FlyWheelAnimation`, and for the mobile navigation drawer backdrop (`#0A0A0E/95`).
* `#27701B`: A dark green used for button hover transitions (e.g., in `Hero`, `Hero2`, `FloatingCTA`).
* `bg-white/5` to `bg-white/20`: Used extensively for subtle borders, dividers, and glassmorphic card backgrounds.
