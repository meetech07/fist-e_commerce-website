import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { ContactForm } from "@/components/home/ContactForm";
import { MapSection } from "@/components/home/MapSection";
import { QuoteSection } from "@/components/home/QuoteSection";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Reach DIA Enterprises for false ceiling materials, PVC & WPC panels, quotations, samples and installation services. Call, WhatsApp, email or visit our Nagpur showroom.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="pb-24 pt-16">
      <ContactForm showHeading />
      <MapSection />
      <QuoteSection />
    </div>
  );
}
