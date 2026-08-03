"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ type = "single", defaultValue = [], className, children }: {
  type?: "single" | "multiple";
  defaultValue?: string[];
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState<string[]>(defaultValue);
  const toggle = (v: string) => {
    if (type === "single") {
      setOpen(open.includes(v) ? [] : [v]);
    } else {
      setOpen(open.includes(v) ? open.filter((x) => x !== v) : [...open, v]);
    }
  };
  return (
    <div className={cn("divide-y divide-border rounded-2xl border bg-card", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const el = child as React.ReactElement<{ value?: string }>;
        return React.cloneElement(el, {
          open,
          toggle,
          isOpen: open.includes(String(el.props.value)),
        } as Record<string, unknown>);
      })}
    </div>
  );
}

function AccordionItem({ value, toggle, isOpen, children, className }: {
  value?: string;
  open?: string[];
  toggle?: (v: string) => void;
  isOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-5", className)}>
      {React.Children.map(children, (child) => {
        if (!child) return child;
        const isTrigger =
          React.isValidElement(child) &&
          typeof child.type !== "string" &&
          (child.type as { displayName?: string }).displayName === "AccordionTrigger";
        if (isTrigger) {
          return React.cloneElement(child as React.ReactElement<TriggerProps>, {
            isOpen,
            onClick: () => toggle?.(value ?? ""),
          });
        }
        return React.cloneElement(child as React.ReactElement<ContentProps>, { isOpen });
      })}
    </div>
  );
}
AccordionItem.displayName = "AccordionItem";

type TriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { isOpen?: boolean };
const AccordionTrigger = React.forwardRef<HTMLButtonElement, TriggerProps>(
  ({ className, children, isOpen, onClick, ...props }, ref) => (
    <button
      ref={ref}
      onClick={onClick}
      className={cn("flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium", className)}
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform duration-300", isOpen && "rotate-180")} />
    </button>
  ),
);
AccordionTrigger.displayName = "AccordionTrigger";

type ContentProps = React.HTMLAttributes<HTMLDivElement> & { isOpen?: boolean };
const AccordionContent = React.forwardRef<HTMLDivElement, ContentProps>(
  ({ className, children, isOpen, ...props }, ref) => (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div ref={ref} className={cn("pb-4 text-sm text-muted-foreground", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  ),
);
AccordionContent.displayName = "AccordionContent";

export { AccordionItem, AccordionTrigger, AccordionContent };
