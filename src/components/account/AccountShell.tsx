"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  Clock,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalUser, localSignOut } from "@/lib/auth-local";
import { createClient } from "@supabase/supabase-js";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/invoices", label: "Invoices", icon: Receipt },
  { href: "/account/recently-viewed", label: "Recently Viewed", icon: Clock },
  { href: "/account/profile", label: "Profile", icon: User },
];

export function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<{ name: string; email: string; role: string } | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
    if (configured) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) {
          setUser({
            name: (data.user.user_metadata?.name as string) ?? data.user.email ?? "User",
            email: data.user.email ?? "",
            role: (data.user.user_metadata?.role as string) ?? "customer",
          });
        }
        setLoaded(true);
      });
    } else {
      setUser(getLocalUser());
      setLoaded(true);
    }
  }, []);

  const signOut = async () => {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      await supabase.auth.signOut();
    } else {
      localSignOut();
    }
    router.push("/login");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar name={user?.name ?? "User"} size="xl" />
          <div>
            <h1 className="font-display text-2xl font-semibold sm:text-3xl">
              Namaste, {user?.name?.split(" ")[0] ?? "Guest"} 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.email} {user?.role && user.role !== "customer" && (
                <span className="ml-2 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                  {user.role}
                </span>
              )}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="sticky top-24 space-y-1 rounded-3xl border bg-card p-3">
            {LINKS.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
                    active ? "bg-primary text-primary-foreground" : "hover:bg-secondary",
                  )}
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              );
            })}
            {user?.role && user.role !== "customer" && (
              <Link
                href="/admin"
                className="mt-2 flex items-center gap-3 rounded-xl border border-accent/40 px-3.5 py-2.5 text-sm font-semibold text-accent transition hover:bg-accent/10"
              >
                <ShieldCheck className="h-4 w-4" /> Admin Panel
              </Link>
            )}
          </div>
        </aside>
        <div>{loaded ? children : <div className="skeleton h-96 rounded-3xl" />}</div>
      </div>
    </div>
  );
}
