"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BadgePercent, Gem, Headset, PackageCheck, Ruler, ShieldCheck, Timer, Truck } from "lucide-react";
import { StaggerGroup, MotionItem } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";

const REASONS = [
  {
    icon: Gem,
    title: "Premium Quality Only",
    desc: "Certified materials from leading manufacturers — inspected before dispatch.",
  },
  {
    icon: BadgePercent,
    title: "Honest Trade Pricing",
    desc: "Factory-direct rates with transparent margins. Bulk discounts for B2B buyers.",
  },
  {
    icon: Truck,
    title: "Fast Pan-India Delivery",
    desc: "Dispatched within 24–48 hrs. Reliable logistics partners for every pin code.",
  },
  {
    icon: Ruler,
    title: "Free Estimation",
    desc: "Ceiling & wall area calculators, plus expert advice on material quantity.",
  },
  {
    icon: PackageCheck,
    title: "GST Invoices",
    desc: "Every order ships with a compliant tax invoice — retail or wholesale.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Backed",
    desc: "Products with 10–15 year warranties and genuine after-sales support.",
  },
  {
    icon: Timer,
    title: "On-time Projects",
    desc: "Commitment that keeps your construction schedule on track, always.",
  },
  {
    icon: Headset,
    title: "Expert Support",
    desc: "Installation guidance, samples and site visits from our interior specialists.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-white lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(200,162,75,0.14),transparent_45%)]" />
      <div className="grain pointer-events-none absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="The DIA Enterprises difference"
          description="Why architects, builders and homeowners trust us with their most important spaces."
        />
        <StaggerGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((reason) => (
            <MotionItem key={reason.title}>
              <motion.div
                whileHover={{ y: -6 }}
                className="group h-full rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:border-accent/40 hover:bg-white/[0.07]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl gold-gradient text-charcoal shadow-lg shadow-accent/20 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <reason.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{reason.desc}</p>
              </motion.div>
            </MotionItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
