"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Info, AlertTriangle, CheckCircle, Megaphone } from "lucide-react";
import { useCmsStore } from "@/lib/cms-store";

const TYPE_STYLES = {
  info: {
    bg: "bg-blue-50 border-blue-200",
    text: "text-blue-800",
    iconColor: "text-blue-500",
    Icon: Info,
  },
  warning: {
    bg: "bg-amber-50 border-amber-200",
    text: "text-amber-800",
    iconColor: "text-amber-500",
    Icon: AlertTriangle,
  },
  success: {
    bg: "bg-emerald-50 border-emerald-200",
    text: "text-emerald-800",
    iconColor: "text-emerald-500",
    Icon: CheckCircle,
  },
  promo: {
    bg: "bg-primary/10 border-primary/20",
    text: "text-foreground",
    iconColor: "text-primary",
    Icon: Megaphone,
  },
};

export default function AnnouncementBanner() {
  const { globalSections } = useCmsStore();
  const banner = globalSections?.announcementBanner;
  const [dismissed, setDismissed] = useState(false);

  // Restore dismissed state
  useEffect(() => {
    const key = `announcement_dismissed_${banner?.message}`;
    if (sessionStorage.getItem(key) === "true") setDismissed(true);
  }, [banner?.message]);

  // Reset when message changes
  useEffect(() => {
    setDismissed(false);
  }, [banner?.message]);

  if (!banner?.enabled || dismissed) return null;

  const styles = TYPE_STYLES[banner.type] || TYPE_STYLES.promo;
  const { Icon } = styles;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(`announcement_dismissed_${banner.message}`, "true");
  };

  return (
    <div
      className={`w-full border-b flex items-center justify-center px-4 py-2.5 gap-3 relative ${styles.bg}`}
    >
      <div className={`flex items-center gap-2.5 ${styles.text}`}>
        {banner.icon ? (
          <span className="text-base leading-none">{banner.icon}</span>
        ) : (
          <Icon className={`w-4 h-4 flex-shrink-0 ${styles.iconColor}`} />
        )}
        <span className="text-[13px] font-medium leading-snug">{banner.message}</span>
        {banner.link && banner.linkText && (
          <Link
            href={banner.link}
            className={`underline underline-offset-2 font-bold text-[12px] hover:opacity-70 transition-opacity whitespace-nowrap ${styles.iconColor}`}
          >
            {banner.linkText} →
          </Link>
        )}
      </div>

      {banner.closeable && (
        <button
          onClick={handleDismiss}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:opacity-70 transition-opacity ${styles.iconColor}`}
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
