"use client";

import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { StoreProvider } from "@/lib/store/store";
import { BusinessSettingsProvider } from "@/lib/business-store";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BusinessSettingsProvider>
        <StoreProvider>
          {children}
          <Toaster richColors position="top-right" />
        </StoreProvider>
      </BusinessSettingsProvider>
    </ThemeProvider>
  );
}
