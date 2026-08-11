"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import CartDrawer from "./cart-drawer";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <div className="flex-1 flex flex-col">{children}</div>;
  }

  return (
    <div className="flex-grow flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
