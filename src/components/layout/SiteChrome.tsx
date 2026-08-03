"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";
import { PageTransition } from "@/components/layout/PageTransition";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <main className="min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingButtons />}
    </>
  );
}
