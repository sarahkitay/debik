"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function Hero() {
  const [anchorVisible, setAnchorVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnchorVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="begin"
      className="relative flex min-h-[90vh] flex-col justify-center px-[var(--gutter)] pt-28 pb-20 md:pt-36"
      aria-label="Introduction"
    >
      <div className="mx-auto w-full max-w-content">
        <div className="max-w-2xl">
          {/* Layer 1: Recognition */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-display text-3xl font-light leading-tight text-[var(--color-charcoal)] md:text-4xl md:leading-snug"
          >
            Something in your life is asking for your attention.
          </motion.p>

          {/* Layer 2: Anchor (credentials + description) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: anchorVisible ? 1 : 0, y: anchorVisible ? 0 : 16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-10 space-y-4"
          >
            <p className="font-label text-[11px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/70">
              Deborah Kitay, LMFT
            </p>
            <p className="max-w-xl text-base leading-body text-[var(--color-charcoal)]/90">
              I offer collaborative, non-pathologizing therapy using Narrative
              Therapy and EMDR, with advanced training in menopause-informed and
              midlife mental health. Together we look at what has shaped your
              life, so you can move forward with greater steadiness and
              intention.
            </p>
            {/* Soft CTA - no pressure */}
            <div className="pt-2">
              <a
                href="#reach-out"
                className="inline-block rounded-[var(--radius-card)] border-2 border-[var(--color-library)]/60 bg-transparent px-6 py-3 text-[15px] font-medium text-[var(--color-library)] transition-colors hover:border-[var(--color-library)] hover:bg-[var(--color-library)]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
              >
                Begin with a brief conversation
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator with pulse */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        aria-hidden
      >
        <motion.div
          className="h-10 w-6 rounded-full border-2 border-[var(--color-charcoal)]/30"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-[var(--color-charcoal)]/20"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </motion.div>
    </section>
  );
}
