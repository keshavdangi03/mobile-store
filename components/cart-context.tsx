"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/lib/db-simulation";

export interface CartItem {
  product: Product;
  quantity: number;
  variant?: string;
  addon?: string;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (product: Product, quantity: number, variant?: string, addon?: string) => void;
  removeFromCart: (productId: string, variant?: string, addon?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string, addon?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("zolpa_cart");
    const savedWish = localStorage.getItem("zolpa_wishlist");
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWish) setWishlist(JSON.parse(savedWish));
    setMounted(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("zolpa_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("zolpa_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const addToCart = (product: Product, quantity: number, variant?: string, addon?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variant === variant &&
          item.addon === addon
      );

      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += quantity;
        return nextCart;
      }

      return [...prev, { product, quantity, variant, addon }];
    });
    setIsCartOpen(true); // Automatically open cart drawer for better feedback
  };

  const removeFromCart = (productId: string, variant?: string, addon?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.product.id === productId && item.variant === variant && item.addon === addon)
      )
    );
  };

  const updateQuantity = (productId: string, quantity: number, variant?: string, addon?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant, addon);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.variant === variant && item.addon === addon
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Calculate totals
  const cartTotal = cart.reduce((total, item) => {
    // Find modification price based on index
    let itemPrice = item.product.price;
    
    if (item.variant && item.product.variants) {
      const varIndex = item.product.variants.options.indexOf(item.variant);
      if (varIndex > -1) {
        itemPrice += item.product.variants.priceModifiers[varIndex];
      }
    }
    
    if (item.addon && item.product.addons) {
      const addIndex = item.product.addons.options.indexOf(item.addon);
      if (addIndex > -1) {
        itemPrice += item.product.addons.priceModifiers[addIndex];
      }
    }

    return total + itemPrice * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isCartOpen,
        setIsCartOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
