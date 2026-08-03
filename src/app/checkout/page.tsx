import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Secure Checkout",
  description: "Complete your order securely — Cash on Delivery, UPI or Razorpay online payment.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="mb-8 font-display text-4xl font-semibold">
        Secure <span className="gold-text">Checkout</span>
      </h1>
      <CheckoutFlow />
    </div>
  );
}
