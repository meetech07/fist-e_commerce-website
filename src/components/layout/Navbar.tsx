"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Menu, Moon, Search, ShoppingCart, Sun, User, GitCompare, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoriesData } from "@/lib/constants";
import { useBusinessSettings } from "@/lib/business-store";
import { Logo } from "@/components/layout/Logo";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { useStore } from "@/lib/store/store";
import { buttonVariants } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products", mega: true },
  { label: "Categories", href: "/categories" },
  { label: "Installation", href: "/installation" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [megaOpen, setMegaOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { cartCount } = useStore();
  const { compare } = useStore();
  const { settings } = useBusinessSettings();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass shadow-lg shadow-black/5" : "bg-transparent",
        )}
      >
        {settings.showAnnouncement && settings.announcement && !scrolled && (
          <div className="bg-charcoal px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-white/90 sm:text-xs">
            {settings.announcement}
          </div>
        )}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:h-[72px]">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="relative" onMouseEnter={() => link.mega && setMegaOpen(true)} onMouseLeave={() => setMegaOpen(false)}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    pathname === link.href ? "text-accent" : "text-foreground/80 hover:text-accent",
                  )}
                >
                  {link.label}
                  {link.mega && <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", megaOpen && "rotate-180")} />}
                </Link>
                {link.mega && <MegaMenu open={megaOpen} onNavigate={() => setMegaOpen(false)} />}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <IconButton label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton
              label="Theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted ? (
                theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />
              ) : (
                <span className="h-[18px] w-[18px]" aria-hidden />
              )}
            </IconButton>
            <a
              href={`tel:${settings.phoneRaw}`}
              aria-label="Call us"
              title="Call us"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-accent xl:flex"
            >
              <Phone className="h-[18px] w-[18px]" />
            </a>
            <Link
              href="/compare"
              aria-label="Compare"
              title="Compare"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-accent sm:flex"
            >
              <GitCompare className="h-[18px] w-[18px]" />
              {compare.length > 0 && <CountBadge>{compare.length}</CountBadge>}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              title="Account"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-accent sm:flex"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <div onClick={() => setCartOpen(true)} className="relative" aria-label="Open cart" role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setCartOpen(true); }}>
              <IconButton label="Cart">
                <ShoppingCart className="h-[18px] w-[18px]" />
              </IconButton>
              {cartCount > 0 && <CountBadge>{cartCount}</CountBadge>}
            </div>
            <button
              onClick={() => setMobileOpen(true)}
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MegaMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const [category, setCategory] = React.useState(categoriesData[0]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22 }}
          className="absolute left-1/2 top-full z-50 mt-3 w-[640px] -translate-x-1/2 overflow-hidden rounded-2xl border bg-popover shadow-2xl"
        >
          <div className="grid grid-cols-2">
            <div className="max-h-[420px] overflow-y-auto border-r p-3">
              {categoriesData.map((c) => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  onClick={onNavigate}
                  onMouseEnter={() => setCategory(c)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                    category.slug === c.slug ? "bg-secondary font-semibold text-accent" : "hover:bg-secondary/60",
                  )}
                >
                  {c.name}
                </Link>
              ))}
            </div>
            <div className="relative min-h-[300px] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-display text-lg font-semibold text-white">{category.name}</p>
                <p className="mt-1 text-xs text-white/80">{category.description}</p>
                <Link href={`/category/${category.slug}`} onClick={onNavigate}>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full gold-gradient px-4 py-1.5 text-xs font-bold text-charcoal">
                    Shop now →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { settings } = useBusinessSettings();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] bg-charcoal/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Logo className="mb-6" />
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-xl px-4 py-3 text-base font-medium transition hover:bg-secondary hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
              <div className="grid grid-cols-2 gap-2">
                {categoriesData.slice(0, 8).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/category/${c.slug}`}
                    onClick={onClose}
                    className="rounded-xl border px-3 py-2 text-xs font-medium transition hover:border-accent hover:text-accent"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 flex gap-2">
              <a
                href={`tel:${settings.phoneRaw}`}
                className={cn(buttonVariants({ variant: "gold" }), "flex-1")}
              >
                <Phone className="h-4 w-4" /> Call Now
              </a>
              <Link
                href="/login"
                onClick={onClose}
                className={cn(buttonVariants({ variant: "outline" }), "flex-1")}
              >
                <User className="h-4 w-4" /> Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-accent"
    >
      {children}
    </button>
  );
}

function CountBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full gold-gradient px-1 text-[10px] font-bold text-charcoal shadow">
      {children}
    </span>
  );
}
