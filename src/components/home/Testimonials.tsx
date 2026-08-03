"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Rating } from "@/components/shared/Rating";
import type { Testimonial } from "@/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), 4500);
    return () => clearInterval(timer);
  }, [paused, items.length]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="Client Reviews"
        title="Loved by designers & homeowners"
        description="Real experiences from the people we build with."
      />
      <div
        className="relative mx-auto max-w-3xl"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute -left-8 -top-8 z-0 text-accent/15">
          <Quote className="h-24 w-24 fill-current" />
        </div>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border bg-card p-8 shadow-soft sm:p-10"
        >
          <Rating value={current.rating} size="lg" />
          <p className="mt-5 text-lg leading-relaxed text-foreground/90 sm:text-xl">“{current.content}”</p>
          <div className="mt-7 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full gold-gradient font-display text-lg font-bold text-charcoal">
              {current.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </span>
            <div>
              <p className="font-semibold">{current.name}</p>
              <p className="text-sm text-muted-foreground">
                {current.role}{current.company ? ` · ${current.company}` : ""}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Testimonial ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 gold-gradient" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
