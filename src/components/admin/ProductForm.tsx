"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2, Upload } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { mockCategories } from "@/lib/data/mock-data";
import type { Product } from "@/types";
import { slugify, uid } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { createProduct, isDbConfigured, updateProduct } from "@/lib/admin-api";

const EMPTY: Product = {
  id: "",
  slug: "",
  name: "",
  description: "",
  price: 0,
  mrp: 0,
  gst: 18,
  category_id: mockCategories[0]?.id ?? "",
  category_name: mockCategories[0]?.name ?? "",
  sku: "",
  stock_quantity: 0,
  unit: "unit",
  images: [],
  colors: [],
  sizes: [],
  thickness: [],
  material: "",
  specifications: {},
  features: [],
  tags: [],
  is_featured: false,
  is_best_seller: false,
  is_new_arrival: false,
  is_published: false,
  views: 0,
  sold: 0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function ProductForm({ product, mode }: { product?: Product; mode: "new" | "edit" }) {
  const { products, setCollection } = useAdminStore();
  const router = useRouter();
  const [form, setForm] = React.useState<Product>(product ?? EMPTY);
  const [tagsText, setTagsText] = React.useState((product?.tags ?? []).join(", "));
  const [featuresText, setFeaturesText] = React.useState((product?.features ?? []).join("\n"));
  const [newSpecKey, setNewSpecKey] = React.useState("");
  const [newSpecVal, setNewSpecVal] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  const set = <K extends keyof Product>(key: K, value: Product[K]) => setForm((f) => ({ ...f, [key]: value }));

  const category = mockCategories.find((c) => c.id === form.category_id);
  const isDirty = (f: Product) => {
    if (mode === "edit") {
      const changed = JSON.stringify(f) !== JSON.stringify(product);
      if (!changed) return false;
    }
    return f.name.trim().length > 0 && f.price > 0;
  };

  const save = async () => {
    if (!form.name.trim()) return toast.error("Product name is required");
    if (form.price <= 0) return toast.error("Enter a valid price");
    if (form.images.length === 0) return toast.error("Add at least one product image");
    setSaving(true);

    const slug = slugify(form.name);
    const record: Product = {
      ...form,
      slug,
      id: form.id || uid("prod"),
      category_id: form.category_id || category?.id || "",
      category_name: category?.name ?? form.category_name,
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    };

    const exists = products.some((p) => p.id === record.id);

    if (isDbConfigured()) {
      const saved = exists ? await updateProduct({ ...record, id: record.id }) : await createProduct(record);
      if (!saved) {
        setSaving(false);
        return toast.error("Could not save product to the database");
      }
      setCollection(
        "products",
        exists ? products.map((p) => (p.id === record.id ? saved : p)) : [saved, ...products],
      );
    } else {
      await new Promise((r) => setTimeout(r, 400));
      setCollection("products", exists ? products.map((p) => (p.id === record.id ? record : p)) : [record, ...products]);
    }

    setSaving(false);
    toast.success(exists ? "Product updated" : "Product created");
    router.push("/admin/products");
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    const added: string[] = [];
    for (const file of Array.from(files).slice(0, 6)) {
      if (file.size > 8 * 1024 * 1024) return toast.error("Each image must be under 8MB");
      const body = new FormData();
      body.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body });
        const data = await res.json();
        if (res.ok && data.url) added.push(data.url);
        else toast.error(data.error ?? "Upload failed");
      } catch {
        toast.error("Upload failed");
      }
    }
    if (added.length) set("images", [...form.images, ...added]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <button onClick={() => router.back()} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-accent">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="mt-1 font-display text-2xl font-semibold">{mode === "new" ? "New Product" : `Edit — ${product?.name ?? ""}`}</h1>
        </div>
        <Button onClick={save} disabled={saving || !isDirty(form)}>
          <Save className="h-4 w-4" /> {saving ? "Saving…" : mode === "new" ? "Create Product" : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Section title="Basic Details">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name *" className="sm:col-span-2">
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Designer PVC Ceiling Panel" />
              </Field>
              <Field label="SKU">
                <Input value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="Auto if blank" />
              </Field>
              <Field label="Unit">
                <Input value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="unit / sheet / kg / box" />
              </Field>
              <Field label="Category">
                <Select
                  value={form.category_id}
                  onValueChange={(v) => set("category_id", v)}
                  options={mockCategories.map((c) => ({ label: c.name, value: c.id }))}
                />
              </Field>
              <Field label="Material">
                <Input value={form.material ?? ""} onChange={(e) => set("material", e.target.value)} placeholder="PVC / WPC / Gypsum…" />
              </Field>
            </div>
            <Field label="Short Description" className="mt-4">
              <Input value={form.short_description ?? ""} onChange={(e) => set("short_description", e.target.value)} placeholder="One-line summary for cards" />
            </Field>
            <Field label="Description" className="mt-4">
              <Textarea rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Detailed description" />
            </Field>
          </Section>

          <Section title="Pricing & Stock">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Field label="Selling Price *">
                <Input type="number" min={0} value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
              </Field>
              <Field label="MRP">
                <Input type="number" min={0} value={form.mrp || ""} onChange={(e) => set("mrp", Number(e.target.value))} />
              </Field>
              <Field label="GST %">
                <Select
                  value={String(form.gst)}
                  onValueChange={(v) => set("gst", Number(v))}
                  options={[0, 5, 12, 18, 28].map((g) => ({ label: `${g}%`, value: String(g) }))}
                />
              </Field>
              <Field label="Stock">
                <Input type="number" min={0} value={form.stock_quantity || ""} onChange={(e) => set("stock_quantity", Number(e.target.value))} />
              </Field>
            </div>
          </Section>

          <Section title="Variants">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Colours (comma separated)">
                <Input value={form.colors.join(", ")} onChange={(e) => set("colors", e.target.value.split(",").map((c) => c.trim()).filter(Boolean))} placeholder="White, Ivory, Oak" />
              </Field>
              <Field label="Sizes (comma separated)">
                <Input value={form.sizes.join(", ")} onChange={(e) => set("sizes", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} placeholder="2x4, 2x8" />
              </Field>
              <Field label="Thickness (comma separated)">
                <Input value={form.thickness.join(", ")} onChange={(e) => set("thickness", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))} placeholder="8mm, 12mm" />
              </Field>
            </div>
            <Field label="Tags (comma separated)" className="mt-4">
              <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="waterproof, designer, bulk" />
            </Field>
            <Field label="Features (one per line)" className="mt-4">
              <Textarea rows={3} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder="Moisture-proof&#10;Termite resistant" />
            </Field>
          </Section>

          <Section title="Specifications">
            <div className="space-y-2">
              {Object.entries(form.specifications).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <Input value={k} disabled className="flex-1" />
                  <Input value={v} onChange={(e) => set("specifications", { ...form.specifications, [k]: e.target.value })} className="flex-1" />
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => {
                    const next = { ...form.specifications };
                    delete next[k];
                    set("specifications", next);
                  }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} placeholder="Spec name" />
                <Input value={newSpecVal} onChange={(e) => setNewSpecVal(e.target.value)} placeholder="Value" />
                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => {
                  if (!newSpecKey.trim()) return;
                  set("specifications", { ...form.specifications, [newSpecKey.trim()]: newSpecVal });
                  setNewSpecKey("");
                  setNewSpecVal("");
                }}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Section>

          <Section title="SEO">
            <Field label="SEO Title">
              <Input value={form.seo_title ?? ""} onChange={(e) => set("seo_title", e.target.value)} />
            </Field>
            <Field label="SEO Description" className="mt-4">
              <Textarea rows={2} value={form.seo_description ?? ""} onChange={(e) => set("seo_description", e.target.value)} />
            </Field>
          </Section>
        </div>

        <div className="space-y-6">
          <Section title="Product Images">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center transition hover:border-accent">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium">Upload images</span>
              <span className="text-xs text-muted-foreground">JPG/PNG/WebP up to 8MB</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { handleUpload(e.target.files); e.target.value = ""; }} />
            </label>
            <div className="mt-3 space-y-3">
              {form.images.map((img, i) => (
                <div key={i} className="flex items-center gap-3 rounded-2xl border p-2">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-secondary/40">
                    <Image src={img} alt="" fill className="object-cover" />
                  </div>
                  <Input value={img} onChange={(e) => set("images", form.images.map((im, j) => (j === i ? e.target.value : im)))} className="h-9 flex-1" />
                  {i === 0 && <Badge variant="gold" className="shrink-0">Main</Badge>}
                  <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-destructive" onClick={() => set("images", form.images.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Flags">
            <div className="space-y-3">
              <SwitchRow label="Published" hint="Visible in storefront" checked={form.is_published} onChange={(v) => set("is_published", v)} />
              <SwitchRow label="Featured" hint="Shown in home showcase" checked={form.is_featured} onChange={(v) => set("is_featured", v)} />
              <SwitchRow label="Best Seller" checked={form.is_best_seller} onChange={(v) => set("is_best_seller", v)} />
              <SwitchRow label="New Arrival" checked={form.is_new_arrival} onChange={(v) => set("is_new_arrival", v)} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              URL: /products/<span className="font-medium text-foreground">{slugify(form.name) || "product-slug"}</span>
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border bg-card p-5 sm:p-6">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
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

function SwitchRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
