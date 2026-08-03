"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { Loader2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function OtpPage({
  searchParams,
}: {
  searchParams: Promise<{ phone?: string }>;
}) {
  const router = useRouter();
  const [digits, setDigits] = React.useState(Array(6).fill(""));
  const [loading, setLoading] = React.useState(false);
  const inputs = React.useRef<(HTMLInputElement | null)[]>([]);

  const { phone = "" } = React.use(searchParams);

  const handleChange = (i: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[i] = value;
    setDigits(next);
    if (value && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const verify = async () => {
    const code = digits.join("");
    if (code.length !== 6) return toast.error("Enter the 6-digit OTP");
    setLoading(true);
    const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (configured) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: code,
        type: "sms",
      });
      if (error) toast.error(error.message);
      else {
        toast.success("OTP verified! Welcome back.");
        router.push("/account");
      }
    } else {
      setTimeout(() => {
        toast.success("OTP verified (demo mode)");
        router.push("/account");
      }, 800);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pb-24 pt-32 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <div className="rounded-3xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient text-charcoal">
            <Smartphone className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold">Enter OTP</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a 6-digit code to <span className="font-semibold text-foreground">+91 {phone || "your phone"}</span>
          </p>
          <div className="mt-6 flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputs.current[i] = el; }}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKey(i, e)}
                inputMode="numeric"
                className={cn(
                  "h-12 w-11 rounded-xl border text-center text-xl font-bold outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/40",
                  d ? "border-accent" : "border-input",
                )}
              />
            ))}
          </div>
          <Button variant="gold" size="lg" className="mt-6 w-full" onClick={verify} loading={loading}>
            {!loading && <Loader2 className="h-4 w-4" />} Verify & Continue
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Didn&apos;t receive it? <button className="text-accent hover:underline">Resend OTP</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
