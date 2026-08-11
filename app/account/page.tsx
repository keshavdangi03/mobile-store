"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/db-simulation";
import { getDbOrders } from "@/app/actions";
import { 
  ShoppingBag, 
  History, 
  User, 
  MapPin, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Loader2 
} from "lucide-react";

type Tab = "orders" | "history" | "profile" | "address" | "password";

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  // Profile fields state
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [defaultAddress, setDefaultAddress] = useState("New Road, Kathmandu");
  const [defaultCity, setDefaultCity] = useState("Kathmandu");

  useEffect(() => {
    // 1. Authenticate user
    const savedSession = localStorage.getItem("customer_session");
    if (!savedSession) {
      router.push("/login");
      return;
    }
    
    const userObj = JSON.parse(savedSession);
    setCustomer(userObj);
    setNewName(userObj.name || "");
    setNewPhone(userObj.phone || "");
    setPageLoading(false);

    // 2. Fetch user orders
    getDbOrders().then((data) => {
      // Filter orders by phone or name to simulate customer scope
      const customerOrders = data.filter(
        (o) => 
          o.customerPhone === userObj.phone || 
          o.customerEmail === userObj.email ||
          o.customerName.toLowerCase().includes(userObj.name.toLowerCase())
      );
      setOrders(customerOrders);
      setLoadingOrders(false);
    });
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem("customer_session");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    
    const updated = { ...customer, name: newName, phone: newPhone };
    setCustomer(updated as any);
    localStorage.setItem("customer_session", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    alert("Profile details updated successfully!");
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const initialLetter = customer?.name?.charAt(0).toUpperCase() || "C";

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-10 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 1. Left Sidebar Panels */}
        <aside className="lg:col-span-1 space-y-6">
          {/* User Profile Header Card */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl flex items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-md">
              {initialLetter}
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-wide">Hello!</span>
              <h2 className="font-extrabold text-sm text-foreground truncate">{customer?.name}</h2>
              <p className="text-[10px] text-slate-400 mt-0.5">Welcome to <span className="text-primary font-bold">Mobile</span> store</p>
            </div>
          </div>

          {/* Navigation links card */}
          <div className="bg-card-bg border border-card-border rounded-3xl p-5 shadow-sm space-y-6">
            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold text-foreground/45 uppercase tracking-wider px-3">Quick Actions</h3>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "orders"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Orders
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <History className="w-4 h-4" /> Purchase History
                </button>
              </nav>
            </div>

            {/* My Account */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-extrabold text-foreground/45 uppercase tracking-wider px-3">My Account</h3>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <User className="w-4 h-4" /> Profile Details
                </button>
                <button
                  onClick={() => setActiveTab("address")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "address"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Address Book
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "password"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-slate-50 dark:hover:bg-slate-900/30"
                  }`}
                >
                  <Lock className="w-4 h-4" /> Change Password
                </button>
              </nav>
            </div>
          </div>

          {/* Log Out Box Card */}
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 p-4 bg-card-bg border border-card-border rounded-3xl text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </aside>

        {/* 2. Right Panels area */}
        <main className="lg:col-span-3">
          <div className="bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 min-h-[480px] shadow-sm flex flex-col">
            
            {/* Tab: Orders */}
            {activeTab === "orders" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Active Orders</h3>
                
                {loadingOrders ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-6 flex-1">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-card-border rounded-2xl p-4 md:p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-card-border/80 pb-3 text-xs">
                          <div>
                            <span className="font-bold text-foreground">Order ID: </span>
                            <span className="text-primary font-black uppercase">{order.id}</span>
                          </div>
                          <div className="text-foreground/60 font-semibold">{new Date(order.createdAt).toLocaleDateString()}</div>
                          <div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === "Shipped" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" :
                              order.status === "Cancelled" ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400" :
                              "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="divide-y divide-card-border/60">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-card-border relative bg-slate-50 flex-shrink-0">
                                <img src={item.image} alt={item.productTitle} className="object-cover w-full h-full" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-xs text-foreground truncate">{item.productTitle}</h4>
                                <p className="text-[10px] text-foreground/50 font-semibold mt-0.5">
                                  Qty: {item.quantity} {item.variant ? `| ${item.variant}` : ""}
                                </p>
                              </div>
                              <div className="text-xs font-black text-foreground">Rs. {item.price.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-card-border/80 pt-3 text-xs">
                          <div>
                            <span className="text-foreground/60 font-semibold">Payment: </span>
                            <span className="font-bold text-foreground">{order.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-foreground/60 font-semibold">Total: </span>
                            <span className="font-black text-sm text-primary">Rs. {order.totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty state exactly matching screenshot layout */
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                    <div className="relative w-36 h-36 flex items-center justify-center text-slate-300 dark:text-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-full">
                      {/* Shopping cart empty icon vector wrapper */}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-16 h-16">
                        <circle cx="9" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        {/* Red X badge inside */}
                        <path d="M18 10l-4 4m0-4l4 4" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-2 max-w-sm">
                      <h4 className="text-lg font-black text-foreground">You have no previous orders</h4>
                      <p className="text-xs text-foreground/60 leading-relaxed font-medium">
                        We have thousands of items available across our wide range of sellers. Start ordering today!
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/category/all")}
                      className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-orange-500 hover:brightness-105 font-bold text-xs uppercase text-white rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Purchase History */}
            {activeTab === "history" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Purchase History</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <History className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  <p className="text-xs text-foreground/50 font-bold">No completed purchases found in your log book.</p>
                </div>
              </div>
            )}

            {/* Tab: Profile Details */}
            {activeTab === "profile" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Profile Details</h3>
                <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={customer?.email || ""}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-100 dark:bg-slate-900 border border-card-border text-foreground/50 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Contact Phone Number</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Address Book */}
            {activeTab === "address" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Address Book</h3>
                <div className="space-y-6 max-w-md">
                  <div className="border border-card-border rounded-2xl p-5 space-y-3">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold rounded uppercase">Default Delivery Address</span>
                    <div className="text-xs text-foreground font-semibold">{newName}</div>
                    <div className="text-xs text-foreground/75 leading-relaxed">{defaultAddress}, {defaultCity}, Nepal</div>
                    <div className="text-xs text-foreground/60 font-medium">📞 {newPhone}</div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Edit Street Address</label>
                      <input
                        type="text"
                        value={defaultAddress}
                        onChange={(e) => setDefaultAddress(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                      />
                    </div>
                    <button
                      onClick={() => alert("Address updated!")}
                      className="px-5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Change Password */}
            {activeTab === "password" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Change Password</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert("Password updated successfully!"); }} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
