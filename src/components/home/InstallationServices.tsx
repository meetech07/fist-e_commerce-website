import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Hammer, PencilRuler, PaintRoller, Ruler, ShieldCheck, Wrench } from "lucide-react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const SERVICES = [
  { icon: PencilRuler, title: "Design Consultation", desc: "Free layout & material selection guidance" },
  { icon: Ruler, title: "Site Measurement", desc: "Accurate on-site measurements & estimation" },
  { icon: Hammer, title: "False Ceiling Installation", desc: "Expert PVC, gypsum & POP ceiling fitting" },
  { icon: Wrench, title: "Panel & Cladding Installation", desc: "WPC walls, 3D panels & decorative cladding" },
  { icon: PaintRoller, title: "Finishing & Detailing", desc: "Cornices, mouldings & perfect edge finishing" },
  { icon: ShieldCheck, title: "Quality Check & Warranty", desc: "Post-installation inspection & support" },
];

export function InstallationServices() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Installation Services"
            title="Professional installation, done right"
            description="Don't risk your materials with unskilled hands. Our certified installers deliver flawless ceilings and walls — with a workmanship guarantee."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {SERVICES.map(({ icon: Icon, title, desc }) => (
              <Reveal key={title}>
                <div className="flex h-full items-start gap-3 rounded-2xl border bg-card p-4 transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl gold-gradient text-charcoal">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/quote" className={cn(buttonVariants({ variant: "gold", size: "lg" }))}>
                Book Free Site Visit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/installation" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                View Installation Process
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal direction="left" className="relative">
          <div className="grid grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=900"
                alt="Ceiling installation"
                width={800}
                height={1000}
                className="aspect-[3/4] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
            <div className="mt-8 space-y-4">
              <div className="overflow-hidden rounded-3xl">
                <Image
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900"
                  alt="Wall panel installation"
                  width={800}
                  height={600}
                  className="aspect-square object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <div className="glass rounded-3xl p-5">
                <p className="font-display text-sm font-semibold">Free site visit & quotation</p>
                <p className="mt-1 text-xs text-muted-foreground">Within 24 hours · Nagpur & nearby</p>
              </div>
            </div>
          </div>
          <div className="absolute -left-6 -top-6 -z-10 h-44 w-44 rounded-full gold-gradient opacity-15 blur-3xl" />
        </Reveal>
      </div>
    </section>
  );
}
