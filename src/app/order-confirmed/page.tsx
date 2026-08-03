import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, Package, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed | DIA Enterprises",
  description: "Your order has been placed successfully. Thank you for shopping with DIA Enterprises.",
  robots: { index: false },
};

export default async function OrderConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; paid?: string }>;
}) {
  const { order, paid } = await searchParams;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 pb-24 pt-36 text-center sm:px-6">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-success/20 blur-3xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-success/15">
          <CheckCircle2 className="h-12 w-12 text-success" />
        </div>
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold sm:text-4xl">
        Order {paid ? "confirmed" : "placed"} successfully!
      </h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        {order ? (
          <>Your order number is <span className="font-bold text-foreground">{order}</span>. We&apos;ve sent the confirmation to your email.</>
        ) : (
          "We've received your order and will confirm it shortly."
        )}
      </p>
      <div className="mt-6 grid w-full max-w-md gap-3 rounded-3xl border bg-card p-6 text-left text-sm">
        <div className="flex items-center gap-3">
          <Package className="h-5 w-5 shrink-0 text-accent" />
          <span>Order confirmation emailed instantly</span>
        </div>
        <div className="flex items-center gap-3">
          <Printer className="h-5 w-5 shrink-0 text-accent" />
          <span>GST invoice downloadable from your dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
          <span>Live tracking once your order is dispatched</span>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/account/orders">
          <Button variant="gold" size="lg">Track My Order</Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
