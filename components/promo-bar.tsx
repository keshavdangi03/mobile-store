"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useCmsStore } from "@/lib/cms-store";

export default function PromoBar() {
  const { globalSections } = useCmsStore();
  const promoBar = globalSections?.promoBar;
  const [dismissed, setDismissed] = useState(false);

  // Restore dismissed state from sessionStorage
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("promobar_dismissed");
    if (wasDismissed === "true") setDismissed(true);
  }, []);

  // Reset dismissed when promo bar text changes (new promo)
  useEffect(() => {
    setDismissed(false);
    sessionStorage.removeItem("promobar_dismissed");
  }, [promoBar?.text]);

  if (!promoBar?.enabled || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("promobar_dismissed", "true");
  };

  return (
    <div
      className="w-full flex items-center justify-center gap-3 px-4 py-2 text-sm font-semibold relative z-50 transition-all"
      style={{ backgroundColor: promoBar.bgColor, color: promoBar.textColor }}
    >
      {/* Content */}
      <div className="flex items-center gap-2 text-center">
        {promoBar.emoji && <span className="text-base leading-none">{promoBar.emoji}</span>}
        <span className="text-[13px] font-semibold leading-snug">{promoBar.text}</span>
        {promoBar.link && promoBar.linkText && (
          <Link
            href={promoBar.link}
            className="underline underline-offset-2 font-black text-[12px] hover:opacity-80 transition-opacity ml-1 whitespace-nowrap"
            style={{ color: promoBar.textColor }}
          >
            {promoBar.linkText} →
          </Link>
        )}
      </div>

      {/* Close Button */}
      {promoBar.closeable && (
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity p-1 rounded"
          style={{ color: promoBar.textColor }}
          aria-label="Dismiss promo bar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
