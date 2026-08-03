"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useBusinessSettings } from "@/lib/business-store";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { saveEnquiry } from "@/lib/enquiries-local";

export function ContactForm({ showHeading = false }: { showHeading?: boolean }) {
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = React.useState(false);
  const { settings } = useBusinessSettings();

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return toast.error("Please enter your name");
    if (!isValidEmail(form.email)) return toast.error("Please enter a valid email");
    if (form.phone && !isValidPhone(form.phone)) return toast.error("Please enter a valid 10-digit mobile number");
    if (form.message.trim().length < 10) return toast.error("Message should be at least 10 characters");

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        saveEnquiry({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          message: form.message,
          type: "contact",
        });
      }
      toast.success("Message sent! Our team will reach out shortly.");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast.error("Could not send your message. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      {showHeading && (
        <SectionHeading
          eyebrow="Contact Us"
          title="Let's build something beautiful"
          description="Questions, quotations, samples or site visits — we're one message away."
        />
      )}
      <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {[
            { icon: MapPin, title: "Showroom Address", value: `${settings.showroom.line1}, ${settings.showroom.line2}` },
            { icon: Phone, title: "Call Us", value: settings.phone },
            { icon: Mail, title: "Email Us", value: settings.email },
          ].map(({ icon: Icon, title, value }) => (
            <div key={title} className="flex items-start gap-4 rounded-2xl border bg-card p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gold-gradient text-charcoal">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
                <p className="mt-1 text-sm font-medium">{value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-charcoal p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-gold-light">Working Hours</p>
            <p className="mt-1 text-sm text-white/80">{settings.hours}</p>
            <p className="text-sm text-white/80">{settings.workDays}</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="c-name">Full Name *</Label>
              <Input id="c-name" placeholder="Your name" value={form.name} onChange={update("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-phone">Phone (optional)</Label>
              <Input id="c-phone" placeholder="10-digit mobile" value={form.phone} onChange={update("phone")} maxLength={10} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-email">Email *</Label>
              <Input id="c-email" type="email" placeholder="you@example.com" value={form.email} onChange={update("email")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-subject">Subject</Label>
              <Input id="c-subject" placeholder="What is this about?" value={form.subject} onChange={update("subject")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="c-msg">Message *</Label>
              <Textarea id="c-msg" rows={5} placeholder="Tell us about your project, quantities, city…" value={form.message} onChange={update("message")} />
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.99 }}>
            <Button type="submit" variant="gold" size="lg" className="mt-6 w-full" loading={loading}>
              {!loading && <Send className="h-4 w-4" />} Send Message
            </Button>
          </motion.div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            We usually respond within 2 business hours. Your data stays private.
          </p>
        </form>
      </div>
    </section>
  );
}
