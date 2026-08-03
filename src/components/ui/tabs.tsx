"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  setValue: (v: string) => void;
}
const TabsContext = React.createContext<TabsContextValue>({ value: "", setValue: () => {} });

export function Tabs({ value, defaultValue, onValueChange, className, children }: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const current = value ?? internal;
  const setValue = (v: string) => {
    if (onValueChange) onValueChange(v);
    setInternal(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, setValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center gap-1 rounded-full bg-secondary p-1", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { value: current, setValue } = React.useContext(TabsContext);
  const active = current === value;
  return (
    <button
      onClick={() => setValue(value)}
      className={cn(
        "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
        active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
    >
      {active && (
        <MotionUnderlay />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function MotionUnderlay() {
  return (
    <span
      className="absolute inset-0 rounded-full bg-primary shadow"
      aria-hidden
    />
  );
}

export function TabsContent({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const { value: current } = React.useContext(TabsContext);
  if (current !== value) return null;
  return <div className={cn("mt-4", className)}>{children}</div>;
}
