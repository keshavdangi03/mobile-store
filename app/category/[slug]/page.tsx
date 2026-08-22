"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { INITIAL_CATEGORIES, Product } from "@/lib/db-simulation";
import { useCart } from "@/components/cart-context";
import { getDbProducts, getDbCategories } from "@/app/actions";

import SectionEditorWrapper from "@/components/section-editor-wrapper";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const { addToCart } = useCart();

  const slug = resolvedParams.slug;
  const initialSearch = resolvedSearchParams.search || "";
  const initialEmi = resolvedSearchParams.emi === "true";
  const initialClearance = resolvedSearchParams.clearance === "true";
  const initialBrand = resolvedSearchParams.brand || "";

  // Category name & icon
  const [categoriesList, setCategoriesList] = useState<{ slug: string; name: string; image: string }[]>(INITIAL_CATEGORIES);

  useEffect(() => {
    const loadCategories = () => {
      getDbCategories().then((cats) => {
        if (Array.isArray(cats) && cats.length > 0) {
          setCategoriesList(cats);
        }
      });
    };
    loadCategories();
    window.addEventListener("categories_updated", loadCategories);
    window.addEventListener("cms_db_synced", loadCategories);
    return () => {
      window.removeEventListener("categories_updated", loadCategories);
      window.removeEventListener("cms_db_synced", loadCategories);
    };
  }, []);

  const activeCategory = categoriesList.find((c) => c.slug === slug);
  const categoryName = slug === "all" ? "All Products" : activeCategory?.name || slug;
  
  // State variables for filter inputs
  const [products, setProducts] = useState<Product[]>([]);
  const [searchBrandQuery, setSearchBrandQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrand ? [initialBrand] : []);
  const [priceRange, setPriceRange] = useState<number>(200000);
  const [sortBy, setSortBy] = useState("newest");
  const [onlyEmi, setOnlyEmi] = useState(initialEmi);
  const [onlyClearance, setOnlyClearance] = useState(initialClearance);
  const [searchInput, setSearchInput] = useState(initialSearch);

  // Sync initial query params
  useEffect(() => {
    getDbProducts().then((data) => {
      setProducts(data);
    });
  }, []);

  // Get list of all available brands in database to show in sidebar filter
  const allBrands = Array.from(new Set(products.map((p) => p.brand)));
  const filteredBrands = allBrands.filter((b) =>
    b.toLowerCase().includes(searchBrandQuery.toLowerCase())
  );

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceRange(200000);
    setSortBy("newest");
    setOnlyEmi(false);
    setOnlyClearance(false);
    setSearchInput("");
  };

  // Main matching engine to filter catalog
  const filteredProducts = products.filter((p) => {
    // 1. Category check
    if (slug !== "all" && p.category !== slug) return false;

    // 2. Search keyword check (title / brand / category)
    if (searchInput) {
      const q = searchInput.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 3. Multi-brand checkboxes
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

    // 4. Maximum Price slider limit
    if (p.price > priceRange) return false;

    // 5. EMI clearance filter toggle
    if (onlyEmi && !p.emiAvailable) return false;

    // 6. Clearance (discount > 10%)
    if (onlyClearance && p.discount <= 10) return false;

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") {
      return a.price - b.price;
    } else if (sortBy === "price-high") {
      return b.price - a.price;
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    } else {
      // Default: "newest" / alphabetical sort simulation
      return b.id.localeCompare(a.id);
    }
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-6 py-8">
      {/* Breadcrumbs */}
      <nav className="text-xs text-foreground/50 font-semibold mb-4 flex items-center gap-1.5">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>&gt;</span>
        <span className="text-foreground capitalize">{categoryName}</span>
      </nav>

      {/* Hero Description Header */}
      <SectionEditorWrapper sectionId={`category-hero-${slug}`}>
        <div className="bg-sidebar-bg border border-card-border rounded-3xl p-6 md:p-8 mb-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {categoryName} price in Nepal
          </h1>
          <p className="text-xs md:text-sm text-foreground/75 leading-relaxed max-w-4xl">
            Browse and compare official {categoryName} models in Nepal. Explore detailed specifications, reviews, 
            discounts, and 0% EMI financing plans. Shop authentic gear with physical warranty support from Putalisadak, Kathmandu.
          </p>
        </div>
      </SectionEditorWrapper>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* 1. Left Sidebar Filter Panel */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-6 shadow-sm sticky top-28">
            <div className="flex items-center justify-between border-b border-card-border pb-3">
              <h2 className="text-base font-bold text-foreground">Filters</h2>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear Filters
              </button>
            </div>

            {/* Keyword search filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Search Keyword</label>
              <input
                type="text"
                placeholder="Search matching items..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
              />
            </div>

            {/* Brands Multi-Checkboxes */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Brands</label>
              <input
                type="text"
                placeholder="Search brand..."
                value={searchBrandQuery}
                onChange={(e) => setSearchBrandQuery(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
              <div className="max-h-40 overflow-y-auto space-y-2.5 pr-2">
                {filteredBrands.length > 0 ? (
                  filteredBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2.5 text-xs text-foreground/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                        className="rounded border-card-border text-primary focus:ring-primary w-4 h-4"
                      />
                      <span className="font-medium">{brand}</span>
                    </label>
                  ))
                ) : (
                  <div className="text-[10px] text-foreground/40 text-center py-2">No matching brands</div>
                )}
              </div>
            </div>

            {/* Price Slider Range */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider">Max Price</label>
                <span className="text-xs font-extrabold text-primary">Rs. {priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="5000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-primary bg-card-border h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Offer Filter Toggles */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider block">Offers & Finance</label>
              
              <label className="flex items-center gap-2.5 text-xs text-foreground/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyEmi}
                  onChange={(e) => setOnlyEmi(e.target.checked)}
                  className="rounded border-card-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="font-medium">EMI Available</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-foreground/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyClearance}
                  onChange={(e) => setOnlyClearance(e.target.checked)}
                  className="rounded border-card-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="font-medium">Clearance Sale</span>
              </label>
            </div>
          </div>
        </aside>

        {/* 2. Right Products Grid Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Sorting & Item Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-sidebar-bg border border-card-border rounded-2xl">
            <span className="text-xs font-bold text-foreground/60">
              Showing <span className="text-foreground">{sortedProducts.length}</span> products matching parameters
            </span>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground/60 flex-shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-card-bg border border-card-border text-xs px-3 py-1.5 rounded-xl outline-none text-foreground font-bold"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-card-bg border border-card-border rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col group relative"
                >
                  {product.discount > 0 && (
                    <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
                      {product.discount}% OFF
                    </span>
                  )}

                  <Link href={`/product/${product.id}`} className="block h-48 w-full relative overflow-hidden bg-card-bg border-b border-card-border">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-4 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-primary bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded uppercase">
                          {product.brand}
                        </span>
                        {product.emiAvailable && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded uppercase">
                            EMI 0%
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-foreground leading-tight hover:text-primary line-clamp-2">
                        <Link href={`/product/${product.id}`}>{product.title}</Link>
                      </h3>

                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">⭐</span>
                        <span className="text-xs font-bold text-foreground/80">{product.rating}</span>
                        <span className="text-[10px] text-foreground/40">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-base font-black text-foreground">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-foreground/40 line-through">
                            Rs. {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/product/${product.id}`}
                          className="flex-1 py-2 text-center border border-card-border hover:border-primary/50 text-foreground text-xs font-bold rounded-lg transition-colors"
                        >
                          Specs
                        </Link>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="py-2 px-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm active:scale-95"
                        >
                          🛒 Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-card-bg border border-card-border rounded-3xl space-y-4">
              <span className="text-5xl block">🔍</span>
              <h3 className="text-lg font-bold text-foreground">No products found</h3>
              <p className="text-xs text-foreground/60 max-w-sm mx-auto">
                No items match your active checkbox filters, pricing slide limits, or search terms. Try clearing parameters.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-full transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
