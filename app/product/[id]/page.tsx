"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/db-simulation";
import { useCart } from "@/components/cart-context";
import { getDbProductById } from "@/app/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addToCart, wishlist, toggleWishlist } = useCart();
  
  const id = resolvedParams.id;
  const [product, setProduct] = useState<Product | null>(null);

  // Selector states
  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedAddon, setSelectedAddon] = useState("");
  const [quantity, setQuantity] = useState(1);

  // EMI Calculator widget states
  const [downPaymentPercent, setDownPaymentPercent] = useState(40); // default 40%
  const [emiTenure, setEmiTenure] = useState(12); // default 12 months

  useEffect(() => {
    getDbProductById(id).then((item) => {
      if (item) {
        setProduct(item);
        // Select first options by default
        if (item.variants) {
          setSelectedVariant(item.variants.options[0]);
        }
        if (item.addons) {
          setSelectedAddon(item.addons.options[0]);
        }
      }
    });
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
        <span className="text-5xl block">⚠️</span>
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <p className="text-xs text-foreground/60 max-w-sm mx-auto">
          The requested item ID does not exist in our catalog database.
        </p>
        <Link href="/" className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-full inline-block">
          Go back home
        </Link>
      </div>
    );
  }

  // Calculate adjusted unit price
  let unitPrice = product.price;
  let variantPriceDiff = 0;
  let addonPriceDiff = 0;

  if (selectedVariant && product.variants) {
    const varIdx = product.variants.options.indexOf(selectedVariant);
    if (varIdx > -1) {
      variantPriceDiff = product.variants.priceModifiers[varIdx];
      unitPrice += variantPriceDiff;
    }
  }

  if (selectedAddon && product.addons) {
    const addIdx = product.addons.options.indexOf(selectedAddon);
    if (addIdx > -1) {
      addonPriceDiff = product.addons.priceModifiers[addIdx];
      unitPrice += addonPriceDiff;
    }
  }

  // EMI computations
  const totalPurchasePrice = unitPrice * quantity;
  const downPaymentAmount = Math.round(totalPurchasePrice * (downPaymentPercent / 100));
  const emiPrincipal = totalPurchasePrice - downPaymentAmount;
  const monthlyInstallment = emiTenure > 0 ? Math.round(emiPrincipal / emiTenure) : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant || undefined, selectedAddon || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant || undefined, selectedAddon || undefined);
    router.push("/checkout");
  };

  const isFavorited = wishlist.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-foreground/50 font-semibold flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>&gt;</span>
        <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors capitalize">
          {product.category}
        </Link>
        <span>&gt;</span>
        <span className="text-foreground/80 truncate max-w-[280px]">{product.title}</span>
      </nav>

      {/* Main Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Dynamic Gallery Showcase */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full aspect-square rounded-3xl overflow-hidden border border-card-border bg-card-bg shadow-md relative group">
            <img
              src={product.image}
              alt={product.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            {product.discount > 0 && (
              <span className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full">
                {product.discount}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Product Details & Variant Selectors */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-primary bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
                {product.brand}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-full border border-card-border hover:bg-card-bg hover:bg-white/10 transition-colors text-base`}
                title="Add to Wishlist"
              >
                {isFavorited ? "❤️" : "🤍"}
              </button>
            </div>
            
            <h1 className="text-xl md:text-2xl font-black text-foreground tracking-tight leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-center gap-1.5 text-xs text-foreground/60 font-semibold">
              <span className="text-yellow-400">⭐</span>
              <span className="text-foreground font-bold">{product.rating}</span>
              <span>&middot;</span>
              <span>{product.reviewsCount} verified reviews</span>
              <span>&middot;</span>
              <span className={product.inStock ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                {product.inStock ? "● In Stock" : "● Out of Stock"}
              </span>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 bg-card-bg border border-card-border rounded-2xl flex items-baseline gap-3">
            <span className="text-2xl font-black text-foreground">
              Rs. {unitPrice.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-sm text-foreground/40 line-through">
                  Rs. {(product.originalPrice + variantPriceDiff + addonPriceDiff).toLocaleString()}
                </span>
                <span className="text-xs font-extrabold text-secondary">
                  (Save Rs. {((product.originalPrice - product.price)).toLocaleString()})
                </span>
              </>
            )}
          </div>

          {/* Variant Selector pills */}
          {product.variants && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-foreground/75 uppercase tracking-wider block">
                Select {product.variants.type}
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedVariant(opt)}
                    className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all ${
                      selectedVariant === opt
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "bg-card-bg border-card-border text-foreground hover:bg-card-bg hover:bg-white/10"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Addon Selector pills */}
          {product.addons && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-foreground/75 uppercase tracking-wider block">
                Select {product.addons.name}
              </label>
              <div className="flex flex-col gap-2">
                {product.addons.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedAddon(opt)}
                    className={`px-4 py-3 border rounded-xl text-xs font-bold transition-all text-left flex justify-between items-center ${
                      selectedAddon === opt
                        ? "bg-purple-50 dark:bg-purple-950/20 border-primary text-primary"
                        : "bg-card-bg border-card-border text-foreground hover:bg-card-bg hover:bg-white/10"
                    }`}
                  >
                    <span>{opt}</span>
                    <span className="text-xs font-black">
                      {product.addons?.priceModifiers[product.addons.options.indexOf(opt)] === 0
                        ? "Included"
                        : `+ Rs. ${product.addons?.priceModifiers[product.addons.options.indexOf(opt)].toLocaleString()}`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & CTA Buttons */}
          <div className="flex flex-wrap gap-4 items-center pt-2">
            <div className="flex items-center border border-card-border rounded-xl bg-card-bg overflow-hidden h-11">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 hover:bg-black/5 hover:bg-white/10 font-extrabold text-foreground"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-foreground w-12 text-center select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 hover:bg-black/5 hover:bg-white/10 font-extrabold text-foreground"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 min-w-[140px] h-11 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98"
            >
              Add to Cart 🛒
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 min-w-[140px] h-11 bg-secondary hover:bg-secondary-hover text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-98"
            >
              Buy It Now &rarr;
            </button>
          </div>

          {/* 3. Interactive EMI Installments Calculator */}
          {product.emiAvailable && (
            <div className="p-6 bg-purple-50/50 dark:bg-purple-950/10 border border-primary/20 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-card-border/60 pb-2.5">
                <h3 className="text-sm font-black text-primary uppercase tracking-wider flex items-center gap-1.5">
                  💳 0% Interest EMI Calculator
                </h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                  Instant Eligibility
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Down Payment % Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-foreground/70">
                    <span>Down Payment</span>
                    <span className="text-primary">{downPaymentPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-primary bg-card-border h-1 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-foreground/40 font-bold">
                    <span>10% min</span>
                    <span>100% max</span>
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground/70 block">Tenure Period</label>
                  <select
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    className="w-full bg-card-bg border border-card-border text-xs px-3.5 py-2.5 rounded-xl outline-none font-bold text-foreground"
                  >
                    <option value={6}>6 Months Installment Plan</option>
                    <option value={12}>12 Months Installment Plan</option>
                    <option value={18}>18 Months Installment Plan</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Outputs Display */}
              <div className="bg-card-bg border border-card-border rounded-2xl p-4 grid grid-cols-3 gap-2 text-center divide-x divide-card-border">
                <div className="space-y-1">
                  <div className="text-[9px] text-foreground/40 uppercase font-black">Downpayment</div>
                  <div className="text-xs font-extrabold text-foreground">Rs. {downPaymentAmount.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-foreground/40 uppercase font-black">Financed</div>
                  <div className="text-xs font-extrabold text-foreground">Rs. {emiPrincipal.toLocaleString()}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[9px] text-foreground/40 uppercase font-black">Monthly EMI</div>
                  <div className="text-sm font-black text-primary">Rs. {monthlyInstallment.toLocaleString()}</div>
                </div>
              </div>

              <div className="text-[9px] text-foreground/40 font-medium leading-relaxed">
                * Calculators provide estimates. Real rates may slightly change due to bank processing charges. 0% interest offer is applicable through Nabil, NIMB, Global IME, and Sanima credit cards.
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 4. Specifications and Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 border-t border-card-border pt-10">
        
        {/* Specifications List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-card-border pb-2">
            Technical Specifications
          </h3>
          <div className="border border-card-border rounded-2xl overflow-hidden divide-y divide-card-border bg-card-bg">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="grid grid-cols-3 p-3.5 text-xs">
                <div className="col-span-1 font-bold text-foreground/60 capitalize">{key}</div>
                <div className="col-span-2 font-bold text-foreground">{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Description */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold text-foreground tracking-tight border-b border-card-border pb-2">
            Overview Description
          </h3>
          <p className="text-xs text-foreground/80 leading-relaxed font-medium bg-card-bg border border-card-border p-5 rounded-2xl shadow-sm">
            {product.description}
          </p>
        </div>

      </div>

    </div>
  );
}
