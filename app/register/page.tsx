"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isTrader, setIsTrader] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    setTimeout(() => {
      // Simulate registering
      
      const newUser = {
        name,
        email,
        phone,
        password,
        isTrader
      };

      if (typeof window !== "undefined") {
        const existingUsersRaw = localStorage.getItem("zolpa_users");
        const existingUsers = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
        
        // Check if user already exists
        const userExists = existingUsers.some((u: any) => u.email === email || u.phone === phone);
        if (userExists) {
          setLoading(false);
          setError("An account with this email or phone number already exists.");
          return;
        }

        existingUsers.push(newUser);
        localStorage.setItem("zolpa_users", JSON.stringify(existingUsers));
      }

      setLoading(false);
      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-md bg-card-bg border border-card-border rounded-3xl p-8 space-y-6 shadow-2xl relative">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-full flex items-center justify-center text-white font-extrabold text-xl mx-auto shadow-md">
            M
          </div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">Create an Account</h2>
          <p className="text-xs text-foreground/60">Register with email or phone to get started</p>
        </div>

        {/* Signup form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Keshav Dangi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Phone Number *</label>
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Password (Min. 6 chars) *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Confirm Password *</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          {error && <p className="text-[10px] text-red-500 font-bold text-center">{error}</p>}
          {success && <p className="text-[10px] text-emerald-500 font-bold text-center">{success}</p>}

          <div className={`p-3.5 rounded-xl border transition-all duration-200 ${
            isTrader 
              ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200" 
              : "bg-black/5 dark:bg-white/5 border-card-border hover:border-foreground/20"
          }`}>
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="isTrader"
                checked={isTrader}
                onChange={(e) => setIsTrader(e.target.checked)}
                className="rounded border-card-border text-amber-500 focus:ring-amber-500 w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
              />
              <div className="space-y-1">
                <label htmlFor="isTrader" className="text-[11px] text-foreground font-extrabold cursor-pointer leading-tight flex items-center gap-1.5">
                  Register as Trader Account 
                  <span className="text-[8px] uppercase font-black bg-amber-500 text-black px-1.5 py-0.5 rounded tracking-wide">Sellers Only</span>
                </label>
                <p className="text-[10px] text-foreground/70 leading-normal font-medium">
                  Choose this if you want to upload, display, and sell your own products on this website.
                </p>
              </div>
            </div>
            {isTrader && (
              <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-[10px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>⚠️ Note: Standard customers do not need a Trader Account to buy products.</span>
              </div>
            )}
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-card-border text-primary focus:ring-primary w-4 h-4 mt-0.5"
            />
            <label htmlFor="terms" className="text-[10px] text-foreground/80 cursor-pointer leading-tight">
              By checking this, I agree to the Mobile Store{" "}
              <Link href="#" className="text-primary font-bold hover:underline">Terms & Conditions</Link> and{" "}
              <Link href="#" className="text-primary font-bold hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center pt-2.5 border-t border-card-border">
          <p className="text-xs text-foreground/70">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
