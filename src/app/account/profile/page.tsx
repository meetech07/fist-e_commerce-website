"use client";

import * as React from "react";
import { Camera, Check, Mail } from "lucide-react";
import { getLocalUser } from "@/lib/auth-local";
import { isValidEmail, isValidGstin, isValidPhone, readFileAsDataURL } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProfileForm {
  name: string;
  phone: string;
  company: string;
  gstin: string;
  avatar: string;
}

export default function ProfilePage() {
  const [form, setForm] = React.useState<ProfileForm>({ name: "", phone: "", company: "", gstin: "", avatar: "" });
  const [email, setEmail] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    const local = getLocalUser();
    setEmail(local?.email ?? "");
    try {
      const raw = localStorage.getItem("pe_profile");
      if (raw) {
        const saved = JSON.parse(raw) as ProfileForm;
        setForm(() => ({ ...saved, name: saved.name || local?.name || "" }));
        return;
      }
    } catch {
      /* ignore */
    }
    setForm((f) => ({ ...f, name: local?.name ?? "" }));
  }, []);

  const set = (k: keyof ProfileForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    if (file.size > 2 * 1024 * 1024) return toast.error("Image should be under 2MB");
    const dataUrl = await readFileAsDataURL(file);
    set("avatar", dataUrl);
  };

  const save = () => {
    if (!form.name.trim()) return toast.error("Name is required");
    if (form.phone && !isValidPhone(form.phone)) return toast.error("Enter a valid 10-digit mobile number");
    if (email && !isValidEmail(email)) return toast.error("Enter a valid email");
    if (form.gstin && !isValidGstin(form.gstin)) return toast.error("Enter a valid GSTIN");
    setSaving(true);
    localStorage.setItem("pe_profile", JSON.stringify(form));
    setTimeout(() => {
      setSaving(false);
      toast.success("Profile updated");
    }, 600);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your personal and billing details.</p>

      <div className="mt-6 rounded-3xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <Avatar name={form.name || "User"} src={form.avatar} size="xl" />
          <div>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-accent hover:underline">
              <Camera className="h-4 w-4" /> Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
            </label>
            <p className="mt-1 text-xs text-muted-foreground">JPG or PNG, up to 2MB</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label>Full Name *</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={email} disabled className="pl-10" />
            </div>
          </div>
          <div>
            <Label>Mobile</Label>
            <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="10-digit mobile" />
          </div>
          <div>
            <Label>Company / Firm</Label>
            <Input value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <Label>GSTIN</Label>
            <Input value={form.gstin} onChange={(e) => set("gstin", e.target.value.toUpperCase())} placeholder="Optional" maxLength={15} />
          </div>
        </div>

        <Button className="mt-6" onClick={save} disabled={saving}>
          {saving ? "Saving…" : (<><Check className="h-4 w-4" /> Save Changes</>)}
        </Button>
      </div>
    </div>
  );
}
