"use client";

import type { Order } from "@/types";

export function getLocalOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("pe_orders") ?? "[]") as Order[];
  } catch {
    return [];
  }
}

export function saveLocalOrders(orders: Order[]) {
  localStorage.setItem("pe_orders", JSON.stringify(orders));
}
