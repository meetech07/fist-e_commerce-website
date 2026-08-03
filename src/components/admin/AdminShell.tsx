"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgePercent,
  Boxes,
  Home,
  ImageIcon,
  Inbox,
  LogOut,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLocalUser, localSignOut } from "@/lib/auth-local";
import { createClient } from "@supabase/supabase-js";
import { Button, buttonVariants } from "@/components/ui/button";
import { AdminStoreProvider } from "@/lib/admin-store";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: Home, exact: true },
  { href: "/admin/products", label: "Products", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/cms", label: "CMS & Content", icon: ImageIcon },
  { href: "/admin/coupons", label: "Coupons", icon: BadgePercent },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const [supabaseRole, setSupabaseRole] = React.useState<string | null>(null);
  const [loaded, setLoaded] = React.useState(false);
  const [enquiryUnread, setEnquiryUnread] = React.useState(0);

  React.useEffect(() => {
    if (!configured) {
      setLoaded(true);
      return;
    }
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    supabase.auth.getUser().then(({ data }) => {
      setSupabaseRole((data.user?.user_metadata?.role as string) ?? null);
      setLoaded(true);
    });
  }, [configured]);

  React.useEffect(() => {
    const loadUnread = async () => {
      if (configured) {
        const res = await fetch("/api/admin/enquiries");
        const json = (await res.json().catch(() => null)) as { data?: Array<{ is_read: boolean }> } | null;
        setEnquiryUnread((json?.data ?? []).filter((e) => !e.is_read).length);
      } else {
        const { getEnquiries } = await import("@/lib/enquiries-local");
        setEnquiryUnread(getEnquiries().filter((e) => !e.is_read).length);
      }
    };
    loadUnread();
  }, [configured, pathname]);

  const role = configured ? supabaseRole : (getLocalUser()?.role ?? null);
  const isStaff = role === "admin" || role === "manager" || role === "staff";

  const signOut = async () => {
    if (configured) {
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
      await supabase.auth.signOut();
    } else {
      localSignOut();
    }
    router.push("/login");
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loaded && role === null) {
    router.replace("/admin/login");
    return null;
  }

  if (loaded && !isStaff) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
        <ShieldCheck className="h-12 w-12 text-destructive" />
        <h1 className="mt-4 font-display text-2xl font-semibold">Access Restricted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is reserved for DIA Enterprises staff. If you&apos;re a customer, head back to your account.
        </p>
        <Link href="/account" className={cn(buttonVariants(), "mt-6")}>Go to Account</Link>
        <Link href="/admin/login" className="mt-3 text-xs font-medium text-muted-foreground transition hover:text-accent">
          Staff? Sign in to the Admin Panel
        </Link>
      </div>
    );
  }

  return (
    <AdminStoreProvider>
      <div className="mx-auto flex max-w-7xl gap-6 px-4 pb-16 pt-8 sm:px-6">
        <aside className="sticky top-6 hidden h-fit w-60 shrink-0 lg:block">
          <div className="space-y-1 rounded-3xl border bg-card p-3">
            <Link href="/" className="mb-2 flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-accent">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to store
            </Link>
            {NAV.map(({ href, label, icon: Icon, exact }) => {
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
                  {href === "/admin/enquiries" && enquiryUnread > 0 && (
                    <span className={cn("ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold", active ? "bg-primary-foreground/20 text-primary-foreground" : "gold-gradient text-charcoal")}>
                      {enquiryUnread}
                    </span>
                  )}
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-destructive" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </aside>

        <main className="min-w-0 flex-1">{loaded ? children : <div className="skeleton h-96 rounded-3xl" />}</main>
      </div>
    </AdminStoreProvider>
  );
}
