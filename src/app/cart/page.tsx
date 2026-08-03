import type { Metadata } from "next";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Your Cart",
  description: "Review the items in your cart before checkout. Free delivery above ₹5,000.",
  path: "/cart",
});

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <h1 className="mb-8 font-display text-4xl font-semibold">
        Shopping <span className="gold-text">Cart</span>
      </h1>
      <CartPageClient />
    </div>
  );
}
