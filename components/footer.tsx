"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Company */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              MOBILE STORE
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mobile Store is Nepal's premium tech shopping destination. We supply genuine laptops, smartphones, PC components, and accessories with official warranties.
          </p>
          <div className="text-xs text-slate-400 space-y-1">
            <p>📍 New Road, Kathmandu, Nepal</p>
            <p>📞 +977-1-4444444 | +977-9800000000</p>
            <p>✉️ support@mobilestore.com</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
          <ul className="text-xs space-y-2.5">
            <li>
              <Link href="/category/laptop" className="hover:text-primary transition-colors">Laptops</Link>
            </li>
            <li>
              <Link href="/category/apple" className="hover:text-primary transition-colors">Apple Store</Link>
            </li>
            <li>
              <Link href="/category/smartphone" className="hover:text-primary transition-colors">Smart Phones</Link>
            </li>
            <li>
              <Link href="/category/pc-components" className="hover:text-primary transition-colors">PC Parts & Components</Link>
            </li>
          </ul>
        </div>

        {/* Support & Policies */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Policies & Support</h4>
          <ul className="text-xs space-y-2.5">
            <li>
              <Link href="/#warranty" className="hover:text-primary transition-colors">Warranty Policy</Link>
            </li>
            <li>
              <Link href="/#emi-info" className="hover:text-primary transition-colors">EMI Information</Link>
            </li>
            <li>
              <Link href="/#terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link href="/#privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* Store Hours & News */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Store Hours</h4>
          <div className="text-xs text-slate-400 space-y-1.5">
            <p>🗓️ Sunday - Friday: 10:00 AM - 7:30 PM</p>
            <p>🗓️ Saturday: 11:00 AM - 5:00 PM</p>
          </div>
          <div className="pt-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Subscribe to Offers</h5>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-slate-800 border border-slate-700 text-slate-100 text-xs px-3 py-2 rounded-lg outline-none focus:border-primary flex-1"
              />
              <button className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2 rounded-lg transition-all">
                Join
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-950 border-t border-slate-800/60 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} Mobile Store. All rights reserved.</span>
          <span className="mt-1 sm:mt-0 flex gap-4">
            <span>Designed by Quarkinfotech</span>
            <span>Enhanced with Antigravity AI</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
