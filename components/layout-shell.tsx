"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCmsStore } from "@/lib/cms-store";
import Header from "./header";
import Footer from "./footer";
import CartDrawer from "./cart-drawer";
import PromoBar from "./promo-bar";
import AnnouncementBanner from "./announcement-banner";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const isEditMode = useCmsStore(state => state.isEditMode);

  useEffect(() => {
    if (!isEditMode) return;
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Prevent navigation on any links
      if (target.closest('a')) {
        e.preventDefault();
      }
      // Also prevent form submissions
      if (target.closest('button[type="submit"]') || target.closest('form')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, [isEditMode]);

  if (isAdmin) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="flex-grow flex flex-col">
      {/* Global sections from CMS — instant-sync via localStorage */}
      <PromoBar />
      <Header />
      <AnnouncementBanner />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
