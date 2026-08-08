"use client";

import * as React from "react";
import Image from "next/image";
import { Download, ImagePlus, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import type { Faq, GalleryItem, Testimonial } from "@/types";
import { uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminCms() {
  const [tab, setTab] = React.useState("testimonials");
  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl font-semibold">CMS & Content</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials"><TestimonialManager /></TabsContent>
        <TabsContent value="images"><ImageManager /></TabsContent>
        <TabsContent value="faqs"><FaqManager /></TabsContent>
      </Tabs>
    </div>
  );
}

const inputCls = "rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

/* ---------------- Testimonials ---------------- */

function TestimonialManager() {
  const { testimonials, setCollection } = useAdminStore();
  const [editing, setEditing] = React.useState<Testimonial | null>(null);
  const [open, setOpen] = React.useState(false);

  const save = (t: Testimonial) => {
    const exists = testimonials.some((x) => x.id === t.id);
    setCollection("testimonials", exists ? testimonials.map((x) => (x.id === t.id ? t : x)) : [...testimonials, t]);
    setOpen(false);
    setEditing(null);
    toast.success("Testimonial saved");
  };

  return (
    <CollectionCard count={testimonials.length} onAdd={() => { setEditing(null); setOpen(true); }}>
      {testimonials.map((t) => (
        <ItemRow key={t.id} title={t.name} subtitle={`${t.role}${t.company ? ` · ${t.company}` : ""} · ${"★".repeat(t.rating)}`} body={t.content} onEdit={() => { setEditing(t); setOpen(true); }} onDelete={() => { setCollection("testimonials", testimonials.filter((x) => x.id !== t.id)); toast.success("Deleted"); }} />
      ))}
      <TestimonialDialog open={open} onOpenChange={setOpen} item={editing} onSave={save} />
    </CollectionCard>
  );
}

function TestimonialDialog({ open, onOpenChange, item, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; item: Testimonial | null; onSave: (t: Testimonial) => void }) {
  const [f, setF] = React.useState<Testimonial>({ id: "", name: "", role: "", company: "", rating: 5, content: "", featured: false, created_at: "" });
  React.useEffect(() => {
    if (open) setF(item ?? { id: "", name: "", role: "", company: "", rating: 5, content: "", featured: true, created_at: new Date().toISOString() });
  }, [open, item]);
  const set = (k: keyof Testimonial, v: string | number | boolean) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Input className={inputCls} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Customer name" />
          <Input className={inputCls} value={f.role} onChange={(e) => set("role", e.target.value)} placeholder="Role (e.g. Interior Designer)" />
          <Input className={inputCls} value={f.company ?? ""} onChange={(e) => set("company", e.target.value)} placeholder="Company / city" />
          <Textarea className={inputCls} rows={4} value={f.content} onChange={(e) => set("content", e.target.value)} placeholder="Review content" />
          <div className="flex items-center justify-between">
            <div>
              <Label>Rating</Label>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => set("rating", n)} className={n <= f.rating ? "text-accent" : "text-muted-foreground/30"}>{n <= f.rating ? "★" : "☆"}</button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="checkbox" checked={f.featured} onChange={(e) => set("featured", e.target.checked)} />
              Featured
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { if (!f.name.trim() || !f.content.trim()) return toast.error("Name and review are required"); onSave({ ...f, id: f.id || uid("t") }); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Images ---------------- */

function ImageManager() {
  const { gallery, setCollection } = useAdminStore();
  const [uploading, setUploading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addImage = async (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be under 8MB");

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok && data.url) {
        const item: GalleryItem = {
          id: uid("gal"),
          title: file.name.replace(/\.[^.]+$/, ""),
          image: data.url,
          category: "",
          featured: false,
          created_at: new Date().toISOString(),
        };
        setCollection("gallery", [item, ...gallery]);
        toast.success("Image added to gallery");
      } else {
        toast.error(data.error ?? "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const downloadImage = async (g: GalleryItem) => {
    try {
      const res = await fetch(g.image);
      const blob = await res.blob();
      const ext = (g.image.split(".").pop() || "jpg").split("?")[0].slice(0, 5);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${g.title || "image"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success("Image downloaded");
    } catch {
      toast.error("Download failed");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{gallery.length} images</p>
        <Button size="sm" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {uploading ? "Uploading…" : "Upload Image"}
        </Button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => addImage(e.target.files)} />
      </div>
      {gallery.length === 0 && (
        <p className="rounded-2xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No images yet. Upload an image to share it in the gallery.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-3xl border bg-card">
            <div className="relative aspect-[4/3]">
              <Image src={g.image} alt={g.title || "Gallery image"} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-end gap-1 p-3">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => downloadImage(g)} title="Download image"><Download className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setCollection("gallery", gallery.filter((x) => x.id !== g.id)); toast.success("Image removed"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FAQs ---------------- */

function FaqManager() {
  const { faqs, setCollection } = useAdminStore();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Faq | null>(null);

  const save = (x: Faq) => {
    const exists = faqs.some((f) => f.id === x.id);
    setCollection("faqs", exists ? faqs.map((f) => (f.id === x.id ? x : f)) : [...faqs, x]);
    setOpen(false);
    setEditing(null);
    toast.success("FAQ saved");
  };

  return (
    <CollectionCard count={faqs.length} onAdd={() => { setEditing(null); setOpen(true); }}>
      {faqs.map((x) => (
        <ItemRow key={x.id} title={x.question} subtitle={x.category} body={x.answer} onEdit={() => { setEditing(x); setOpen(true); }} onDelete={() => { setCollection("faqs", faqs.filter((f) => f.id !== x.id)); toast.success("Deleted"); }} />
      ))}
      <FaqDialog open={open} onOpenChange={setOpen} item={editing} onSave={save} />
    </CollectionCard>
  );
}

function FaqDialog({ open, onOpenChange, item, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; item: Faq | null; onSave: (x: Faq) => void }) {
  const [f, setF] = React.useState<Faq>({ id: "", question: "", answer: "", category: "General", sort_order: 0 });
  React.useEffect(() => {
    if (open) setF(item ?? { id: "", question: "", answer: "", category: "General", sort_order: 0 });
  }, [open, item]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit FAQ" : "Add FAQ"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Input className={inputCls} value={f.question} onChange={(e) => setF((p) => ({ ...p, question: e.target.value }))} placeholder="Question" />
          <Input className={inputCls} value={f.category} onChange={(e) => setF((p) => ({ ...p, category: e.target.value }))} placeholder="Category" />
          <Textarea className={inputCls} rows={4} value={f.answer} onChange={(e) => setF((p) => ({ ...p, answer: e.target.value }))} placeholder="Answer" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { if (!f.question.trim() || !f.answer.trim()) return toast.error("Both fields required"); onSave({ ...f, id: f.id || uid("faq") }); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Shared ---------------- */

function CollectionCard({ count, onAdd, children }: { count: number; onAdd: () => void; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{count} entries</p>
        <Button size="sm" onClick={onAdd}><Plus className="h-4 w-4" /> Add New</Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ItemRow({ title, subtitle, body, onEdit, onDelete }: { title: string; subtitle?: string; body?: string; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border bg-card p-4">
      <div className="min-w-0">
        <p className="font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {body && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{body}</p>}
      </div>
      <div className="flex shrink-0 gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onEdit}><Pencil className="h-3.5 w-3.5" /></Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={onDelete}><Trash2 className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}
