"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { Order } from "@/lib/db-simulation";
import { getDbOrders } from "@/app/actions";

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default function OrderSuccessPage({ searchParams }: PageProps) {
  const resolvedSearchParams = use(searchParams);
  const orderId = resolvedSearchParams.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  
  // simulated delivery progress stage
  const [trackingStep, setTrackingStep] = useState(1); // 1: Placed, 2: Processing, 3: In Transit, 4: Out for Delivery, 5: Delivered

  useEffect(() => {
    if (orderId) {
      getDbOrders().then((ordersList) => {
        const match = ordersList.find((o) => o.id === orderId);
        if (match) {
          setOrder(match);
        }
      });
    }
  }, [orderId]);

  // Simulate courier transit updates over time (adds rich interactive flavor)
  useEffect(() => {
    if (!order) return;
    
    const interval = setInterval(() => {
      setTrackingStep((step) => {
        if (step < 3) {
          return step + 1;
        }
        return step; // stay in Transit during session
      });
    }, 8000); // increment stage every 8 seconds

    return () => clearInterval(interval);
  }, [order]);

  if (!orderId) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <span className="text-5xl block">⚠️</span>
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="text-xs text-foreground/60 max-w-sm mx-auto">
          No order identifier was found. Redirecting to storefront.
        </p>
        <Link href="/" className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-full inline-block">
          Go back Home
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", desc: "Received at Mobile Store HQ", icon: "📝" },
    { label: "Processing", desc: "Packed & verified at Putalisadak warehouse", icon: "📦" },
    { label: "In Transit", desc: "Handed over to local courier", icon: "🚚" },
    { label: "Out for Delivery", desc: "Rider is heading to your district", icon: "🛵" },
    { label: "Delivered", desc: "Package signed & completed", icon: "🎁" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
      
      {/* 1. Success Message Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl mx-auto shadow-md animate-bounce">
          ✓
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs text-foreground/60 max-w-md mx-auto">
          Your order has been placed successfully. Below is your reference id and tracking progression.
        </p>
        <div className="inline-block px-4 py-1.5 bg-slate-50 dark:bg-slate-900 border border-card-border rounded-xl font-mono text-xs font-bold text-foreground">
          Order ID: <span className="text-primary">{orderId}</span>
        </div>
      </div>

      {/* 2. Interactive simulated Shipping Tracker */}
      <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-card-border pb-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
            📦 Live Shipment Tracker (Simulated)
          </h3>
          <span className="text-[10px] font-bold text-primary bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded animate-pulse">
            Real-time updates
          </span>
        </div>

        {/* Visual Progress Line */}
        <div className="relative flex justify-between items-center w-full px-2 py-4">
          {/* Background Bar */}
          <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 h-1 bg-card-border rounded-full z-0" />
          
          {/* Active progress color bar */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 left-4 h-1 bg-gradient-to-r from-primary to-secondary rounded-full z-0 transition-all duration-1000"
            style={{ width: `${((trackingStep - 1) / (steps.length - 1)) * 90}%` }}
          />

          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isCompleted = stepNum < trackingStep;
            const isActive = stepNum === trackingStep;
            const isPending = stepNum > trackingStep;

            return (
              <div key={idx} className="flex flex-col items-center z-10 relative group">
                {/* Dot */}
                <button
                  onClick={() => setTrackingStep(stepNum)} // User can override step for testing/flavor!
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md active:scale-90 ${
                    isCompleted
                      ? "bg-primary text-white border-2 border-primary"
                      : isActive
                      ? "bg-secondary text-white border-4 border-orange-100 dark:border-orange-950 ring-2 ring-secondary animate-pulse"
                      : "bg-card-bg border-2 border-card-border text-foreground/40 hover:border-foreground/45"
                  }`}
                  title={`Trigger Stage: ${s.label}`}
                >
                  {isCompleted ? "✓" : s.icon}
                </button>
                
                {/* label */}
                <span className={`text-[9px] font-extrabold mt-2 text-center max-w-[80px] truncate ${
                  isActive ? "text-secondary font-black" : "text-foreground/60"
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Text Details for currently active step */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-card-border flex gap-3.5 items-center">
          <span className="text-2xl">{steps[trackingStep - 1].icon}</span>
          <div>
            <div className="text-xs font-bold text-foreground">
              Current Stage: {steps[trackingStep - 1].label}
            </div>
            <div className="text-[10px] text-foreground/60 leading-relaxed mt-0.5">
              {steps[trackingStep - 1].desc}. {trackingStep < 5 && "Couriers will coordinate via contact number upon local arrival."}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Customer & Billing Receipt details */}
      {order && (
        <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6 shadow-sm">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
            🧾 Receipt & Delivery Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-foreground/40">Ship To</span>
              <p className="font-bold text-foreground">{order.customerName}</p>
              <p className="text-foreground/75 leading-relaxed">{order.address}, {order.city}</p>
              <p className="text-foreground/60">{order.customerPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-foreground/40">Payment Status</span>
              <p className="font-bold text-foreground">{order.paymentMethod}</p>
              <p className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded w-max mt-0.5 font-bold">
                Payment Authorized
              </p>
            </div>
          </div>

          {/* List of items purchased */}
          <div className="border-t border-card-border pt-4 space-y-3.5">
            <span className="text-[10px] uppercase font-bold text-foreground/40 block">Purchased Items</span>
            
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-card-border relative bg-slate-50 flex-shrink-0">
                    <img src={item.image} alt={item.productTitle} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground leading-none">{item.productTitle}</div>
                    <span className="text-[9px] text-foreground/50">
                      Qty: {item.quantity} {item.variant ? `(${item.variant})` : ""}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-foreground">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}

            <div className="border-t border-card-border pt-3.5 flex items-center justify-between text-xs font-bold">
              <span className="text-foreground/60">Total Bill Paid:</span>
              <span className="text-base font-black text-primary">Rs. {order.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Button controls */}
      <div className="flex gap-4 items-center justify-center">
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md"
        >
          &larr; Return to Store
        </Link>
        
        {/* Customer account order tracker */}
        <Link
          href="/account"
          className="px-6 py-2.5 border border-card-border hover:bg-slate-50 dark:hover:bg-slate-800 text-foreground text-xs font-bold rounded-xl transition-all"
        >
          Track Order Status &rarr;
        </Link>
      </div>

    </div>
  );
}
