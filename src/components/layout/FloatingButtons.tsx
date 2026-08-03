"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { WHATSAPP_DEFAULT_MESSAGE } from "@/lib/business-config";
import { useBusinessSettings } from "@/lib/business-store";

export function FloatingButtons() {
  const [chatOpen, setChatOpen] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);
  const { settings } = useBusinessSettings();

  const waLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {chatOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.94 }}
          className="w-72 overflow-hidden rounded-2xl border bg-card shadow-2xl"
        >
          <div className="flex items-center justify-between bg-charcoal px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
              </span>
              <span className="text-sm font-semibold">{settings.companyName}</span>
            </div>
            <button onClick={() => setChatOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2 p-4">
            <div className="rounded-2xl rounded-tl-sm bg-secondary px-3 py-2 text-sm">
              Namaste 👋 How can we help you with your ceiling & interior project?
            </div>
            <div className="flex gap-2 pt-1">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-xl bg-success py-2 text-center text-sm font-semibold text-white transition hover:brightness-110">
                WhatsApp Chat
              </a>
              <a href={`tel:${settings.phoneRaw}`} className="flex-1 rounded-xl bg-primary py-2 text-center text-sm font-semibold text-primary-foreground transition hover:bg-accent hover:text-accent-foreground">
                Call Now
              </a>
            </div>
            <div className="pt-1 text-center text-[11px] text-muted-foreground">
              Typically replies in minutes
            </div>
          </div>
        </motion.div>
      )}

      {!dismissed && (
        <motion.a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-xl shadow-success/30 animate-pulse-glow"
          aria-label="WhatsApp us"
        >
          <MessageCircle className="h-7 w-7" />
        </motion.a>
      )}

      <div className="flex items-center gap-2">
        <motion.a
          href={`tel:${settings.phoneRaw}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex h-12 w-12 items-center justify-center rounded-full gold-gradient text-charcoal shadow-xl shadow-accent/30"
          aria-label="Call us now"
        >
          <Phone className="h-5 w-5" />
        </motion.a>
        <button
          onClick={() => setDismissed((v) => !v)}
          className="rounded-full bg-card px-2 py-1 text-[10px] font-medium text-muted-foreground shadow border"
        >
          {dismissed ? "Show WhatsApp" : "Hide"}
        </button>
      </div>
    </div>
  );
}
