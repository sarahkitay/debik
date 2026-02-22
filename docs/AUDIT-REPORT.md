# Debik — Front-End Style & Backend Audits

**Date:** 2025-02-21  
**Scope:** Style (chief front-end), Security / Speed / SEO (backend)

---

## 1. Front-End Style Audit (Chief Front-End Engineer)

### 1.1 Design system & tokens
- **Strengths:** Clear `:root` tokens in both `design-system.css` (--ds-*) and `styles.css` (--color-*, --paper, etc.). Easing variables (--ease-out-expo, --ease-out-back) used consistently. Section spacing and typography use clamp() for responsiveness.
- **Gaps:** Two token systems (design-system vs styles) can drift; consider documenting which file owns which tokens or consolidating into a single source (e.g. design-system only, styles imports or overrides).
- **Recommendation:** Add a small comment block at top of `styles.css` listing which design-system variables it expects (e.g. --ds-charcoal, --ds-library) so overrides stay intentional.

### 1.2 Transitions & motion
- **Strengths:** Puzzle piece transform now uses a single smooth curve (`0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)`), and magnetic pull runs only on release. `prefers-reduced-motion` is respected for puzzle and completion animations.
- **Consistency:** Transition durations vary (0.2s–0.8s). For a “really smooth” feel, consider standardizing on 2–3 durations (e.g. 0.25s quick, 0.4s standard, 0.6s emphasis) and one or two easings.
- **Recommendation:** Define `--transition-fast`, `--transition-standard`, `--transition-slow` in `:root` and use them in new or refactored rules.

### 1.3 Layout & responsiveness
- **Strengths:** Grid and flex used appropriately; puzzle uses absolute positioning with JS-set custom properties; clamp() for font sizes and spacing.
- **Watch:** Some inline `style="margin: 0 0 10px"` in index.html; prefer utility classes or design-system classes for consistency.
- **Recommendation:** Replace inline margin/style on key sections with classes (e.g. `.section-intro--tight`) so spacing stays in the design system.

### 1.4 Accessibility (a11y)
- **Strengths:** Skip link, `aria-label` on nav/footer, `aria-expanded`/`aria-controls` on menu, `role="banner"`/`navigation`, form labels, and `prefers-reduced-motion` for puzzle.
- **Gaps:** Decorative SVG uses `aria-hidden="true"` (good). Ensure all interactive puzzle pieces remain keyboard-focusable and that focus order is logical after “Start again.”
- **Recommendation:** Run axe or WAVE on the puzzle section and on the mobile menu open state; fix any focus-trapping or missing live region announcements if the puzzle state changes.

### 1.5 CSS hygiene
- **Specificity:** Some selectors are long (e.g. `.resonance-grid--puzzle .resonance-card--puzzle-piece.resonance-piece--2.visible`). Acceptable for component-scoping but avoid adding more nesting.
- **Duplication:** `.is-dragging` appears in multiple blocks; consolidated in one place would make future changes easier.
- **Files:** `design-system.css` is large (~2900 lines). Consider splitting into `design-system-base.css` (tokens, reset, typography) and `design-system-components.css` (puzzle, hero, CTA, etc.) for maintainability.

### 1.6 Summary (style)
- Puzzle drag vs. magnetic behavior and transitions are in good shape; reduced-motion is respected.
- Unify transition tokens and reduce inline styles where possible.
- Document token ownership and consider splitting the design-system file for long-term maintainability.

---

## 2. Security Audit (Backend Engineer)

### 2.1 Content Security Policy (CSP)
- **Current:** `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`.
- **Risks:** `'unsafe-inline'` for scripts and styles weakens XSS protection. If no server-side rendering or hash-based CSP is possible, this is a known tradeoff for static sites.
- **Recommendation:** Prefer nonces or hashes for inline scripts if you introduce a build step; otherwise document that CSP is defense-in-depth and that all content is static/trusted.

### 2.2 Headers
- **X-Frame-Options: DENY** — Good; prevents clickjacking.
- **X-Content-Type-Options: nosniff** — Good.
- **Referrer-Policy: strict-origin-when-cross-origin** — Good for privacy.

### 2.3 XSS & injection
- **Finding:** `main.js` uses `innerHTML` for puzzle completion text: `completion.innerHTML = '<span class="puzzle-complete-text">Safe</span>'`. Content is static (no user input).
- **Risk:** Low (no user-controlled data). For defense-in-depth, could use `textContent` + `createElement` or a single `createElement` + `classList` + `append`.
- **Recommendation:** Optionally replace with DOM APIs; if left as-is, add a one-line comment that this string is static and not user-supplied.

### 2.4 Forms & links
- **Forms:** Contact/scheduling flows likely live on an external service; ensure form `action` and any redirects use HTTPS and intended domains.
- **Links:** External links (e.g. Client Portal) use `target="_blank"` and `rel="noopener noreferrer"` — good.

### 2.5 Dependencies
- **Lenis:** Loaded from unpkg.com (lenis@1.1.11). Integrity (SRI) not used; if you need stronger supply-chain guarantees, consider vendoring or using SRI hashes.
- **Matter.js:** Local (`assets/matter.min.js`). No network exposure.

### 2.6 Summary (security)
- CSP, frame options, and referrer policy are solid. Main improvement is reducing or documenting `unsafe-inline` and optionally replacing static `innerHTML` with DOM APIs.

---

## 3. Systems Speed Audit (Backend Engineer)

### 3.1 Render-blocking resources
- **CSS:** Two stylesheets in `<head>` without `media` or `disabled` — block render. Acceptable for above-the-fold styling.
- **Recommendation:** Keep as-is unless you add critical-CSS inlining; then load non-critical CSS with `media="print"` and switch to `all` on load, or defer.

### 3.2 Scripts
- **Placement:** Scripts at end of `<body>` — good; they don’t block initial paint.
- **Recommendation:** Add `defer` to script tags so parsing can continue while scripts load (e.g. `<script src="..." defer></script>`). Ensure execution order is correct (Lenis → Matter → utils → main if dependencies exist).

### 3.3 Fonts
- **Preconnect:** `preconnect` for fonts.googleapis.com and fonts.gstatic.com — good.
- **Loading:** Single Google Fonts request with multiple families; consider subsetting or reducing families if metrics show slow LCP.
- **Recommendation:** Ensure font-display is set (Google Fonts often adds `display=swap` in the URL; verify in Network tab).

### 3.4 Images
- **Hero:** `loading="eager"` and `preload` for key image (e.g. deb4.jpg for mobile) — good.
- **LCP:** Hero image is a strong LCP candidate; preload and eager are appropriate. Preload only one critical image to avoid wasting bandwidth.

### 3.5 Third-party and payload
- **Lenis:** Fetched from unpkg; one extra DNS + connection. Consider self-hosting if you want to avoid external latency.
- **Payload:** design-system.css is large; see Style audit for splitting. Minification in production will help.

### 3.6 Summary (speed)
- Scripts at bottom and preconnect for fonts are good. Add `defer` to scripts; consider self-hosting Lenis and splitting or minifying CSS in production.

---

## 4. SEO Audit (Backend Engineer)

### 4.1 Meta & social
- **Title / description:** Present and unique per page where checked (index, approach, contact, faq, etc.).
- **Canonical:** index.html has `rel="canonical"` to production URL — good.
- **og:*** and **twitter:*** present (title, description, image, type, url). Some pages use different images (e.g. approach uses beach-hillside.jpg) — good for relevance.

### 4.2 Structure
- **Headings:** Single `<h1>` per page; hierarchy (h2, h3) used in content.
- **Landmarks:** `<header>`, `<main>`, `<footer>`, `<nav>` with roles/aria where needed — good for accessibility and crawlers.

### 4.3 Schema
- **JSON-LD:** ProfessionalService (and similar where present) with name, url, image, areaServed, serviceType, email — good for local/therapy relevance.
- **Recommendation:** On contact or about, consider adding `ContactPoint` (phone, hours) if you want richer snippets.

### 4.4 Indexability
- No `noindex` on key pages. CSP and headers do not block crawlers.
- **Recommendation:** Ensure staging or dev domains use `noindex` or are not linked from production.

### 4.5 Summary (SEO)
- Meta, canonical, Open Graph, Twitter, and JSON-LD are in place. Optional: add ContactPoint schema and ensure non-production environments are not indexed.

---

## 5. Puzzle behavior (implemented)

- **Drag:** Magnetic pull removed during drag; piece position follows pointer 1:1 while dragging.
- **Release:** If distance to target ≤ SNAP_DISTANCE → snap and lock. If ≤ MAGNETIC_RADIUS → animate to target over 380ms then lock. Otherwise leave in place.
- **Transitions:** `transform` transition 0.38s with smooth easing when not dragging; `transition: none` for `.is-dragging`. `prefers-reduced-motion: reduce` disables puzzle piece transition.

---

## 6. Quick wins already applied

- Puzzle: magnetic only on release; smooth transform transition; reduced-motion respected.
- Audit document created (this file).

## 7. Recommended next steps (priority)

1. **High:** Add `defer` to all script tags and verify order.
2. **Medium:** Replace or document static `innerHTML` in main.js; consider SRI or self-host for Lenis.
3. **Medium:** Introduce `--transition-*` tokens and replace a few inline styles with classes.
4. **Low:** Split design-system.css into base + components; add ContactPoint schema if desired.
