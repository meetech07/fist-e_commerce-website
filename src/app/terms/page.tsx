import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description: `Terms and conditions for using the ${SITE.name} website and services.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="1 January 2025">
      <p>
        By accessing this website and placing an order, you agree to the following terms between you and {SITE.name}.
      </p>
      <h2>Products & Pricing</h2>
      <ul>
        <li>All prices are in Indian Rupees (₹) and include GST unless stated otherwise.</li>
        <li>Product images are indicative; actual finish may vary slightly by batch.</li>
        <li>We reserve the right to revise prices, availability and specifications without prior notice.</li>
        <li>Trade/bulk pricing requires a quotation and may differ from listed retail prices.</li>
      </ul>
      <h2>Orders & Acceptance</h2>
      <p>
        An order is confirmed only when payment is successfully received (or COD order is accepted) and our system
        generates an order number. We may cancel orders that appear fraudulent, mispriced or out of stock, and will
        refund in full in such cases.
      </p>
      <h2>Delivery</h2>
      <ul>
        <li>Dispatch timelines are estimates and may vary during peak seasons or remote locations.</li>
        <li>For bulk orders, delivery slots are confirmed by our sales team.</li>
        <li>Please inspect goods at delivery; report damages within 48 hours with photos.</li>
      </ul>
      <h2>Warranty</h2>
      <p>
        Manufacturer warranties apply to products as specified by their brands. Installation workmanship is covered
        under our workmanship guarantee for the period stated on your invoice. Warranty does not cover misuse,
        improper installation by third parties, or normal wear.
      </p>
      <h2>Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {SITE.name} is not liable for indirect or consequential damages
        arising from the use of our products or website. Our total liability is limited to the value of the order in
        question.
      </p>
      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes are subject to the exclusive jurisdiction of the
        courts of Nagpur, Maharashtra.
      </p>
    </LegalPage>
  );
}
