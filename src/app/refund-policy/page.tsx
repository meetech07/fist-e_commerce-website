import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/LegalPage";

export const metadata: Metadata = buildMetadata({
  title: "Refund & Return Policy",
  description: `Returns, exchanges and refunds policy for ${SITE.name}.`,
  path: "/refund-policy",
});

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Return Policy" updated="1 January 2025">
      <p>
        We want you to be completely satisfied. Here&apos;s how returns, exchanges and refunds work at {SITE.name}.
      </p>
      <h2>Damaged or Defective Goods</h2>
      <ul>
        <li>Report damages within 48 hours of delivery with clear photos and your order number.</li>
        <li>We will replace damaged items or issue a full refund at no cost to you.</li>
        <li>For bulk orders, replacement claims must be raised within 3 days of receipt.</li>
      </ul>
      <h2>Change of Mind</h2>
      <ul>
        <li>Unused, unopened products in original packaging may be returned within 7 days of delivery.</li>
        <li>A restocking fee of 10% applies for non-defective returns.</li>
        <li>Return shipping is borne by the customer unless the return is due to our error.</li>
        <li>Cut-to-size, custom-colour and installation services are not returnable.</li>
      </ul>
      <h2>Refund Timelines</h2>
      <ul>
        <li>Online payments are refunded to the original payment method within 5–7 business days of approval.</li>
        <li>COD orders are refunded via bank transfer/NEFT after you share account details.</li>
        <li>Refund status can be tracked in your order history or by contacting us.</li>
      </ul>
      <h2>Cancellations</h2>
      <p>
        Orders can be cancelled free of charge before dispatch. Once dispatched, cancellation is subject to the
        standard return policy above. Payments for cancelled orders are refunded in full within 3–5 business days.
      </p>
      <h2>How to Start a Return</h2>
      <p>
        Go to <strong>My Account → Orders</strong> and raise a return request, or write to {SITE.email} with your
        order number. Our team will respond within 24 hours.
      </p>
    </LegalPage>
  );
}
