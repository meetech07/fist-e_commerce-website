"use client";

import { useBusinessSettings } from "@/lib/business-store";
import { SectionHeading } from "@/components/shared/SectionHeading";

export function MapSection() {
  const { settings } = useBusinessSettings();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
      <SectionHeading
        eyebrow="Find Us"
        title="Visit our showroom"
        description={`${settings.showroom.line1}, ${settings.showroom.line2} · ${settings.hours}`}
      />
      <div className="overflow-hidden rounded-3xl border shadow-soft">
        <iframe
          src={settings.mapEmbed}
          title={`${settings.companyName} Location`}
          className="h-[420px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </section>
  );
}
