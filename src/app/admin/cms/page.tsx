"use client";

import * as React from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import type { BlogPost, Faq, GalleryItem, Testimonial } from "@/types";
import { formatDate, uid } from "@/lib/utils";
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
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="blogs">Blog Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials"><TestimonialManager /></TabsContent>
        <TabsContent value="gallery"><GalleryManager /></TabsContent>
        <TabsContent value="faqs"><FaqManager /></TabsContent>
        <TabsContent value="blogs"><BlogManager /></TabsContent>
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

/* ---------------- Gallery ---------------- */

function GalleryManager() {
  const { gallery, setCollection } = useAdminStore();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<GalleryItem | null>(null);

  const save = (g: GalleryItem) => {
    const exists = gallery.some((x) => x.id === g.id);
    setCollection("gallery", exists ? gallery.map((x) => (x.id === g.id ? g : x)) : [...gallery, g]);
    setOpen(false);
    setEditing(null);
    toast.success("Gallery item saved");
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{gallery.length} images</p>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> Add Image</Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gallery.map((g) => (
          <div key={g.id} className="group relative overflow-hidden rounded-3xl border bg-card">
            <div className="relative aspect-[4/3]">
              <Image src={g.image} alt={g.title} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-semibold">{g.title}</p>
                <p className="text-xs text-muted-foreground">{g.category}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setCollection("gallery", gallery.filter((x) => x.id !== g.id)); toast.success("Deleted"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <GalleryDialog open={open} onOpenChange={setOpen} item={editing} onSave={save} />
    </div>
  );
}

function GalleryDialog({ open, onOpenChange, item, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; item: GalleryItem | null; onSave: (g: GalleryItem) => void }) {
  const [f, setF] = React.useState<GalleryItem>({ id: "", title: "", image: "", category: "", featured: false, created_at: "" });
  React.useEffect(() => {
    if (open) setF(item ?? { id: "", title: "", image: "", category: "", featured: false, created_at: new Date().toISOString() });
  }, [open, item]);
  const set = (k: keyof GalleryItem, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit Image" : "Add Image"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Title" />
          <Input className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="Category (e.g. False Ceiling)" />
          <Input className={inputCls} value={f.image} onChange={(e) => set("image", e.target.value)} placeholder="Image URL" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { if (!f.title.trim() || !f.image.trim()) return toast.error("Title and image are required"); onSave({ ...f, id: f.id || uid("gal") }); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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

/* ---------------- Blog ---------------- */

function BlogManager() {
  const { blogs, setCollection } = useAdminStore();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<BlogPost | null>(null);

  const save = (b: BlogPost) => {
    const exists = blogs.some((x) => x.id === b.id);
    setCollection("blogs", exists ? blogs.map((x) => (x.id === b.id ? b : x)) : [b, ...blogs]);
    setOpen(false);
    setEditing(null);
    toast.success("Blog post saved");
  };

  return (
    <CollectionCard count={blogs.length} onAdd={() => { setEditing(null); setOpen(true); }}>
      {blogs.map((b) => (
        <ItemRow key={b.id} title={b.title} subtitle={`${b.category} · ${b.reading_time} min · ${formatDate(b.created_at)}`} body={b.excerpt} onEdit={() => { setEditing(b); setOpen(true); }} onDelete={() => { setCollection("blogs", blogs.filter((x) => x.id !== b.id)); toast.success("Deleted"); }} />
      ))}
      <BlogDialog open={open} onOpenChange={setOpen} item={editing} onSave={save} />
    </CollectionCard>
  );
}

function BlogDialog({ open, onOpenChange, item, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; item: BlogPost | null; onSave: (b: BlogPost) => void }) {
  const [f, setF] = React.useState<BlogPost>({ id: "", slug: "", title: "", excerpt: "", content: "", cover_image: "", category: "", tags: [], author: "", reading_time: 3, is_published: true, views: 0, created_at: "" });
  const emptyBlog = (): BlogPost => ({ id: "", slug: "", title: "", excerpt: "", content: "", cover_image: "", category: "", tags: [], author: "Paras Enterprises", reading_time: 3, is_published: true, views: 0, created_at: new Date().toISOString() });
  React.useEffect(() => {
    if (open) setF(item ?? emptyBlog());
  }, [open, item]);
  const [tagsText, setTagsText] = React.useState("");
  React.useEffect(() => { if (open) setTagsText((item?.tags ?? []).join(", ")); }, [open, item]);
  const set = (k: keyof BlogPost, v: string | number | boolean) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{item ? "Edit Post" : "New Post"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <Input className={inputCls} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Title" />
          <div className="grid grid-cols-2 gap-3">
            <Input className={inputCls} value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="Category" />
            <Input className={inputCls} value={f.author} onChange={(e) => set("author", e.target.value)} placeholder="Author" />
          </div>
          <Input className={inputCls} value={f.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="Cover image URL" />
          <Input className={inputCls} value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="Tags (comma separated)" />
          <Textarea className={inputCls} rows={2} value={f.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Excerpt" />
          <Textarea className={inputCls} rows={6} value={f.content} onChange={(e) => set("content", e.target.value)} placeholder="Full content" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { if (!f.title.trim() || !f.content.trim()) return toast.error("Title and content are required"); onSave({ ...f, tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean), slug: f.slug || f.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""), id: f.id || uid("post") }); }}>Save</Button>
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
