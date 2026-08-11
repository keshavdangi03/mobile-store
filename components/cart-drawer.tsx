"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./cart-context";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

  // Click outside to close drawer
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        isCartOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsCartOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={drawerRef}
        className="w-full max-w-md h-full bg-card-bg border-l border-card-border flex flex-col shadow-2xl relative animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-card-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            🛒 Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground/60 hover:text-foreground text-sm font-semibold transition-colors"
          >
            ✕ Close
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <span className="text-5xl">🛒</span>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-foreground">Your cart is empty</h3>
                <p className="text-xs text-foreground/60 max-w-[240px]">
                  Add items to your cart to see them here and proceed to checkout.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-full transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item, idx) => {
              // Calculate adjusted item price
              let adjustedPrice = item.product.price;
              
              if (item.variant && item.product.variants) {
                const varIdx = item.product.variants.options.indexOf(item.variant);
                if (varIdx > -1) {
                  adjustedPrice += item.product.variants.priceModifiers[varIdx];
                }
              }
              
              if (item.addon && item.product.addons) {
                const addIdx = item.product.addons.options.indexOf(item.addon);
                if (addIdx > -1) {
                  adjustedPrice += item.product.addons.priceModifiers[addIdx];
                }
              }

              return (
                <div
                  key={`${item.product.id}-${item.variant || ""}-${item.addon || ""}-${idx}`}
                  className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-900 border border-card-border rounded-xl hover:shadow-sm transition-all"
                >
                  {/* Thumb */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-card-border relative bg-white flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground truncate hover:text-primary transition-colors">
                        <Link href={`/product/${item.product.id}`} onClick={() => setIsCartOpen(false)}>
                          {item.product.title}
                        </Link>
                      </h4>
                      
                      {/* Configuration options */}
                      {(item.variant || item.addon) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.variant && (
                            <span className="text-[9px] font-semibold bg-purple-100 text-primary dark:bg-purple-950/40 dark:text-purple-300 px-1.5 py-0.5 rounded">
                              {item.variant}
                            </span>
                          )}
                          {item.addon && (
                            <span className="text-[9px] font-semibold bg-orange-100 text-secondary dark:bg-orange-950/40 dark:text-orange-300 px-1.5 py-0.5 rounded">
                              {item.addon}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Quantity controls & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-card-border rounded-lg bg-card-bg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant, item.addon)}
                          className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-foreground/75"
                        >
                          -
                        </button>
                        <span className="px-2.5 text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant, item.addon)}
                          className="px-2 py-0.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-foreground/75"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-foreground">
                          Rs. {(adjustedPrice * item.quantity).toLocaleString()}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant, item.addon)}
                          className="text-[10px] text-red-500 hover:underline mt-0.5 block ml-auto"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Billing summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-card-border bg-slate-50 dark:bg-slate-950 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/60 font-semibold">Total items:</span>
              <span className="text-xs font-bold text-foreground">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-base">
              <span className="font-bold text-foreground">Subtotal:</span>
              <span className="font-extrabold text-primary">
                Rs. {cartTotal.toLocaleString()}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all duration-300"
            >
              🔒 Proceed to Checkout
            </Link>

            <p className="text-[10px] text-center text-foreground/40 font-medium">
              Tax included. Shipping calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
