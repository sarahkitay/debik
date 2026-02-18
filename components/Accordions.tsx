"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

const items = [
  {
    id: "narrative",
    title: "Narrative Therapy",
    desc: "Working with the stories shaping your life.",
    body: "We approach your life as rich and multi-layered. We look closely at the stories that have shaped you and how you see your life, many of which might have been inherited or imposed by others. Together, we will co-author new stories that reflect a richer understanding of who you are and who you want to be.",
  },
  {
    id: "menopause",
    title: "Menopause & Midlife",
    desc: "Supporting identity shift in midlife.",
    body: "I have advanced training in menopause-informed and midlife mental health, and support clients through identity shifts and life transitions that call for depth, context, and care. This work often involves grief, re-evaluation, and the emergence of new priorities.",
  },
  {
    id: "emdr",
    title: "EMDR",
    desc: "Shifting the influence of past experiences on the present.",
    body: "When appropriate, EMDR allows the nervous system to work with experiences that have not fully settled, without requiring repeated retelling of painful events. When patterns around substances, food, or compulsive behaviors are connected to past experiences, EMDR can help loosen what keeps those patterns in place.",
  },
];

export function Accordions() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="practical"
      className="px-[var(--gutter)] py-[var(--section-gap)] md:py-[120px]"
      aria-labelledby="modalities-heading"
    >
      <div className="mx-auto max-w-content">
        <p
          id="modalities-heading"
          className="font-label text-[11px] uppercase tracking-[0.15em] text-[var(--color-charcoal)]/70"
        >
          How I work with you
        </p>
        <h2 className="mt-2 font-display text-3xl font-light text-[var(--color-charcoal)] md:text-4xl">
          Modalities
        </h2>

        <ul className="mt-10 space-y-0" role="list">
          {items.map(({ id, title, desc, body }) => {
            const isOpen = openId === id;
            return (
              <li
                key={id}
                className={clsx(
                  "border-b border-[var(--color-charcoal)]/10 transition-colors",
                  isOpen && "border-l-4 border-l-[var(--color-library)]"
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : id)}
                  className="flex w-full items-start justify-between gap-4 py-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-library)]"
                  aria-expanded={isOpen}
                  aria-controls={`accordion-${id}`}
                  id={`accordion-${id}-button`}
                >
                  <span>
                    <span className="font-display text-xl font-normal text-[var(--color-charcoal)]">
                      {title}
                    </span>
                    <span className="mt-1 block text-sm text-[var(--color-charcoal)]/70">
                      {desc}
                    </span>
                  </span>
                  <motion.span
                    className="mt-1 shrink-0 text-2xl text-[var(--color-charcoal)]/60"
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{
                      duration: 0.45,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    aria-hidden
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`accordion-${id}`}
                      role="region"
                      aria-labelledby={`accordion-${id}-button`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.3 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
                          opacity: { duration: 0.2 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-8 text-base leading-body text-[var(--color-charcoal)]/90">
                        {body}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
