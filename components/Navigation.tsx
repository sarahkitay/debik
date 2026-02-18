"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { clsx } from "clsx";

const navLinks = [
  { href: "#begin", label: "Begin Here" },
  { href: "#how-i-work", label: "How I Work With You" },
  { href: "#practical", label: "Practical Questions" },
  { href: "#reach-out", label: "Reach Out" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-paper)]/95 backdrop-blur-[8px] shadow-sm"
          : "bg-transparent"
      )}
      role="banner"
    >
      <nav
        className="mx-auto flex max-w-content items-center justify-between gap-8 px-[var(--gutter)] py-5"
        aria-label="Primary"
      >
        <Link
          href="/#begin"
          className="font-display text-xl font-normal text-[var(--color-charcoal)] hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
        >
          Deborah Kitay, LMFT
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-10 md:flex">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-[15px] tracking-wide text-[var(--color-charcoal)]/90 hover:text-[var(--color-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA - magnetic effect container */}
        <div className="relative hidden md:block">
          <Link
            href="#reach-out"
            className="MagneticCTA inline-block rounded-[var(--radius-card)] bg-[var(--color-library)] px-6 py-3 text-[15px] font-medium text-[var(--color-ivory)] shadow-card transition-shadow hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
            aria-label="Begin with a brief conversation"
          >
            Begin with a brief conversation
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={clsx(
              "h-0.5 w-5 bg-[var(--color-charcoal)] transition-all",
              menuOpen && "translate-y-2 rotate-45"
            )}
          />
          <span
            className={clsx(
              "h-0.5 w-5 bg-[var(--color-charcoal)] transition-opacity",
              menuOpen && "opacity-0"
            )}
          />
          <span
            className={clsx(
              "h-0.5 w-5 bg-[var(--color-charcoal)] transition-all",
              menuOpen && "-translate-y-2 -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div
        id="site-menu"
        className={clsx(
          "overflow-hidden border-t border-[var(--color-charcoal)]/10 bg-[var(--color-paper)]/98 backdrop-blur-md transition-all duration-300 md:hidden",
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-[var(--gutter)] py-4">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 text-[var(--color-charcoal)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-library)]"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="#reach-out"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-block rounded-[var(--radius-card)] bg-[var(--color-library)] px-6 py-3 text-[15px] font-medium text-[var(--color-ivory)]"
            >
              Begin with a brief conversation
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
