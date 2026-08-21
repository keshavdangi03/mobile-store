"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createRepairRequest } from "@/app/actions";
import { 
  Smartphone, 
  Wrench, 
  ShieldAlert, 
  Send, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Wallet, 
  Loader2, 
  FileText,
  Clock
} from "lucide-react";

export default function RepairPage() {
  const router = useRouter();
  
  // Form states
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [problemType, setProblemType] = useState("Screen Damage");
  const [customProblem, setCustomProblem] = useState("");
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  
  // User session details
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("customer_session");
    if (!session) {
      // Redirect to login
      router.push("/login?redirect=/repair");
      return;
    }
    const user = JSON.parse(session);
    setFullName(user.name || "");
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setLoadingSession(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand.trim() || !modelName.trim() || !description.trim()) {
      alert("Please fill in all mobile details.");
      return;
    }

    setSubmitting(true);

    const finalProblem = problemType === "Other" ? `Other: ${customProblem}` : problemType;

    const requestData = {
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      brand,
      modelName,
      problemType: finalProblem,
      description,
      paymentMethod
    };

    createRepairRequest(requestData).then((success) => {
      setSubmitting(false);
      if (success) {
        alert("Mobile repairing request submitted successfully! Tracking will be available in your account dashboard.");
        localStorage.setItem("active_account_tab", "repairs");
        router.push("/account");
      } else {
        alert("Submission failed. Please try again.");
      }
    });
  };

  const predefinedProblems = [
    "Screen Damage / Cracked Display",
    "Battery Drain / Replacement",
    "Water / Liquid Damage",
    "Charging Port / Connection Issue",
    "Camera Malfunction / Lens Crack",
    "Software Brick / Logo Bootloop",
    "Speaker / Mic Distortion",
    "Other"
  ];

  if (loadingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Left Columns: Interactive Info Step Tracker */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <span className="px-3.5 py-1.5 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-black rounded-full uppercase tracking-wider">
            Repair Services
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
            <BlockEditorWrapper blockId="repair-heading" defaultText="Fix Your Device in 5 Easy Steps" />
          </h1>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Professional multi-brand repair service with certified OEM parts. Track every milestone live from your customer profile page.
          </p>
        </div>

        {/* Milestone Steps Timeline */}
        <div className="relative border-l-2 border-dashed border-card-border pl-6 ml-3 space-y-8 text-xs font-semibold text-foreground/80">
          {/* Step 1 */}
          <div className="relative">
            <span className="absolute -left-9 top-0.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-sm">
              1
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">Submit Request</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-normal">
                Fill the details of your damaged mobile and write diagnostic notes below.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <span className="absolute -left-9 top-0.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-sm">
              2
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">Admin Diagnostics Estimate</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-normal">
                Admin reviews your request. If fixable, it gets approved with an estimated repair price invoice.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <span className="absolute -left-9 top-0.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-sm">
              3
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">Send/Drop-off Phone</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-normal">
                Ship your phone to our New Road repair lab or drop it off at our counter.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <span className="absolute -left-9 top-0.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-sm">
              4
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">Repaired & Tested</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-normal">
                Technicians repair your phone, run QC hardware tests, and prepare it for return.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="relative">
            <span className="absolute -left-9 top-0.5 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px] shadow-sm">
              5
            </span>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-foreground">Return & Pay</h4>
              <p className="text-[11px] text-foreground/60 leading-relaxed font-normal">
                We return the phone to your door. Pay securely using Cash on Return, Card, or eSewa.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Submission Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 p-6 md:p-8 bg-card-bg border border-card-border rounded-3xl space-y-6 shadow-xl">
        <h3 className="text-base font-extrabold text-foreground border-b border-card-border pb-3">Device Repair Request</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5 text-xs font-semibold text-foreground/75">
            <label>Mobile Brand *</label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung, Apple, Xiaomi"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
            />
          </div>

          <div className="space-y-1.5 text-xs font-semibold text-foreground/75">
            <label>Model Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Galaxy S24 Ultra, iPhone 15 Pro"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="space-y-1.5 text-xs font-semibold text-foreground/75">
          <label>Problem Category *</label>
          <select
            value={problemType}
            onChange={(e) => setProblemType(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none font-bold"
          >
            {predefinedProblems.map((prob) => (
              <option key={prob} value={prob}>{prob}</option>
            ))}
          </select>
        </div>

        {problemType === "Other" && (
          <div className="space-y-1.5 text-xs font-semibold text-foreground/75 animate-in slide-in-from-top duration-200">
            <label>Specify Custom Problem *</label>
            <input
              type="text"
              required
              placeholder="Describe the issue briefly (e.g. Front Camera blur)"
              value={customProblem}
              onChange={(e) => setCustomProblem(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
            />
          </div>
        )}

        <div className="space-y-1.5 text-xs font-semibold text-foreground/75">
          <label>Describe the Problem & Hardware Damage *</label>
          <textarea
            rows={4}
            required
            placeholder="Please detail how the issue occurred (e.g., dropped in water, screen flickering, charger only works at angle...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none resize-none"
          />
        </div>

        {/* Payment preference selection */}
        <div className="space-y-2 text-xs font-semibold text-foreground/75">
          <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Preferred Payment Method (Pay on Return)</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("Cash on Delivery")}
              className={`py-2.5 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                paymentMethod === "Cash on Delivery"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
              }`}
            >
              <Truck className="w-4 h-4" /> Cash / COD
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Credit/Debit Card")}
              className={`py-2.5 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                paymentMethod === "Credit/Debit Card"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Card Payment
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("Mobile Wallet")}
              className={`py-2.5 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                paymentMethod === "Mobile Wallet"
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
              }`}
            >
              <Wallet className="w-4 h-4" /> Mobile Wallet
            </button>
          </div>
        </div>

        {/* Pre-fill display */}
        <div className="p-4 bg-black/5 border border-card-border rounded-2xl flex items-center justify-between text-[11px] text-foreground/60">
          <div>
            <span className="font-bold">Requester Profile: </span>
            {fullName} ({phone})
          </div>
          <div>
            <span className="font-bold">Email: </span>
            {email}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-500 hover:brightness-105 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
        >
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-3.5 h-3.5" /> Submit Repair Request
            </>
          )}
        </button>
      </form>

    </div>
  );
}
