"use client";

import Link from "next/link";
import * as React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { useBusinessSettings } from "@/lib/business-store";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import { categoriesData } from "@/lib/constants";

function BrandIcon({ name, className }: { name: "facebook" | "instagram" | "linkedin" | "youtube" | "twitter"; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    facebook: <path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.3c0-.8.2-1.4 1.4-1.4h1.5V5.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2H8.1V14h2.4v7h3Z" />,
    instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4.5" />
        <circle cx="12" cy="12" r="3.6" />
        <circle cx="16.8" cy="7.2" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    linkedin: <path d="M6.5 8.8H3.8V21h2.7V8.8ZM5.1 3.8a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM20.2 13.9c0-3.1-1.6-5-4.2-5-1.7 0-2.7.8-3.2 1.7V8.8H10v12.2h2.8v-6.6c0-1.2.5-2.2 1.8-2.2 1.2 0 1.7.8 1.7 2.2v6.6H20.2v-7.1Z" />,
    youtube: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
        <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill="currentColor" stroke="none" />
      </>
    ),
    twitter: <path d="M21 6.5c-.7.3-1.4.5-2.1.6a3.6 3.6 0 0 0 1.6-2 7.4 7.4 0 0 1-2.3.9 3.6 3.6 0 0 0-6.2 3.3A10.3 10.3 0 0 1 3.7 5.6a3.6 3.6 0 0 0 1.1 4.8 3.6 3.6 0 0 1-1.6-.5v.1a3.6 3.6 0 0 0 2.9 3.6 3.6 3.6 0 0 1-1.6 0 3.6 3.6 0 0 0 3.4 2.5A7.3 7.3 0 0 1 3 17.3a10.2 10.2 0 0 0 5.6 1.6c6.7 0 10.4-5.6 10.4-10.4v-.5A7.4 7.4 0 0 0 21 6.5Z" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}

export function Footer() {
  const { settings } = useBusinessSettings();
  const socials: Array<{ name: "facebook" | "instagram" | "linkedin" | "youtube" | "twitter"; href: string; label: string }> = [
    { name: "facebook" as const, href: settings.social.facebook, label: "Facebook" },
    { name: "instagram" as const, href: settings.social.instagram, label: "Instagram" },
    { name: "linkedin" as const, href: settings.social.linkedin, label: "LinkedIn" },
    { name: "youtube" as const, href: settings.social.youtube, label: "YouTube" },
    { name: "twitter" as const, href: settings.social.twitter, label: "Twitter" },
  ].filter((s) => s.href);
  const gstLine = settings.gstEnabled && settings.gstin ? ` GSTIN: ${settings.gstin}` : "";

  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, rgba(200,162,75,0.15), transparent 50%)" }} />
      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo className="[&_span_text-muted-foreground]:text-white/60" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {settings.footerDescription}
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map(({ name, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-accent hover:bg-accent hover:text-charcoal"
                >
                  <BrandIcon name={name} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Shop</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              {categoriesData.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="transition hover:text-accent">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-white/65">
              <li><Link href="/about" className="transition hover:text-accent">About Us</Link></li>
              <li><Link href="/installation" className="transition hover:text-accent">Installation Services</Link></li>
              <li><Link href="/blog" className="transition hover:text-accent">Blog & Guides</Link></li>
              <li><Link href="/quote" className="transition hover:text-accent">Request Quotation</Link></li>
              <li><Link href="/categories" className="transition hover:text-accent">All Categories</Link></li>
              <li><Link href="/compare" className="transition hover:text-accent">Compare Products</Link></li>
              <li><Link href="/account/orders" className="transition hover:text-accent">Track Order</Link></li>
              <li><Link href="/account" className="transition hover:text-accent">My Account</Link></li>
              <li><Link href="/admin/login" className="transition hover:text-accent">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{settings.showroom.line1}, {settings.showroom.line2}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${settings.phoneRaw}`} className="transition hover:text-accent">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${settings.email}`} className="transition hover:text-accent">{settings.email}</a>
              </li>
            </ul>
            <p className="mt-4 text-xs text-white/45">{settings.hours}</p>
            <NewsletterForm dark />
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row">
          <p>{settings.footerCopyright.replace("{year}", String(new Date().getFullYear()))}{gstLine}</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="transition hover:text-accent">Privacy Policy</Link>
            <Link href="/terms" className="transition hover:text-accent">Terms</Link>
            <Link href="/refund-policy" className="transition hover:text-accent">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
