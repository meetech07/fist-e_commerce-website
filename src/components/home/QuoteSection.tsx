"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarCheck, MessageSquareText, PhoneCall } from "lucide-react";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/business-config";
import { useBusinessSettings } from "@/lib/business-store";

export function QuoteSection() {
  const { settings } = useBusinessSettings();
  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;
  return (
    <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-charcoal px-6 py-14 text-white sm:px-14 sm:py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-accent/15 blur-[100px]" />
        </div>
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold-light">
              <CalendarCheck className="h-3.5 w-3.5" /> Get a quote in hours
            </p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Planning a project? <span className="gold-text">Let&apos;s estimate it together.</span>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-white/65">
              Send us your room sizes or upload a drawing — our team will prepare a detailed material list and
              quotation within 24 hours. Free for retail & bulk orders.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/quote">
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  className="inline-flex items-center gap-2 rounded-full gold-gradient px-7 py-3.5 text-sm font-bold text-charcoal shadow-xl shadow-accent/25"
                >
                  Request Quotation <ArrowRight className="h-4 w-4" />
                </motion.span>
              </Link>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-gold-light"
              >
                <MessageSquareText className="h-4 w-4" /> WhatsApp Us
              </a>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold transition hover:border-accent hover:text-gold-light"
              >
                <PhoneCall className="h-4 w-4" /> {settings.phone}
              </a>
            </div>
          </div>
          <div className="glass-dark hidden rounded-3xl p-6 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Average response time</p>
            <p className="mt-2 font-display text-4xl font-bold text-gold-light">24 hrs</p>
            <div className="mt-5 space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span>Quotation</span><span className="font-semibold">Free</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span>Site visit</span><span className="font-semibold">Free</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span>Sample kit</span><span className="font-semibold">Adjustable</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Design support</span><span className="font-semibold">Free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
