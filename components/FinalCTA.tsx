"use client";

import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section
      id="reach-out"
      className="px-[var(--gutter)] py-[var(--section-gap)] md:py-[120px]"
      aria-labelledby="cta-heading"
    >
      <div className="mx-auto max-w-content">
        <motion.div
          className="mx-auto max-w-2xl rounded-[var(--radius-card)] bg-[var(--color-ivory)] p-10 text-center shadow-card transition-shadow hover:shadow-card-hover md:p-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <blockquote className="font-display text-2xl font-light leading-snug text-[var(--color-charcoal)] md:text-3xl">
            I'm here when you're ready to begin.
          </blockquote>
          <p className="mt-4 font-label text-[11px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/70">
            Invitation
          </p>
          <a
            href="mailto:debi@debikitaytherapy.com"
            className="mt-8 inline-block rounded-[var(--radius-card)] bg-[var(--color-library)] px-8 py-4 text-[15px] font-medium text-[var(--color-ivory)] shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
          >
            Begin with a brief conversation
          </a>
        </motion.div>
      </div>
    </section>
  );
}
