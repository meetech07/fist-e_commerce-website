"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, Lock, ShieldCheck, Wallet, Zap } from "lucide-react";
import { useCart } from "@/lib/store/store";
import { calculateBreakdown, calcDiscount, type ShippingConfig } from "@/lib/prices";
import { formatINR, isValidEmail, isValidPhone, isValidGstin, orderId } from "@/lib/utils";
import { mockCoupons } from "@/lib/data/mock-data";
import { openRazorpay } from "@/lib/razorpay";
import { useBusinessSettings } from "@/lib/business-store";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { Address } from "@/types";
import { cn } from "@/lib/utils";

export function CheckoutFlow() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const { settings } = useBusinessSettings();

  const shippingConfig: ShippingConfig = {
    enabled: settings.freeShippingEnabled,
    threshold: settings.shippingThreshold,
    fee: settings.shippingFee,
  };

  const [address, setAddress] = React.useState<Address>({
    type: "home",
    name: "",
    phone: "",
    email: "",
    line1: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
  });
  const [notes, setNotes] = React.useState("");
  const [gstin, setGstin] = React.useState("");
  const [payment, setPayment] = React.useState<"razorpay" | "upi" | "cod">("razorpay");
  const [couponCode, setCouponCode] = React.useState("");
  const [coupon, setCoupon] = React.useState<{ type: "percent" | "fixed"; value: number; min_cart: number; max_discount: number } | null>(null);
  const [applied, setApplied] = React.useState(false);
  const [placing, setPlacing] = React.useState(false);
  const [agree, setAgree] = React.useState(false);

  const breakdown = calculateBreakdown(cart, applied ? couponCode : undefined, coupon ?? undefined, shippingConfig);

  const update = (key: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((a) => ({ ...a, [key]: e.target.value }));

  const validate = () => {
    if (address.name.trim().length < 2) return "Please enter the recipient name";
    if (!isValidPhone(address.phone)) return "Please enter a valid 10-digit mobile number";
    if (!address.email || !isValidEmail(address.email)) return "Please enter a valid email for the invoice";
    if (address.line1.trim().length < 5) return "Please enter a valid address";
    if (!address.city.trim()) return "Please enter your city";
    if (!address.state.trim()) return "Please enter your state";
    if (!/^\d{6}$/.test(address.pincode)) return "Please enter a valid 6-digit PIN code";
    if (gstin && !isValidGstin(gstin)) return "Please enter a valid GSTIN";
    if (!agree) return "Please accept the terms & conditions";
    return null;
  };

  const applyCoupon = () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return toast.error("Enter a coupon code");
    const found = mockCoupons.find((c) => c.code === code);
    if (!found) return toast.error("Invalid coupon code");
    if (breakdown.subtotal < found.min_cart)
      return toast.error(`Add items worth ${formatINR(found.min_cart)} to use ${code}`);
    setCoupon(found);
    setApplied(true);
    toast.success(`Coupon ${code} applied — you save ${formatINR(calcDiscount(breakdown.subtotal, code, found))}`);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setApplied(false);
    setCouponCode("");
  };

  const createOrderRecord = async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("order-create-failed");
      return res.json();
    } catch {
      const orders = JSON.parse(localStorage.getItem("pe_orders") ?? "[]") as unknown[];
      localStorage.setItem(
        "pe_orders",
        JSON.stringify([
          {
            ...payload,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...orders,
        ]),
      );
      return { ok: true, orderId: `local_${Date.now()}` };
    }
  };

  const placeOrder = async () => {
    const error = validate();
    if (error) return toast.error(error);
    if (cart.length === 0) return toast.error("Your cart is empty");

    setPlacing(true);
    const orderNumber = orderId(settings.orderPrefix);
    const items = cart.map((i) => ({
      productId: i.productId,
      name: i.name,
      image: i.image,
      price: i.price,
      mrp: i.mrp,
      gst: i.gst,
      quantity: i.quantity,
      color: i.color,
      size: i.size,
      unit: i.unit,
    }));

    const baseOrder = {
      order_number: orderNumber,
      invoice_number: orderId(settings.invoicePrefix),
      customer_name: address.name,
      customer_email: address.email,
      customer_phone: address.phone,
      items,
      subtotal: breakdown.subtotal,
      discount: breakdown.discount,
      coupon_code: applied ? couponCode.toUpperCase() : null,
      gst_amount: breakdown.gstAmount,
      shipping: breakdown.shipping,
      total: Math.round(breakdown.total * 100) / 100,
      address: { ...address, type: address.type },
      notes: notes || null,
      gstin: gstin || null,
      status: "pending",
    };

    try {
      if (payment === "cod") {
        await createOrderRecord({ ...baseOrder, payment_method: "cod", payment_status: "pending" });
        toast.success("Order placed! Pay on delivery.");
        clearCart();
        router.push(`/order-confirmed?order=${orderNumber}`);
        return;
      }

      // Online payment via Razorpay
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(breakdown.total * 100), currency: settings.currencyCode }),
      });
      const razorpayOrder = await orderRes.json();
      if (!orderRes.ok || !razorpayOrder.id) throw new Error("razorpay-order-failed");

      await openRazorpay({
        amount: Math.round(breakdown.total * 100),
        currency: settings.currencyCode,
        name: settings.legalName,
        description: `Order ${orderNumber}`,
        order_id: razorpayOrder.id,
        prefill: { name: address.name, email: address.email!, contact: address.phone },
        notes: { order_number: orderNumber },
        theme: { color: "#c8a24b" },
        handler: async (response) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verified = await verifyRes.json();
          if (!verified.ok) throw new Error("verification-failed");

          await createOrderRecord({
            ...baseOrder,
            payment_method: "razorpay",
            payment_status: "paid",
            payment_id: response.razorpay_payment_id,
            status: "confirmed",
          });
          toast.success("Payment successful! Order confirmed.");
          clearCart();
          router.push(`/order-confirmed?order=${orderNumber}&paid=1`);
        },
      });
    } catch (err) {
      if ((err as Error).message === "Payment window closed") {
        toast.info("Payment cancelled. You can retry anytime.");
      } else {
        toast.error("Something went wrong placing your order. Please try again.");
      }
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed py-24 text-center">
        <p className="font-display text-2xl font-semibold">Nothing to check out yet</p>
        <p className="mt-2 text-sm text-muted-foreground">Your cart is empty.</p>
        <Link href="/products" className={cn(buttonVariants({ variant: "gold" }), "mt-5")}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <CheckoutSection step={1} title="Delivery Address">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full Name *"><Input value={address.name} onChange={update("name")} placeholder="Recipient name" /></Field>
            <Field label="Mobile Number *"><Input value={address.phone} onChange={update("phone")} placeholder="10-digit mobile" maxLength={10} /></Field>
            <Field label="Email for Invoice *" className="sm:col-span-2"><Input type="email" value={address.email} onChange={update("email")} placeholder="you@example.com" /></Field>
            <Field label="Address (House / Shop No, Street) *" className="sm:col-span-2">
              <Input value={address.line1} onChange={update("line1")} placeholder="House no, street, area" />
            </Field>
            <Field label="Landmark"><Input value={address.landmark ?? ""} onChange={update("landmark")} placeholder="Near…" /></Field>
            <Field label="City *"><Input value={address.city} onChange={update("city")} placeholder="City" /></Field>
            <Field label="State *"><Input value={address.state} onChange={update("state")} placeholder="State" /></Field>
            <Field label="PIN Code *"><Input value={address.pincode} onChange={update("pincode")} placeholder="6-digit PIN" maxLength={6} /></Field>
            <Field label="GSTIN (for B2B invoice)"><Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="e.g. 27ABCDE1234F1Z5" /></Field>
          </div>
        </CheckoutSection>

        <CheckoutSection step={2} title="Payment Method">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { id: "razorpay" as const, icon: Zap, title: "Online Payment", desc: "Cards · NetBanking · Wallet", enabled: true },
              { id: "upi" as const, icon: Wallet, title: "UPI", desc: "GPay · PhonePe · Paytm", enabled: settings.upiEnabled },
              { id: "cod" as const, icon: Banknote, title: "Cash on Delivery", desc: "Pay when you receive", enabled: settings.codEnabled },
            ]
              .filter((m) => m.enabled)
              .map(({ id, icon: Icon, title, desc }) => (
                <button
                  key={id}
                  onClick={() => setPayment(id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    payment === id ? "border-accent bg-accent/10 shadow-glow" : "hover:border-accent/50",
                  )}
                >
                  <Icon className={cn("h-5 w-5", payment === id ? "text-accent" : "text-muted-foreground")} />
                  <p className="mt-2 text-sm font-semibold">{title}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </button>
              ))}
          </div>
          {(payment === "razorpay" || payment === "upi") && (
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Secured by Razorpay · PCI-DSS compliant
            </p>
          )}
        </CheckoutSection>

        <CheckoutSection step={3} title="Order Notes (optional)">
          <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Delivery instructions, preferred time, etc." />
        </CheckoutSection>

        <div className="flex items-start gap-3 rounded-2xl border p-4">
          <Checkbox checked={agree} onCheckedChange={setAgree} id="terms" />
          <label htmlFor="terms" className="text-xs leading-relaxed text-muted-foreground">
            I agree to the <span className="text-accent">terms & conditions</span>, and confirm the delivery address
            and contact details are correct. I understand an authorised signature is required on delivery.
          </label>
        </div>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="font-display text-xl font-semibold">Order Summary</h2>
          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
            {cart.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity} · {formatINR(item.price)}</p>
                </div>
                <span className="text-sm font-semibold">{formatINR(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4">
            {applied && coupon ? (
              <div className="flex items-center justify-between rounded-xl border border-accent/40 bg-accent/10 px-3 py-2.5 text-sm">
                <span className="font-semibold text-accent">
                  {couponCode.toUpperCase()} · −{formatINR(breakdown.couponDiscount)}
                </span>
                <button onClick={removeCoupon} className="text-xs text-muted-foreground underline hover:text-foreground">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code (try WELCOME10)"
                  className="flex-1"
                />
                <Button variant="outline" size="sm" onClick={applyCoupon} className="shrink-0">
                  Apply
                </Button>
              </div>
            )}
          </div>
          <Separator className="my-4" />
          <div className="space-y-2.5 text-sm">
            <Row label="Subtotal" value={formatINR(breakdown.subtotal)} />
            <Row label="Discount" value={`− ${formatINR(breakdown.discount)}`} accent="text-success" />
            <Row label="GST" value={formatINR(breakdown.gstAmount)} />
            <Row label="Shipping" value={breakdown.shipping === 0 ? "FREE" : formatINR(breakdown.shipping)} accent={breakdown.shipping === 0 ? "text-success" : undefined} />
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatINR(breakdown.total)}</span>
            </div>
          </div>
          <Button
            variant="gold"
            size="lg"
            className="mt-5 w-full"
            loading={placing}
            onClick={placeOrder}
          >
            {!placing && <Lock className="h-4 w-4" />}
            {placing ? "Placing order…" : payment === "cod" ? "Place Order (COD)" : `Pay ${formatINR(breakdown.total)}`}
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> 100% secure checkout · GST invoice included
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium", accent)}>{value}</span>
    </div>
  );
}

function CheckoutSection({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full gold-gradient font-display text-sm font-bold text-charcoal">
          {step}
        </span>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
      </div>
      {children}
    </div>
  );
}
