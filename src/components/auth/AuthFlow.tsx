"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import { KeyRound, Mail, Phone, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/layout/Logo";
import { isValidEmail, isValidPhone } from "@/lib/utils";
import { toast } from "sonner";
import { isSupabaseConfigured, localSignIn, localSignUp, otpLogin } from "@/lib/auth-local";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C41.7 35 44 30 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!supabaseClient && isSupabaseConfigured()) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return supabaseClient;
}

export function AuthFlow({ mode = "login" }: { mode?: "login" | "signup" }) {
  const router = useRouter();
  const [tab, setTab] = React.useState(mode);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const supabase = getSupabase();
  const configured = Boolean(supabase);

  const afterLogin = (role?: string) => {
    const next = new URLSearchParams(window.location.search).get("next") ?? "";
    const isStaff = role === "admin" || role === "manager" || role === "staff";
    const dest = isStaff || next.startsWith("/admin") ? "/admin" : next || "/account";
    toast.success(isStaff ? "Welcome back, admin!" : "Welcome back!");
    router.push(dest);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      if (configured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        const role = (data.user?.user_metadata?.role as string | undefined) ?? "customer";
        afterLogin(role);
      } else {
        const result = localSignIn(email, password);
        if ("error" in result) throw new Error(result.error);
        afterLogin(result.role);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Please enter your full name");
    if (!isValidEmail(email)) return toast.error("Please enter a valid email");
    if (phone && !isValidPhone(phone)) return toast.error("Please enter a valid 10-digit mobile");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      if (configured && supabase) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone },
          },
        });
        if (error) throw new Error(error.message);
        toast.success("Account created! Check your email to verify.");
        router.push("/login?verified=1");
      } else {
        const result = localSignUp(name, email, password);
        if ("error" in result) throw new Error(result.error);
        toast.success("Account created successfully!");
        afterLogin(result.role);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      if (configured && supabase) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: `${window.location.origin}/account` },
        });
        if (error) throw new Error(error.message);
      } else {
        const result = localSignUp("Google User", `google_${Date.now()}@demo.local`, Math.random().toString(36));
        if ("error" in result) throw new Error(result.error);
        afterLogin(result.role);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleOtp = async () => {
    if (!/^\d{6}$/.test(phone)) return toast.error("Enter a valid 10-digit mobile to receive OTP");
    if (!isValidPhone(phone)) return toast.error("Please enter a valid 10-digit mobile");
    setLoading(true);
    setTimeout(() => {
      if (configured && supabase) {
        supabase.auth.signInWithOtp({ phone: `+91${phone}` }).then(({ error }) => {
          if (error) toast.error(error.message);
          else {
            toast.success("OTP sent to your phone!");
            router.push(`/otp?phone=${phone}`);
          }
        });
      } else {
        const emailGuess = `${phone.slice(-4)}@demo.local`;
        otpLogin(emailGuess);
        toast.success("OTP verified (demo mode)");
        router.push("/account");
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 pb-24 pt-32 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <Tabs value={tab} onValueChange={setTab as (v: string) => void}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password">Password</Label>
                  <Link href="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
                </div>
                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
                {!loading && <KeyRound className="h-4 w-4" />} Login
              </Button>
            </form>

            <Divider />
            <Button variant="outline" size="lg" className="w-full" loading={googleLoading} onClick={handleGoogle}>
              {!googleLoading && <GoogleIcon className="h-4 w-4" />} Continue with Google
            </Button>

            <div className="mt-5 rounded-2xl border bg-secondary/40 p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Phone className="h-3.5 w-3.5" /> Login with OTP
              </div>
              <div className="flex gap-2">
                <Input value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" className="flex-1" />
                <Button variant="outline" onClick={handleOtp} loading={loading}><Mail className="h-4 w-4" /> Send OTP</Button>
              </div>
            </div>

            {!configured && (
              <p className="mt-4 rounded-xl bg-warning/10 px-3 py-2 text-center text-[11px] text-warning">
                Demo mode: use <span className="font-bold">admin@diaenterprises.in / Admin@123</span> for the admin panel,
                or sign up for a customer account.
              </p>
            )}

            <Link
              href="/admin/login"
              className="mt-5 flex items-center justify-center gap-2 text-xs font-medium text-muted-foreground transition hover:text-accent"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Staff member? Go to Admin Login
            </Link>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="su-name">Full Name</Label>
                <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-phone">Mobile (optional)</Label>
                <Input id="su-phone" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile" maxLength={10} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="su-password">Password</Label>
                <Input id="su-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" />
              </div>
              <Button type="submit" variant="gold" size="lg" className="w-full" loading={loading}>
                {!loading && <ShieldCheck className="h-4 w-4" />} Create Account
              </Button>
            </form>
            <Divider />
            <Button variant="outline" size="lg" className="w-full" loading={googleLoading} onClick={handleGoogle}>
              {!googleLoading && <GoogleIcon className="h-4 w-4" />} Sign up with Google
            </Button>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              By signing up you agree to our terms & privacy policy.
            </p>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
