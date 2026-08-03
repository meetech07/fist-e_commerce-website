"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GALLERY } from "@/lib/constants";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function Gallery() {
  const categories = ["All", ...Array.from(new Set(GALLERY.map((g) => g.category)))];
  const [active, setActive] = React.useState("All");
  const items = active === "All" ? GALLERY : GALLERY.filter((g) => g.category === active);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
      <SectionHeading
        eyebrow="Project Gallery"
        title="Our work speaks for itself"
        description="A glimpse of ceilings and walls we've crafted across homes, offices and hotels."
      />
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              active === c ? "bg-primary text-primary-foreground shadow-lg" : "border bg-card hover:border-accent"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <motion.div layout className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.div
            layout
            key={item.image}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-2xl"
          >
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={600}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">{item.category}</p>
              <p className="font-display text-sm font-semibold text-white">{item.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
