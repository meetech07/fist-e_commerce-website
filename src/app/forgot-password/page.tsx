"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/Logo";
import { isValidEmail } from "@/lib/utils";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    setLoading(true);
    try {
      const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
      if (configured) {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account?reset=1`,
        });
        if (error) throw new Error(error.message);
      }
      setSent(true);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pb-24 pt-32 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-3xl border bg-card p-8 shadow-sm">
          <h1 className="font-display text-2xl font-semibold">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a password reset link.
          </p>
          {sent ? (
            <div className="mt-6 rounded-2xl bg-success/10 p-4 text-sm text-success">
              If an account exists for <span className="font-semibold">{email}</span>, a reset link has been sent.
              Please check your inbox (and spam folder).
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fp-email">Email</Label>
                <Input id="fp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
                {!loading && <KeyRound className="h-4 w-4" />} Send Reset Link
              </Button>
            </form>
          )}
          <Link href="/login" className="mt-4 block text-center text-sm text-accent hover:underline">
            ← Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
