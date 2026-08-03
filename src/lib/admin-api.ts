"use client";

import type { Enquiry, Product } from "@/types";

export const isDbConfigured = () =>
  Boolean(
    typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

async function request<T>(url: string, init?: RequestInit): Promise<T | null> {
  try {
    const res = await fetch(url, init);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.error("API error", url, json);
      return null;
    }
    return json as T;
  } catch (err) {
    console.error("API fetch failed", url, err);
    return null;
  }
}

const jsonInit = (method: string, body?: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: body ? JSON.stringify(body) : undefined,
});

export async function listProducts(): Promise<Product[]> {
  if (!isDbConfigured()) return [];
  const res = await request<{ data: Product[] }>("/api/admin/products");
  return res?.data ?? [];
}

export async function createProduct(product: Product): Promise<Product | null> {
  if (!isDbConfigured()) return null;
  const res = await request<{ data: Product }>("/api/admin/products", jsonInit("POST", product));
  return res?.data ?? null;
}

export async function updateProduct(product: Product): Promise<Product | null> {
  if (!isDbConfigured()) return null;
  const res = await request<{ data: Product }>("/api/admin/products", jsonInit("PATCH", product));
  return res?.data ?? null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const res = await request<{ ok: boolean }>(`/api/admin/products?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return Boolean(res?.ok);
}

export async function listEnquiries(): Promise<Enquiry[]> {
  if (!isDbConfigured()) return [];
  const res = await request<{ data: Enquiry[] }>("/api/admin/enquiries");
  return res?.data ?? [];
}

export async function setEnquiryRead(id: string, is_read: boolean): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const res = await request<{ ok: boolean }>(
    "/api/admin/enquiries",
    jsonInit("PATCH", { id, is_read }),
  );
  return Boolean(res?.ok);
}

export async function removeEnquiry(id: string): Promise<boolean> {
  if (!isDbConfigured()) return false;
  const res = await request<{ ok: boolean }>(`/api/admin/enquiries?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  return Boolean(res?.ok);
}
