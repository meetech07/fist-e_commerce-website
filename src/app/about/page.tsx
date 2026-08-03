import Image from "next/image";
import type { Metadata } from "next";
import { Award, Factory, Handshake, ShieldCheck, Truck } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { MapSection } from "@/components/home/MapSection";
import { getTestimonials } from "@/lib/data";

export const metadata: Metadata = buildMetadata({
  title: "About DIA Enterprises",
  description:
    "Nagpur's trusted supplier of false ceiling materials, PVC ceiling panels, WPC wall panels and interior solutions since 2012. Direct from manufacturers, delivered pan-India.",
  path: "/about",
});

const VALUES = [
  { icon: Factory, title: "Direct Sourcing", text: "We partner with certified manufacturers, cutting middlemen so you get factory pricing without compromising on quality." },
  { icon: ShieldCheck, title: "Guaranteed Quality", text: "Every batch is inspected for thickness, finish and consistency. Products ship with manufacturer warranty." },
  { icon: Truck, title: "Pan-India Dispatch", text: "Bulk B2B orders dispatch within 24–48 hours from our Nagpur warehouse through trusted logistics partners." },
  { icon: Handshake, title: "Honest Pricing", text: "Transparent, GST-compliant pricing on every order — retail or trade. No hidden charges, ever." },
];

const TIMELINE = [
  { year: "2012", text: "Founded as a small ceiling-materials store in Nagpur." },
  { year: "2015", text: "Expanded into PVC panels and gypsum board distribution." },
  { year: "2018", text: "Became an authorized distributor for leading national brands." },
  { year: "2021", text: "Launched in-house installation & turnkey interior services." },
  { year: "2024", text: "Crossed 8,500+ projects delivered across 15+ cities." },
];

export default async function AboutPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2000" alt="Premium interiors" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 text-center sm:px-6">
          <div className="mx-auto mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-8 gold-gradient" /> Since 2012 <span className="h-px w-8 gold-gradient" />
          </div>
          <h1 className="font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Crafting spaces with <span className="gold-text">material excellence</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            DIA Enterprises is a premium supplier of false ceiling materials, PVC & WPC panels, gypsum boards and
            complete interior solutions — trusted by architects, builders, contractors and homeowners across India.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl border bg-card p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl gold-gradient text-charcoal">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
              <span className="h-px w-8 gold-gradient" /> Our Journey
            </div>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">A decade of building trust, ceiling by ceiling</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              What started as a modest ceiling-material store has grown into one of Central India&apos;s most reliable
              interior material suppliers. We&apos;ve outfitted luxury villas, offices, hospitals, hotels and thousands of
              homes — always with the same promise: the right material, at the right price, delivered on time.
            </p>
            <div className="mt-8 space-y-0">
              {TIMELINE.map((item, i) => (
                <div key={item.year} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < TIMELINE.length - 1 && <span className="absolute left-[13px] top-8 h-full w-px bg-accent/30" />}
                  <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full gold-gradient text-[10px] font-bold text-charcoal">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-accent">{item.year}</p>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-3xl shadow-soft">
              <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200" alt="Our work" width={1200} height={900} className="aspect-[4/3] object-cover" />
            </div>
            <div className="glass absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl p-4 shadow-2xl">
              <Award className="h-8 w-8 text-accent" />
              <div>
                <p className="font-display text-sm font-semibold">Certified Materials</p>
                <p className="text-xs text-muted-foreground">ISI & fire-rated options</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-24">
        <WhyChooseUs />
      </div>
      <Testimonials items={testimonials} />
      <MapSection />
    </div>
  );
}
