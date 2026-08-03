"use client";

import * as React from "react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import type { Address } from "@/types";
import { isValidPhone, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select } from "@/components/ui/select";
import { toast } from "sonner";

const STATES = ["Maharashtra", "Gujarat", "Madhya Pradesh", "Rajasthan", "Telangana", "Karnataka", "Tamil Nadu", "Delhi", "Uttar Pradesh", "Chhattisgarh", "Other"];

function loadAddresses(): Address[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("pe_addresses");
    return raw ? (JSON.parse(raw) as Address[]) : [];
  } catch {
    return [];
  }
}

export default function AddressesPage() {
  const [addresses, setAddresses] = React.useState<Address[]>([]);
  const [editing, setEditing] = React.useState<Address | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setAddresses(loadAddresses());
  }, []);

  const persist = (next: Address[]) => {
    setAddresses(next);
    localStorage.setItem("pe_addresses", JSON.stringify(next));
  };

  const handleSave = (form: Address) => {
    let next: Address[];
    if (form.id) {
      next = addresses.map((a) => (a.id === form.id ? form : a));
    } else {
      next = [...addresses, { ...form, id: uid("addr") }];
    }
    if (form.is_default && next.length > 1) {
      next = next.map((a) => (a.id === form.id ? { ...a, is_default: true } : { ...a, is_default: false }));
    } else if (next.length === 1) {
      next = next.map((a) => ({ ...a, is_default: true }));
    }
    persist(next);
    setDialogOpen(false);
    setEditing(null);
    toast.success(form.id ? "Address updated" : "Address added");
  };

  const handleDelete = (id: string) => {
    persist(addresses.filter((a) => a.id !== id));
    toast.success("Address removed");
  };

  const setDefault = (id: string) => {
    persist(addresses.map((a) => ({ ...a, is_default: a.id === id })));
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold">Saved Addresses</h1>
        <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-3xl border border-dashed py-16 text-center">
          <MapPin className="h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 font-medium">No saved addresses</p>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">Add delivery addresses to speed up checkout.</p>
          <Button className="mt-5" onClick={() => { setEditing(null); setDialogOpen(true); }}>Add Address</Button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className={`relative rounded-3xl border bg-card p-5 ${a.is_default ? "border-accent" : ""}`}>
              {a.is_default && (
                <span className="absolute right-4 top-4 rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">Default</span>
              )}
              <p className="font-semibold">{a.name} <span className="text-xs font-normal text-muted-foreground">· {a.phone}</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{a.line1}</p>
              {a.line2 && <p className="text-sm text-muted-foreground">{a.line2}</p>}
              <p className="text-sm text-muted-foreground">{a.landmark && `${a.landmark}, `}{a.city}, {a.state} — {a.pincode}</p>
              <div className="mt-4 flex items-center gap-2">
                {!a.is_default && (
                  <Button variant="outline" size="sm" onClick={() => setDefault(a.id!)}>Set Default</Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditing(a); setDialogOpen(true); }}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(a.id!)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} address={editing} onSave={handleSave} />
    </div>
  );
}

function AddressDialog({
  open,
  onOpenChange,
  address,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  address: Address | null;
  onSave: (form: Address) => void;
}) {
  const [form, setForm] = React.useState<Address>({
    id: "",
    type: "home",
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "Maharashtra",
    pincode: "",
    landmark: "",
    is_default: false,
  });

  React.useEffect(() => {
    if (open) {
      setForm(address ?? { id: "", type: "home", name: "", phone: "", line1: "", line2: "", city: "", state: "Maharashtra", pincode: "", landmark: "", is_default: false });
    }
  }, [open, address]);

  const set = (k: keyof Address, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.line1.trim() || !form.city.trim() || !form.pincode.trim()) {
      return toast.error("Please fill all required fields");
    }
    if (!isValidPhone(form.phone)) return toast.error("Enter a valid 10-digit mobile number");
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add New Address"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Full Name *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Receiver name" />
            </div>
            <div>
              <Label>Mobile *</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
            </div>
          </div>
          <div>
            <Label>Address Line 1 *</Label>
            <Input value={form.line1} onChange={(e) => set("line1", e.target.value)} placeholder="Flat / plot / building, street" />
          </div>
          <div>
            <Label>Address Line 2</Label>
            <Input value={form.line2 ?? ""} onChange={(e) => set("line2", e.target.value)} placeholder="Area / locality" />
          </div>
          <div>
            <Label>Landmark</Label>
            <Input value={form.landmark ?? ""} onChange={(e) => set("landmark", e.target.value)} placeholder="Near…" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>City *</Label>
              <Input value={form.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div>
              <Label>State *</Label>
              <Select
                value={form.state}
                onValueChange={(v) => set("state", v)}
                options={STATES.map((s) => ({ label: s, value: s }))}
                placeholder="Select state"
              />
            </div>
            <div>
              <Label>PIN Code *</Label>
              <Input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} maxLength={6} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Address Type</Label>
              <Select
                value={form.type}
                onValueChange={(v) => set("type", v as Address["type"])}
                options={[{ label: "Home", value: "home" }, { label: "Office", value: "office" }, { label: "Construction Site", value: "site" }]}
              />
            </div>
            <div>
              <Label>GSTIN (B2B)</Label>
              <Input value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="Optional" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit}>{address ? "Save Changes" : "Save Address"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
