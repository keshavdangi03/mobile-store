"use client";

import React, { useState, useEffect } from "react";
import { getAdminTraderProducts, approveTraderProduct, rejectTraderProduct } from "@/app/actions";
import { Check, X, Loader2, Store, AlertTriangle, Eye } from "lucide-react";

export default function AdminTradersPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  // Reject Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submittingAction, setSubmittingAction] = useState(false);

  // Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchTraderProducts = () => {
    setLoading(true);
    getAdminTraderProducts().then((res) => {
      setProducts(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchTraderProducts();
  }, []);

  const handleApprove = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to approve "${title}"? It will go live on the storefront.`)) return;
    setSubmittingAction(true);
    const success = await approveTraderProduct(id);
    setSubmittingAction(false);
    if (success) {
      alert("Product approved successfully!");
      fetchTraderProducts();
    } else {
      alert("Failed to approve product.");
    }
  };

  const handleOpenRejectModal = (product: any) => {
    setSelectedProduct(product);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason.");
      return;
    }
    setSubmittingAction(true);
    const success = await rejectTraderProduct(selectedProduct.id, rejectionReason.trim());
    setSubmittingAction(false);
    if (success) {
      setIsRejectModalOpen(false);
      alert("Product rejected with feedback sent to trader.");
      fetchTraderProducts();
    } else {
      alert("Failed to reject product.");
    }
  };

  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-200">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Trader Listing Approvals</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Review and Publish Trader Catalog Items</p>
        </div>
      </div>

      {/* Grid count stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-[#14141b] border border-slate-850 rounded-3xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Submissions</div>
          <div className="text-2xl font-black text-white mt-1">{products.length}</div>
        </div>
        <div className="p-6 bg-[#14141b] border border-[#1b3b2b] rounded-3xl">
          <div className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Approved Live Listings</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {products.filter(p => p.status === "Approved").length}
          </div>
        </div>
        <div className="p-6 bg-[#14141b] border border-[#3b2b1b] rounded-3xl">
          <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">Awaiting Review</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {products.filter(p => p.status === "Pending").length}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-[#14141b] border border-slate-800 rounded-3xl p-6 shadow-md">
        {products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-500">
                  <th className="py-3 px-2">Image</th>
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Trader Account</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-semibold">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-900/10 transition-colors">
                    <td className="py-3 px-2">
                      <div className="w-10 h-10 rounded overflow-hidden border border-slate-800 bg-slate-950 relative">
                        <img src={p.image} alt={p.title} className="object-cover w-full h-full" />
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="font-bold text-white max-w-[160px] truncate">{p.title}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">{p.brand} &middot; {p.category}</div>
                    </td>
                    <td className="py-3 px-2 text-slate-400">{p.traderEmail}</td>
                    <td className="py-3 px-2 font-black text-white">Rs. {p.price.toLocaleString()}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                        p.status === "Approved" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" :
                        p.status === "Rejected" ? "bg-red-950/40 text-red-400 border border-red-900/30" :
                        "bg-amber-950/40 text-amber-400 border border-amber-900/30"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right space-x-2">
                      <button
                        onClick={() => handleViewDetails(p)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      
                      {p.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(p.id, p.title)}
                            disabled={submittingAction}
                            className="p-1.5 bg-emerald-900/20 hover:bg-emerald-900/50 text-emerald-400 rounded-lg transition-colors border border-emerald-900/30 cursor-pointer disabled:opacity-50"
                            title="Approve Listing"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(p)}
                            disabled={submittingAction}
                            className="p-1.5 bg-red-900/20 hover:bg-red-900/50 text-red-400 rounded-lg transition-colors border border-red-900/30 cursor-pointer disabled:opacity-50"
                            title="Reject Listing"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Store className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-500">No trader listing submissions found in database.</p>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {isRejectModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-md bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative text-slate-200">
            <button 
              onClick={() => setIsRejectModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400" /> Reject Listing Submission
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Please provide rejection feedback for: {selectedProduct.title}</p>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-400">Feedback Reason *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Image resolution is too low, please upload a clear cover photo or adjust pricing specs..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-red-500 text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white font-bold cursor-pointer text-center flex items-center justify-center disabled:opacity-50"
                >
                  {submittingAction ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send & Reject"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {isDetailModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-lg bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-slate-200 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white">Listing Specifications Review</h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Submitted by trader: {selectedProduct.traderEmail}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="object-cover w-full h-full" />
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold">Product Name</span>
                  <span className="text-sm font-extrabold text-white block mt-0.5">{selectedProduct.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Price</span>
                    <span className="text-sm font-black text-primary">Rs. {selectedProduct.price.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Brand / Cat</span>
                    <span className="text-white block mt-0.5 capitalize">{selectedProduct.brand} / {selectedProduct.category}</span>
                  </div>
                </div>
                {selectedProduct.specs && (
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase font-bold mb-1">Specifications</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      {Object.entries(selectedProduct.specs).map(([k, v]: any) => (
                        <div key={k}>
                          <span className="text-slate-500 font-bold block">{k}:</span>
                          <span className="text-slate-300 font-semibold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Trader Description</span>
              <p className="text-slate-300 font-normal leading-relaxed bg-slate-905 p-3.5 border border-slate-800/80 rounded-xl max-h-32 overflow-y-auto whitespace-pre-wrap">
                {selectedProduct.description}
              </p>
            </div>

            {selectedProduct.status === "Pending" && (
              <div className="flex gap-3 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleApprove(selectedProduct.id, selectedProduct.title);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-extrabold cursor-pointer text-center"
                >
                  Approve & Go Live
                </button>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenRejectModal(selectedProduct);
                  }}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-white font-extrabold cursor-pointer text-center"
                >
                  Reject listing
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
