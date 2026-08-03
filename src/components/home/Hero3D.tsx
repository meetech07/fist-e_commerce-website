"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles, Truck, Wallet, ShieldCheck } from "lucide-react";

const HeroCanvas = dynamic(() => import("@/components/home/three/HeroCanvas"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-charcoal" />,
});

export function Hero3D() {
  const [webgl, setWebgl] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const supported = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
      setWebgl(supported);
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-charcoal text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,162,75,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(200,162,75,0.08),transparent_45%)]" />
        <div className="grain absolute inset-0 opacity-40" />
        {webgl !== false && (
          <div className="absolute inset-0 opacity-90">
            <HeroCanvas />
          </div>
        )}
        {webgl === false && <StaticFallback />}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/45 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-charcoal to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-32 sm:px-6">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }}
          className="max-w-2xl"
        >
          <motion.div
            variants={item}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Since 2012 · B2B & B2C · Pan-India
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Luxury Ceilings.
            <br />
            <span className="gold-text">Walls that Wow.</span>
            <br />
            Built to Last.
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            Premium false ceiling materials, PVC & WPC panels, gypsum boards and designer interior
            hardware — crafted for architects, builders and homes across India.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full gold-gradient px-7 py-3.5 text-sm font-bold text-charcoal shadow-xl shadow-accent/30"
              >
                Explore Collection <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
            <Link href="/quote">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:border-accent hover:text-gold-light"
              >
                Request Quotation
              </motion.span>
            </Link>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {[
              { icon: Truck, label: "Pan-India Delivery" },
              { icon: Wallet, label: "Trade Pricing" },
              { icon: ShieldCheck, label: "GST Invoice" },
              { icon: BadgeCheck, label: "Certified Materials" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur">
                <Icon className="h-4 w-4 shrink-0 text-gold-light" />
                <span className="text-[11px] font-medium leading-tight text-white/75">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/50"
      >
        <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em]">
          Scroll
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
            <rect x="1" y="1" width="16" height="24" rx="8" stroke="currentColor" strokeOpacity="0.5" />
            <motion.circle
              cx="9" cy="8" r="2.5" fill="#c8a24b"
              animate={{ y: [0, 8, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

function StaticFallback() {
  return (
    <div className="absolute inset-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000"
        alt="Luxury false ceiling"
        className="h-full w-full object-cover opacity-40"
      />
    </div>
  );
}
