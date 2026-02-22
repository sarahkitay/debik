// Site configuration (edit these)
window.SITE_CONFIG = {
  // If you only have ONE SimplePractice link, you can paste it into simplePracticeSchedulingUrl
  // and leave the other URLs empty.
  simplePracticeSchedulingUrl: "https://example.com/your-simplepractice-scheduling-link",
  simplePracticeConsultationUrl: "", // optional: dedicated consultation calendar link
  simplePracticeContactUrl:
    "https://deborah-kitay.clientsecure.me/?mld=192971f0de6213a-0bc459d371b0ac-16525637-16a7f0-192971f0de7336d", // secure client portal link
  availabilityNote: "Limited openings for new clients", // optional
  availabilityDetail: "", // optional (e.g., "Current availability: 2–3 spots per month")
};

// Constants
const ANIMATION_CONSTANTS = {
  TESTIMONIAL_ROTATION_INTERVAL: 7000, // milliseconds
  FAQ_TRANSITION_DELAY: 300, // milliseconds
  SCROLL_THRESHOLD: 0.12,
  INTERSECTION_THRESHOLD: 0.35,
  REVEAL_DELAY_CAP: 160, // milliseconds
  REVEAL_DELAY_INCREMENT: 24, // milliseconds
  STAGGER_DELAY: 200, // milliseconds
};

// Development mode flag - set to false in production
const IS_DEVELOPMENT = false;

/**
 * Sets consultation links based on SITE_CONFIG
 * Updates all elements with [data-consultation-link] attribute
 * Falls back to contact page if SimplePractice URL is not configured
 */
function setConsultationLinks() {
  const url =
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeConsultationUrl) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeSchedulingUrl) ||
    "";
  const links = document.querySelectorAll("[data-consultation-link]");
  links.forEach((a) => {
    if (!url || url.includes("example.com")) {
      const onContact = (window.location.pathname || "").endsWith("contact.html");
      a.setAttribute("href", onContact ? "#scheduling" : "contact.html#scheduling");
      a.setAttribute(
        "aria-label",
        "Begin with a complimentary 15-minute consultation (opens contact page until SimplePractice link is configured)"
      );
      return;
    }
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
}

/**
 * Sets the current navigation item based on the current page
 * Adds aria-current="page" to the active navigation link
 */
function setCurrentNav() {
  const path = (window.location.pathname || "").split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href) return;
    const normalized = href.split("#")[0];
    if (normalized === path) a.setAttribute("aria-current", "page");
  });
}

/**
 * Sets up mobile navigation toggle functionality
 * Handles opening/closing the mobile menu with keyboard and click events
 */
function setupMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  };

  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    setOpen(open);
  });

  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("is-open")) return;
    if (toggle.contains(e.target) || menu.contains(e.target)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}

function setPortalLinks() {
  const url =
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeContactUrl) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeConsultationUrl) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeSchedulingUrl) ||
    "";
  const links = document.querySelectorAll("[data-portal-link]");
  links.forEach((a) => {
    if (!url || url.includes("example.com")) {
      a.setAttribute("href", "contact.html");
      return;
    }
    a.setAttribute("href", url);
    a.setAttribute("target", "_blank");
    a.setAttribute("rel", "noopener noreferrer");
  });
}

/**
 * Schedule consultation: go straight to portal when configured; otherwise show email dialog
 */
function initScheduleConsultation() {
  const portalUrl =
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeContactUrl) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeConsultationUrl) ||
    (window.SITE_CONFIG && window.SITE_CONFIG.simplePracticeSchedulingUrl) ||
    "";
  const hasPortal = portalUrl && !portalUrl.includes("example.com");

  const triggers = document.querySelectorAll("[data-schedule-consultation]");
  triggers.forEach((t) => {
    t.addEventListener("click", (e) => {
      if (hasPortal) {
        e.preventDefault();
        window.open(portalUrl, "_blank", "noopener,noreferrer");
        return;
      }
      if (!document.body.classList.contains("contact-page")) return;
      const dialog = document.getElementById("schedule-dialog");
      if (dialog) {
        e.preventDefault();
        dialog.showModal();
        triggers.forEach((el) => el.setAttribute("aria-expanded", "true"));
      }
    });
  });

  if (!document.body.classList.contains("contact-page")) return;

  const dialog = document.getElementById("schedule-dialog");
  const portalBtn = document.getElementById("schedule-portal-btn");
  const emailBtn = document.getElementById("schedule-email-btn");
  const closeBtn = document.querySelector("[data-close-schedule-dialog]");

  if (hasPortal && portalBtn) {
    portalBtn.href = portalUrl;
    portalBtn.style.display = "";
  } else if (portalBtn) {
    portalBtn.style.display = "none";
  }

  if (emailBtn) {
    const emailSubject = encodeURIComponent("Consultation request");
    const emailBody = encodeURIComponent(
      "Hi Debi,\n\nI'm interested in scheduling a consultation. Please let me know what times work for you.\n\nBest regards"
    );
    emailBtn.href = `mailto:debi@debikitaytherapy.com?subject=${emailSubject}&body=${emailBody}`;
  }

  const close = () => {
    if (dialog) dialog.close();
    triggers.forEach((t) => t.setAttribute("aria-expanded", "false"));
  };

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (dialog) {
    dialog.addEventListener("cancel", close);
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) close();
    });
  }
}

/**
 * Initializes the site search functionality
 * Creates search button, modal, and handles search operations
 * Uses TreeWalker API for efficient text searching
 * Highlights matches and provides navigation between results
 */
function initSiteSearch() {
  const main = document.querySelector("main");
  const navRight = document.querySelector(".nav-right.nav-links, .nav-right");
  if (!main || !navRight) return;

  const ensureOpenButton = () => {
    if (document.querySelector("[data-site-search-open]")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-quiet btn-search nav-search-btn";
    
    // Create SVG element safely
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    
    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z");
    path1.setAttribute("fill", "none");
    path1.setAttribute("stroke", "currentColor");
    path1.setAttribute("stroke-width", "1.8");
    svg.appendChild(path1);
    
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M16.2 16.2 21 21");
    path2.setAttribute("fill", "none");
    path2.setAttribute("stroke", "currentColor");
    path2.setAttribute("stroke-width", "1.8");
    path2.setAttribute("stroke-linecap", "round");
    svg.appendChild(path2);
    
    const span = document.createElement("span");
    span.className = "sr-only";
    span.textContent = "Search";
    
    btn.appendChild(svg);
    btn.appendChild(span);
    btn.setAttribute("data-site-search-open", "true");
    btn.setAttribute("aria-label", "Search this page");
    btn.setAttribute("title", "Search");
    const scheduleLink = navRight.querySelector("a.nav-cta");
    if (scheduleLink) {
      scheduleLink.parentNode.insertBefore(btn, scheduleLink.nextSibling);
    } else {
      navRight.appendChild(btn);
    }
  };

  const ensureFooterSearchButton = () => {
    if (document.querySelector(".footer-search-trigger[data-site-search-open]")) return;
    const footerLinks = document.querySelector(".site-footer .footer-links");
    if (!footerLinks) return;
    const link = document.createElement("a");
    link.href = "#";
    link.className = "footer-search-trigger";
    link.setAttribute("data-site-search-open", "true");
    link.setAttribute("aria-label", "Search this page");
    link.textContent = "Search";
    link.addEventListener("click", (e) => { e.preventDefault(); });
    footerLinks.insertBefore(link, footerLinks.firstChild);
  };

  const ensureModal = () => {
    if (document.querySelector("[data-site-search-modal]")) return;
    const modal = document.createElement("div");
    modal.className = "site-search";
    modal.hidden = true;
    modal.setAttribute("data-site-search-modal", "true");
    
    // Create modal structure safely using DOM methods
    const overlay = document.createElement("div");
    overlay.className = "site-search__overlay";
    overlay.setAttribute("data-site-search-close", "true");
    
    const panel = document.createElement("div");
    panel.className = "site-search__panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "site-search-title");
    
    const top = document.createElement("div");
    top.className = "site-search__top";
    
    const title = document.createElement("h2");
    title.className = "site-search__title";
    title.id = "site-search-title";
    title.textContent = "Search this page";
    
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "btn btn-quiet btn-search";
    closeBtn.setAttribute("data-site-search-close", "true");
    closeBtn.textContent = "Close";
    
    top.appendChild(title);
    top.appendChild(closeBtn);
    
    const form = document.createElement("form");
    form.className = "site-search__form";
    form.setAttribute("data-site-search-form", "true");
    
    const input = document.createElement("input");
    input.className = "site-search__input";
    input.type = "search";
    input.setAttribute("inputmode", "search");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("placeholder", "Type a word or phrase…");
    
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary";
    submitBtn.textContent = "Search";
    
    form.appendChild(input);
    form.appendChild(submitBtn);
    
    const status = document.createElement("div");
    status.className = "site-search__status";
    status.setAttribute("aria-live", "polite");
    status.setAttribute("data-site-search-status", "true");
    
    const controls = document.createElement("div");
    controls.className = "site-search__controls";
    
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "btn btn-quiet btn-search";
    prevBtn.setAttribute("data-site-search-prev", "true");
    prevBtn.disabled = true;
    prevBtn.textContent = "Previous";
    
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "btn btn-quiet btn-search";
    nextBtn.setAttribute("data-site-search-next", "true");
    nextBtn.disabled = true;
    nextBtn.textContent = "Next";
    
    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.className = "btn btn-quiet btn-search";
    clearBtn.setAttribute("data-site-search-clear", "true");
    clearBtn.disabled = true;
    clearBtn.textContent = "Clear";
    
    controls.appendChild(prevBtn);
    controls.appendChild(nextBtn);
    controls.appendChild(clearBtn);
    
    panel.appendChild(top);
    panel.appendChild(form);
    panel.appendChild(status);
    panel.appendChild(controls);
    
    modal.appendChild(overlay);
    modal.appendChild(panel);
    document.body.appendChild(modal);
  };

  ensureOpenButton();
  ensureFooterSearchButton();
  ensureModal();

  const modal = document.querySelector("[data-site-search-modal]");
  const openBtns = document.querySelectorAll("[data-site-search-open]");
  const closeEls = Array.from(document.querySelectorAll("[data-site-search-close]"));
  const form = document.querySelector("[data-site-search-form]");
  const input = modal.querySelector("input[type='search']");
  const status = document.querySelector("[data-site-search-status]");
  const btnPrev = document.querySelector("[data-site-search-prev]");
  const btnNext = document.querySelector("[data-site-search-next]");
  const btnClear = document.querySelector("[data-site-search-clear]");

  let hits = [];
  let activeIdx = -1;
  let lastQuery = "";

  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const unwrapHighlights = () => {
    const marks = Array.from(main.querySelectorAll("mark.site-search__hit"));
    marks.forEach((m) => {
      const text = document.createTextNode(m.textContent || "");
      m.replaceWith(text);
    });
    main.normalize();
  };

  const isSkippable = (node) => {
    const parent = node.parentElement;
    if (!parent) return true;
    const tag = parent.tagName;
    return (
      tag === "SCRIPT" ||
      tag === "STYLE" ||
      tag === "NOSCRIPT" ||
      tag === "MARK" ||
      tag === "TEXTAREA" ||
      tag === "INPUT" ||
      parent.closest(".site-search__panel") != null
    );
  };

  const setActive = (idx) => {
    if (!hits.length) return;
    hits.forEach((el, i) => el.classList.toggle("is-active", i === idx));
    activeIdx = idx;
    hits[idx].scrollIntoView({ behavior: "smooth", block: "center" });
    status.textContent = `${idx + 1} of ${hits.length} match${hits.length === 1 ? "" : "es"}`;
  };

  const runSearch = (query) => {
    const q = (query || "").trim();
    lastQuery = q;
    unwrapHighlights();
    hits = [];
    activeIdx = -1;

    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnClear.disabled = true;

    if (!q) {
      status.textContent = "";
      return;
    }

    const re = new RegExp(escapeRegExp(q), "gi");
    const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (isSkippable(node)) return NodeFilter.FILTER_REJECT;
        if (!re.test(node.nodeValue)) return NodeFilter.FILTER_REJECT;
        re.lastIndex = 0;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      const text = node.nodeValue || "";
      const frag = document.createDocumentFragment();
      let last = 0;
      let m;
      re.lastIndex = 0;
      while ((m = re.exec(text))) {
        const start = m.index;
        const end = start + m[0].length;
        if (start > last) frag.appendChild(document.createTextNode(text.slice(last, start)));
        const mark = document.createElement("mark");
        mark.className = "site-search__hit";
        mark.textContent = text.slice(start, end);
        frag.appendChild(mark);
        hits.push(mark);
        last = end;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode && node.parentNode.replaceChild(frag, node);
    });

    if (!hits.length) {
      status.textContent = `No matches for “${q}”.`;
      return;
    }

    btnPrev.disabled = false;
    btnNext.disabled = false;
    btnClear.disabled = false;
    setActive(0);
  };

  const open = () => {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => input.focus(), 0);
  };

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    unwrapHighlights();
    hits = [];
    activeIdx = -1;
    status.textContent = "";
  };

  openBtns.forEach((btn) => btn.addEventListener("click", open));
  closeEls.forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") close();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(input.value);
  });

  btnNext.addEventListener("click", () => {
    if (!hits.length) return;
    setActive((activeIdx + 1) % hits.length);
  });

  btnPrev.addEventListener("click", () => {
    if (!hits.length) return;
    setActive((activeIdx - 1 + hits.length) % hits.length);
  });

  btnClear.addEventListener("click", () => {
    input.value = "";
    lastQuery = "";
    unwrapHighlights();
    hits = [];
    activeIdx = -1;
    status.textContent = "";
    btnPrev.disabled = true;
    btnNext.disabled = true;
    btnClear.disabled = true;
    input.focus();
  });
}

/**
 * Initializes active table of contents highlighting
 * Uses IntersectionObserver to track which section is currently visible
 * Updates active state based on scroll position
 */
function initActiveToc() {
  const toc = document.querySelector(".page-toc__nav");
  if (!toc) return;
  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  const sections = links
    .map((a) => document.getElementById((a.getAttribute("href") || "").slice(1)))
    .filter(Boolean);
  if (!links.length || !sections.length) return;

  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  };

  const obs = new IntersectionObserver(
    (entries) => {
      // pick the most visible intersecting section
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      if (id) setActive(id);
    },
    { rootMargin: "-20% 0px -70% 0px", threshold: [0.1, 0.2, 0.35, 0.5] }
  );

  sections.forEach((s) => obs.observe(s));
}

/**
 * Initializes scroll-triggered reveal animations on all pages
 * Respects prefers-reduced-motion setting
 * Uses IntersectionObserver for performance
 */
function initScrollReveals() {
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const selectors = [
    // Index & shared
    ".section .surface",
    ".pillar-card",
    ".you-card",
    ".trust-metric",
    ".step",
    ".pricing-section",
    ".faq-accordion details",
    ".soft-quote",
    ".method",
    ".investment-item",
    ".testimonial",
    ".not-right-fit__surface",
    // .meet-debi-sanctuary excluded (image uses data-observe only)
    ".cta-feature",
    ".cta-urgency-block",
    // About page
    ".about-page .section",
    ".hands-holding-break--fade",
    // Approach page
    ".approach-flow-section",
    ".approach-image-divider",
    ".approach-divider-subtle",
    // Services page
    ".section .card",
    ".hero .hero-grid",
    // Contact page
    ".contact-hero__inner",
    ".contact-booking",
    ".contact__grid",
    ".contact-card",
    ".contact .section",
    // FAQ page
    ".section.faq",
    ".faq__list details",
    ".faq__item",
    // Privacy / legal
    ".legal .section",
    ".legal-doc",
    // Generic main content blocks
    "main > section",
  ];

  const nodes = Array.from(document.querySelectorAll(selectors.join(","))).filter(
    (el) => !el.closest(".site-search__panel") && !el.closest(".site-header") && !el.closest(".site-footer") && !el.closest(".meet-debi-sanctuary")
  );

  // Dedupe (elements may match multiple selectors)
  const seen = new Set();
  const unique = nodes.filter((el) => {
    if (seen.has(el)) return false;
    seen.add(el);
    return true;
  });
  if (!unique.length) return;

  const viewportH = window.innerHeight;

  unique.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const isAboveFold = rect.top < viewportH * 0.85;
    if (!isAboveFold) {
      el.classList.add("reveal");
      const delay = Math.min(ANIMATION_CONSTANTS.REVEAL_DELAY_CAP, (i % 8) * ANIMATION_CONSTANTS.REVEAL_DELAY_INCREMENT);
      el.style.setProperty("--reveal-delay", `${delay}ms`);
    }
  });

  const toObserve = unique.filter((el) => el.classList.contains("reveal"));
  if (!toObserve.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-inview");
        obs.unobserve(entry.target);
      });
    },
    { threshold: ANIMATION_CONSTANTS.SCROLL_THRESHOLD, rootMargin: "0px 0px -5% 0px" }
  );

  toObserve.forEach((el) => obs.observe(el));
}

/**
 * Initializes draw-on animation for hands-holding SVG when it scrolls into view
 */
function initHandsDraw() {
  const container = document.querySelector(".hands-holding-break");
  if (!container) return;
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const paths = container.querySelectorAll("svg path");
  if (!paths.length) return;

  prepDraw(paths);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        paths.forEach((p) => {
          p.style.strokeDashoffset = "0";
        });
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -20px 0px" }
  );
  observer.observe(container);
}

document.addEventListener("DOMContentLoaded", () => {
  setConsultationLinks();
  setPortalLinks();
  setCurrentNav();
  setupMobileNav();
  initSiteSearch();
  initActiveToc();
  initScrollReveals();
  initHandsDraw();
  initScheduleConsultation();

  // Mobile: load Debi portrait sooner (preload is in head with media (max-width: 768px))
  if (window.innerWidth <= 768) {
    const portraitImg = document.querySelector(".meet-debi-sanctuary .portrait-image");
    if (portraitImg) {
      portraitImg.loading = "eager";
      if (portraitImg.fetchPriority !== undefined) portraitImg.fetchPriority = "high";
    }
  }

  // Letter-by-letter reveal for statement overlays (accessibility + reduced motion respected).
  document.querySelectorAll("[data-animate-letters]").forEach((el) => {
    const raw = (el.textContent || "").replace(/\s+/g, " ").trim();
    if (!raw) return;

    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    el.setAttribute("aria-label", raw);
    const frag = document.createDocumentFragment();

    // Build word-level wrappers so the browser wraps BETWEEN words (not mid-word).
    const parts = raw.split(" ");
    let letterIndex = 0;
    parts.forEach((word, wIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      wordSpan.setAttribute("aria-hidden", "true");

      [...word].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.style.setProperty("--i", String(letterIndex));
        span.textContent = ch;
        span.setAttribute("aria-hidden", "true");
        wordSpan.appendChild(span);
        letterIndex += 1;
      });

      frag.appendChild(wordSpan);

      if (wIdx !== parts.length - 1) {
        const space = document.createElement("span");
        space.className = "space";
        space.setAttribute("aria-hidden", "true");
        frag.appendChild(space);
      }
    });

    el.textContent = "";
    el.appendChild(frag);
  });

  // Trigger statement animations on scroll (so it feels like a “reveal”, not autoplay).
  const animatedStatements = Array.from(document.querySelectorAll(".statement-overlay [data-animate-letters]"));
  if (animatedStatements.length) {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const overlay = entry.target.closest(".statement-overlay");
          if (overlay) overlay.classList.add("is-inview");
          obs.unobserve(entry.target);
        });
      },
      { threshold: ANIMATION_CONSTANTS.INTERSECTION_THRESHOLD }
    );
    animatedStatements.forEach((el) => obs.observe(el));
  }

  // Optional, privacy-friendly instrumentation (no network calls, no PII).
  document.querySelectorAll("[data-availability-note]").forEach((el) => {
    const note = window.SITE_CONFIG?.availabilityNote || "";
    if (note) el.textContent = note;
  });
  document.querySelectorAll("[data-availability-detail]").forEach((el) => {
    const detail = window.SITE_CONFIG?.availabilityDetail || "";
    if (detail) el.textContent = detail;
  });

  // Track CTA clicks (console only). Replace with HIPAA-appropriate analytics only if you have a BAA.
  document.querySelectorAll("[data-cta-location]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const loc = e.currentTarget?.dataset?.ctaLocation;
      if (IS_DEVELOPMENT) {
        console.log("CTA clicked:", loc);
      }
    });
  });

  // Track scroll depth (console only).
  const targets = document.querySelectorAll("[data-scroll-tracker]");
  if (targets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (IS_DEVELOPMENT) {
            console.log("User reached:", entry.target.dataset.scrollTracker);
          }
          observer.unobserve(entry.target);
        });
      },
      { threshold: ANIMATION_CONSTANTS.INTERSECTION_THRESHOLD }
    );
    targets.forEach((el) => observer.observe(el));
  }

  // Simple testimonial rotation (no network calls).
  document.querySelectorAll("[data-testimonial-rotator]").forEach((rotator) => {
    const items = Array.from(rotator.querySelectorAll(".testimonial"));
    const dots = Array.from(rotator.querySelectorAll("[data-testimonial-dot]"));
    const counter = rotator.querySelector("[data-testimonial-counter]");
    const prevBtn = rotator.querySelector("[data-testimonial-prev]");
    const nextBtn = rotator.querySelector("[data-testimonial-next]");
    if (items.length <= 1) return;

    let idx = items.findIndex((el) => el.classList.contains("is-active"));
    if (idx < 0) idx = 0;

    const pad = (n) => String(n).padStart(2, "0");
    const setActive = (nextIdx) => {
      const i = Math.max(0, Math.min(items.length - 1, nextIdx));
      items.forEach((el, k) => el.classList.toggle("is-active", k === i));
      dots.forEach((el, k) => el.classList.toggle("is-active", k === i));
      if (counter) counter.textContent = `${pad(i + 1)} / ${pad(items.length)}`;
      idx = i;
    };

    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const i = Number(dot.dataset.testimonialDot ?? "0");
        if (Number.isFinite(i)) setActive(i);
      });
    });
    if (prevBtn) prevBtn.addEventListener("click", () => setActive((idx - 1 + items.length) % items.length));
    if (nextBtn) nextBtn.addEventListener("click", () => setActive((idx + 1) % items.length));

    setActive(idx);
    window.setInterval(() => setActive((idx + 1) % items.length), ANIMATION_CONSTANTS.TESTIMONIAL_ROTATION_INTERVAL);
  });
});

// Vintage scroll-tracking vertical line
function initScrollLine() {
  const scrollLine = document.querySelector('.scroll-line');
  const scrollPath = document.querySelector('.scroll-line__path');
  if (!scrollLine || !scrollPath) return;

  // Set SVG height to match document
  const setSVGHeight = () => {
    const docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    scrollLine.style.height = `${docHeight}px`;
  };
  setSVGHeight();

  const updateScrollLine = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
    const pathLength = scrollPath.getTotalLength();
    
    // Draw the path progressively based on scroll
    const drawLength = pathLength * scrollPercent;
    scrollPath.style.strokeDasharray = `${pathLength}`;
    scrollPath.style.strokeDashoffset = pathLength - drawLength;
  };

  // Initialize path drawing
  const pathLength = scrollPath.getTotalLength();
  scrollPath.style.strokeDasharray = `${pathLength}`;
  scrollPath.style.strokeDashoffset = pathLength;
  
  // Update on scroll
  let ticking = false;
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollLine();
        ticking = false;
      });
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', () => {
    setSVGHeight();
    updateScrollLine();
  }, { passive: true });
  
  // Initial update
  updateScrollLine();

  // Book spine: hide after scrolling past hero
  const bookSpine = document.querySelector('.scroll-line.book-spine[data-book-spine]');
  if (bookSpine) {
    const hero = document.querySelector('.hero, .hero-sanctuary');
    const updateBookSpine = () => {
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      const past = (window.pageYOffset || document.documentElement.scrollTop) > heroHeight;
      bookSpine.classList.toggle('book-spine-past-hero', past);
    };
    window.addEventListener('scroll', updateBookSpine, { passive: true });
    updateBookSpine();
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initScrollLine);
} else {
  initScrollLine();
}

// Badge drawing animation
function initBadgeFlip() {
  document.querySelectorAll('[data-badge-flip]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      el.classList.toggle('is-flipped');
    });
  });
}

function initBadgeAnimations() {
  const badges = document.querySelectorAll('[data-badge-animate]');
  if (badges.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const path = entry.target.querySelector('.badge-path');
        if (path) {
          // Calculate path length
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = length;
          
          // Trigger animation
          setTimeout(() => {
            entry.target.setAttribute('data-badge-animated', '');
            path.style.strokeDashoffset = '0';
          }, 50);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
  });

  badges.forEach((badge) => {
    const path = badge.querySelector('.badge-path');
    if (path) {
      // Initialize path length
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = length;
    }
    observer.observe(badge);
  });
}

// Growing Tree Animation - Organic Growth
/**
 * Prepares paths for drawing animation by setting stroke-dasharray.
 * @param {NodeList|Array} paths - The path elements to prepare
 * @returns {void}
 */
function prepDraw(paths) {
  paths.forEach(p => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.willChange = 'stroke-dashoffset';
  });
}

/**
 * Plays the full-tree fade-in: the full-tree-reference (display tree) fades in with the same
 * simple opacity fade the trunk used before. Uses #full-tree-display if present.
 * @returns {void}
 */

/**
 * Updates foliage growth based on scroll progress.
 * Grows foliage groups one at a time from bottom to top.
 * @returns {void}
 */
function updateFoliageGrowth() {
  const svg = document.querySelector('#treeSvg');
  if (!svg) return;

  const foliageGroups = [
    svg.querySelector('#foliage-1'),
    svg.querySelector('#foliage-2'),
    svg.querySelector('#foliage-3'),
    svg.querySelector('#foliage-4'),
    svg.querySelector('#foliage-5'),
    svg.querySelector('#foliage-6')
  ].filter(Boolean);

  if (foliageGroups.length === 0) {
    console.warn('No foliage groups found');
    return;
  }

  // Calculate scroll progress (0 to 1)
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  // Normalize scroll to 0-1, but start showing foliage earlier (at 10% scroll)
  const scrollStart = 0.1;
  const scrollEnd = 0.9;
  const scrollRange = scrollEnd - scrollStart;
  let scrollPercent = 0;
  if (docHeight > 0) {
    const rawPercent = scrollTop / docHeight;
    if (rawPercent >= scrollStart) {
      scrollPercent = Math.min((rawPercent - scrollStart) / scrollRange, 1);
    }
  }

  // Each foliage group gets a portion of the scroll
  // Group 1 appears at 0-16.67%, group 2 at 16.67-33.33%, etc.
  const groupPortion = 1 / foliageGroups.length;

  foliageGroups.forEach((group, index) => {
    if (!group) return;

    const groupStart = index * groupPortion;
    const groupEnd = (index + 1) * groupPortion;
    
    // Calculate progress for this specific group (0 to 1)
    let groupProgress = 0;
    if (scrollPercent >= groupEnd) {
      // Fully grown
      groupProgress = 1;
    } else if (scrollPercent > groupStart) {
      // Growing
      groupProgress = (scrollPercent - groupStart) / groupPortion;
    } else {
      // Not started
      groupProgress = 0;
    }

    // Apply growth with scale and opacity
    const scale = 0.96 + (groupProgress * 0.04); // Scale from 0.96 to 1.0
    // Set inline styles to override CSS
    group.style.opacity = String(groupProgress);
    group.style.transform = `scale(${scale})`;
    // Force a reflow to ensure styles are applied
    void group.offsetHeight;
  });
}

/**
 * Initializes the growing tree animation.
 * Uses the hidden full-tree-reference as the visible tree: clones it into #treeSvg as #full-tree-display,
 * hides trunk/foliage, and fades in #full-tree-display when the tree comes into view.
 * @returns {void}
 */

// Tree: grows in (reveals) on scroll from bottom to top; stays visible (no fade-out)
function initTreeStrokeDraw() {
  const container = document.querySelector('.growing-tree');
  const treeContent = document.getElementById('tree-content');
  if (!container || !treeContent) return;

  const paths = Array.from(treeContent.querySelectorAll('path'));
  if (paths.length === 0) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    paths.forEach((p) => { p.style.opacity = '1'; });
    return;
  }

  // Order: bottom to top by bbox center Y (descending = bottom first)
  paths.sort((a, b) => {
    try {
      const bboxA = a.getBBox();
      const bboxB = b.getBBox();
      const centerY_A = bboxA.y + bboxA.height / 2;
      const centerY_B = bboxB.y + bboxB.height / 2;
      return centerY_B - centerY_A;
    } catch (_) {
      return 0;
    }
  });

  // Reveal tree over this scroll range (px); each path fades in over its own slice
  const scrollRevealEnd = 580;
  const n = paths.length;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    const progress = clamp(y / scrollRevealEnd, 0, 1);
    paths.forEach((path, index) => {
      const slotStart = index / n;
      const slotEnd = (index + 1) / n;
      let opacity = 0;
      if (progress >= slotEnd) opacity = 1;
      else if (progress > slotStart) opacity = (progress - slotStart) / (slotEnd - slotStart);
      path.style.opacity = String(opacity);
    });
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

// Pricing block dropdown (click to expand/collapse)
function setupPricingDropdown() {
  const trigger = document.querySelector('[data-pricing-toggle]');
  const section = document.querySelector('.investment-section');
  const panel = document.getElementById('pricing-dropdown-panel');
  if (!trigger || !section || !panel) return;

  trigger.addEventListener('click', () => {
    const isOpen = section.classList.toggle('is-pricing-open');
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

// FAQ Split Screen Reveal
function initFAQSplitScreen() {
  const questions = document.querySelectorAll('.faq-question');
  const answerArea = document.querySelector('.faq-answer-paper');
  const answerContent = document.querySelector('.faq-answer-content');
  const answersData = document.querySelector('.faq-answers-data');
  
  if (!questions.length || !answerArea || !answerContent || !answersData) return;

  questions.forEach((question, index) => {
    question.addEventListener('click', () => {
      const wasExpanded = question.getAttribute('aria-expanded') === 'true';
      
      // Remove active state from all questions
      questions.forEach((q) => {
        q.setAttribute('aria-expanded', 'false');
      });
      
      if (!wasExpanded) {
        // Set active state on clicked question
        question.setAttribute('aria-expanded', 'true');
        
        // Get answer content
        const answerDiv = answersData.querySelector(`[data-answer="${index}"]`);
        if (answerDiv) {
          // Slide out and fade
          answerArea.classList.remove('active');
          
          setTimeout(() => {
            // Update content safely - clone nodes instead of innerHTML to prevent XSS
            answerContent.textContent = ''; // Clear existing content
            const fragment = document.createDocumentFragment();
            Array.from(answerDiv.childNodes).forEach(node => {
              fragment.appendChild(node.cloneNode(true));
            });
            answerContent.appendChild(fragment);
            // Slide in and fade
            answerArea.classList.add('active');
          }, ANIMATION_CONSTANTS.FAQ_TRANSITION_DELAY);
        }
      } else {
        // Close if clicking the same question
        answerArea.classList.remove('active');
      }
    });
  });
}

// Vine Separator Growth
function initVineSeparators() {
  const vines = document.querySelectorAll('[data-vine-grow]');
  if (vines.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-vine-revealed', '');
        const path = entry.target.querySelector('path');
        if (path) {
          const length = path.getTotalLength();
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = length;
          setTimeout(() => {
            path.style.strokeDashoffset = '0';
            entry.target.setAttribute('data-vine-grown', '');
          }, 200);
        }
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  vines.forEach((vine) => {
    const paths = vine.querySelectorAll('path');
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = length;
    });
    observer.observe(vine);
  });
}

// Resonance "This work might resonate if" – smooth scroll-linked fade, quickly readable
function initResonanceReveal() {
  const list = document.querySelector('[data-reveal-list]');
  const section = document.querySelector('.resonance-section');
  if (!list) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    list.setAttribute('data-list-revealed', '');
    return;
  }
  const target = section || list;
  const thresholds = [];
  for (let i = 0; i <= 35; i++) thresholds.push(i / 35);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const r = Math.min(1, entry.intersectionRatio * 2);
      list.style.opacity = r;
      if (r >= 1) list.setAttribute('data-list-revealed', '');
    });
  }, { threshold: thresholds, rootMargin: '0px 0px -3% 0px' });
  observer.observe(target);
}

// Lenis smooth scroll (luxury feel) — expose instance for parallax
let lenisInstance = null;
function initLenis() {
  if (typeof window.Lenis === 'undefined') return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  lenisInstance = new window.Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  document.documentElement.classList.add('lenis');

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

// Hero offer block: fade-in + green border on scroll (mobile) or hover (desktop); Red Sea scroll-driven reveal
function initHeroOfferBlock() {
  const wrap = document.querySelector('[data-hero-offer-wrap]');
  const block = document.querySelector('[data-hero-offer]');
  if (wrap && wrap.hasAttribute('data-red-sea')) {
    const revealRange = 650;
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const updateRedSea = () => {
      if (reduceMotion) {
        wrap.style.setProperty('--red-sea-progress', '1');
        return;
      }
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / revealRange));
      wrap.style.setProperty('--red-sea-progress', String(progress));
      requestAnimationFrame(updateRedSea);
    };

    updateRedSea();
  }
  if (!block) return;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          block.classList.add('is-visible');
          if (isTouch) block.classList.add('is-active');
        } else if (isTouch) {
          block.classList.remove('is-active');
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px' }
  );
  io.observe(block);
  // Show immediately if already in view (e.g. short viewport)
  if (block.getBoundingClientRect().top < window.innerHeight * 0.9) {
    block.classList.add('is-visible');
    if (isTouch) block.classList.add('is-active');
  }
}

// Gentle 3D tilt parallax on hero-fullbleed image (mouse + scroll) — text unaffected
function initHeroFullbleedTilt() {
  const hero = document.querySelector('.hero-fullbleed');
  if (!hero) return;
  const img = hero.querySelector('.hero__image--fullbleed img');
  if (!img) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let tiltX = 0, tiltY = 0;
  let currentTiltX = 0, currentTiltY = 0, currentScroll = 0;

  const onMove = (e) => {
    const w = window.innerWidth, h = window.innerHeight;
    tiltX = ((e.clientY / h) - 0.5) * -4;
    tiltY = ((e.clientX / w) - 0.5) * 4;
  };

  window.addEventListener('mousemove', onMove, { passive: true });

  const getScrollY = () => {
    if (lenisInstance && typeof lenisInstance.scroll === 'number') return lenisInstance.scroll;
    return window.scrollY ?? document.documentElement.scrollTop ?? 0;
  };

  const tick = () => {
    const scrollY = getScrollY();
    currentTiltX += (tiltX - currentTiltX) * 0.08;
    currentTiltY += (tiltY - currentTiltY) * 0.08;
    currentScroll += (scrollY - currentScroll) * 0.1;
    const parallaxY = Math.min(currentScroll * 0.06, 40);
    img.style.transform = `perspective(1000px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) translate3d(0, ${parallaxY}px, 0) scale(1.08)`;
    requestAnimationFrame(tick);
  };
  tick();
}

// Parallax hero image (depth) – lerp every frame for smooth motion
function initHeroParallax() {
  const img = document.querySelector('.hero__image img');
  if (!img) return;
  const hero = img.closest('.hero');
  if (hero && hero.classList.contains('hero-fullbleed')) return; // handled by initHeroFullbleedTilt
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  img.classList.add('hero__img--parallax');
  let targetMove = 0;
  let currentMove = 0;

  const tick = () => {
    const y = window.scrollY || window.pageYOffset;
    targetMove = Math.min(y * 0.06, 72);
    currentMove += (targetMove - currentMove) * 0.14;
    img.style.transform = `scale(1.12) translate3d(0, ${currentMove}px, 0)`;
    requestAnimationFrame(tick);
  };

  tick();
}

// Header glassmorphism on scroll; nav green line fades in on load; mini nav fades out
function setupHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const miniNav = document.querySelector('[data-hero-mini-nav]');
  const threshold = 100;

  function setHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight);

  const getScrollY = () => (lenisInstance && typeof lenisInstance.scroll === 'number' ? lenisInstance.scroll : window.scrollY || window.pageYOffset);
  const update = () => {
    const y = getScrollY();
    header.classList.toggle('is-scrolled', y > threshold);
    if (header.classList.contains('primary-nav')) {
      header.classList.toggle('scrolled', y > threshold);
    }
    if (miniNav) miniNav.classList.toggle('is-hidden', y > threshold);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });

  if (header.classList.contains('primary-nav')) {
    requestAnimationFrame(() => {
      header.classList.add('nav-line-visible');
    });
  }
}

/**
 * Resonance puzzle: draggable pieces that snap together.
 * On complete: card content fades out, "this is a safe space" fades in at center, puzzle lines disappear; undo resets.
 */
function initFloatingCards() {
  let initialized = false;

  function runInit() {
    if (initialized) return;

    const grid = document.querySelector('.resonance-grid--arc, .resonance-grid');
    if (!grid) return;

    const cardElements = grid.querySelectorAll('.resonance-card');
    if (cardElements.length < 3) return;

    const W = grid.offsetWidth;
    const H = grid.offsetHeight;
    if (W < 10 || H < 10) {
      setTimeout(runInit, 400);
      return;
    }

    requestAnimationFrame(() => {
      if (initialized) return;
      initialized = true;

      const nodes = Array.from(cardElements);

      // Use exact SVG viewBox proportions; one scale factor so pieces match the art.
      // Circle layout (from reference): arc on TOP, bottom-left = 2nd piece, bottom-right = 1st piece.
      const VIEWBOXES = [
        { w: 260.11, h: 206.39 },  // 0: first SVG = bottom-right of circle
        { w: 145.65, h: 210.63 },   // 1: second SVG = bottom-left of circle
        { w: 244.39, h: 134.74 }    // 2: third SVG = top arc of circle
      ];
      const isMobilePuzzle = typeof window !== 'undefined' && window.innerWidth <= 768;
      const mobileMargin = 24;
      let ROW_HEIGHT = isMobilePuzzle ? 210 : 255;
      let scale = ROW_HEIGHT / Math.max(...VIEWBOXES.map(v => v.h));
      let naturalSizes = VIEWBOXES.map(v => ({
        width: Math.round(v.w * scale),
        height: Math.round(v.h * scale)
      }));

      const KNOB_FRACTION = 0.88;
      let w0 = naturalSizes[0].width, h0 = naturalSizes[0].height;
      let w1 = naturalSizes[1].width, h1 = naturalSizes[1].height;
      let w2 = naturalSizes[2].width, h2 = naturalSizes[2].height;
      let overlapBottom = KNOB_FRACTION * Math.min(w0, w1);
      let bottomRowWidth = w1 + w0 - overlapBottom;
      const overlapVertical = 88;
      let assembledHeight = h2 + Math.max(h0, h1) - overlapVertical;
      let assembledW = Math.max(bottomRowWidth, w2);

      if (isMobilePuzzle && assembledW > W - mobileMargin) {
        const fitScale = (W - mobileMargin) / assembledW;
        ROW_HEIGHT = Math.floor(ROW_HEIGHT * fitScale);
        scale = ROW_HEIGHT / Math.max(...VIEWBOXES.map(v => v.h));
        naturalSizes = VIEWBOXES.map(v => ({
          width: Math.round(v.w * scale),
          height: Math.round(v.h * scale)
        }));
        w0 = naturalSizes[0].width; h0 = naturalSizes[0].height;
        w1 = naturalSizes[1].width; h1 = naturalSizes[1].height;
        w2 = naturalSizes[2].width; h2 = naturalSizes[2].height;
        overlapBottom = KNOB_FRACTION * Math.min(w0, w1);
        bottomRowWidth = w1 + w0 - overlapBottom;
        assembledHeight = h2 + Math.max(h0, h1) - overlapVertical;
        assembledW = Math.max(bottomRowWidth, w2);
      }

      const offsetX = Math.max(0, (W - assembledW) / 2);
      const containerH = Math.max(assembledHeight * 1.5, 480);
      const circleTop = (containerH - assembledHeight) / 2;
      const bottomRowY = circleTop + h2 - overlapVertical;

      const leftX = offsetX + (assembledW - bottomRowWidth) / 2;
      const rightX = leftX + w1 - overlapBottom;
      const arcX = offsetX + (assembledW - w2) / 2;
      const arcY = circleTop;

      const targets = [
        { x: rightX, y: bottomRowY + (Math.max(h0, h1) - h0) / 2 },   // node 0: bottom-right
        { x: leftX, y: bottomRowY + (Math.max(h0, h1) - h1) / 2 },    // node 1: bottom-left
        { x: arcX, y: arcY }                                             // node 2: top arc
      ];

      grid.style.position = 'relative';
      grid.style.minHeight = containerH + 'px';
      grid.style.width = '100%';
      grid.classList.add('resonance-grid--physics', 'resonance-grid--puzzle');

      let uniBg = grid.querySelector('.puzzle-unified-bg');
      if (!uniBg) {
        uniBg = document.createElement('div');
        uniBg.className = 'puzzle-unified-bg';
        grid.insertBefore(uniBg, grid.firstChild);
      }
      uniBg.style.left = offsetX + 'px';
      uniBg.style.top = circleTop + 'px';
      uniBg.style.width = assembledW + 'px';
      uniBg.style.height = assembledHeight + 'px';

      const assembledCenterX = offsetX + assembledW / 2;
      const assembledCenterY = circleTop + assembledHeight / 2;
      const assembledMax = Math.max(assembledW, assembledHeight);
      const targetOutlineSize = assembledMax * 0.85;
      const circleSize = assembledMax * 1.0;
      let targetOutline = grid.querySelector('.puzzle-target-outline');
      if (!targetOutline) {
        targetOutline = document.createElement('div');
        targetOutline.className = 'puzzle-target-outline';
        targetOutline.setAttribute('aria-hidden', 'true');
        grid.insertBefore(targetOutline, grid.firstChild);
      }
      targetOutline.style.left = assembledCenterX + 'px';
      targetOutline.style.top = assembledCenterY + 'px';
      targetOutline.style.width = targetOutlineSize + 'px';
      targetOutline.style.height = targetOutlineSize + 'px';

      let completion = grid.querySelector('.resonance-puzzle-complete');
      if (!completion) {
        completion = document.createElement('div');
        completion.className = 'resonance-puzzle-complete puzzle-complete-circle';
        completion.innerHTML = '<span class="puzzle-complete-text">Safe</span>';
        grid.appendChild(completion);
      } else {
        completion.innerHTML = '<span class="puzzle-complete-text">Safe</span>';
        completion.classList.add('puzzle-complete-circle');
      }

      completion.style.left = assembledCenterX + 'px';
      completion.style.top = assembledCenterY + 'px';
      completion.style.transform = 'translate(-50%, -50%)';
      completion.style.width = circleSize + 'px';
      completion.style.height = circleSize + 'px';
      completion.style.bottom = 'auto';

      const hideTargetOutline = () => {
        const outline = grid.querySelector('.puzzle-target-outline');
        if (outline) outline.classList.add('is-hidden');
      };
      grid.addEventListener('puzzle-complete', hideTargetOutline);

      let hint = grid.querySelector('.puzzle-hint');
      if (!hint) {
        hint = document.createElement('div');
        hint.className = 'puzzle-hint';
        hint.textContent = 'Drag puzzle pieces together';
        grid.appendChild(hint);
      }
      setTimeout(() => hint.classList.add('puzzle-hint-visible'), 600);

      const scatterY_top = 10;
      const scatterY_bottom = containerH - assembledHeight - 10;
      const margin = 16;
      const startPositions = [
        { x: margin + Math.random() * 30, y: scatterY_top + Math.random() * 20 },
        { x: (W - w1) / 2 + (Math.random() - 0.5) * 40, y: scatterY_bottom - Math.random() * 20 },
        { x: W - w2 - margin - Math.random() * 30, y: scatterY_top + Math.random() * 20 }
      ];

      let undoBtn = grid.querySelector('.resonance-puzzle-undo');
      if (!undoBtn) {
        undoBtn = document.createElement('button');
        undoBtn.type = 'button';
        undoBtn.className = 'resonance-puzzle-undo';
        undoBtn.textContent = 'Start again';
        undoBtn.setAttribute('aria-label', 'Start puzzle again');
        grid.appendChild(undoBtn);
      }

      const cards = nodes.map((node, i) => {
        const w = naturalSizes[i].width;
        const h = naturalSizes[i].height;
        const sx = Math.max(0, Math.min(W - w, startPositions[i].x));
        const sy = Math.max(0, Math.min(containerH - h, startPositions[i].y));

        node.style.position = 'absolute';
        node.style.left = '0';
        node.style.top = '0';
        node.style.width = w + 'px';
        node.style.height = h + 'px';
        node.style.margin = '0';
        node.style.boxSizing = 'border-box';
        node.style.willChange = 'transform';
        node.style.touchAction = 'none';
        node.classList.add('resonance-card--puzzle-piece', 'resonance-piece--' + (i + 1));
        node.classList.add('visible');
        node.setAttribute('tabindex', '0');

        return {
          node,
          index: i,
          x: sx,
          y: sy,
          targetX: targets[i].x,
          targetY: targets[i].y,
          width: w,
          height: h,
          locked: false
        };
      });

      const SNAP_DISTANCE = 80;
      const NEAR_DISTANCE = 120;
      const MAGNETIC_RADIUS = 130;
      const CLOSE_ENOUGH = 100;
      const CLUSTER_RADIUS = 95;

      function cardCenter(c) {
        return { x: c.x + c.width / 2, y: c.y + c.height / 2 };
      }
      function clusterCenter() {
        const centers = cards.map(cardCenter);
        return {
          x: centers.reduce((s, p) => s + p.x, 0) / 3,
          y: centers.reduce((s, p) => s + p.y, 0) / 3
        };
      }
      function allTogetherAnywhere() {
        const center = clusterCenter();
        return cards.every(c => {
          const p = cardCenter(c);
          return Math.hypot(p.x - center.x, p.y - center.y) <= CLUSTER_RADIUS;
        });
      }

      function renderCard(c) {
        c.node.style.setProperty('--puzzle-x', Math.round(c.x) + 'px');
        c.node.style.setProperty('--puzzle-y', Math.round(c.y) + 'px');
        if (c.locked) {
          c.node.classList.add('is-snapped');
          c.node.classList.remove('is-near-target', 'is-near');
        } else {
          c.node.classList.remove('is-snapped');
          const near = Math.hypot(c.targetX - c.x, c.targetY - c.y) < NEAR_DISTANCE;
          c.node.classList.toggle('is-near-target', near);
          c.node.classList.toggle('is-near', near);
        }
      }

      cards.forEach(c => renderCard(c));

      function allWithinClose() {
        return cards.every(c => Math.hypot(c.targetX - c.x, c.targetY - c.y) <= CLOSE_ENOUGH);
      }

      function checkSolved() {
        if (cards.every(c => c.locked)) {
          setTimeout(() => {
            grid.classList.add('puzzle-complete');
            completion.classList.add('visible', 'puzzle-complete-just-revealed');
            undoBtn.classList.add('visible');
            grid.dispatchEvent(new CustomEvent('puzzle-complete'));
            setTimeout(() => completion.classList.remove('puzzle-complete-just-revealed'), 1200);
          }, 350);
        }
      }

      function resetPuzzle() {
        grid.classList.remove('puzzle-complete');
        completion.classList.remove('visible');
        undoBtn.classList.remove('visible');
        const outline = grid.querySelector('.puzzle-target-outline');
        if (outline) outline.classList.remove('is-hidden');
        cards.forEach((c, i) => {
          c.locked = false;
          c.x = Math.max(0, Math.min(W - c.width, startPositions[i].x));
          c.y = Math.max(0, Math.min(containerH - c.height, startPositions[i].y));
          c.node.classList.remove('is-snapped', 'is-near-target', 'is-near');
          renderCard(c);
        });
      }

      undoBtn.addEventListener('click', resetPuzzle);

      let dragging = null;

      const MAGNETIC_ANIM_MS = 380;

      function clearDrag() {
        if (!dragging) return;
        const c = dragging.card;
        const pid = dragging.pointerId;
        dragging = null;
        c.node.classList.remove('is-dragging');
        try { c.node.releasePointerCapture(pid); } catch (_) {}
        const dist = Math.hypot(c.targetX - c.x, c.targetY - c.y);
        if (dist <= SNAP_DISTANCE) {
          c.x = c.targetX;
          c.y = c.targetY;
          c.locked = true;
          renderCard(c);
          checkSolved();
        } else if (dist <= MAGNETIC_RADIUS) {
          // Magnetic pull on release: smooth animate to target, then lock
          c.x = c.targetX;
          c.y = c.targetY;
          renderCard(c);
          setTimeout(() => {
            c.locked = true;
            renderCard(c);
            checkSolved();
          }, MAGNETIC_ANIM_MS);
        } else if (allWithinClose() || allTogetherAnywhere()) {
          cards.forEach((card) => {
            card.x = card.targetX;
            card.y = card.targetY;
            card.locked = true;
            renderCard(card);
          });
          checkSolved();
        } else {
          renderCard(c);
        }
      }

      function pointerDown(e, card) {
        if (card.locked || e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (hint && hint.style) hint.style.opacity = '0';
        dragging = {
          card,
          pointerId: e.pointerId,
          offsetX: e.clientX - (grid.getBoundingClientRect().left + card.x),
          offsetY: e.clientY - (grid.getBoundingClientRect().top + card.y)
        };
        card.node.classList.add('is-dragging');
        card.node.style.zIndex = '10';
        card.node.setPointerCapture(e.pointerId);
      }

      function pointerMove(e) {
        if (!dragging || dragging.pointerId !== e.pointerId) return;
        e.preventDefault();
        const c = dragging.card;
        const r = grid.getBoundingClientRect();
        let nx = e.clientX - r.left - dragging.offsetX;
        let ny = e.clientY - r.top - dragging.offsetY;
        nx = Math.max(-10, Math.min(W - c.width + 10, nx));
        ny = Math.max(-10, Math.min(containerH - c.height + 10, ny));
        // No magnetic pull while dragging – piece follows pointer exactly for easy control
        c.x = nx;
        c.y = ny;
        renderCard(c);
      }

      function pointerUp(e) {
        if (!dragging || e.pointerId !== dragging.pointerId) return;
        clearDrag();
      }

      function onLostCapture(e) {
        if (dragging && e.pointerId === dragging.pointerId) clearDrag();
      }

      cards.forEach(c => {
        c.node.addEventListener('pointerdown', e => pointerDown(e, c), { passive: false });
        c.node.addEventListener('lostpointercapture', onLostCapture);
      });

      document.addEventListener('pointermove', pointerMove, { passive: false });
      document.addEventListener('pointerup', pointerUp);
      document.addEventListener('pointercancel', pointerUp);
    });
  }

  const gridEl = document.querySelector('.resonance-grid--arc, .resonance-grid');
  if (gridEl) {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          runInit();
        }
      },
      { rootMargin: '200px', threshold: 0.01 }
    );
    observer.observe(gridEl);
  }

  setTimeout(runInit, 200);
  setTimeout(runInit, 1000);
  setTimeout(runInit, 2500);
}

/**
 * Design system: reveal [data-observe] elements with stagger (resonance cards, etc.)
 */
function initDesignSystemReveal() {
  const observed = document.querySelectorAll('[data-observe]');
  if (!observed.length) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    observed.forEach((el) => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = index * 120;
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  observed.forEach((el) => observer.observe(el));
}

// Sticky CTA (show after scrolling past hero)
function setupStickyCta() {
  const el = document.querySelector('[data-sticky-cta]');
  if (!el) return;
  const threshold = 800;
  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    el.classList.toggle('is-visible', y > threshold);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

// Staggered Text Reveals
function initStaggeredReveals() {
  const elements = document.querySelectorAll('[data-stagger-reveal]');
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.setAttribute('data-stagger-revealed', '');
        }, index * ANIMATION_CONSTANTS.STAGGER_DELAY);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach((el) => {
    observer.observe(el);
  });
}

// Quote Soft Reveal Animation
function initQuoteReveal() {
  const quoteWrap = document.querySelector('[data-quote-reveal]');
  if (!quoteWrap) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-quote-revealed', '');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  });

  observer.observe(quoteWrap);
}

// Pull quote: scroll-driven water-fill (green fills text as you scroll)
function initPullQuoteReveal() {
  const section = document.querySelector('[data-pull-quote-reveal]');
  if (!section) return;
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealRange = 480;

  const update = () => {
    if (reduceMotion) {
      section.style.setProperty('--quote-fill', '100%');
      return;
    }
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const startOffset = -vh * 0.3;
    const progress = Math.max(0, Math.min(1, (vh - rect.top + startOffset) / revealRange));
    section.style.setProperty('--quote-fill', (progress * 100) + '%');
    requestAnimationFrame(update);
  };
  update();
}

// Right decorative SVG fade-in on scroll from bottom
function initRightDecorativeSVG() {
  const svgElement = document.querySelector('.right-decorative-svg');
  if (!svgElement) return;

  const svgContent = svgElement.querySelector('.decorative-svg-content');
  if (!svgContent) return;

  function updateOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Start revealing when user has scrolled past 15% of the page
    const revealStart = documentHeight * 0.15;
    
    // Add data attribute when scrolled past reveal point to trigger CSS animation
    if (scrollY >= revealStart) {
      svgElement.setAttribute('data-fade-revealed', '');
    } else {
      svgElement.removeAttribute('data-fade-revealed');
    }
  }

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll(); // Initial check
}

// Center-right tree SVG grow animation on scroll - progressive reveal from bottom
function initCenterRightTree() {
  const treeElement = document.querySelector('.center-right-tree-svg');
  if (!treeElement) {
    if (IS_DEVELOPMENT) {
      console.warn('Center-right tree SVG element not found');
    }
    return;
  }

  const treeContent = treeElement.querySelector('.tree-svg-content');
  if (!treeContent) {
    if (IS_DEVELOPMENT) {
      console.warn('Tree SVG content not found');
    }
    return;
  }

  function updateOnScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;
    
    // Start revealing when user has scrolled past 5% of the page
    const revealStart = documentHeight * 0.05;
    // Complete reveal at 40% of page scroll
    const revealEnd = documentHeight * 0.4;
    
    // Calculate scroll progress (0 to 1)
    const scrollProgress = Math.max(0, Math.min(1, (scrollY - revealStart) / (revealEnd - revealStart)));
    
    // Set opacity and clip-path based on scroll progress
    if (scrollProgress > 0) {
      treeElement.setAttribute('data-tree-grow', '');
      // Reveal from bottom to top using clip-path
      // Start with 0% visible (fully clipped), end with 100% visible (fully revealed)
      // This makes it grow from the stump (bottom) upward
      const clipPercent = scrollProgress * 100; // 0% to 100%
      treeContent.style.clipPath = `inset(${100 - clipPercent}% 0 0 0)`;
      treeContent.style.transform = 'translateY(0)';
      // Subtle secret: very low opacity so tree feels like a whisper in the background
      const opacity = 0.02 + (scrollProgress * 0.05); // 0.02 to 0.07
      treeElement.style.opacity = opacity;
    } else {
      treeElement.removeAttribute('data-tree-grow');
      treeContent.style.clipPath = 'inset(100% 0 0 0)'; // Fully clipped from top
      treeContent.style.transform = 'translateY(0)';
      treeElement.style.opacity = '0';
    }
  }

  window.addEventListener('scroll', updateOnScroll, { passive: true });
  updateOnScroll(); // Initial check
}

/**
 * Loads decorative SVG paths for the resonance section
 * Fetches SVG file and injects paths into the decorative container
 * Applies decorative-path class for styling
 */
function loadResonanceDecorativeSVG() {
  const svgContainer = document.getElementById('resonance-decorative');
  if (!svgContainer) return;
  
  // Fetch the SVG file and replace the container with the loaded SVG
  fetch('assets/images/resonance-decorative.svg')
    .then(response => {
      if (!response.ok) throw new Error('Failed to fetch SVG');
      return response.text();
    })
    .then(svgText => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      
      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error('SVG parsing error');
      }
      
      const loadedSvg = svgDoc.documentElement;
      
      // Copy all paths from the loaded SVG
      const paths = loadedSvg.querySelectorAll('path');
      const pathsGroup = svgContainer.querySelector('.decorative-paths');
      
      if (!pathsGroup) {
        if (IS_DEVELOPMENT) {
          console.warn('Paths group not found');
        }
        return;
      }
      
      // Clear existing content
      while (pathsGroup.firstChild) {
        pathsGroup.removeChild(pathsGroup.firstChild);
      }
      
      // Add all paths with proper styling
      paths.forEach((path, index) => {
        const cloned = path.cloneNode(true);
        // Ensure the decorative-path class is applied
        cloned.classList.add('decorative-path');
        // Set fill and opacity directly on the path
        cloned.setAttribute('fill', '#7FA694');
        cloned.setAttribute('fill-opacity', '0.12');
        cloned.setAttribute('stroke', 'none');
        pathsGroup.appendChild(cloned);
      });
      
      if (IS_DEVELOPMENT && paths.length > 0) {
        console.log(`Loaded ${paths.length} decorative paths`);
      }
    })
    .catch(err => {
      if (IS_DEVELOPMENT) {
        console.warn('Could not load decorative SVG:', err);
      }
    });
}

// Approach page: scroll-reveal for image-led method sections
function initApproachPage() {
  if (!document.body.classList.contains('approach-page')) return;

  const sections = document.querySelectorAll('.approach-method');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-inview');
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );
  sections.forEach((el) => observer.observe(el));
}

/**
 * Final CTA "I'm here when you're ready": scroll-driven green fill,
 * serene gradual transition instead of binary toggle.
 */
function initFinalCtaScroll() {
  const section = document.querySelector('[data-final-cta-scroll].final-cta');
  const fillEl = section?.querySelector('.final-cta-fill');
  if (!section || !fillEl) return;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fillRange = 420;
  let inview = false;

  const update = () => {
    if (reduceMotion) {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        section.style.setProperty('--final-cta-progress', '1');
        document.body.classList.add('final-cta-inview');
      } else {
        section.style.setProperty('--final-cta-progress', '0');
        document.body.classList.remove('final-cta-inview');
      }
      requestAnimationFrame(update);
      return;
    }
    const rect = section.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.max(0, Math.min(1, (vh - rect.top - vh * 0.3) / fillRange));
    section.style.setProperty('--final-cta-progress', String(progress));
    if (progress > 0.75 && !inview) { inview = true; document.body.classList.add('final-cta-inview'); }
    else if (progress < 0.6 && inview) { inview = false; document.body.classList.remove('final-cta-inview'); }
    requestAnimationFrame(update);
  };
  update();
}

// Initialize all features
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApproachPage();
    initBadgeAnimations();
    initTreeStrokeDraw();
    setupPricingDropdown();
    initFAQSplitScreen();
    initQuoteReveal();
    initPullQuoteReveal();
    initVineSeparators();
    initStaggeredReveals();
    initResonanceReveal();
    initDesignSystemReveal();
    initFloatingCards();
    setupHeaderScroll();
    setupStickyCta();
    initLenis();
    initHeroParallax();
    initHeroFullbleedTilt();
    initHeroOfferBlock();
    initRightDecorativeSVG();
    initCenterRightTree();
    loadResonanceDecorativeSVG();
    initBadgeFlip();
    initFinalCtaScroll();
  });
} else {
  initApproachPage();
  initBadgeAnimations();
  initBadgeFlip();
  initFinalCtaScroll();
  initTreeStrokeDraw();
  setupPricingDropdown();
  initFAQSplitScreen();
  initQuoteReveal();
  initVineSeparators();
  initStaggeredReveals();
  initResonanceReveal();
  initDesignSystemReveal();
  initFloatingCards();
  setupHeaderScroll();
  setupStickyCta();
  initLenis();
  initHeroParallax();
  initHeroFullbleedTilt();
  initHeroOfferBlock();
  initRightDecorativeSVG();
  initCenterRightTree();
  loadResonanceDecorativeSVG();
  initBadgeFlip();
  initFinalCtaScroll();
}
