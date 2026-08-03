"use client";

import * as React from "react";
import { BadgePercent, Pencil, Plus, Trash2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import type { Coupon } from "@/types";
import { formatINR, formatDate, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const inputCls = "rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring";

export default function AdminCoupons() {
  const { coupons, setCollection } = useAdminStore();
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Coupon | null>(null);

  const save = (c: Coupon) => {
    const exists = coupons.some((x) => x.id === c.id);
    setCollection("coupons", exists ? coupons.map((x) => (x.id === c.id ? c : x)) : [c, ...coupons]);
    setOpen(false);
    setEditing(null);
    toast.success("Coupon saved");
  };

  const active = coupons.filter((c) => c.is_active).length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Coupons</h1>
          <p className="text-sm text-muted-foreground">{coupons.length} coupons · {active} active</p>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setOpen(true); }}><Plus className="h-4 w-4" /> New Coupon</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {coupons.map((c) => (
          <div key={c.id} className={`relative rounded-3xl border bg-card p-5 ${c.is_active ? "" : "opacity-60"}`}>
            <BadgePercent className="absolute right-4 top-4 h-5 w-5 text-accent" />
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="font-mono text-sm">{c.code}</Badge>
              <Badge variant={c.is_active ? "default" : "outline"}>{c.is_active ? "Active" : "Inactive"}</Badge>
            </div>
            <p className="mt-3 font-display text-xl font-bold">
              {c.type === "percent" ? `${c.value}% OFF` : formatINR(c.value) + " OFF"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Min cart {formatINR(c.min_cart)}{c.max_discount ? ` · Max ${formatINR(c.max_discount)}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(c.valid_from)} → {formatDate(c.valid_to)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{c.used_count} / {c.usage_limit} used</p>
            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEditing(c); setOpen(true); }}><Pencil className="h-3.5 w-3.5" /> Edit</Button>
              <Button variant="outline" size="sm" onClick={() => { setCollection("coupons", coupons.map((x) => (x.id === c.id ? { ...x, is_active: !x.is_active } : x))); toast.success("Toggled"); }}>
                {c.is_active ? "Deactivate" : "Activate"}
              </Button>
              <Button variant="ghost" size="sm" className="ml-auto text-destructive" onClick={() => { setCollection("coupons", coupons.filter((x) => x.id !== c.id)); toast.success("Deleted"); }}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CouponDialog open={open} onOpenChange={setOpen} item={editing} onSave={save} />
    </div>
  );
}

function CouponDialog({ open, onOpenChange, item, onSave }: { open: boolean; onOpenChange: (v: boolean) => void; item: Coupon | null; onSave: (c: Coupon) => void }) {
  const [f, setF] = React.useState<Coupon>({ id: "", code: "", type: "percent", value: 0, min_cart: 0, max_discount: 0, usage_limit: 100, used_count: 0, valid_from: "", valid_to: "", is_active: true });
  React.useEffect(() => {
    if (open) {
      setF(item ?? { id: "", code: "", type: "percent", value: 0, min_cart: 0, max_discount: 0, usage_limit: 100, used_count: 0, valid_from: new Date().toISOString().slice(0, 10), valid_to: new Date(Date.now() + 90 * 864e5).toISOString().slice(0, 10), is_active: true });
    }
  }, [open, item]);
  const set = (k: keyof Coupon, v: string | number | boolean) => setF((p) => ({ ...p, [k]: v }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>{item ? "Edit Coupon" : "New Coupon"}</DialogTitle></DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Code</Label>
              <Input className={inputCls} value={f.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="WELCOME10" />
            </div>
            <div>
              <Label>Type</Label>
              <Select value={f.type} onValueChange={(v) => set("type", v)} options={[{ label: "Percentage (%)", value: "percent" }, { label: "Fixed (₹)", value: "fixed" }]} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Value</Label>
              <Input className={inputCls} type="number" min={0} value={f.value || ""} onChange={(e) => set("value", Number(e.target.value))} />
            </div>
            <div>
              <Label>Min cart (₹)</Label>
              <Input className={inputCls} type="number" min={0} value={f.min_cart || ""} onChange={(e) => set("min_cart", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Max discount (₹)</Label>
              <Input className={inputCls} type="number" min={0} value={f.max_discount || ""} onChange={(e) => set("max_discount", Number(e.target.value))} />
            </div>
            <div>
              <Label>Usage limit</Label>
              <Input className={inputCls} type="number" min={1} value={f.usage_limit || ""} onChange={(e) => set("usage_limit", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Valid from</Label>
              <Input className={inputCls} type="date" value={f.valid_from} onChange={(e) => set("valid_from", e.target.value)} />
            </div>
            <div>
              <Label>Valid to</Label>
              <Input className={inputCls} type="date" value={f.valid_to} onChange={(e) => set("valid_to", e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => { if (!f.code.trim() || f.value <= 0) return toast.error("Code and value required"); onSave({ ...f, id: f.id || uid("cp") }); }}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
