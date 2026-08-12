"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";
import { Order } from "@/lib/db-simulation";
import { saveDbOrder } from "@/app/actions";

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  // Authentication check & pre-fill fields
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [shipping, setShipping] = useState("free"); // "free" or "express"
  const [paymentMethod, setPaymentMethod] = useState("cod"); // "cod", "bank", "emi"

  // EMI credit card simulation details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [emiBank, setEmiBank] = useState("Nabil Bank");

  // Error validations
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSession = localStorage.getItem("customer_session");
      if (!savedSession) {
        // Redirect to login page and preserve redirect path
        router.push("/login?redirect=/checkout");
      } else {
        const user = JSON.parse(savedSession);
        setName(user.name || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setCheckingAuth(false);
      }
    }
  }, [router]);

  const getShippingCost = () => {
    return shipping === "express" ? 150 : 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Full name is required";
    if (!phone.trim() || phone.length < 9) newErrors.phone = "Provide a valid contact number";
    if (!address.trim()) newErrors.address = "Delivery address is required";
    
    if (paymentMethod === "emi") {
      if (!cardNumber.trim() || cardNumber.length < 15) newErrors.card = "Provide a valid credit card number";
      if (!cardExpiry.trim()) newErrors.expiry = "Expiry is required";
      if (!cardCvv.trim() || cardCvv.length < 3) newErrors.cvv = "CVV required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // scroll to top of form
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const orderId = "MBS-" + Math.floor(100000 + Math.random() * 900000);
      
      const newOrder: Order = {
        id: orderId,
        customerName: name,
        customerPhone: phone,
        customerEmail: email || "guest@mobilestore.com",
        address,
        city,
        items: cart.map((item) => {
          let price = item.product.price;
          if (item.variant && item.product.variants) {
            const vIdx = item.product.variants.options.indexOf(item.variant);
            if (vIdx > -1) price += item.product.variants.priceModifiers[vIdx];
          }
          if (item.addon && item.product.addons) {
            const aIdx = item.product.addons.options.indexOf(item.addon);
            if (aIdx > -1) price += item.product.addons.priceModifiers[aIdx];
          }

          return {
            productId: item.product.id,
            productTitle: item.product.title,
            price,
            quantity: item.quantity,
            variant: item.variant,
            addon: item.addon,
            image: item.product.image,
          };
        }),
        totalPrice: cartTotal + getShippingCost(),
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "bank" ? "Bank Transfer" : `0% EMI (${emiBank})`,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      saveDbOrder(newOrder).then(() => {
        clearCart();
        setLoading(false);
        router.push(`/checkout/success?orderId=${orderId}`);
      });
    }, 1500); // simulate network latency
  };

  if (checkingAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <span className="text-5xl block">🛒</span>
        <h2 className="text-xl font-bold text-foreground">Your checkout cart is empty</h2>
        <p className="text-xs text-foreground/60 max-w-sm mx-auto">
          Please add products to your shopping bag before visiting the checkout page.
        </p>
        <Link href="/" className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-full inline-block">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight border-b border-card-border pb-4 mb-8">
        Secure Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Checkout form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 space-y-6">
          
          {/* Shipping Address form */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-2">
              1. Delivery Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/75">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  className={`w-full text-xs px-3.5 py-2.5 bg-card-bg border ${
                    errors.name ? "border-red-500" : "border-card-border"
                  } rounded-xl outline-none`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/75">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="9801234567"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  className={`w-full text-xs px-3.5 py-2.5 bg-card-bg border ${
                    errors.phone ? "border-red-500" : "border-card-border"
                  } rounded-xl outline-none`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/75">Email Address (Optional)</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-card-bg border border-card-border rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground/75">City / District *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-card-bg border border-card-border rounded-xl outline-none text-foreground font-bold"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Chitwan">Chitwan</option>
                  <option value="Biratnagar">Biratnagar</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground/75">Street Address *</label>
              <textarea
                rows={2}
                placeholder="House No, Ward, Near landmark..."
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: "" });
                }}
                className={`w-full text-xs px-3.5 py-2.5 bg-card-bg border ${
                  errors.address ? "border-red-500" : "border-card-border"
                } rounded-xl outline-none resize-none`}
              />
              {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
            </div>
          </div>

          {/* Shipping Methods selection */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-2">
              2. Shipping Method
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 border border-card-border rounded-xl cursor-pointer bg-card-bg/50 /50 hover:bg-card-bg dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === "free"}
                    onChange={() => setShipping("free")}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">Standard Store Delivery</div>
                    <div className="text-[10px] text-foreground/50">Delivered within 2-4 business days across Nepal</div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600">FREE</span>
              </label>

              <label className="flex items-center justify-between p-4 border border-card-border rounded-xl cursor-pointer bg-card-bg/50 /50 hover:bg-card-bg dark:hover:bg-slate-900">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    checked={shipping === "express"}
                    onChange={() => setShipping("express")}
                    className="w-4 h-4 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="text-xs font-bold text-foreground">Express Next-Day Delivery</div>
                    <div className="text-[10px] text-foreground/50">Next business day delivery inside Kathmandu valley</div>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-foreground">Rs. 150</span>
              </label>
            </div>
          </div>

          {/* Payment Methods selection */}
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-2">
              3. Payment Option
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "cod", name: "Cash on Delivery", desc: "Pay at door" },
                { id: "bank", name: "Bank Transfer", desc: "Direct Bank" },
                { id: "emi", name: "0% Installment EMI", desc: "Credit Card" },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPaymentMethod(p.id)}
                  className={`p-3 border rounded-xl flex flex-col items-center text-center justify-center gap-1.5 transition-all ${
                    paymentMethod === p.id
                      ? "border-primary bg-purple-50/45 dark:bg-purple-950/20 text-primary"
                      : "border-card-border bg-card-bg hover:bg-black/5 text-foreground"
                  }`}
                >
                  <span className="text-xs font-extrabold">{p.name}</span>
                  <span className="text-[9px] text-foreground/50">{p.desc}</span>
                </button>
              ))}
            </div>

            {/* Credit Card EMI simulator form */}
            {paymentMethod === "emi" && (
              <div className="p-4 bg-purple-50/20 dark:bg-purple-950/5 border border-primary/20 rounded-2xl space-y-3 mt-4 animate-in fade-in duration-200">
                <div className="text-xs font-extrabold text-primary border-b border-primary/10 pb-1.5">
                  Simulate Bank Credit Card Submission
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Select Financing Bank</label>
                  <select
                    value={emiBank}
                    onChange={(e) => setEmiBank(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-card-bg border border-card-border rounded-xl"
                  >
                    <option value="Nabil Bank">Nabil Bank (0% Interest)</option>
                    <option value="NIMB Bank">NIMB Bank (0% Interest)</option>
                    <option value="Global IME Bank">Global IME Bank (0% Interest)</option>
                    <option value="Sanima Bank">Sanima Bank (0% Interest)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-foreground/60 uppercase">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      setCardNumber(e.target.value);
                      if (errors.card) setErrors({ ...errors, card: "" });
                    }}
                    className={`w-full text-xs px-3 py-2 bg-card-bg border ${
                      errors.card ? "border-red-500" : "border-card-border"
                    } rounded-xl`}
                  />
                  {errors.card && <p className="text-[9px] text-red-500 font-bold">{errors.card}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => {
                        setCardExpiry(e.target.value);
                        if (errors.expiry) setErrors({ ...errors, expiry: "" });
                      }}
                      className={`w-full text-xs px-3 py-2 bg-card-bg border ${
                        errors.expiry ? "border-red-500" : "border-card-border"
                      } rounded-xl`}
                    />
                    {errors.expiry && <p className="text-[9px] text-red-500 font-bold">{errors.expiry}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-foreground/60 uppercase">CVV</label>
                    <input
                      type="password"
                      placeholder="***"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => {
                        setCardCvv(e.target.value);
                        if (errors.cvv) setErrors({ ...errors, cvv: "" });
                      }}
                      className={`w-full text-xs px-3 py-2 bg-card-bg border ${
                        errors.cvv ? "border-red-500" : "border-card-border"
                      } rounded-xl`}
                    />
                    {errors.cvv && <p className="text-[9px] text-red-500 font-bold">{errors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>

        </form>

        {/* Right Side: Order Summary */}
        <aside className="lg:col-span-5">
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6 shadow-sm sticky top-28">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider border-b border-card-border pb-3">
              Order Summary
            </h3>

            {/* Cart products item list */}
            <div className="max-h-60 overflow-y-auto space-y-4 pr-1">
              {cart.map((item, idx) => {
                let price = item.product.price;
                if (item.variant && item.product.variants) {
                  const vIdx = item.product.variants.options.indexOf(item.variant);
                  if (vIdx > -1) price += item.product.variants.priceModifiers[vIdx];
                }
                if (item.addon && item.product.addons) {
                  const aIdx = item.product.addons.options.indexOf(item.addon);
                  if (aIdx > -1) price += item.product.addons.priceModifiers[aIdx];
                }

                return (
                  <div key={idx} className="flex gap-3 items-center justify-between">
                    <div className="flex gap-2.5 items-center min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-card-border relative flex-shrink-0 bg-card-bg">
                        <img src={item.product.image} alt={item.product.title} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-foreground truncate max-w-[180px]">
                          {item.product.title}
                        </div>
                        <div className="text-[9px] text-foreground/50">
                          Qty: {item.quantity} {item.variant ? `(${item.variant})` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-foreground flex-shrink-0">
                      Rs. {(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Price list */}
            <div className="border-t border-card-border pt-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">Rs. {cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-foreground/60">
                <span>Shipping</span>
                <span className="font-bold text-foreground">
                  {getShippingCost() === 0 ? "FREE" : `Rs. ${getShippingCost()}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-card-border pt-3 text-base">
                <span className="font-bold text-foreground">Total Bill</span>
                <span className="font-black text-primary">
                  Rs. {(cartTotal + getShippingCost()).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full inline-block"></span>
                  Placing Order Securely...
                </>
              ) : (
                `Confirm & Place Order (Rs. ${(cartTotal + getShippingCost()).toLocaleString()})`
              )}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
