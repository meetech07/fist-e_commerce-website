"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ArrowRight, Award, Building2, Home, Truck } from "lucide-react";
import { Reveal, MotionItem, StaggerGroup } from "@/components/shared/Reveal";
import { useCountUp } from "@/hooks/useHooks";

const STATS = [
  { icon: Building2, value: 1200, suffix: "+", label: "Projects Delivered" },
  { icon: Home, value: 8500, suffix: "+", label: "Happy Customers" },
  { icon: Truck, value: 15, suffix: "+", label: "Cities Served" },
  { icon: Award, value: 12, suffix: "+", label: "Years of Excellence" },
];

function StatItem({ value, suffix, label, icon: Icon }: { value: number; suffix: string; label: string; icon: React.ComponentType<{ className?: string }> }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useCountUp(value, 1.8, inView);
  return (
    <div ref={ref} className="flex flex-col items-center gap-2 rounded-3xl border bg-card p-6 text-center shadow-sm">
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl gold-gradient text-charcoal">
        <Icon className="h-5 w-5" />
      </span>
      <span className="font-display text-3xl font-bold">
        {count.toLocaleString("en-IN")}
        <span className="gold-text">{suffix}</span>
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

export function CompanyIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="right" className="relative">
          <div className="relative overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400"
              alt="Premium false ceiling showroom"
              width={1200}
              height={900}
              className="aspect-[4/3] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
          </div>
          <div className="glass absolute -bottom-6 -right-2 hidden max-w-[240px] rounded-2xl p-5 shadow-2xl sm:block">
            <p className="font-display text-sm font-semibold leading-snug">
              Trusted by architects, builders & designers across India.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Since 2012</p>
          </div>
          <div className="absolute -left-4 -top-4 -z-10 h-40 w-40 rounded-3xl gold-gradient opacity-20 blur-2xl" />
        </Reveal>

        <div>
          <Reveal>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 gold-gradient" /> Who We Are
            </div>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
              One destination for the <span className="gold-text">finest interior materials</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              DIA Enterprises is a premium supplier of false ceiling materials, PVC ceiling panels, WPC wall panels,
              gypsum boards, ceiling channels, louvers and complete interior decorative hardware. From luxury homes to
              large commercial projects, we supply materials that combine aesthetics, durability and honest pricing.
            </p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              Every product is sourced from certified manufacturers, backed with warranty, and delivered with a
              GST-compliant invoice — whether you&apos;re buying one panel or a truckload.
            </p>
          </Reveal>
          <StaggerGroup className="mt-6 space-y-2.5">
            {[
              "Direct manufacturer partnerships & trade pricing",
              "Professional installation & site visit support",
              "Free material estimation & cost calculators",
              "Fast pan-India dispatch with reliable logistics",
            ].map((point) => (
              <MotionItem key={point}>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full gold-gradient">
                    <span className="h-1.5 w-1.5 rounded-full bg-charcoal" />
                  </span>
                  {point}
                </div>
              </MotionItem>
            ))}
          </StaggerGroup>
          <Reveal delay={0.2}>
            <Link href="/about">
              <motion.span
                whileHover={{ x: 6 }}
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                Learn more about us <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </Reveal>
        </div>
      </div>

      <StaggerGroup className="mt-16 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STATS.map((stat) => (
          <MotionItem key={stat.label}>
            <StatItem {...stat} />
          </MotionItem>
        ))}
      </StaggerGroup>
    </section>
  );
}
