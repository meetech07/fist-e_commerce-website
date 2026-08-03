import type { CartItem } from "@/types";

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  couponCode?: string;
  couponDiscount: number;
  taxable: number;
  gstAmount: number;
  shipping: number;
  total: number;
}

export const SHIPPING_THRESHOLD = 5000;
export const SHIPPING_FEE = 150;

export interface ShippingConfig {
  enabled: boolean;
  threshold: number;
  fee: number;
}

export const DEFAULT_SHIPPING_CONFIG: ShippingConfig = {
  enabled: true,
  threshold: SHIPPING_THRESHOLD,
  fee: SHIPPING_FEE,
};

export function calcDiscount(subtotal: number, couponCode?: string, coupon?: { type: "percent" | "fixed"; value: number; min_cart: number; max_discount: number }): number {
  if (!couponCode || !coupon) return 0;
  if (subtotal < coupon.min_cart) return 0;
  let discount = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;
  if (coupon.max_discount) discount = Math.min(discount, coupon.max_discount);
  return Math.min(discount, subtotal);
}

export function calcShipping(subtotal: number, couponCode?: string, coupon?: { type: "percent" | "fixed"; value: number; min_cart: number; max_discount: number }, shipping: ShippingConfig = DEFAULT_SHIPPING_CONFIG): number {
  if (!shipping.enabled) return 0;
  if (subtotal >= shipping.threshold) return 0;
  if (couponCode && coupon) return 0;
  return shipping.fee;
}

export function calculateBreakdown(cart: CartItem[], couponCode?: string, coupon?: { type: "percent" | "fixed"; value: number; min_cart: number; max_discount: number }, shipping: ShippingConfig = DEFAULT_SHIPPING_CONFIG): PriceBreakdown {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const mrpTotal = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);
  const productDiscount = Math.max(mrpTotal - subtotal, 0);
  const couponDiscount = calcDiscount(subtotal, couponCode, coupon);
  const discount = productDiscount + couponDiscount;
  const taxable = Math.max(subtotal - couponDiscount, 0);
  const gstAmount = cart.reduce((sum, item) => sum + item.gst * item.quantity, 0);
  const shippingCost = calcShipping(subtotal, couponCode, coupon, shipping);
  const total = taxable + gstAmount + shippingCost;

  return {
    subtotal,
    discount,
    couponCode,
    couponDiscount,
    taxable,
    gstAmount,
    shipping: shippingCost,
    total,
  };
}
