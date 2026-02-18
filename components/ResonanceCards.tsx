"use client";

import { motion } from "framer-motion";

const items = [
  "You don't feel like yourself lately, and the way you understand yourself no longer fits.",
  "You're noticing your emotional responses feel more intense or less predictable, and it's beginning to affect your relationships or sense of self.",
  "You may have lived under a sense of \"never enough\" expressed through perfectionism, people pleasing, or over-functioning, and feel exhausted by expectations that don't reflect who you are or how you want to live.",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export function ResonanceCards() {
  return (
    <section
      id="resonance"
      className="px-[var(--gutter)] py-[var(--section-gap)] md:py-[120px]"
      aria-labelledby="resonance-heading"
    >
      <div className="mx-auto max-w-content">
        <motion.div
          className="max-w-3xl"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.p
            id="resonance-heading"
            className="font-label text-[11px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/70"
            variants={itemVariants}
          >
            This work might resonate if…
          </motion.p>
          <div className="mt-8 space-y-6">
            {items.map((text, i) => (
              <motion.p
                key={i}
                className="font-display text-xl font-light leading-body text-[var(--color-charcoal)] md:text-2xl"
                variants={itemVariants}
              >
                {text}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
