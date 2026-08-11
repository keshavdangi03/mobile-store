"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "./theme-provider";
import { useCart } from "./cart-context";
import { getProducts, Product } from "@/lib/db-simulation";
import MegaMenu from "./mega-menu";
import { 
  Search, 
  X, 
  MapPin, 
  Sparkles, 
  Moon, 
  Sun, 
  ShoppingCart, 
  User, 
  Grid, 
  ChevronDown, 
  Flame, 
  CreditCard 
} from "lucide-react";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount, setIsCartOpen } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [customer, setCustomer] = useState<{ name: string; email: string } | null>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const loadCustomerSession = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("customer_session");
      if (saved) {
        setCustomer(JSON.parse(saved));
      } else {
        setCustomer(null);
      }
    }
  };

  useEffect(() => {
    loadCustomerSession();

    // Listen to localstorage updates to refresh login state across routing
    window.addEventListener("storage", loadCustomerSession);
    return () => window.removeEventListener("storage", loadCustomerSession);
  }, []);

  // Search logic
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const allProducts = getProducts();
      const filtered = allProducts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  }, [searchQuery]);

  // Click outside search & profile dismisses dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchResults(false);
    }
  };

  const navCategories = [
    { label: "Laptop", value: "laptop" },
    { label: "Apple", value: "apple" },
    { label: "Smart Phone", value: "smartphone" },
    { label: "Tablet", value: "tablet" },
    { label: "PC Components", value: "pc-components" },
    { label: "Monitor", value: "monitor" },
    { label: "Projector", value: "projector" },
    { label: "Earbuds", value: "earbuds" },
  ];

  return (
    <header className="w-full flex flex-col z-40 bg-card-bg border-b border-card-border sticky top-0">
      {/* 1. Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-primary to-primary-hover text-white text-[11px] font-medium py-2 px-6 flex items-center justify-between">
        <span className="mx-auto flex items-center gap-1.5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" /> Shrawan Sale is LIVE! Massive Discounts on Premium Gear
        </span>
        <div className="hidden md:flex items-center gap-1 hover:underline text-[11px] cursor-pointer" onClick={() => router.push("/#locations")}>
          <MapPin className="w-3 h-3" /> <span>Find our store</span>
        </div>
      </div>

      {/* 2. Main Middle Header */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:rotate-12 transition-all duration-300">
            M
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent uppercase">
            Mobile Store
          </span>
        </Link>

        {/* Live Search Bar */}
        <div className="flex-1 max-w-lg relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder='Search for "Alienware series", "iPad 8", "Sony"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              className="w-full px-4 py-2.5 pl-10 border border-card-border bg-slate-50 dark:bg-slate-900 rounded-full text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/45">
              <Search className="w-4 h-4" />
            </span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/45 hover:text-foreground transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Search Result Popup Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-200">
              <div className="text-[10px] uppercase font-bold text-foreground/40 px-3 py-1">Matching Products</div>
              {searchResults.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  onClick={() => setShowSearchResults(false)}
                  className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-card-border relative flex-shrink-0 bg-slate-50">
                    <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold truncate text-foreground">{p.title}</div>
                    <div className="text-xs text-foreground/60">{p.brand} &middot; {p.category}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-primary">Rs. {p.price.toLocaleString()}</div>
                    {p.discount > 0 && (
                      <div className="text-[10px] text-secondary font-medium">{p.discount}% OFF</div>
                    )}
                  </div>
                </Link>
              ))}
              <div className="border-t border-card-border mt-1 pt-2 pb-1 text-center">
                <button
                  onClick={() => {
                    router.push(`/category/all?search=${encodeURIComponent(searchQuery)}`);
                    setShowSearchResults(false);
                  }}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all results &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Live Chat Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-card-border rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-xs font-semibold text-foreground/80">24/7 Live Chat</span>
          </div>

          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-card-border text-foreground transition-all flex items-center justify-center"
            title="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Cart Icon with badge */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-card-border relative transition-all flex items-center justify-center text-foreground"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-card-bg shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Customer Profile / Sign In Portal */}
          {customer ? (
            <div 
              ref={profileRef}
              className="relative flex items-center gap-1.5 px-3.5 py-2 border border-card-border rounded-full bg-slate-50/50 dark:bg-slate-900/40 text-xs font-bold text-foreground cursor-pointer select-none"
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
            >
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="truncate max-w-[80px]">Hi, {customer.name.split(" ")[0]}</span>
              <ChevronDown className={`w-3 h-3 text-foreground/50 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
              
              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-card-bg border border-card-border rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in duration-200 text-foreground">
                  <Link
                    href="/account"
                    className="block px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all font-semibold text-xs mb-0.5"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    👤 My Account
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent re-toggling on container click
                      localStorage.removeItem("customer_session");
                      setCustomer(null);
                      setIsProfileDropdownOpen(false);
                      router.push("/");
                      window.dispatchEvent(new Event("storage"));
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-500 rounded-xl transition-all font-extrabold text-xs cursor-pointer block border-none outline-none"
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 border border-card-border rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold transition-all text-foreground"
            >
              <User className="w-3.5 h-3.5" /> Sign In
            </Link>
          )}
        </div>
      </div>

      {/* 3. Category & Navigation Menu */}
      <div className="w-full bg-slate-50 dark:bg-slate-950 border-t border-card-border py-1">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between gap-4 text-sm font-semibold">
          {/* Main Category Links */}
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
            {/* Mega Dropdown Hover Activation */}
            <div 
              className="relative py-1 cursor-pointer text-primary hover:text-primary-hover flex items-center gap-1.5 flex-shrink-0"
              onMouseEnter={() => setHoveredCategory("laptop")} // Default mega menu anchor
              onClick={() => {
                router.push("/category/all");
                setHoveredCategory(null);
              }}
            >
              <Grid className="w-4 h-4" /> All Categories <ChevronDown className="w-3.5 h-3.5" />
            </div>

            {navCategories.map((cat) => (
              <div
                key={cat.value}
                className={`py-1 cursor-pointer transition-colors relative flex-shrink-0 ${
                  pathname.includes(`/category/${cat.value}`)
                    ? "text-primary border-b-2 border-primary"
                    : "text-foreground/80 hover:text-primary"
                }`}
                onMouseEnter={() => setHoveredCategory(cat.value)}
                onClick={() => {
                  router.push(`/category/${cat.value}`);
                  setHoveredCategory(null);
                }}
              >
                {cat.label}
              </div>
            ))}
          </div>

          {/* Clearance & EMI Quick Links */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/category/all?clearance=true"
              className="px-3 py-1 bg-orange-100 hover:bg-orange-200 dark:bg-orange-950/40 dark:hover:bg-orange-950/80 text-secondary text-[11px] font-bold rounded-lg border border-orange-200/50 dark:border-orange-900/30 flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5" /> Stock Clearance
            </Link>
            <Link
              href="/category/all?emi=true"
              className="px-3 py-1 bg-purple-100 hover:bg-purple-200 dark:bg-purple-950/40 dark:hover:bg-purple-950/80 text-primary dark:text-purple-300 text-[11px] font-bold rounded-lg border border-purple-200/50 dark:border-purple-900/30 flex items-center gap-1"
            >
              <CreditCard className="w-3.5 h-3.5" /> EMI Products
            </Link>
          </div>
        </div>
      </div>

      {/* Render Hover MegaMenu */}
      {hoveredCategory && (
        <MegaMenu
          initialCategory={hoveredCategory}
          onClose={() => setHoveredCategory(null)}
        />
      )}
    </header>
  );
}
