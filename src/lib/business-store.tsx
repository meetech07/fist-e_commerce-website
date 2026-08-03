"use client";

import * as React from "react";
import {
  BUSINESS_KEY,
  DEFAULT_BUSINESS,
  clearBusinessSettings,
  loadBusinessSettings,
  normalizeBusiness,
  saveBusinessSettings,
  type BusinessSettings,
} from "@/lib/business-config";

interface BusinessSettingsValue {
  settings: BusinessSettings;
  update: (patch: Partial<BusinessSettings>) => void;
  reset: () => void;
  loaded: boolean;
}

const BusinessSettingsContext = React.createContext<BusinessSettingsValue | null>(null);

export function BusinessSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<BusinessSettings>(DEFAULT_BUSINESS);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setSettings(loadBusinessSettings());
    setLoaded(true);
  }, []);

  React.useEffect(() => {
    const icon = settings.favicon || "/icon.png";
    document.querySelectorAll<HTMLLinkElement>('link[rel="icon"], link[rel="apple-touch-icon"]').forEach((el) => {
      el.href = icon;
    });
  }, [settings.favicon]);

  const update = React.useCallback((patch: Partial<BusinessSettings>) => {
    setSettings((prev) => {
      const next = normalizeBusiness({ ...prev, ...patch });
      saveBusinessSettings(next);
      return next;
    });
  }, []);

  const reset = React.useCallback(() => {
    clearBusinessSettings();
    setSettings(DEFAULT_BUSINESS);
  }, []);

  return (
    <BusinessSettingsContext.Provider value={{ settings, update, reset, loaded }}>
      {children}
    </BusinessSettingsContext.Provider>
  );
}

export function useBusinessSettings(): BusinessSettingsValue {
  const ctx = React.useContext(BusinessSettingsContext);
  if (!ctx) throw new Error("useBusinessSettings must be used within BusinessSettingsProvider");
  return ctx;
}

export { BUSINESS_KEY };
