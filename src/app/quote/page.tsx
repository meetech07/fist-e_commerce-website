"use client";

import * as React from "react";
import { ArrowRight, Calculator, CheckCircle2, MessageSquareText } from "lucide-react";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/business-config";
import { useBusinessSettings } from "@/lib/business-store";
import { formatINR, isValidEmail, isValidPhone } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { saveEnquiry } from "@/lib/enquiries-local";

interface MaterialOption {
  id: string;
  name: string;
  rate: number;
  installRate: number;
  description: string;
}

const MATERIALS: MaterialOption[] = [
  { id: "pvc", name: "PVC Ceiling Panels", rate: 85, installRate: 20, description: "Moisture-proof designer ceiling planks" },
  { id: "gypsum", name: "Gypsum False Ceiling", rate: 95, installRate: 25, description: "Fire-rated gypsum with GI frame" },
  { id: "wpc", name: "WPC Wall Panels", rate: 130, installRate: 22, description: "Waterproof wood-polymer cladding" },
  { id: "louver", name: "PVC Louvers / Partitions", rate: 150, installRate: 28, description: "Modern louvered screens & partitions" },
  { id: "3d", name: "3D Wall Panels", rate: 115, installRate: 24, description: "Textured acoustic-style panels" },
  { id: "channels", name: "Channels & Suspension System", rate: 28, installRate: 0, description: "GI channels, tees, hangers" },
];

const RATE_STEPS = [
  { upTo: 300, mult: 1 },
  { upTo: 1000, mult: 0.92 },
  { upTo: 3000, mult: 0.85 },
  { upTo: Infinity, mult: 0.78 },
];

export default function QuoteCalculator() {
  const [material, setMaterial] = React.useState(MATERIALS[0]);
  const [area, setArea] = React.useState(400);
  const [install, setInstall] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", city: "" });
  const { settings } = useBusinessSettings();

  const tier = RATE_STEPS.find((r) => area <= r.upTo) ?? RATE_STEPS[RATE_STEPS.length - 1];
  const rate = Math.round(material.rate * tier.mult);
  const materialCost = rate * area;
  const wastage = materialCost * 0.08;
  const accessories = materialCost * 0.06;
  const installCost = install ? material.installRate * area : 0;
  const subtotal = materialCost + wastage + accessories + installCost;
  const gst = settings.gstEnabled ? subtotal * (settings.gstRate / 100) : 0;
  const total = subtotal + gst;

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (!isValidEmail(form.email)) return toast.error("Please enter a valid email");
    if (form.phone && !isValidPhone(form.phone)) return toast.error("Please enter a valid 10-digit mobile number");
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          material: `${material.name} @ ${formatINR(rate)}/sq.ft`,
          area: `${area} sq.ft (est. ${formatINR(total)})`,
          message: `Estimated cost ${formatINR(total)} incl. GST. ${install ? "Installation required." : "Materials only."}`,
        }),
      });
      if (!res.ok) throw new Error("failed");
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        saveEnquiry({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: `QUOTE · ${material.name}`,
          message: `City: ${form.city}\nArea: ${area} sq.ft\nEstimated: ${formatINR(total)}\n\n${material.name} @ ${formatINR(rate)}/sq.ft`,
          type: "quote",
        });
      }
      toast.success("Quotation requested! We'll call you within 24 hours.");
      setForm({ name: "", email: "", phone: "", city: "" });
    } catch {
      toast.error("Could not submit. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `${WHATSAPP_DEFAULT_MESSAGE}\n\nMaterial: ${material.name}\nArea: ${area} sq.ft\nEstimated: ${formatINR(total)}`,
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
          <span className="h-px w-8 gold-gradient" /> Free Estimation <span className="h-px w-8 gold-gradient" />
        </div>
        <h1 className="font-display text-4xl font-semibold sm:text-5xl">Instant Material Cost Calculator</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Estimate the material budget for your ceiling or wall project in seconds. No sign-up needed.
        </p>
      </div>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            <h2 className="font-display text-xl font-semibold">Your Project</h2>
          </div>

          <div className="mt-5">
            <Label>Material Type</Label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {MATERIALS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterial(m)}
                  className={cn(
                    "rounded-2xl border p-3.5 text-left transition",
                    material.id === m.id ? "border-accent bg-accent/10 shadow-sm" : "hover:border-accent/50",
                  )}
                >
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.description}</p>
                  <p className="mt-1.5 text-xs font-bold text-accent">from {formatINR(m.rate)}/sq.ft</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Label>Area (sq.ft)</Label>
            <div className="mt-2 flex items-center gap-3">
              <input
                type="range"
                min={50}
                max={10000}
                step={50}
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="flex-1 accent-[#c8a24b]"
              />
              <span className="flex h-11 w-28 shrink-0 items-center justify-center rounded-xl border bg-background text-sm font-bold">{area.toLocaleString("en-IN")} ft²</span>
            </div>
          </div>

          <button
            onClick={() => setInstall((v) => !v)}
            className="mt-6 flex w-full items-center justify-between rounded-2xl border p-4 transition hover:border-accent/50"
          >
            <div className="text-left">
              <p className="text-sm font-semibold">Include professional installation</p>
              <p className="text-xs text-muted-foreground">{material.installRate > 0 ? `${formatINR(material.installRate)}/sq.ft by our trained team` : "Not applicable for this material"}</p>
            </div>
            <span className={cn("flex h-6 w-11 items-center rounded-full p-0.5 transition", install ? "bg-accent" : "bg-secondary")}>
              <span className={cn("h-5 w-5 rounded-full bg-white shadow transition-transform", install && "translate-x-5")} />
            </span>
          </button>
        </div>

        <div className="h-fit space-y-6">
          <div className="rounded-3xl bg-charcoal p-6 text-white sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Estimated Budget</p>
            <p className="mt-2 font-display text-5xl font-bold text-gold-light">{formatINR(total)}</p>
            <p className="mt-1 text-sm text-white/60">
              {settings.gstEnabled ? `incl. ${settings.gstRate}% GST · ` : ""}{area} sq.ft of {material.name.toLowerCase()}
            </p>
            <div className="mt-6 space-y-2.5 border-t border-white/10 pt-5 text-sm">
              <Row label={`Material @ ${formatINR(rate)}/ft²`} value={formatINR(materialCost)} />
              <Row label="Wastage (8%)" value={formatINR(wastage)} />
              <Row label="Accessories & trims" value={formatINR(accessories)} />
              <Row label="Installation" value={install ? formatINR(installCost) : "—"} />
              {settings.gstEnabled && <Row label={`GST (${settings.gstRate}%)`} value={formatINR(gst)} />}
              <div className="flex justify-between border-t border-white/10 pt-3 font-bold">
                <span>Total</span><span className="text-gold-light">{formatINR(total)}</span>
              </div>
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full border border-white/25 py-3 text-sm font-semibold transition hover:border-accent hover:text-gold-light">
              <MessageSquareText className="h-4 w-4" /> Send this estimate on WhatsApp
            </a>
          </div>

          <form onSubmit={submit} className="rounded-3xl border bg-card p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold">Lock in this estimate</h2>
            <p className="mt-1 text-sm text-muted-foreground">Our team will confirm exact pricing & availability.</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name} onChange={update("name")} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label>Mobile</Label>
                <Input value={form.phone} onChange={update("phone")} placeholder="10-digit" maxLength={10} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Email *</Label>
                <Input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>City</Label>
                <Input value={form.city} onChange={update("city")} placeholder="Nagpur" />
              </div>
            </div>
            <Button type="submit" variant="gold" size="lg" className="mt-5 w-full" loading={loading}>
              {!loading && <ArrowRight className="h-4 w-4" />} Request Free Quotation
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">Free site visit within Nagpur · Response in under 24 hrs</p>
          </form>
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-4xl gap-4 text-sm sm:grid-cols-3">
        {[
          { icon: CheckCircle2, title: "Accurate, not inflated", text: "Rates reflect current distributor pricing. Final quote is itemised." },
          { icon: CheckCircle2, title: "Free site visit", text: "In Nagpur? We measure and suggest materials for free." },
          { icon: CheckCircle2, title: "Trade discounts", text: "Contractors & bulk buyers get extra slab pricing automatically." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl border bg-card p-4">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/60">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
