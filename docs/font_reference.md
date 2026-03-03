# Original Font Usage Reference

> Original font stack before any changes in this session.

## Font Stack

| CSS Variable | Font | Provider |
|---|---|---|
| `--font-display` | **Clash Display** | Fontshare CDN |
| `--font-sans` | **Inter** | next/font/google |
| `--font-mono` | **Space Mono** | next/font/google |
| `--font-serif` | **Playfair Display** | (CDN, italic accents only) |

---

## Where Each Font Was Used

### Clash Display (`font-display` class)
All major headings and prominent brand text:

| Component | Element | Text |
|---|---|---|
| `Hero.tsx` | `<h1>` | "We Help Brands Win by Educating the Internet." |
| `Navbar.tsx` | Brand logo link | "MONARCH MEDIA HOUSE" |
| `WhyInfotainmentWorks.tsx` | `<h2>` | "Why Infotainment Works" |
| `WhyInfotainmentWorks.tsx` | `<h3>` | Card labels — "Attention", "Authority", "Trust", "Demand" |
| `ProblemsSection.tsx` | Section heading | Problems section main title |
| `Who.tsx` | `<h2>` | "Which brands is this for?" centre heading |
| `Who.tsx` | Point text `<p>` | All 8 bullet point texts (for/not-for) |
| `Contact.tsx` | `<h2>` | "Turn Your Expertise Into Influence." |
| `Footer.tsx` | Brand name `<div>` | "MONARCH MEDIA HOUSE" |

---

### Inter (`font-sans` / default body)
All paragraph text, descriptions, sub-headings without `font-display` or `font-mono`:

| Component | Element | Text |
|---|---|---|
| `Hero.tsx` | `<p>` subtitle | "Infotainment-led social content that builds authority…" |
| `WhyInfotainmentWorks.tsx` | `<p>` | "Anyone can entertain. Anyone can educate…" |
| `Contact.tsx` | `<p>` | "Ready to build absolute authority…" |
| `Contact.tsx` | Input values | Form field input text |
| `ProblemsSection.tsx` | Body copy | Supporting descriptions |
| `Footer.tsx` | Copyright `<p>` | "© 2026 Monarch Media House" |

---

### Space Mono (`font-mono` class)
Small uppercase tracking labels, eyebrows, utility text:

| Component | Element | Text |
|---|---|---|
| `Contact.tsx` | Form field labels | "Name", "Email", "Company", "Phone Number", "Project Brief" |
| `Contact.tsx` | Footer note | "We reply to all applications within 48 hours." |
| `WhyInfotainmentWorks.tsx` | Action word pills | "Builds", "Earns", "Creates" |
| `ProblemsSection.tsx` | Eyebrow labels | Small muted uppercase tags above cards |

---

### Playfair Display (`font-serif` class)
Italic accent words only:

| Component | Element | Text |
|---|---|---|
| `Hero.tsx` | `<span>` inside h1 | *"Educating"* (italic gold accent word) |
