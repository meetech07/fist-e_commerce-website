import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ClipboardList, FileCheck2, Hammer, Ruler, ShieldCheck, Truck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { InstallationServices } from "@/components/home/InstallationServices";
import { QuoteSection } from "@/components/home/QuoteSection";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/shared/Reveal";

export const metadata: Metadata = buildMetadata({
  title: "Installation Services",
  description:
    "Professional false ceiling, PVC & WPC panel installation by Paras Enterprises. Free site visits, certified installers and a workmanship guarantee in Nagpur.",
  path: "/installation",
});

const PROCESS = [
  { icon: ClipboardList, title: "Free Consultation", text: "Share your room sizes or a sketch. We suggest the best material for your budget and style." },
  { icon: Ruler, title: "Site Measurement", text: "Our team visits to measure precisely and check for services, beams and existing structure." },
  { icon: FileCheck2, title: "Itemised Quote", text: "A transparent, GST-inclusive quotation with material + labour broken down line by line." },
  { icon: Truck, title: "Material Delivery", text: "Materials arrive at your site on schedule — inspected and packed to avoid damage." },
  { icon: Hammer, title: "Flawless Installation", text: "Certified installers complete the work with clean lines, level surfaces and tidy finishing." },
  { icon: ShieldCheck, title: "Handover & Warranty", text: "We inspect together, hand over care guidelines, and back the work with a warranty." },
];

const AREAS = ["Nagpur", "Wardha", "Chandrapur", "Amravati", "Gondia", "Katol", "Kamptee", "Hingna", "Manish Nagar", "Pardi", "Dharampeth", "Besa"];

export default function InstallationPage() {
  return (
    <div className="pb-24 pt-16">
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 gold-gradient" /> Turnkey Installation
            </div>
            <h1 className="font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Materials from us. <span className="gold-text">Perfection from our team.</span>
            </h1>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              We don&apos;t just supply materials — we install them with the same care. From a single living-room
              ceiling to complete office fit-outs, our in-house crew ensures every line is level and every joint is
              flawless.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/quote" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>Book Free Site Visit</Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Talk to Our Team</Link>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl shadow-soft">
            <Image
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1400"
              alt="Professional installation in progress"
              width={1200}
              height={900}
              className="aspect-[4/3] object-cover"
            />
          </div>
        </div>
      </section>

      <InstallationServices />

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="rounded-[2.5rem] border bg-card p-8 sm:p-14">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 gold-gradient" /> How It Works <span className="h-px w-8 gold-gradient" />
            </div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Six steps to a perfect finish</h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PROCESS.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.05}>
                <div className="relative h-full rounded-3xl border bg-background/60 p-6">
                  <span className="absolute right-5 top-5 font-display text-4xl font-bold text-accent/15">{String(i + 1).padStart(2, "0")}</span>
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl gold-gradient text-charcoal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="rounded-[2.5rem] bg-charcoal px-6 py-12 text-white sm:px-12">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">Currently serving across Central India</h2>
              <p className="mt-2 text-sm text-white/60">On-site installation available in these areas; pan-India material dispatch everywhere.</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {AREAS.map((a) => (
              <span key={a} className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium">{a}</span>
            ))}
          </div>
        </div>
      </section>

      <QuoteSection />
    </div>
  );
}
