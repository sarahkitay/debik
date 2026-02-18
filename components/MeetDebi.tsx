"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function MeetDebi() {
  return (
    <section
      id="how-i-work"
      className="px-[var(--gutter)] py-[var(--section-gap)] md:py-[120px]"
      aria-labelledby="meet-debi-heading"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 gap-12 md:grid-cols-12 md:gap-[var(--gutter)]">
        {/* 40% - portrait */}
        <motion.div
          className="md:col-span-5"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-charcoal)]/5">
            <Image
              src="/images/debi-headshot.jpg"
              alt="Deborah Kitay, LMFT"
              fill
              className="object-cover blur-up"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
              onLoad={(e) => e.currentTarget.classList.add("loaded")}
            />
            {/* Vintage treatment overlay: desaturate + sepia + vignette via CSS */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[var(--radius-card)]"
              style={{
                background:
                  "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.15) 100%), linear-gradient(90deg, rgba(0,0,0,.08) 0%, transparent 20%, transparent 80%, rgba(0,0,0,.08) 100%)",
                mixBlendMode: "multiply",
              }}
            />
          </div>
        </motion.div>

        {/* 60% - content */}
        <motion.div
          className="flex flex-col justify-center md:col-span-7"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <h2
            id="meet-debi-heading"
            className="font-display text-3xl font-light text-[var(--color-charcoal)] md:text-4xl"
          >
            Meet Debi
          </h2>
          <p className="mt-4 font-label text-[11px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/70">
            Authority &amp; approach
          </p>
          <div className="mt-6 space-y-5 text-base leading-body text-[var(--color-charcoal)]/90">
            <p>
              I work with people who are thoughtful, capable, and who are
              questioning ways of being that once made sense but no longer feel
              aligned. Together, we look at what has shaped your life, so you can
              move forward with greater steadiness and intention.
            </p>
            <p>
              I also have advanced training in menopause-informed and midlife
              mental health, and support clients through identity shifts and life
              transitions that deserve depth, context, and care.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
