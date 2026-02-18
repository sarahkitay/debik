## 1) Project Overview & Technical Requirements

- **Client/business**: Deborah Kitay, LMFT (LMFT 105063)
- **Location**: El Segundo, CA + Telehealth (California)
- **Email**: `debi@debikitaytherapy.com`
- **Style**: calming, modern, professional; warm and approachable (not cold/business-y, not new-agey)
- **Navigation**: top nav, **multi-page (not single page)**
- **HIPAA**: avoid collecting/storing PHI on this site; prefer SimplePractice for scheduling/secure messages
- **Integration**: SimplePractice scheduling/consultation links

## 2) Design System (colors, typography, spacing)

**Colors (CSS variables in `assets/styles.css`)**
- **primary**: `#74b9ff`
- **secondary**: `#a29bfe`
- **accent**: `#55efc4`
- **light background**: `#f0f9f9`
- **text (dark)**: `#2d3436`
- **text (medium)**: `#636e72`
- **text (light)**: `#b2bec3`

**Typography**
- **Headings**: Montserrat / Open Sans / sans-serif
- **Body**: Lato / Source Sans Pro / sans-serif
- **Base body size**: ~18px (`1.125rem`)

**Spacing**
- `--space-xs`: 8px
- `--space-sm`: 16px
- `--space-md`: 32px
- `--space-lg`: 64px
- `--space-xl`: 96px

**Breakpoints**
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

## 3) Page-by-Page HTML/CSS Structure

- **Home** (`index.html`): hero + intro + about teaser + approach teaser + philosophy + “why narrative”
- **Approach** (`approach.html`): narrative therapy explanation + experience/philosophy/why choose
- **Services** (`services.html`): services grid + About Debi snippet + General Information (FAQ)
- **About** (`about.html`): consistent About Debi bio intro + full background
- **Contact** (`contact.html`): “Ready to Take the Next Step?” CTA + SimplePractice link + optional mailto form
- **Privacy Policy** (`privacy-policy.html`): privacy-forward, HIPAA-conscious guidance

## 4) Component Library (buttons, cards, sections)

- **Buttons**: `.btn`, `.btn-primary`, `.btn-quiet`
- **Cards/surfaces**: `.card`, `.surface`
- **Layout**: `.container`, `.grid`, `.split`
- **FAQ**: `.faq` with `<details>` accordions

## 5) Responsive Breakpoints

- **Tablet and below**: nav collapses into a menu; grids stack
- **Mobile**: buttons scale down slightly; form becomes single column

## 6) Accessibility Requirements

- Skip link (`.skip-link`)
- Focus outlines (keyboard navigable)
- Semantic headings and landmarks
- Accessible accordions (`<details>/<summary>`)

## 7) HIPAA Compliance Considerations

- Do not collect/store PHI via this static site.
- Encourage SimplePractice for scheduling/secure messaging.
- Contact form is **mailto-based** and requires explicit acknowledgement to avoid PHI.

## 8) Integration Points (SimplePractice)

Edit `assets/main.js`:
- `window.SITE_CONFIG.simplePracticeSchedulingUrl`
- `window.SITE_CONFIG.simplePracticeConsultationUrl` (optional; falls back to scheduling URL)

## 9) Testing Checklist

- All nav links work on every page
- “Make an Appointment” + “Schedule a Free Consultation” buttons open the correct SimplePractice URLs
- Mobile menu toggles and closes on outside click / Escape
- FAQ accordions open/close and remain readable on mobile
- No sensitive info requested in the contact form copy

