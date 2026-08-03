"use client";

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes?: Record<string, string>;
  theme?: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  modal?: { ondismiss?: () => void };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

let loaded: Promise<void> | null = null;

export function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Razorpay) return Promise.resolve();
  if (loaded) return loaded;
  loaded = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      loaded = null;
      reject(new Error("Failed to load Razorpay SDK"));
    };
    document.body.appendChild(script);
  });
  return loaded;
}

export function openRazorpay(options: Omit<RazorpayOptions, "key">): Promise<{ paymentId: string; orderId: string; signature: string }> {
  return new Promise(async (resolve, reject) => {
    try {
      await loadRazorpay();
      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        ...options,
        handler: (response) =>
          resolve({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          }),
        modal: {
          ondismiss: () => reject(new Error("Payment window closed")),
        },
      });
      razorpay.open();
    } catch (err) {
      reject(err);
    }
  });
}
