"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  Home, 
  LogOut 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth") === "true";
    setIsAuthenticated(authStatus);
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Invalid username or password (hint: admin / admin)");
    }
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <span className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></span>
      </div>
    );
  }

  // 1. Authentication Wall Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-slate-100 p-6 font-sans">
        <div className="w-full max-w-sm bg-[#14141b] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl relative">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md">
              M
            </div>
            <h2 className="text-xl font-black tracking-tight">Mobile Store Admin</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Username</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Password</label>
              <input
                type="password"
                placeholder="•••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-200"
              />
            </div>

            {error && <p className="text-[10px] text-red-400 font-bold text-center">{error}</p>}

            <button
              type="submit"
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md"
            >
              Sign In to Dashboard
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-[10px] text-slate-500 hover:text-slate-300 font-bold">
              &larr; Back to Shop Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin layout shell
  return (
    <div className="min-h-screen flex bg-[#0b0b0f] text-slate-100 font-sans">
      {/* Sidebar Panel */}
      <aside className="w-64 bg-[#0f0f14] border-r border-slate-800 flex flex-col justify-between flex-shrink-0">
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-base">
              M
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-wide block">STORE ADMIN</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">Console v1.0</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                pathname === "/admin"
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
            </Link>
            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                pathname.startsWith("/admin/products")
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <Package className="w-4 h-4" /> Manage Products
            </Link>
            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
                pathname.startsWith("/admin/orders")
                  ? "bg-primary text-white"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Manage Orders
            </Link>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800/60 space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-200"
          >
            <Home className="w-3.5 h-3.5" /> Back to Shop Front
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full py-2 bg-red-950/20 border border-red-900/35 hover:bg-red-950/55 text-red-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-8 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
