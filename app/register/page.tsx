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
      setLoading(false);
      setSuccess("Account created successfully! Redirecting to login...");
      
      // Save details to mock store
      const mockRegisteredUser = {
        name,
        email,
        phone,
        password
      };
      localStorage.setItem("mock_registered_user", JSON.stringify(mockRegisteredUser));

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
