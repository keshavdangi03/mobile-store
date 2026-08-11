"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_CATEGORIES, Product } from "@/lib/db-simulation";
import { getDbProducts, saveDbProduct, deleteDbProduct } from "@/app/actions";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setId("");
    setTitle("");
    setBrand("");
    setCategory("laptop");
    setPrice(0);
    setOriginalPrice(0);
    setDiscount(0);
    setInStock(true);
    setImage("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80");
    setDescription("");
    setSpecKey1("Processor"); setSpecVal1("");
    setSpecKey2("Display"); setSpecVal2("");
    setSpecKey3("Battery"); setSpecVal3("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setId(product.id);
    setTitle(product.title);
    setBrand(product.brand);
    setCategory(product.category);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice);
    setDiscount(product.discount);
    setInStock(product.inStock);
    setImage(product.image);
    setDescription(product.description);

    // Load specs keys/values
    const entries = Object.entries(product.specs);
    setSpecKey1(entries[0]?.[0] || "Processor");
    setSpecVal1(entries[0]?.[1] || "");
    setSpecKey2(entries[1]?.[0] || "Display");
    setSpecVal2(entries[1]?.[1] || "");
    setSpecKey3(entries[2]?.[0] || "Battery");
    setSpecVal3(entries[2]?.[1] || "");
    
    setIsModalOpen(true);
  };

  const handleDelete = (prodId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteDbProduct(prodId).then((success) => {
        if (success) {
          loadProducts();
        } else {
          alert("Error: Failed to delete product from database.");
        }
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !brand.trim()) {
      alert("Product Title and Brand are required fields!");
      return;
    }

    const finalId = editingProduct ? id : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const specsObj: { [key: string]: string } = {};
    if (specKey1 && specVal1) specsObj[specKey1] = specVal1;
    if (specKey2 && specVal2) specsObj[specKey2] = specVal2;
    if (specKey3 && specVal3) specsObj[specKey3] = specVal3;

    const newProd: Product = {
      id: finalId || "prod-" + Math.floor(Math.random() * 10000),
      title,
      brand,
      category,
      price: Number(price),
      originalPrice: Number(originalPrice) || Number(price),
      discount: Number(discount) || 0,
      rating: editingProduct ? editingProduct.rating : 4.5,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 1,
      inStock,
      image,
      description: description || `Authentic ${title} provided with official manufacturer warranty support.`,
      specs: specsObj,
    };

    saveDbProduct(newProd).then((success) => {
      if (success) {
        setIsModalOpen(false);
        loadProducts();
      } else {
        alert("Error: Failed to save product details to database.");
      }
    });
  };

  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Manage Products</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Inventory Catalog CRUD Panel</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          ➕ Add New Product
        </button>
      </div>

      {/* Products list table grid */}
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
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 relative">
                      <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate max-w-[200px]" title={p.title}>{p.title}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{p.id}</div>
                    </div>
                  </td>
                  <td className="p-4 capitalize">{p.category}</td>
                  <td className="p-4">{p.brand}</td>
                  <td className="p-4">
                    <div>Rs. {p.price.toLocaleString()}</div>
                    {p.discount > 0 && (
                      <span className="text-[9px] text-secondary font-bold">{p.discount}% OFF</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      p.inStock ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"
                    }`}>
                      {p.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-2.5 py-1 bg-blue-950 border border-blue-900/50 hover:bg-blue-900/40 text-blue-400 text-[10px] font-bold rounded-lg transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="px-2.5 py-1 bg-red-950 border border-red-900/50 hover:bg-red-900/40 text-red-400 text-[10px] font-bold rounded-lg transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-800 bg-slate-900/40 text-[11px] font-bold">
            {/* Left: Button list */}
            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors flex items-center justify-center font-black cursor-pointer bg-slate-900"
              >
                |&lt;
              </button>
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors flex items-center justify-center font-black cursor-pointer bg-slate-900"
              >
                &lt;
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => Math.abs(page - currentPage) <= 1 || page === 1 || page === totalPages)
                .map((page, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && page - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsisBefore && (
                        <span className="px-1.5 text-slate-600 text-xs font-bold">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors border cursor-pointer ${
                          currentPage === page
                            ? "bg-primary border-primary text-white"
                            : "border-slate-800 hover:bg-slate-800 text-slate-300 bg-slate-900"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors flex items-center justify-center font-black cursor-pointer bg-slate-900"
              >
                &gt;
              </button>
              {/* Last Page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 border border-slate-800 hover:bg-slate-800 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent text-slate-300 transition-colors flex items-center justify-center font-black cursor-pointer bg-slate-900"
              >
                &gt;|
              </button>
            </div>

            {/* Right: Summary info */}
            <span className="text-[11px] font-bold text-slate-400">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} ({totalPages} {totalPages === 1 ? "Page" : "Pages"})
            </span>
          </div>
        )}
      </div>

      {/* CRUD Edit/Add Modal Overlay */}
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
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none text-slate-100"
                  >
                    {INITIAL_CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
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
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Discount Percentage (%)</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Stock Status</label>
                  <select
                    value={inStock ? "true" : "false"}
                    onChange={(e) => setInStock(e.target.value === "true")}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none text-slate-100"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-slate-100"
                  />
                </div>
              </div>

              {/* Technical Specifications Sub-Panel */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-800">
                  🔧 Dynamic Technical Specifications
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={specKey1}
                    onChange={(e) => setSpecKey1(e.target.value)}
                    placeholder="Spec Name (e.g. RAM)"
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
                    placeholder="Spec Name (e.g. Battery)"
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
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-900/60 text-slate-400 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-all shadow-md"
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
