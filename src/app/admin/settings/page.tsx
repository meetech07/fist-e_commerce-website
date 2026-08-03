"use client";

import * as React from "react";
import {
  Check,
  Clock,
  CreditCard,
  ImagePlus,
  Landmark,
  MapPin,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Share2,
  ShieldCheck,
  Store,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  DEFAULT_BUSINESS,
  type BusinessAddress,
  type BusinessSettings,
} from "@/lib/business-config";
import { useBusinessSettings } from "@/lib/business-store";

const TABS = [
  { id: "general", label: "General", icon: Store },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "tax", label: "Tax & Legal", icon: ShieldCheck },
  { id: "commerce", label: "Commerce", icon: CreditCard },
  { id: "hours", label: "Hours & Holidays", icon: Clock },
  { id: "social", label: "Social & Footer", icon: Share2 },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminBusinessSettings() {
  const { settings, update, reset } = useBusinessSettings();
  const [f, setF] = React.useState<BusinessSettings>(settings);
  const [dirty, setDirty] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [tab, setTab] = React.useState<TabId>("general");

  React.useEffect(() => {
    setF(settings);
  }, [settings]);

  const set = <K extends keyof BusinessSettings>(k: K, v: BusinessSettings[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  };

  const setNested = <K extends "showroom" | "billing" | "warehouse">(k: K, v: BusinessAddress) => {
    setF((prev) => ({ ...prev, [k]: v }));
    setDirty(true);
  };

  const setSocial = (k: keyof BusinessSettings["social"], v: string) => {
    setF((prev) => ({ ...prev, social: { ...prev.social, [k]: v } }));
    setDirty(true);
  };

  const save = () => {
    try {
      update(f);
      setDirty(false);
      setSaved(true);
      toast.success("Business settings saved & applied site-wide");
      setTimeout(() => setSaved(false), 1800);
    } catch {
      toast.error("Could not save. Some uploads may exceed browser storage limits.");
    }
  };

  const doReset = () => {
    reset();
    setF(DEFAULT_BUSINESS);
    setDirty(false);
    toast.success("Settings reset to defaults");
  };

  const showroom = f.showroom;
  const billing = f.billingSameAsShowroom ? showroom : f.billing;
  const warehouse = f.warehouseSameAsShowroom ? showroom : f.warehouse;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Business Settings</h1>
          <p className="text-sm text-muted-foreground">
            Company, GST, address, contact, delivery &amp; footer details — instantly applied across the
            website, invoices, quotations, checkout, contact pages &amp; emails.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge>{dirty ? "Unsaved changes" : "Live"}</Badge>
          <Button variant="outline" onClick={doReset}><RotateCcw className="h-4 w-4" /> Reset</Button>
          <Button onClick={save}>{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? "Saved" : "Save Changes"}</Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabId)}>
        <TabsList className="flex w-full flex-wrap justify-start overflow-x-auto rounded-2xl">
          {TABS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger key={id} value={id} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5" /> {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <Section
            title="Identity & Branding"
            desc="Shown in the logo, browser tab, footer and document headers."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company Name"><Input value={f.companyName} onChange={(e) => set("companyName", e.target.value)} /></Field>
              <Field label="Legal Name (for invoices/contracts)"><Input value={f.legalName} onChange={(e) => set("legalName", e.target.value)} /></Field>
              <Field label="Tagline" className="sm:col-span-2"><Input value={f.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
              <Field label="Description" className="sm:col-span-2">
                <Textarea rows={3} value={f.description} onChange={(e) => set("description", e.target.value)} />
              </Field>
              <Field label="Website URL"><Input value={f.websiteUrl} onChange={(e) => set("websiteUrl", e.target.value)} /></Field>
              <Field label="Founded Year"><Input value={f.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} /></Field>
            </div>
            <Separator className="my-5" />
            <div className="grid gap-5 sm:grid-cols-2">
              <UploadField
                label="Logo Image"
                hint="Shown in header, footer & invoices. JPG/PNG up to ~500KB."
                value={f.logo}
                onChange={(v) => set("logo", v)}
              />
              <UploadField
                label="Favicon"
                hint="Small browser-tab icon. Square PNG preferred."
                value={f.favicon}
                onChange={(v) => set("favicon", v)}
              />
            </div>
          </Section>

          <Section title="Announcement Bar" desc="A slim strip shown above the navbar on every page.">
            <ToggleRow label="Show announcement bar" checked={f.showAnnouncement} onChange={(v) => set("showAnnouncement", v)} />
            <div className="mt-4">
              <Field label="Announcement Message">
                <Textarea rows={2} value={f.announcement} onChange={(e) => set("announcement", e.target.value)} />
              </Field>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="addresses">
          <Section title="Showroom Address" desc="Primary address used across the site, invoices and maps." icon={<MapPin className="h-4 w-4 text-accent" />}>
            <AddressFields value={showroom} onChange={(v) => setNested("showroom", v)} />
          </Section>

          <Section title="Billing Address" desc="Used on GST invoices when different from the showroom.">
            <ToggleRow
              label="Billing address same as showroom"
              checked={f.billingSameAsShowroom}
              onChange={(v) => set("billingSameAsShowroom", v)}
            />
            {!f.billingSameAsShowroom && (
              <div className="mt-4"><AddressFields value={billing} onChange={(v) => setNested("billing", v)} /></div>
            )}
          </Section>

          <Section title="Warehouse / Dispatch Address" desc="Return & shipment origin address.">
            <ToggleRow
              label="Warehouse address same as showroom"
              checked={f.warehouseSameAsShowroom}
              onChange={(v) => set("warehouseSameAsShowroom", v)}
            />
            {!f.warehouseSameAsShowroom && (
              <div className="mt-4"><AddressFields value={warehouse} onChange={(v) => setNested("warehouse", v)} /></div>
            )}
          </Section>

          <Section title="Google Map" desc="Embed URL used on the contact page, plus coordinates for listing sync.">
            <Field label="Map Embed URL">
              <Input value={f.mapEmbed} onChange={(e) => set("mapEmbed", e.target.value)} placeholder="https://www.google.com/maps?q=…&output=embed" />
            </Field>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Latitude"><Input value={f.latitude} onChange={(e) => set("latitude", e.target.value)} /></Field>
              <Field label="Longitude"><Input value={f.longitude} onChange={(e) => set("longitude", e.target.value)} /></Field>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="contact">
          <Section title="Contact Details" desc="Phone & email surfaced in the navbar, footer, floating buttons and contact page.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Primary Phone (display)"><Input value={f.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
              <Field label="Phone for tel: links (raw)">
                <Input value={f.phoneRaw} onChange={(e) => set("phoneRaw", e.target.value)} placeholder="+918863982250" />
              </Field>
              <Field label="Alternate Phone"><Input value={f.alternatePhone} onChange={(e) => set("alternatePhone", e.target.value)} /></Field>
              <Field label="WhatsApp Number (country code + number)">
                <Input value={f.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="918863982250" />
              </Field>
              <Field label="Email"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} /></Field>
              <Field label="Support Email"><Input type="email" value={f.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} /></Field>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="tax">
          <Section
            title="GST & Registration"
            desc="GST details flow automatically into every invoice, footer and legal page."
            icon={<Landmark className="h-4 w-4 text-accent" />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="GST Number (GSTIN)">
                <Input value={f.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} placeholder="10ABCDE1234F1Z5" />
              </Field>
              <Field label="PAN"><Input value={f.pan} onChange={(e) => set("pan", e.target.value.toUpperCase())} /></Field>
              <Field label="CIN"><Input value={f.cin} onChange={(e) => set("cin", e.target.value.toUpperCase())} /></Field>
              <Field label="HSN Code"><Input value={f.hsn} onChange={(e) => set("hsn", e.target.value)} /></Field>
              <Field label="SAC Code"><Input value={f.sac} onChange={(e) => set("sac", e.target.value)} /></Field>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Field label="GST Rate (%)"><Input type="number" min={0} max={100} value={f.gstRate || ""} onChange={(e) => set("gstRate", Number(e.target.value))} /></Field>
              <Field label="CGST (%)"><Input type="number" min={0} max={100} value={f.cgstRate || ""} onChange={(e) => set("cgstRate", Number(e.target.value))} /></Field>
              <Field label="SGST (%)"><Input type="number" min={0} max={100} value={f.sgstRate || ""} onChange={(e) => set("sgstRate", Number(e.target.value))} /></Field>
            </div>
            <div className="mt-5">
              <ToggleRow label="Enable GST on invoices & checkout" checked={f.gstEnabled} onChange={(v) => set("gstEnabled", v)} />
            </div>
            <div className="mt-5">
              <UploadField
                label="GST Registration Certificate"
                hint="Upload the registration PDF/image for records. Preview images are shown."
                value={f.gstCertificate}
                onChange={(v) => set("gstCertificate", v)}
              />
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="commerce">
          <Section title="Ordering & Invoicing">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Order Number Prefix"><Input value={f.orderPrefix} onChange={(e) => set("orderPrefix", e.target.value)} /></Field>
              <Field label="Invoice Number Prefix"><Input value={f.invoicePrefix} onChange={(e) => set("invoicePrefix", e.target.value)} /></Field>
              <Field label="Currency Symbol"><Input value={f.currencySymbol} onChange={(e) => set("currencySymbol", e.target.value)} /></Field>
              <Field label="Currency Code"><Input value={f.currencyCode} onChange={(e) => set("currencyCode", e.target.value.toUpperCase())} /></Field>
            </div>
          </Section>

          <Section title="Delivery Charges" icon={<Truck className="h-4 w-4 text-accent" />}>
            <ToggleRow label="Enable free-shipping threshold" checked={f.freeShippingEnabled} onChange={(v) => set("freeShippingEnabled", v)} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Free delivery above (₹)"><Input type="number" min={0} value={f.shippingThreshold || ""} onChange={(e) => set("shippingThreshold", Number(e.target.value))} /></Field>
              <Field label="Flat delivery fee (₹)"><Input type="number" min={0} value={f.shippingFee || ""} onChange={(e) => set("shippingFee", Number(e.target.value))} /></Field>
            </div>
            <div className="mt-4">
              <Field label="Delivery / Dispatch Note (shown on invoices)">
                <Textarea rows={2} value={f.deliveryNote} onChange={(e) => set("deliveryNote", e.target.value)} />
              </Field>
            </div>
          </Section>

          <Section title="Payment Methods">
            <ToggleRow label="Accept Cash on Delivery (COD)" checked={f.codEnabled} onChange={(v) => set("codEnabled", v)} />
            <ToggleRow label="Accept UPI payments" checked={f.upiEnabled} onChange={(v) => set("upiEnabled", v)} />
          </Section>
        </TabsContent>

        <TabsContent value="hours">
          <Section title="Business Hours" icon={<Clock className="h-4 w-4 text-accent" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Hours (display)">
                <Input value={f.hours} onChange={(e) => set("hours", e.target.value)} placeholder="Mon – Sun, 09:00 AM – 05:00 PM" />
              </Field>
              <Field label="Working Days (display)">
                <Input value={f.workDays} onChange={(e) => set("workDays", e.target.value)} placeholder="Monday – Sunday" />
              </Field>
            </div>
          </Section>

          <Section title="Holiday Schedule" desc="Closed days / holidays announced on the site and quote responses.">
            {f.holidaySchedule.length === 0 && (
              <p className="text-sm text-muted-foreground">No holidays scheduled. Add one below.</p>
            )}
            <div className="space-y-3">
              {f.holidaySchedule.map((h, i) => (
                <div key={h.id} className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={h.date}
                    onChange={(e) => {
                      const list = f.holidaySchedule.map((x, j) => (j === i ? { ...x, date: e.target.value } : x));
                      set("holidaySchedule", list);
                    }}
                    className="w-44"
                  />
                  <Input
                    value={h.reason}
                    placeholder="Reason (e.g. Diwali)"
                    onChange={(e) => {
                      const list = f.holidaySchedule.map((x, j) => (j === i ? { ...x, reason: e.target.value } : x));
                      set("holidaySchedule", list);
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => set("holidaySchedule", f.holidaySchedule.filter((x) => x.id !== h.id))}
                    aria-label="Remove holiday"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => set("holidaySchedule", [...f.holidaySchedule, { id: `h_${Date.now()}`, date: "", reason: "" }])}
            >
              <Plus className="h-4 w-4" /> Add Holiday
            </Button>
          </Section>
        </TabsContent>

        <TabsContent value="social">
          <Section title="Social Links" icon={<Share2 className="h-4 w-4 text-accent" />}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Facebook"><Input value={f.social.facebook} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="https://facebook.com/…" /></Field>
              <Field label="Instagram"><Input value={f.social.instagram} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="https://instagram.com/…" /></Field>
              <Field label="LinkedIn"><Input value={f.social.linkedin} onChange={(e) => setSocial("linkedin", e.target.value)} placeholder="https://linkedin.com/…" /></Field>
              <Field label="YouTube"><Input value={f.social.youtube} onChange={(e) => setSocial("youtube", e.target.value)} placeholder="https://youtube.com/…" /></Field>
              <Field label="Twitter / X"><Input value={f.social.twitter} onChange={(e) => setSocial("twitter", e.target.value)} placeholder="https://x.com/…" /></Field>
              <Field label="Pinterest"><Input value={f.social.pinterest} onChange={(e) => setSocial("pinterest", e.target.value)} placeholder="https://pinterest.com/…" /></Field>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Leave a field empty to hide that icon in the footer.</p>
          </Section>

          <Section title="Footer">
            <Field label="Footer Description">
              <Textarea rows={3} value={f.footerDescription} onChange={(e) => set("footerDescription", e.target.value)} />
            </Field>
            <div className="mt-4">
              <Field label="Copyright Text">
                <Input value={f.footerCopyright} onChange={(e) => set("footerCopyright", e.target.value)} />
              </Field>
              <p className="mt-1.5 text-xs text-muted-foreground">Use {"{year}"} to auto-insert the current year, e.g. © {"{year}"} Paras Enterprises.</p>
            </div>
          </Section>

          <Section title="Legal Pages">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="GSTIN (echoed on legal pages)"><Input value={f.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} /></Field>
              <Field label="Support Email (privacy contacts)"><Input type="email" value={f.supportEmail} onChange={(e) => set("supportEmail", e.target.value)} /></Field>
            </div>
          </Section>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 border-t pt-5">
        <Button variant="outline" onClick={doReset}><RotateCcw className="h-4 w-4" /> Reset</Button>
        <Button onClick={save}>{saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />} {saved ? "Saved" : "Save Changes"}</Button>
      </div>
    </div>
  );
}

function Section({
  title,
  desc,
  children,
  icon,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-card p-5 sm:p-6">
      <div className="mb-4 flex items-start gap-2.5">
        <div>
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">{icon}{title}</h2>
          {desc && <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>}
        </div>
      </div>
      {children}
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

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-medium">{label}</p>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function AddressFields({ value, onChange }: { value: BusinessAddress; onChange: (v: BusinessAddress) => void }) {
  const set = (k: keyof BusinessAddress, v: string) => onChange({ ...value, [k]: v });
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Address Line 1" className="sm:col-span-2">
        <Input value={value.line1} onChange={(e) => set("line1", e.target.value)} placeholder="Gali No. 3, Behind Rohtas Petrol Pump" />
      </Field>
      <Field label="Address Line 2" className="sm:col-span-2">
        <Input value={value.line2} onChange={(e) => set("line2", e.target.value)} placeholder="New Dillian, Dehri, Rohtas" />
      </Field>
      <Field label="City"><Input value={value.city} onChange={(e) => set("city", e.target.value)} /></Field>
      <Field label="State"><Input value={value.state} onChange={(e) => set("state", e.target.value)} /></Field>
      <Field label="PIN Code"><Input value={value.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} /></Field>
      <Field label="Country"><Input value={value.country} onChange={(e) => set("country", e.target.value)} /></Field>
    </div>
  );
}

function UploadField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const readFile = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1024 * 1024) {
      toast.error("File too large. Please keep uploads under 1MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed text-muted-foreground transition hover:border-accent hover:text-accent"
          aria-label={`Upload ${label}`}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-contain" />
          ) : (
            <ImagePlus className="h-7 w-7" />
          )}
        </button>
        <div className="space-y-1.5">
          <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
            {value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              Remove
            </Button>
          )}
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          readFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
