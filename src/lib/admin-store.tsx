"use client";

import * as React from "react";
import type { BlogPost, Coupon, Faq, GalleryItem, Order, Product, Profile, Testimonial } from "@/types";
import { mockProducts, mockBlogs, mockCoupons, mockTestimonials } from "@/lib/data/mock-data";
import { getLocalOrders } from "@/lib/orders-local";
import { FAQS, GALLERY } from "@/lib/constants";
import { isDbConfigured, listProducts } from "@/lib/admin-api";

const KEYS = {
  products: "pe_admin_products",
  orders: "pe_admin_orders",
  customers: "pe_admin_customers",
  coupons: "pe_admin_coupons",
  testimonials: "pe_admin_testimonials",
  blogs: "pe_admin_blogs",
  gallery: "pe_admin_gallery",
  faqs: "pe_admin_faqs",
};

function seedCustomers(): Profile[] {
  return [
    { id: "local-admin", name: "Admin", email: "admin@parasenterprises.in", phone: "", role: "admin", company: "Paras Enterprises", gstin: "", created_at: new Date().toISOString() },
    { id: "demo-c1", name: "Rohit Sharma", email: "rohit@buildmart.in", phone: "9823001122", role: "customer", company: "BuildMart Interiors", gstin: "27ABCDE1234F1Z5", created_at: new Date().toISOString() },
    { id: "demo-c2", name: "Priya Deshmukh", email: "priya.d@designhub.in", phone: "9765012345", role: "customer", company: "DesignHub Studio", gstin: "", created_at: new Date().toISOString() },
    { id: "demo-c3", name: "Amit Khare", email: "amit.khare@gmail.com", phone: "9881122334", role: "customer", company: "", gstin: "", created_at: new Date().toISOString() },
  ];
}

function load<T>(key: string, seed: () => T[]): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : seed();
  } catch {
    return seed();
  }
}

function seedGallery(): GalleryItem[] {
  return GALLERY.map((g, i) => ({
    id: String(i + 1),
    title: g.title,
    image: g.image,
    category: g.category,
    featured: false,
    created_at: new Date().toISOString(),
  }));
}

function seedFaqs(): Faq[] {
  return FAQS.map((f, i) => ({ id: String(i + 1), question: f.question, answer: f.answer, category: "General", sort_order: i }));
}

export interface AdminStoreValue {
  products: Product[];
  orders: Order[];
  customers: Profile[];
  coupons: Coupon[];
  testimonials: Testimonial[];
  blogs: BlogPost[];
  gallery: GalleryItem[];
  faqs: Faq[];
  setCollection: <T>(key: keyof typeof KEYS, list: T[]) => void;
  resetAll: () => void;
}

const AdminStoreContext = React.createContext<AdminStoreValue | null>(null);

export function AdminStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState({
    products: [] as Product[],
    orders: [] as Order[],
    customers: [] as Profile[],
    coupons: [] as Coupon[],
    testimonials: [] as Testimonial[],
    blogs: [] as BlogPost[],
    gallery: [] as GalleryItem[],
    faqs: [] as Faq[],
  });

  React.useEffect(() => {
    setState({
      products: load(KEYS.products, () => mockProducts),
      orders: load(KEYS.orders, getLocalOrders),
      customers: load(KEYS.customers, seedCustomers),
      coupons: load(KEYS.coupons, () => mockCoupons as Coupon[]),
      testimonials: load(KEYS.testimonials, () => mockTestimonials),
      blogs: load(KEYS.blogs, () => mockBlogs),
      gallery: load(KEYS.gallery, seedGallery),
      faqs: load(KEYS.faqs, seedFaqs),
    });

    if (isDbConfigured()) {
      listProducts().then((db) => {
        setState((prev) => ({ ...prev, products: db }));
      });
    }
  }, []);

  const setCollection = <T,>(key: keyof typeof KEYS, list: T[]) => {
    setState((prev) => ({ ...prev, [key]: list }));
    if (typeof window !== "undefined") localStorage.setItem(KEYS[key], JSON.stringify(list));
  };

  const resetAll = () => {
    const keys = Object.keys(KEYS) as Array<keyof typeof KEYS>;
    keys.forEach((k) => {
      const fresh = {
        products: () => mockProducts,
        orders: getLocalOrders,
        customers: seedCustomers,
        coupons: () => mockCoupons as Coupon[],
        testimonials: () => mockTestimonials,
        blogs: () => mockBlogs,
        gallery: seedGallery,
        faqs: seedFaqs,
      }[k]();
      localStorage.setItem(KEYS[k], JSON.stringify(fresh));
    });
    window.location.reload();
  };

  return (
    <AdminStoreContext.Provider value={{ ...state, setCollection, resetAll }}>
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore(): AdminStoreValue {
  const ctx = React.useContext(AdminStoreContext);
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
