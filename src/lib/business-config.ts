import { SITE, WHATSAPP_MESSAGE } from "@/lib/constants";

export const BUSINESS_KEY = "pe_business_settings";

export interface BusinessAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Holiday {
  id: string;
  date: string;
  reason: string;
}

export interface BusinessSettings {
  // Identity & branding
  companyName: string;
  legalName: string;
  tagline: string;
  description: string;
  websiteUrl: string;
  foundedYear: string;
  logo: string;
  favicon: string;
  announcement: string;
  showAnnouncement: boolean;

  // Addresses
  showroom: BusinessAddress;
  billing: BusinessAddress;
  billingSameAsShowroom: boolean;
  warehouse: BusinessAddress;
  warehouseSameAsShowroom: boolean;
  mapEmbed: string;
  latitude: string;
  longitude: string;

  // Contact
  phone: string;
  phoneRaw: string;
  alternatePhone: string;
  whatsapp: string;
  email: string;
  supportEmail: string;

  // Tax & legal
  gstin: string;
  gstEnabled: boolean;
  gstRate: number;
  cgstRate: number;
  sgstRate: number;
  hsn: string;
  sac: string;
  pan: string;
  cin: string;
  gstCertificate: string;

  // Commerce & ordering
  orderPrefix: string;
  invoicePrefix: string;
  currencySymbol: string;
  currencyCode: string;
  freeShippingEnabled: boolean;
  shippingThreshold: number;
  shippingFee: number;
  codEnabled: boolean;
  upiEnabled: boolean;
  deliveryNote: string;

  // Hours
  hours: string;
  workDays: string;
  holidaySchedule: Holiday[];

  // Social & footer
  social: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    twitter: string;
    pinterest: string;
  };
  footerDescription: string;
  footerCopyright: string;
}

export const DEFAULT_BUSINESS: BusinessSettings = {
  companyName: SITE.name,
  legalName: SITE.legalName,
  tagline: SITE.tagline,
  description: SITE.description,
  websiteUrl: SITE.url,
  foundedYear: "2012",
  logo: "",
  favicon: "",
  announcement: "Free delivery on orders above ₹5,000 · GST invoices on every order",
  showAnnouncement: true,

  showroom: { ...SITE.address },
  billing: { ...SITE.address },
  billingSameAsShowroom: true,
  warehouse: { ...SITE.address },
  warehouseSameAsShowroom: true,
  mapEmbed: SITE.mapEmbed,
  latitude: "",
  longitude: "",

  phone: SITE.phone,
  phoneRaw: SITE.phoneRaw,
  alternatePhone: "",
  whatsapp: SITE.whatsapp,
  email: SITE.email,
  supportEmail: SITE.email,

  gstin: SITE.gstin,
  gstEnabled: true,
  gstRate: 18,
  cgstRate: 9,
  sgstRate: 9,
  hsn: "",
  sac: "9954",
  pan: "",
  cin: "",
  gstCertificate: "",

  orderPrefix: "PE",
  invoicePrefix: "INV",
  currencySymbol: "₹",
  currencyCode: "INR",
  freeShippingEnabled: true,
  shippingThreshold: 5000,
  shippingFee: 150,
  codEnabled: true,
  upiEnabled: true,
  deliveryNote: "",

  hours: "Mon – Sun, 09:00 AM – 05:00 PM",
  workDays: "Monday – Sunday",
  holidaySchedule: [],

  social: { ...SITE.social },
  footerDescription:
    "India's premium destination for false ceiling materials, PVC & WPC panels, gypsum boards, louvers and complete interior decorative hardware. Serving builders, designers and homes.",
  footerCopyright: `© {year} ${SITE.legalName}. All rights reserved. GSTIN: ${SITE.gstin}`,
};

export const WHATSAPP_DEFAULT_MESSAGE = WHATSAPP_MESSAGE;

export function deepMergeAddress(base: BusinessAddress, patch?: Partial<BusinessAddress>): BusinessAddress {
  return { ...base, ...patch };
}

export function normalizeBusiness(raw: unknown): BusinessSettings {
  const base = structuredClone(DEFAULT_BUSINESS);
  if (!raw || typeof raw !== "object") return base;
  const r = raw as Partial<BusinessSettings>;

  const pickAddress = (patch?: Partial<BusinessAddress>) =>
    patch && typeof patch === "object" ? deepMergeAddress(base.showroom, patch) : { ...base.showroom };

  return {
    ...base,
    ...r,
    showroom: r.showroom && typeof r.showroom === "object" ? { ...base.showroom, ...r.showroom } : { ...base.showroom },
    billing: r.billingSameAsShowroom
      ? { ...(r.showroom && typeof r.showroom === "object" ? { ...base.showroom, ...r.showroom } : base.showroom) }
      : pickAddress(r.billing),
    warehouse: r.warehouseSameAsShowroom
      ? { ...(r.showroom && typeof r.showroom === "object" ? { ...base.showroom, ...r.showroom } : base.showroom) }
      : pickAddress(r.warehouse),
    social: { ...base.social, ...(r.social ?? {}) },
    holidaySchedule: Array.isArray(r.holidaySchedule) ? r.holidaySchedule : [],
    gstRate: typeof r.gstRate === "number" ? r.gstRate : base.gstRate,
    cgstRate: typeof r.cgstRate === "number" ? r.cgstRate : base.cgstRate,
    sgstRate: typeof r.sgstRate === "number" ? r.sgstRate : base.sgstRate,
    shippingThreshold: typeof r.shippingThreshold === "number" ? r.shippingThreshold : base.shippingThreshold,
    shippingFee: typeof r.shippingFee === "number" ? r.shippingFee : base.shippingFee,
  };
}

export function loadBusinessSettings(): BusinessSettings {
  if (typeof window === "undefined") return DEFAULT_BUSINESS;
  try {
    const raw = localStorage.getItem(BUSINESS_KEY);
    return raw ? normalizeBusiness(JSON.parse(raw)) : DEFAULT_BUSINESS;
  } catch {
    return DEFAULT_BUSINESS;
  }
}

export function saveBusinessSettings(settings: BusinessSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(normalizeBusiness(settings)));
  } catch {
    /* ignore quota errors on large uploads */
  }
}

export function clearBusinessSettings(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BUSINESS_KEY);
  } catch {
    /* ignore */
  }
}

export function formatHolidays(list: Holiday[]): string {
  if (!list.length) return "";
  return list
    .map((h) => (h.date ? `${h.date}${h.reason ? ` (${h.reason})` : ""}` : h.reason))
    .filter(Boolean)
    .join(", ");
}
