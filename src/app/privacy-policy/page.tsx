import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${SITE.name} collects, uses and protects your personal information.`,
  path: "/privacy-policy",
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="1 January 2025">
      <p>
        At {SITE.name}, we respect your privacy. This policy explains what information we collect when you use our
        website, how we use it, and the choices you have.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li><strong>Account details</strong> — name, email, phone number, GSTIN when you register.</li>
        <li><strong>Order details</strong> — delivery addresses, order history, payment references.</li>
        <li><strong>Enquiries</strong> — messages, quotation requests and survey responses you send us.</li>
        <li><strong>Usage data</strong> — pages visited, device type and browsing behaviour for analytics.</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your orders and provide GST invoices.</li>
        <li>To respond to enquiries, quotations and support requests.</li>
        <li>To improve our website, products and services.</li>
        <li>To send updates or offers, only with your consent. You can unsubscribe anytime.</li>
      </ul>
      <h2>Payments & Security</h2>
      <p>
        Online payments are processed by Razorpay using industry-standard encryption. We do not store your card or
        bank details. Access to your personal data is restricted to authorised staff only.
      </p>
      <h2>Data Sharing</h2>
      <p>
        We never sell your data. We share information only with trusted partners — logistics providers, payment
        processors and IT services — strictly to fulfil your orders.
      </p>
      <h2>Your Rights</h2>
      <p>
        You may request a copy, correction or deletion of your personal data at any time by writing to {SITE.email}.
        We will respond within 30 days.
      </p>
      <h2>Contact</h2>
      <p>
        For any privacy concerns, contact us at {SITE.email} or {SITE.phone}.
      </p>
    </LegalPage>
  );
}
