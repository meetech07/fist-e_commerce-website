"use client";

export interface LocalEnquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  type: "contact" | "quote" | "visit" | "callback";
  is_read: boolean;
  created_at: string;
}

const KEY = "pe_enquiries";

function load(): LocalEnquiry[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as LocalEnquiry[]) : [];
  } catch {
    return [];
  }
}

function persist(list: LocalEnquiry[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function saveEnquiry(input: Omit<LocalEnquiry, "id" | "created_at" | "is_read">) {
  const item: LocalEnquiry = {
    ...input,
    id: `eq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    is_read: false,
    created_at: new Date().toISOString(),
  };
  persist([item, ...load()]);
  return item;
}

export function getEnquiries(): LocalEnquiry[] {
  return load();
}

export function updateEnquiry(id: string, patch: Partial<LocalEnquiry>) {
  persist(load().map((e) => (e.id === id ? { ...e, ...patch } : e)));
}

export function removeEnquiry(id: string) {
  persist(load().filter((e) => e.id !== id));
}
