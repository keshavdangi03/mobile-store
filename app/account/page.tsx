"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/db-simulation";
import { 
  getDbOrders, 
  getCourseEnrollmentsByEmail, 
  getRepairRequestsByEmail, 
  getTraderProducts, 
  saveDbProduct,
  updateRepairPaymentStatus,
  cancelRepairRequest
} from "@/app/actions";
import { 
  ShoppingBag, 
  History, 
  User, 
  MapPin, 
  Lock, 
  LogOut, 
  ChevronRight, 
  Loader2,
  GraduationCap,
  Wrench,
  Store,
  Plus,
  Play,
  Download,
  BookOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X
} from "lucide-react";

type Tab = "orders" | "history" | "profile" | "address" | "password" | "courses" | "repairs" | "trader";

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<{ name: string; email: string; phone?: string; isTrader?: boolean } | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);

  // New Services States
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [activeVideo, setActiveVideo] = useState<any>(null);

  const [repairs, setRepairs] = useState<any[]>([]);
  const [loadingRepairs, setLoadingRepairs] = useState(false);

  const [traderProducts, setTraderProducts] = useState<any[]>([]);
  const [loadingTrader, setLoadingTrader] = useState(false);
  const [isListingModalOpen, setIsListingModalOpen] = useState(false);

  // Trader Form States
  const [prodTitle, setProdTitle] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodBrand, setProdBrand] = useState("");
  const [prodCategory, setProdCategory] = useState("smartphone");
  const [prodCustomCategory, setProdCustomCategory] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodRam, setProdRam] = useState("");
  const [prodStorage, setProdStorage] = useState("");
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [previewPdfTitle, setPreviewPdfTitle] = useState("");

  // Repair Cancellation States
  const [cancellingJob, setCancellingJob] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [submittingCancellation, setSubmittingCancellation] = useState(false);

  const handleCancelRepairSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) {
      alert("Please enter a cancellation reason.");
      return;
    }

    setSubmittingCancellation(true);
    const success = await cancelRepairRequest(cancellingJob.id, cancelReason.trim());
    setSubmittingCancellation(false);

    if (success) {
      alert("Your repair request has been cancelled.");
      setCancellingJob(null);
      setCancelReason("");
      // Refresh list
      getRepairRequestsByEmail(customer?.email || "").then(setRepairs);
    } else {
      alert("Failed to cancel repair request.");
    }
  };

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

    // Check if redirecting from training/repair to open a specific tab
    const requestedTab = localStorage.getItem("active_account_tab") as Tab;
    if (requestedTab) {
      setActiveTab(requestedTab);
      localStorage.removeItem("active_account_tab");
    }

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

    // 3. Fetch courses
    setLoadingCourses(true);
    getCourseEnrollmentsByEmail(userObj.email).then((data) => {
      setCourses(data);
      setLoadingCourses(false);
      // Select first online video automatically if online courses found
      const onlineCourse = data.find((c: any) => c.courseType === "online");
      if (onlineCourse && Array.isArray(onlineCourse.videos) && onlineCourse.videos.length > 0) {
        setActiveVideo({
          title: onlineCourse.videos[0].title,
          url: onlineCourse.videos[0].url
        });
      }
    });

    // 4. Fetch repairs
    setLoadingRepairs(true);
    getRepairRequestsByEmail(userObj.email).then((data) => {
      setRepairs(data);
      setLoadingRepairs(false);
    });

    // 5. Fetch trader products if applicable
    if (userObj.isTrader) {
      setLoadingTrader(true);
      getTraderProducts(userObj.email).then((data) => {
        setTraderProducts(data);
        setLoadingTrader(false);
      });
    }
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

  const handleListProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle.trim() || !prodPrice.trim() || !prodBrand.trim() || !prodDesc.trim()) {
      alert("Please fill in all product details.");
      return;
    }

    const priceNum = parseInt(prodPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (!prodImage.trim()) {
      alert("Product cover image URL is required.");
      return;
    }

    if (prodCategory === "other" && !prodCustomCategory.trim()) {
      alert("Please specify the custom category name.");
      return;
    }

    const listingId = "trader-prod-" + Math.floor(100000 + Math.random() * 900000);
    const newProduct: any = {
      id: listingId,
      title: prodTitle,
      price: priceNum,
      originalPrice: Math.floor(priceNum * 1.15),
      discount: 13,
      rating: 4.5,
      reviewsCount: 0,
      image: prodImage.trim(),
      category: prodCategory === "other" ? prodCustomCategory.trim().toLowerCase() : prodCategory,
      brand: prodBrand,
      description: prodDesc,
      inStock: true,
      featured: false,
      trending: false,
      emiAvailable: false,
      specs: {
        "RAM": prodRam || "8GB",
        "Storage": prodStorage || "128GB",
        "Condition": "Brand New"
      },
      isApproved: false,
      isTraderProduct: true,
      traderEmail: customer?.email,
      status: "Pending",
      feedback: null,
      commissionPercent: 10
    };

    const success = await saveDbProduct(newProduct);
    if (success) {
      alert("Your product listing has been submitted to the Admin for approval!");
      setProdTitle("");
      setProdPrice("");
      setProdBrand("");
      setProdDesc("");
      setProdImage("");
      setProdRam("");
      setProdStorage("");
      setProdCustomCategory("");
      setIsListingModalOpen(false);
      
      if (customer?.email) {
        setLoadingTrader(true);
        const data = await getTraderProducts(customer.email);
        setTraderProducts(data);
        setLoadingTrader(false);
      }
    } else {
      alert("Failed to submit product listing.");
    }
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
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" /> Orders
                </button>
                <button
                  onClick={() => setActiveTab("history")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "history"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <History className="w-4 h-4" /> Purchase History
                </button>
                <button
                  onClick={() => setActiveTab("courses")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "courses"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" /> My Courses
                </button>
                <button
                  onClick={() => setActiveTab("repairs")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "repairs"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <Wrench className="w-4 h-4" /> Track Repairs
                </button>
                {customer?.isTrader && (
                  <button
                    onClick={() => setActiveTab("trader")}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeTab === "trader"
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                    }`}
                  >
                    <Store className="w-4 h-4" /> Trader Dashboard
                  </button>
                )}
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
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <User className="w-4 h-4" /> Profile Details
                </button>
                <button
                  onClick={() => setActiveTab("address")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "address"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
                  }`}
                >
                  <MapPin className="w-4 h-4" /> Address Book
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "password"
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-card-bg dark:hover:bg-slate-900/30"
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
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-card-border relative bg-card-bg flex-shrink-0">
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
                    <div className="relative w-36 h-36 flex items-center justify-center text-slate-300 dark:text-slate-700 bg-card-bg rounded-full">
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
                      className="w-full text-xs px-3.5 py-2.5 bg-black/5  border border-card-border text-foreground/50 rounded-xl outline-none"
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

            {/* Tab: My Courses */}
            {activeTab === "courses" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">My Enrolled Programs</h3>
                
                {loadingCourses ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : courses.length > 0 ? (
                  <div className="space-y-8 flex-1">
                    {courses.map((enrollment) => (
                      <div key={enrollment.id} className="border border-card-border rounded-2xl p-4 md:p-6 space-y-6">
                        
                        {/* Course Overview Card */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-card-border pb-4">
                          <div>
                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                              enrollment.courseType === "physical" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40" : "bg-teal-100 text-teal-600 dark:bg-teal-950/40"
                            }`}>
                              {enrollment.courseType === "physical" ? "Classroom Training" : "Online Video Course"}
                            </span>
                            <h4 className="font-extrabold text-sm text-foreground mt-1.5">{enrollment.courseTitle}</h4>
                          </div>
                          <div className="text-right text-xs">
                            <div className="text-foreground/50 font-bold uppercase text-[9px]">Receipt Code</div>
                            <div className="font-black text-primary uppercase">{enrollment.id.slice(0, 8)}</div>
                          </div>
                        </div>

                        {/* If Online Course: Render Lessons Player & PDF Study Guides */}
                        {enrollment.courseType === "online" ? (
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Left List of lessons */}
                            <div className="lg:col-span-5 space-y-3 bg-black/5 dark:bg-black/20 p-4 rounded-xl border border-card-border">
                              <h5 className="font-bold text-xs text-foreground flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5 text-primary" /> Lessons Playlist
                              </h5>
                              <div className="flex flex-col gap-1.5 pt-2">
                                {Array.isArray(enrollment.videos) && enrollment.videos.length > 0 ? (
                                  enrollment.videos.map((vid: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => setActiveVideo(vid)}
                                      className={`w-full text-left px-3 py-2 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-between ${
                                        activeVideo?.title === vid.title
                                          ? "bg-primary text-white"
                                          : "bg-background hover:bg-black/5 dark:hover:bg-slate-900/30 text-foreground"
                                      }`}
                                    >
                                      <span className="truncate max-w-[180px]">{idx + 1}. {vid.title}</span>
                                      <Play className="w-3 h-3 flex-shrink-0" />
                                    </button>
                                  ))
                                ) : (
                                  <div className="text-center py-4 text-xs text-foreground/50 italic">No video lessons uploaded yet.</div>
                                )}
                              </div>

                              <div className="border-t border-card-border mt-3 pt-3 space-y-2">
                                <h5 className="font-bold text-xs text-foreground flex items-center gap-1">
                                  <Download className="w-3.5 h-3.5 text-primary" /> Study Material PDFs
                                </h5>
                                <div className="flex flex-col gap-1">
                                  {Array.isArray(enrollment.notes) && enrollment.notes.length > 0 ? (
                                    enrollment.notes.map((note: any, idx: number) => {
                                      const url = (!note.downloadUrl || note.downloadUrl === "#" || note.downloadUrl === "") ? "/dummy.pdf" : note.downloadUrl;
                                      return (
                                        <button 
                                          key={idx}
                                          onClick={() => {
                                            setPreviewPdfUrl(url);
                                            setPreviewPdfTitle(note.title);
                                          }}
                                          className="w-full text-left p-2.5 bg-background border border-card-border hover:border-primary rounded-lg text-[10px] font-bold text-foreground flex items-center justify-between hover:bg-primary/5 transition-all cursor-pointer"
                                        >
                                          <div className="flex items-center gap-1.5 truncate">
                                            <FileText className="w-3.5 h-3.5 text-foreground/50 shrink-0" />
                                            <span className="truncate">{note.title}</span>
                                          </div>
                                          <div className="text-[9px] text-primary uppercase font-extrabold flex items-center gap-0.5 hover:underline shrink-0">
                                            View PDF <Play className="w-2.5 h-2.5 rotate-90" />
                                          </div>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="text-center py-4 text-xs text-foreground/50 italic">No PDF study materials uploaded yet.</div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Video Player */}
                            <div className="lg:col-span-7 space-y-2">
                              {activeVideo ? (
                                <div className="space-y-2">
                                  <div className="aspect-video bg-black rounded-xl overflow-hidden border border-card-border relative shadow">
                                    <video key={activeVideo.url} src={activeVideo.url} controls className="w-full h-full object-cover" />
                                  </div>
                                  <div className="text-xs font-bold text-foreground truncate">{activeVideo.title}</div>
                                </div>
                              ) : (
                                <div className="aspect-video bg-slate-950 rounded-xl border border-card-border flex items-center justify-center text-slate-500 text-xs">
                                  Click on a video in the playlist to start studying.
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          /* If Physical Course: Render admission ticket card style */
                          <div className="p-5 bg-gradient-to-tr from-emerald-50/5 to-teal-500/5 border border-dashed border-emerald-500/20 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                            {/* Admission info */}
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <h5 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Lab Entrance Ticket</h5>
                                <h4 className="text-base font-black text-foreground">Academy Classroom Seat Confirmed</h4>
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-foreground/80">
                                <div>
                                  <span className="text-[10px] text-foreground/45 uppercase block">Center Address</span>
                                  Mobile Store Lab, New Road, Kathmandu
                                </div>
                                <div>
                                  <span className="text-[10px] text-foreground/45 uppercase block">Class Timings</span>
                                  Mon - Fri, 8:00 AM - 10:00 AM
                                </div>
                                <div>
                                  <span className="text-[10px] text-foreground/45 uppercase block">Duration</span>
                                  6 Weeks (Hands-on Lab)
                                </div>
                                <div>
                                  <span className="text-[10px] text-foreground/45 uppercase block">Student Profile</span>
                                  {enrollment.customerName}
                                </div>
                              </div>
                            </div>

                            {/* Ticket Stubs / Barcode Simulation */}
                            <div className="flex flex-col items-center justify-center p-4 bg-background border border-card-border rounded-xl shadow-inner text-center shrink-0 w-full md:w-36">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2 animate-bounce" />
                              <span className="text-[10px] font-bold text-emerald-600 uppercase">Paid & Active</span>
                              
                              {/* Simulated Barcode */}
                              <div className="mt-3 flex gap-0.5 justify-center opacity-70">
                                {[1,3,1,2,4,1,3,2,1,4,1,2].map((w, i) => (
                                  <div key={i} className="bg-foreground h-6" style={{ width: `${w}px` }} />
                                ))}
                              </div>
                              <span className="text-[8px] font-bold font-mono text-foreground/40 mt-1 uppercase">ADM-{enrollment.id.slice(0,6)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <GraduationCap className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-foreground">No Enrolled Courses Found</h4>
                      <p className="text-xs text-foreground/60 max-w-xs mx-auto">You have not bought any training programs yet. Learn hardware repairing and chip soldering from professionals.</p>
                    </div>
                    <button
                      onClick={() => router.push("/training")}
                      className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-105 text-white font-bold text-xs uppercase rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Browse Training Programs
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Track Repairs */}
            {activeTab === "repairs" && (
              <div className="flex-1 flex flex-col">
                <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-4 mb-6">Device Repairs Log</h3>
                
                {loadingRepairs ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : repairs.length > 0 ? (
                  <div className="space-y-8 flex-1">
                    {repairs.map((job) => {
                      const steps = ["Pending", "Approved", "Received", "Repairing", "Fixed", "Returned"];
                      const stepLabels = ["Submitted", "Approved", "Received", "Repairing", "Fixed", "Returned"];
                      let currentStepIndex = steps.indexOf(job.status);
                      
                      const isRejected = job.status === "Rejected";

                      return (
                        <div key={job.id} className="border border-card-border rounded-2xl p-4 md:p-6 space-y-6">
                          {/* Header */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-card-border pb-3">
                            <div>
                              <div className="text-xs text-slate-400 font-semibold">Repair Ticket</div>
                              <h4 className="font-black text-sm text-foreground mt-0.5">{job.brand} {job.modelName}</h4>
                            </div>
                            <div className="text-right text-xs">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isRejected ? "bg-red-100 text-red-600 dark:bg-red-950/40" :
                                job.status === "Returned" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40" :
                                "bg-blue-100 text-blue-600 dark:bg-blue-950/40"
                              }`}>
                                {job.status}
                              </span>
                              <div className="text-[9px] text-foreground/50 mt-1 font-semibold">{new Date(job.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>

                          {/* Rejection Banner */}
                          {isRejected && (
                            <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <div>
                                <h5 className="font-bold">Request Rejected</h5>
                                <p className="mt-0.5 text-foreground/70 font-normal">
                                  {job.adminFeedback || "Technicians reviewed details and decided they cannot fix this model at this time."}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Stepper Timeline Tracker */}
                          {!isRejected && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between text-[10px] text-foreground/45 uppercase font-bold tracking-wider px-1">
                                <span>Track Progress</span>
                                <span className="text-primary font-black">Status: {job.status}</span>
                              </div>

                              <div className="grid grid-cols-6 gap-1 relative items-center py-2">
                                {/* Connecting line */}
                                <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded" />
                                <div 
                                  className="absolute left-[8%] top-1/2 -translate-y-1/2 h-1 bg-blue-500 -z-10 rounded transition-all duration-700" 
                                  style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 84}%` }}
                                />

                                {stepLabels.map((lbl, idx) => {
                                  const isActive = idx <= currentStepIndex;
                                  return (
                                    <div key={idx} className="flex flex-col items-center text-center">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                                        isActive
                                          ? "bg-blue-500 border-blue-500 text-white scale-110 shadow-md"
                                          : "bg-background border-card-border text-foreground/40"
                                      }`}>
                                        {idx < currentStepIndex ? "✓" : idx + 1}
                                      </div>
                                      <span className={`text-[9px] font-bold mt-1.5 block truncate max-w-[60px] ${
                                        isActive ? "text-blue-500" : "text-foreground/40 font-semibold"
                                      }`}>
                                        {lbl}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Diagnostics & Bill details */}
                          <div className="p-4 bg-black/5 dark:bg-black/20 rounded-xl border border-card-border space-y-3 text-xs">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <span className="font-extrabold text-[10px] text-foreground/40 uppercase block">Problem Description</span>
                                <span className="text-foreground/75 font-semibold leading-relaxed block mt-0.5">{job.description}</span>
                              </div>
                              {job.estimateCost && (
                                <div className="text-right shrink-0">
                                  <span className="font-extrabold text-[10px] text-foreground/40 uppercase block">Est. Invoice</span>
                                  <span className="text-base font-black text-primary block mt-0.5">Rs. {job.estimateCost.toLocaleString()}</span>
                                </div>
                              )}
                            </div>

                            {/* Status message */}
                            {job.status === "Pending" && (
                              <div className="text-[11px] text-slate-400 font-semibold">
                                ⌛ Diagnosing details. Admin will approve and provide estimated invoice cost soon.
                              </div>
                            )}

                            {job.status === "Approved" && (
                              <div className="space-y-2">
                                <p className="text-[11px] text-blue-500 font-semibold">
                                  ✅ Approved! Estimated invoice cost: Rs. {job.estimateCost}. Please ship/drop off your mobile.
                                </p>
                                <div className="p-3 bg-background border border-card-border rounded-lg leading-relaxed text-[10px] font-semibold text-foreground/70">
                                  📍 <span className="font-bold text-foreground">Delivery Address:</span> Mobile Store Labs, New Road (Opposite Nabil Bank), Ward 22, Kathmandu. Please attach your Request ID: <span className="font-black text-primary">{job.id.slice(0, 8)}</span> on the box.
                                </div>
                              </div>
                            )}

                            {job.status === "Received" && (
                              <div className="text-[11px] text-indigo-500 font-bold">
                                📦 Mobile Received at New Road workshop counter. Technician diagnostics & hardware check in progress.
                              </div>
                            )}

                            {job.status === "Repairing" && (
                              <div className="text-[11px] text-indigo-500 font-bold">
                                🔧 Repair in progress. Replacement parts are being installed. Hardware safety tests active.
                              </div>
                            )}

                            {job.status === "Fixed" && (
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-1 border-t border-card-border">
                                <div className="text-[11px] text-emerald-500 font-bold">
                                  🎉 Successful! Repair job complete and device tested. Invoice: Rs. {job.estimateCost}.
                                </div>
                                
                                {job.paymentStatus === "Paid" ? (
                                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-black text-[10px] rounded-lg">
                                    💰 Payment Verified - Shipping Return
                                  </span>
                                ) : (
                                  <button
                                    onClick={async () => {
                                      const success = await updateRepairPaymentStatus(job.id, job.paymentMethod || "Mobile Wallet", "Paid");
                                      if (success) {
                                        alert("Mock payment verification successful! Your device status will update shortly.");
                                        getRepairRequestsByEmail(customer?.email || "").then(setRepairs);
                                      }
                                    }}
                                    className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white text-[10px] font-black uppercase rounded-lg transition-all"
                                  >
                                    Pay Estimate Rs. {job.estimateCost}
                                  </button>
                                )}
                              </div>
                            )}

                            {job.status === "Returned" && (
                              <div className="text-[11px] text-emerald-500 font-bold">
                                🚀 Completed. Handed back to owner. Invoice Paid ({job.paymentMethod}). Thank you!
                              </div>
                            )}

                            {job.status === "Cancelled" && (
                              <div className="p-3 bg-red-950/10 border border-red-900/20 rounded-xl space-y-1">
                                <div className="text-[11px] text-red-400 font-bold">❌ Request Cancelled by Customer</div>
                                {job.cancelReason && (
                                  <p className="text-[10px] text-slate-400 font-medium">
                                    <span className="font-bold text-slate-500">Reason:</span> {job.cancelReason}
                                  </p>
                                )}
                              </div>
                            )}

                            {["Pending", "Approved"].includes(job.status) && (
                              <div className="flex justify-end pt-2">
                                <button
                                  onClick={() => {
                                    setCancellingJob(job);
                                    setCancelReason("");
                                  }}
                                  className="px-3.5 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  Cancel Request
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <Wrench className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-sm text-foreground">No Repair Tickets Found</h4>
                      <p className="text-xs text-foreground/60 max-w-xs mx-auto">Have a phone with cracked screen, charging issue, or dead battery? Submit a ticket and our technicians will fix it.</p>
                    </div>
                    <button
                      onClick={() => router.push("/repair")}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-105 text-white font-bold text-xs uppercase rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
                    >
                      Request Device Repair
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Trader Dashboard */}
            {activeTab === "trader" && customer?.isTrader && (
              <div className="flex-1 flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-card-border pb-4 mb-6">
                  <div>
                    <h3 className="text-base font-extrabold text-foreground">Trader Listing Console</h3>
                    <p className="text-xs text-foreground/50">Submit products to sell on the store (10% platform commission fee applies).</p>
                  </div>
                  <button
                    onClick={() => setIsListingModalOpen(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Product to Sell
                  </button>
                </div>

                {/* Performance overview metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-black/5 dark:bg-black/20 border border-card-border rounded-2xl text-center">
                    <div className="text-[10px] text-foreground/50 uppercase font-bold">Total Listed</div>
                    <div className="text-xl font-black text-foreground mt-1">{traderProducts.length}</div>
                  </div>
                  <div className="p-4 bg-black/5 dark:bg-black/20 border border-card-border rounded-2xl text-center">
                    <div className="text-[10px] text-foreground/50 uppercase font-bold">Approved</div>
                    <div className="text-xl font-black text-emerald-500 mt-1">
                      {traderProducts.filter(p => p.isApproved).length}
                    </div>
                  </div>
                  <div className="p-4 bg-black/5 dark:bg-black/20 border border-card-border rounded-2xl text-center">
                    <div className="text-[10px] text-foreground/50 uppercase font-bold">Pending</div>
                    <div className="text-xl font-black text-amber-500 mt-1">
                      {traderProducts.filter(p => p.status === "Pending").length}
                    </div>
                  </div>
                </div>

                {/* Products Table list */}
                {loadingTrader ? (
                  <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : traderProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-foreground/75 border-collapse divide-y divide-card-border/80">
                      <thead>
                        <tr className="text-[10px] text-foreground/45 uppercase font-black tracking-wider border-b border-card-border/80">
                          <th className="py-3 px-2">Image</th>
                          <th className="py-3 px-2">Product Name</th>
                          <th className="py-3 px-2">Selling Price</th>
                          <th className="py-3 px-2">Net Earnings (90%)</th>
                          <th className="py-3 px-2">Approval Status</th>
                          <th className="py-3 px-2">Admin Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border/60">
                        {traderProducts.map((p) => {
                          const earnings = Math.floor(p.price * 0.9);
                          return (
                            <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-slate-900/10 transition-colors">
                              <td className="py-3 px-2">
                                <div className="w-10 h-10 rounded overflow-hidden border border-card-border relative bg-card-bg">
                                  <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                                </div>
                              </td>
                              <td className="py-3 px-2 font-bold max-w-[150px] truncate">{p.title}</td>
                              <td className="py-3 px-2 font-black text-foreground">Rs. {p.price.toLocaleString()}</td>
                              <td className="py-3 px-2 font-bold text-emerald-500">Rs. {earnings.toLocaleString()}</td>
                              <td className="py-3 px-2">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                  p.status === "Approved" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40" :
                                  p.status === "Rejected" ? "bg-red-100 text-red-600 dark:bg-red-950/40" :
                                  "bg-amber-100 text-amber-600 dark:bg-amber-950/40"
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-3 px-2 font-semibold text-slate-400 max-w-[160px] truncate" title={p.feedback || ""}>
                                {p.status === "Rejected" ? p.feedback : "—"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border border-dashed border-card-border rounded-2xl">
                    <Store className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-xs text-foreground/50 font-bold">You have not listed any items to sell yet.</p>
                  </div>
                )}

                {/* Add Listing Modal overlay */}
                {isListingModalOpen && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
                      {/* Close */}
                      <button 
                        onClick={() => setIsListingModalOpen(false)}
                        className="absolute right-4 top-4 w-8 h-8 rounded-full border border-card-border hover:bg-black/5 flex items-center justify-center text-foreground/50 hover:text-foreground cursor-pointer text-xs"
                      >
                        ✕
                      </button>

                      <div className="space-y-1">
                        <h3 className="text-lg font-black text-foreground">List a Product for Approval</h3>
                        <p className="text-xs text-foreground/60">Fill details. Admin will review and display on web catalogs.</p>
                      </div>

                      <form onSubmit={handleListProduct} className="space-y-4 font-semibold text-foreground/75">
                        <div className="space-y-1.5">
                          <label>Product Title *</label>
                          <input
                            type="text" required
                            placeholder="e.g. Xiaomi Pad 8 | 8GB RAM 256GB Storage"
                            value={prodTitle}
                            onChange={(e) => setProdTitle(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label>Selling Price (Rs.) *</label>
                            <input
                              type="number" required
                              placeholder="e.g. 59999"
                              value={prodPrice}
                              onChange={(e) => setProdPrice(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                            />
                            <div className="text-[10px] text-foreground/50 mt-1 font-bold">10% commission goes to website owner. Net earnings: Rs. {Math.floor((parseInt(prodPrice) || 0) * 0.9).toLocaleString()}</div>
                          </div>
                          
                          <div className="space-y-1.5 font-semibold text-foreground/75">
                            <label>Brand *</label>
                            <input
                              type="text" required
                              placeholder="e.g. Xiaomi, Apple, Asus"
                              value={prodBrand}
                              onChange={(e) => setProdBrand(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label>Category *</label>
                            <select
                              value={prodCategory}
                              onChange={(e) => setProdCategory(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none font-bold"
                            >
                              <option value="smartphone">Smart Phone</option>
                              <option value="laptop">Laptop</option>
                              <option value="tablet">Tablet</option>
                              <option value="apple">Apple Devices</option>
                              <option value="earbuds">Earbuds</option>
                              <option value="monitor">Monitor</option>
                              <option value="other">Other (Write Custom Category)</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label>Product Cover Image URL *</label>
                            <input
                              type="text"
                              required
                              placeholder="https://images.unsplash.com/..."
                              value={prodImage}
                              onChange={(e) => setProdImage(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                            />
                          </div>

                          {prodCategory === "other" && (
                            <div className="space-y-1.5 col-span-2">
                              <label>Custom Category Name *</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Smart Watch, Camera, Drone"
                                value={prodCustomCategory}
                                onChange={(e) => setProdCustomCategory(e.target.value)}
                                className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                              />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label>RAM Spec</label>
                            <input
                              type="text"
                              placeholder="e.g. 8GB or 16GB"
                              value={prodRam}
                              onChange={(e) => setProdRam(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label>Storage Spec</label>
                            <input
                              type="text"
                              placeholder="e.g. 128GB or 512GB"
                              value={prodStorage}
                              onChange={(e) => setProdStorage(e.target.value)}
                              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label>Full Product Description & Condition details *</label>
                          <textarea
                            rows={3} required
                            placeholder="Detail condition, hardware specs, box inclusion, warranty status..."
                            value={prodDesc}
                            onChange={(e) => setProdDesc(e.target.value)}
                            className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          Submit to Admin for Review
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </main>

        {/* Modal: Cancel Repair Request */}
        {cancellingJob && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
            <div className="w-full max-w-md bg-[#0e2525] border border-[#1c4545] rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative text-slate-200">
              <button 
                onClick={() => setCancellingJob(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                  Cancel Repair Request
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold uppercase">Device: {cancellingJob.brand} {cancellingJob.modelName}</p>
              </div>

              <form onSubmit={handleCancelRepairSubmit} className="space-y-4 font-semibold text-slate-400">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold">Please specify your cancellation reason *</label>
                  <textarea
                    rows={3} required
                    placeholder="e.g. Estimate cost is too high / Decided to purchase a new device / Repair timeline is too long..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancellingJob(null)}
                    className="flex-1 py-2.5 bg-slate-850 hover:bg-slate-800 rounded-xl text-white font-bold cursor-pointer text-center border border-slate-850"
                  >
                    Keep Request
                  </button>
                  <button
                    type="submit"
                    disabled={submittingCancellation}
                    className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold cursor-pointer text-center flex items-center justify-center disabled:opacity-50"
                  >
                    {submittingCancellation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cancel Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* PDF Inline Viewer Modal */}
        {previewPdfUrl && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl h-[85vh] bg-[#0e2525] border border-[#1c4545] rounded-3xl p-4 flex flex-col justify-between shadow-2xl relative">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#1c4545]/60 pb-3 mb-3">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-sm text-white truncate max-w-[280px] md:max-w-md">{previewPdfTitle}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Document Previewer</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a 
                    href={previewPdfUrl} 
                    download={`${previewPdfTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "study-material"}.pdf`}
                    className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer transition-colors shadow"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button 
                    onClick={() => {
                      setPreviewPdfUrl(null);
                      setPreviewPdfTitle("");
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Close Preview"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Document Iframe Area */}
              <div className="flex-1 rounded-2xl overflow-hidden border border-[#1c4545] bg-black/40">
                <iframe 
                  src={`${previewPdfUrl}#toolbar=1`}
                  className="w-full h-full border-none"
                  title={previewPdfTitle}
                />
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
