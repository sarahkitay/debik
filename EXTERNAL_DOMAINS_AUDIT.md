# External Domains Audit Report

## Summary
This document lists all external domains currently being called by the website, categorized by resource type.

---

## External Domains by Category

### 1. **Fonts & Typography**

#### Google Fonts
- **Domain:** `fonts.googleapis.com`
- **Purpose:** Font stylesheet delivery
- **Usage:** All HTML pages load Google Fonts CSS
- **Files:** All `.html` files (index.html, about.html, contact.html, services.html, faq.html, approach.html, privacy-policy.html)
- **CSP Directive:** `style-src`
- **Status:** ✅ Already whitelisted in CSP

- **Domain:** `fonts.gstatic.com`
- **Purpose:** Font file delivery (actual font files)
- **Usage:** Cross-origin font files loaded via `crossorigin` attribute
- **Files:** All `.html` files
- **CSP Directive:** `font-src`
- **Status:** ✅ Already whitelisted in CSP

**Font Families Loaded:**
- Cormorant Garamond (400, 500, italic variants)
- Inter (300, 400, 500, 600)
- Dancing Script (400, 500, 600) - index.html only
- Space Grotesk (500, 600) - index.html only
- Courier Prime (400, 700) - index.html only

---

### 2. **Third-Party Services**

#### SimplePractice Client Portal
- **Domain:** `deborah-kitay.clientsecure.me`
- **Purpose:** Client portal link (external navigation)
- **Usage:** Used as `href` attribute in links, not for form submission or API calls
- **Files:** `assets/main.js` (configuration), `contact.html` (portal link)
- **CSP Directive:** None required (regular link navigation, not resource loading)
- **Status:** ✅ No CSP whitelisting needed (links navigate away from site)

#### Example/Placeholder URL
- **Domain:** `example.com`
- **Purpose:** Placeholder URL in configuration
- **Usage:** Not actively used (placeholder for SimplePractice scheduling URL)
- **Files:** `assets/main.js`
- **CSP Directive:** None required
- **Status:** ⚠️ Placeholder - should be replaced with actual SimplePractice URL

---

### 3. **Metadata & Structured Data**

#### Schema.org
- **Domain:** `schema.org`
- **Purpose:** JSON-LD structured data context
- **Usage:** Used in `@context` field of JSON-LD scripts
- **Files:** `index.html`, `contact.html`
- **CSP Directive:** None required (not actually loaded as a resource, just a namespace identifier)
- **Status:** ✅ No CSP whitelisting needed (metadata only)

---

### 4. **Own Domain (Meta Tags)**

#### debikitaytherapy.com
- **Domain:** `debikitaytherapy.com`
- **Purpose:** Canonical URLs, Open Graph tags, Twitter cards
- **Usage:** Meta tags for SEO and social sharing
- **Files:** All `.html` files
- **CSP Directive:** None required (metadata only, not resource loading)
- **Status:** ✅ No CSP whitelisting needed

---

### 5. **SVG Namespaces (Not External Resources)**

#### W3C SVG Namespace
- **Namespace:** `http://www.w3.org/2000/svg`
- **Purpose:** SVG XML namespace declaration
- **Usage:** Inline SVG elements
- **Files:** All HTML files, SVG files
- **CSP Directive:** None required (XML namespace, not an external resource)
- **Status:** ✅ No CSP whitelisting needed

#### Sitemap Namespace
- **Namespace:** `http://www.sitemaps.org/schemas/sitemap/0.9`
- **Purpose:** XML sitemap namespace
- **Usage:** `sitemap.xml`
- **CSP Directive:** None required (XML namespace, not an external resource)
- **Status:** ✅ No CSP whitelisting needed

---

## Current CSP Policy Analysis

### Current CSP (as applied):
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### Verification:

✅ **style-src:** Correctly includes `https://fonts.googleapis.com`
✅ **font-src:** Correctly includes `https://fonts.gstatic.com`
✅ **form-action:** Set to `'self'` (no external form submissions)
✅ **connect-src:** Set to `'self'` (all fetch/XHR calls are to local files)
✅ **img-src:** Includes `data:` for inline data URIs (used in CSS)

---

## Recommendations

### ✅ Current CSP is Correct
The current Content Security Policy correctly whitelists all necessary external domains:
- Google Fonts (both CSS and font files) are properly whitelisted
- No external scripts are loaded
- No external APIs are called
- All form submissions stay on the same origin
- SimplePractice links are regular navigation (no CSP needed)

### Optional Improvements

1. **Subresource Integrity (SRI) for Google Fonts**
   - Consider adding SRI hashes to Google Fonts links for additional security
   - This would require updating the CSP to allow the specific hashes

2. **Remove 'unsafe-inline' (Future Enhancement)**
   - Currently using `'unsafe-inline'` for scripts and styles
   - Could be removed by:
     - Moving inline scripts to external files
     - Using nonces or hashes for inline styles
   - This is a more advanced security improvement

3. **Update Placeholder URL**
   - Replace `example.com` placeholder with actual SimplePractice scheduling URL when available

---

## External Domain Summary Table

| Domain | Type | CSP Directive | Status |
|--------|------|---------------|--------|
| `fonts.googleapis.com` | Font CSS | `style-src` | ✅ Whitelisted |
| `fonts.gstatic.com` | Font Files | `font-src` | ✅ Whitelisted |
| `deborah-kitay.clientsecure.me` | External Link | None | ✅ No CSP needed |
| `schema.org` | Metadata | None | ✅ No CSP needed |
| `debikitaytherapy.com` | Own Domain | None | ✅ No CSP needed |

---

## Conclusion

**All external domains are properly handled in the current CSP policy.** The policy correctly whitelists Google Fonts (the only external resources actually loaded), and all other external references are either:
- Metadata/namespaces (not loaded as resources)
- External links (navigate away, no CSP needed)
- Own domain references (not external)

The CSP is secure and correctly configured.
