"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { isValidEmail } from "@/lib/utils";
import { toast } from "sonner";
import { isSupabaseConfigured, localSignIn, localSignOut } from "@/lib/auth-local";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const configured = Boolean(isSupabaseConfigured());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      if (configured) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        let role = (data.user?.user_metadata?.role as string | undefined) ?? "customer";
        if (data.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();
          if (profile?.role) role = profile.role as string;
        }
        if (role !== "admin" && role !== "manager" && role !== "staff") {
          await supabase.auth.signOut();
          throw new Error("This account does not have staff access.");
        }
        toast.success("Welcome to the Admin Panel");
        router.push("/admin");
      } else {
        const result = localSignIn(email, password);
        if ("error" in result) throw new Error(result.error);
        if (result.role === "customer") {
          localSignOut();
          throw new Error("This account does not have staff access.");
        }
        toast.success("Welcome to the Admin Panel");
        router.push("/admin");
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-16 sm:px-6">
      <div className="mb-6 flex flex-col items-center gap-3 text-center">
        <Logo />
        <div className="mt-2 flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
          <ShieldCheck className="h-3.5 w-3.5" /> Admin Panel
        </div>
        <p className="text-sm text-muted-foreground">Staff-only sign in to manage the store.</p>
      </div>

      <div className="w-full rounded-2xl border bg-card p-6 shadow-lg shadow-black/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="admin-email">Staff Email</Label>
            <Input id="admin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@diaenterprises.in" autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="admin-password">Password</Label>
            <Input id="admin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </div>
          <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
            {!loading && <KeyRound className="h-4 w-4" />} Sign in to Admin Panel
          </Button>
        </form>

        {!configured && (
          <p className="mt-4 rounded-xl bg-warning/10 px-3 py-2 text-center text-[11px] text-warning">
            Demo mode: use <span className="font-bold">admin@diaenterprises.in / Admin@123</span>
          </p>
        )}
      </div>

      <Link href="/login" className="mt-5 text-xs font-medium text-muted-foreground transition hover:text-accent">
        ← Back to customer login
      </Link>
    </div>
  );
}
