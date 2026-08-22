"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_CATEGORIES, Product } from "@/lib/db-simulation";
import { getDbProducts, saveDbProduct, deleteDbProduct } from "@/app/actions";
import { Edit3, Trash2, X, Check, Image as ImageIcon, Plus, Tag, AlertTriangle, ExternalLink } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Tabs for managing products vs categories
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Categories list dynamic state
  const [categories, setCategories] = useState<{ slug: string; name: string; image: string; count?: number }[]>([]);

  // Category Add Form fields
  const [newCatName, setNewCatName] = useState("");
  const [newCatImage, setNewCatImage] = useState("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80");

  // GUI Category Edit Modal State
  const [editingCat, setEditingCat] = useState<{
    originalSlug: string;
    slug: string;
    name: string;
    image: string;
  } | null>(null);

  // GUI Category Delete Confirmation Modal State
  const [deleteCatModal, setDeleteCatModal] = useState<{
    slug: string;
    name: string;
  } | null>(null);

  // GUI Add Category from Product Dropdown Modal State
  const [isDropdownAddCatOpen, setIsDropdownAddCatOpen] = useState(false);
  const [dropdownCatName, setDropdownCatName] = useState("");
  const [dropdownCatImage, setDropdownCatImage] = useState("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80");

  // Form Fields
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("laptop");
  const [price, setPrice] = useState(0);
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [inStock, setInStock] = useState(true);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  
  // Specs helper state (simple key-value list)
  const [specKey1, setSpecKey1] = useState("Processor");
  const [specVal1, setSpecVal1] = useState("");
  const [specKey2, setSpecKey2] = useState("Display");
  const [specVal2, setSpecVal2] = useState("");
  const [specKey3, setSpecKey3] = useState("Battery");
  const [specVal3, setSpecVal3] = useState("");

  const loadProducts = () => {
    getDbProducts().then((res) => {
      setProducts(res);
    });
  };

  // Load categories from localStorage
  const loadCategories = () => {
    const saved = localStorage.getItem("expert_mobile_categories");
    if (saved) {
      const parsed = JSON.parse(saved);
      const needsMigration = parsed.some((c: any) => !c.image && c.icon);
      if (needsMigration) {
        setCategories(INITIAL_CATEGORIES);
        localStorage.setItem("expert_mobile_categories", JSON.stringify(INITIAL_CATEGORIES));
      } else {
        setCategories(parsed);
      }
    } else {
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem("expert_mobile_categories", JSON.stringify(INITIAL_CATEGORIES));
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // Category Handlers
  const handleAddCategoryDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const slug = newCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (categories.some(c => c.slug === slug)) {
      alert("This category slug already exists!");
      return;
    }
    const newCat = { slug, name: newCatName.trim(), image: newCatImage.trim() };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("categories_updated"));
    window.dispatchEvent(new Event("storage"));
    setNewCatName("");
    setNewCatImage("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80");
  };

  const handleOpenEditCategory = (cat: { slug: string; name: string; image: string }) => {
    setEditingCat({
      originalSlug: cat.slug,
      slug: cat.slug,
      name: cat.name,
      image: cat.image || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80"
    });
  };

  const handleSaveEditCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name.trim()) return;

    const newSlug = editingCat.slug.trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/(^-|-$)/g, "") || editingCat.originalSlug;
    
    // Check if new slug already exists on another category
    if (newSlug !== editingCat.originalSlug && categories.some(c => c.slug === newSlug)) {
      alert("A category with this slug already exists!");
      return;
    }

    const updated = categories.map((c) => {
      if (c.slug === editingCat.originalSlug) {
        return {
          slug: newSlug,
          name: editingCat.name.trim(),
          image: editingCat.image.trim() || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80"
        };
      }
      return c;
    });

    setCategories(updated);
    localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("categories_updated"));
    window.dispatchEvent(new Event("storage"));
    setEditingCat(null);
  };

  const handleConfirmDeleteCategory = (slug: string) => {
    const updated = categories.filter((c) => c.slug !== slug);
    setCategories(updated);
    localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("categories_updated"));
    window.dispatchEvent(new Event("storage"));
    setDeleteCatModal(null);
  };

  const handleCategoryDropdownChange = (val: string) => {
    if (val === "ADD_NEW_CAT") {
      setDropdownCatName("");
      setDropdownCatImage("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80");
      setIsDropdownAddCatOpen(true);
    } else {
      setCategory(val);
    }
  };

  const handleSaveDropdownAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropdownCatName.trim()) return;
    const slug = dropdownCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (categories.some(c => c.slug === slug)) {
      alert("This category already exists!");
      setCategory(slug);
      setIsDropdownAddCatOpen(false);
      return;
    }
    const newCat = { slug, name: dropdownCatName.trim(), image: dropdownCatImage.trim() };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("expert_mobile_categories", JSON.stringify(updated));
    window.dispatchEvent(new Event("categories_updated"));
    window.dispatchEvent(new Event("storage"));
    setCategory(slug);
    setIsDropdownAddCatOpen(false);
  };

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setId("");
    setTitle("");
    setBrand("");
    setCategory(categories[0]?.slug || "laptop");
    setPrice(0);
    setOriginalPrice(0);
    setDiscount(0);
    setInStock(true);
    setImage("");
    setDescription("");
    setSpecKey1("Processor");
    setSpecVal1("");
    setSpecKey2("Display");
    setSpecVal2("");
    setSpecKey3("Battery");
    setSpecVal3("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setId(p.id);
    setTitle(p.title);
    setBrand(p.brand || "");
    setCategory(p.category);
    setPrice(p.price);
    setOriginalPrice(p.originalPrice || p.price);
    setDiscount(p.discount || 0);
    setInStock(p.inStock);
    setImage(p.image);
    setDescription(p.description || "");
    
    // Parse specs if available
    const keys = Object.keys(p.specs || {});
    setSpecKey1(keys[0] || "Processor");
    setSpecVal1(p.specs?.[keys[0]] || "");
    setSpecKey2(keys[1] || "Display");
    setSpecVal2(p.specs?.[keys[1]] || "");
    setSpecKey3(keys[2] || "Battery");
    setSpecVal3(p.specs?.[keys[2]] || "");

    setIsModalOpen(true);
  };

  const handleDelete = async (prodId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const ok = await deleteDbProduct(prodId);
      if (ok) {
        loadProducts();
      } else {
        alert("Failed to delete product");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const specs: Record<string, string> = {};
    if (specKey1 && specVal1) specs[specKey1] = specVal1;
    if (specKey2 && specVal2) specs[specKey2] = specVal2;
    if (specKey3 && specVal3) specs[specKey3] = specVal3;

    const payload: Product = {
      id: editingProduct?.id || id || `prod-${Date.now()}`,
      title,
      brand,
      category,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discount: Number(discount),
      inStock,
      image: image || "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
      description,
      rating: editingProduct?.rating || 4.8,
      reviewsCount: editingProduct?.reviewsCount || 12,
      specs,
    };

    const ok = await saveDbProduct(payload);
    if (ok) {
      setIsModalOpen(false);
      loadProducts();
    } else {
      alert("Error saving product");
    }
  };

  // Pagination helper
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Products & Category Inventory</h2>
          <p className="text-xs text-slate-400">Manage catalog hardware, pricing, categories, and real-time inventory</p>
        </div>
        {activeTab === "products" && (
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-[#0d1e1c] text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Product
          </button>
        )}
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "products"
              ? "border-primary text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          📦 Products list ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
            activeTab === "categories"
              ? "border-primary text-white font-black"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          🗂️ Manage Categories ({categories.length})
        </button>
      </div>

      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left panel: Add Category Form */}
          <div className="bg-[#14141b] border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Category</h3>
            <form onSubmit={handleAddCategoryDirect} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Watch, Camera"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Category Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://images.unsplash.com/..."
                  value={newCatImage}
                  onChange={(e) => setNewCatImage(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-primary hover:bg-primary-hover text-[#0d1e1c] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Category
              </button>
            </form>
          </div>

          {/* Right panel: Categories list table */}
          <div className="lg:col-span-2 bg-[#14141b] border border-slate-800 rounded-3xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60">
                    <th className="p-4">Image</th>
                    <th className="p-4">Category Name</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Associated Products</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
                  {categories.map((cat) => {
                    const assocProductsCount = products.filter((p) => p.category === cat.slug).length;
                    return (
                      <tr key={cat.slug} className="hover:bg-slate-900/35 transition-colors">
                        <td className="p-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
                            <img src={cat.image || "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80"} alt={cat.name} className="object-cover w-full h-full" />
                          </div>
                        </td>
                        <td className="p-4 font-bold text-white">{cat.name}</td>
                        <td className="p-4 text-slate-500 font-mono text-[11px]">/category/{cat.slug}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-bold text-[10px]">
                            {assocProductsCount} products
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditCategory(cat)}
                              className="px-2.5 py-1 bg-blue-950/80 border border-blue-800 hover:bg-blue-900 text-blue-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteCatModal({ slug: cat.slug, name: cat.name })}
                              className="px-2.5 py-1 bg-red-950/80 border border-red-800 hover:bg-red-900 text-red-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Products list table grid */
        <div className="bg-[#14141b] border border-slate-800 rounded-3xl overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60">
                <th className="p-4">Product Info</th>
                <th className="p-4">Category</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Price (Rs.)</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
              {currentProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/35 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
                      <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <span className="text-[10px] text-slate-500 block truncate max-w-xs">{p.description}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 font-bold text-[10px] uppercase">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-400">{p.brand || "—"}</td>
                  <td className="p-4 font-bold text-white">
                    Rs. {p.price?.toLocaleString()}
                    {p.discount ? (
                      <span className="ml-1.5 text-[10px] text-emerald-400 font-semibold">({p.discount}% off)</span>
                    ) : null}
                  </td>
                  <td className="p-4">
                    {p.inStock ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-bold text-[10px]">
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-800 text-red-400 font-bold text-[10px]">
                        Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="px-2.5 py-1 bg-red-950/40 border border-red-900/40 hover:bg-red-900/60 text-red-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Previous / Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Prev
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-primary text-[#0d1e1c] shadow-sm font-black"
                        : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next →
              </button>
            </div>
            
            {/* Right: Summary info */}
            <span className="text-[11px] font-bold text-slate-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} ({totalPages} {totalPages === 1 ? "Page" : "Pages"})
            </span>
          </div>
        )}
      </div>
      )}

      {/* GUI EDIT CATEGORY MODAL */}
      {editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#14141b] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden p-6 md:p-7 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-200 text-slate-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Edit Category</h3>
                  <p className="text-[10px] text-slate-400">Update category details and image thumbnail</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingCat(null)}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditCategory} className="space-y-4 text-xs">
              
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Watch"
                  value={editingCat.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setEditingCat(prev => prev ? { ...prev, name } : null);
                  }}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              {/* Category Slug / Route */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Category Slug *</label>
                <div className="flex items-center border border-slate-800 rounded-xl overflow-hidden bg-slate-900 focus-within:border-primary">
                  <span className="px-3 py-2 text-xs text-slate-500 bg-slate-950 border-r border-slate-800 whitespace-nowrap font-mono">
                    /category/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="smart-watch"
                    value={editingCat.slug}
                    onChange={(e) => {
                      const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                      setEditingCat(prev => prev ? { ...prev, slug } : null);
                    }}
                    className="flex-1 text-xs px-3 py-2 bg-slate-900 outline-none text-white font-mono"
                  />
                </div>
              </div>

              {/* Category Image URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://images.pexels.com/..."
                  value={editingCat.image}
                  onChange={(e) => {
                    const image = e.target.value;
                    setEditingCat(prev => prev ? { ...prev, image } : null);
                  }}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              {/* Image Live Preview */}
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0 flex items-center justify-center">
                  <img
                    src={editingCat.image}
                    alt={editingCat.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=120&h=120&fit=crop&q=80";
                    }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  <span className="font-bold text-white block">Preview Thumbnail</span>
                  Displayed in navigation bar, mega-menu, and product filter list.
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingCat(null)}
                  className="flex-1 py-2.5 text-xs font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-black text-[#0d1e1c] bg-primary hover:bg-primary-hover rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* GUI DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#14141b] border border-red-950 rounded-3xl w-full max-w-sm overflow-hidden p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-red-950/60 border border-red-900/60 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">Delete Category?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="font-bold text-white font-mono">"{deleteCatModal.name}"</span>?
              </p>
            </div>
            <div className="p-3 bg-red-950/30 border border-red-900/30 rounded-xl text-[11px] text-red-300">
              All associated products will remain safe in inventory, but their category will be unassigned.
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCatModal(null)}
                className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer border border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDeleteCategory(deleteCatModal.slug)}
                className="flex-1 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GUI ADD CATEGORY (from product dropdown) MODAL */}
      {isDropdownAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#14141b] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95 duration-200 text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Add New Category</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDropdownAddCatOpen(false)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDropdownAddCategory} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smart Watch"
                  value={dropdownCatName}
                  onChange={(e) => setDropdownCatName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Image URL *</label>
                <input
                  type="text"
                  required
                  placeholder="https://..."
                  value={dropdownCatImage}
                  onChange={(e) => setDropdownCatImage(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                />
              </div>
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsDropdownAddCatOpen(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-black text-[#0d1e1c] bg-primary hover:bg-primary-hover rounded-xl shadow-md"
                >
                  Create & Select
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CRUD Edit/Add Product Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 animate-in fade-in duration-200">
          <div className="bg-[#14141b] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative animate-in zoom-in duration-200">
            
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {editingProduct ? "✏️ Edit Product Details" : "✨ Add New Shop Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Row 1: Name and brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asus Vivobook Pro 15"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Asus, Xiaomi, Apple"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
              </div>

              {/* Row 2: Category and Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Category</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryDropdownChange(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none text-slate-100"
                  >
                    {categories.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                    <option value="ADD_NEW_CAT" className="text-primary font-bold">➕ Add New Category...</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Selling Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="59999"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Original Price (Rs.)</label>
                  <input
                    type="number"
                    placeholder="65000"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
              </div>

              {/* Row 3: Discount and Stock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Discount %</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Inventory Stock Status</label>
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="inStockCheck"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 accent-primary rounded"
                    />
                    <label htmlFor="inStockCheck" className="text-slate-300 font-semibold cursor-pointer">Available in Stock</label>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Product Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Top 3 Highlight Specs</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={specKey1}
                    onChange={(e) => setSpecKey1(e.target.value)}
                    placeholder="Spec Name (e.g. Processor)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />
                  <input
                    type="text"
                    value={specVal1}
                    onChange={(e) => setSpecVal1(e.target.value)}
                    placeholder="Spec Value (e.g. 16GB)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />

                  <input
                    type="text"
                    value={specKey2}
                    onChange={(e) => setSpecKey2(e.target.value)}
                    placeholder="Spec Name (e.g. Display)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />
                  <input
                    type="text"
                    value={specVal2}
                    onChange={(e) => setSpecVal2(e.target.value)}
                    placeholder="Spec Value (e.g. 90Wh)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />

                  <input
                    type="text"
                    value={specKey3}
                    onChange={(e) => setSpecKey3(e.target.value)}
                    placeholder="Spec Name (e.g. OS)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />
                  <input
                    type="text"
                    value={specVal3}
                    onChange={(e) => setSpecVal3(e.target.value)}
                    placeholder="Spec Value (e.g. Windows 11)"
                    className="bg-[#14141b] border border-slate-800 rounded-xl px-2 py-1.5 text-xs text-slate-300"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Overview Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the product key features..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100 resize-none"
                />
              </div>

              {/* Modal controls */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-900/60 text-slate-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Save Product details
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
