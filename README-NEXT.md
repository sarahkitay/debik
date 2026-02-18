# Deborah Kitay Therapy — Next.js App

High-end therapy site built as a "digital holding environment" per the implementation brief.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Design system

- **Colors:** Antique Paper `#F5F1E8`, Deep Warm Charcoal `#2C2823`, Library Green `#7A8B7F`, Soft Terracotta `#D4A896`, Oxblood `#A65E4D`, Ivory `#FFFDF7`
- **Typography:** Display (Cormorant Garamond), Body (Inter), Labels (EB Garamond Italic 11px, 0.15em tracking)
- **Layout:** Max 1280px, 32px gutters, 120px section spacing (80px mobile)
- **Dark mode:** `prefers-color-scheme: dark` supported via CSS variables

## Structure

- **Navigation:** Relational labels (Begin Here, How I Work With You, Practical Questions, Reach Out); transparent → 95% blur on scroll
- **Hero:** Two-layer (recognition line → anchor/credentials after 800ms); soft CTA; scroll indicator with pulse
- **Resonance:** “This work might resonate if…” — poetry layout, fade-up stagger
- **Meet Debi:** 40/60 grid, portrait + copy
- **Modalities:** Accordion with 4px left border when open, 450ms cubic-bezier
- **Final CTA:** Elevated card, invitation line + primary CTA

## Content updates

- **Copy:** Edit `components/Hero.tsx`, `ResonanceCards.tsx`, `MeetDebi.tsx`, `Accordions.tsx`, `FinalCTA.tsx`
- **Nav labels/links:** `components/Navigation.tsx` — `navLinks` and anchor IDs (`#begin`, `#how-i-work`, `#practical`, `#reach-out`)
- **Design tokens:** `app/globals.css` (`:root`) and `tailwind.config.ts`

## Optional enhancements (brief)

- **Magnetic CTA:** Add a wrapper that moves the nav CTA slightly toward cursor (20px radius); see comments in `Navigation.tsx`
- **Blur-up images:** `MeetDebi` uses a `blur-up` class; ensure images use `loading="lazy"` and the `loaded` class on load
- **Audio intro:** Add `/public/audio/intro.mp3` and a play control in the hero or nav
- **Page transitions:** Integrate Barba.js or Framer Motion layout animations for multi-page flows

## Accessibility

- Skip link, focus-visible 2px ring (Library Green), 4px offset
- ARIA on accordions and nav (aria-expanded, aria-controls, aria-label)
- `prefers-reduced-motion` respected in `globals.css`
