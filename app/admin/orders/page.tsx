"use client";

import React, { useState, useEffect } from "react";
import { Order } from "@/lib/db-simulation";
import { getDbOrders, updateDbOrderStatus } from "@/app/actions";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = () => {
    getDbOrders().then((res) => {
      setOrders(res);
    });
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = (orderId: string, nextStatus: Order['status']) => {
    updateDbOrderStatus(orderId, nextStatus).then((success) => {
      if (success) {
        loadOrders();
        // Update local modal details if currently inspecting it
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => prev ? { ...prev, status: nextStatus } : null);
        }
      } else {
        alert("Error: Failed to update order status in database.");
      }
    });
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Manage Orders</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Customer Purchases & Logistics Queue</p>
        </div>
        <div className="text-xs font-bold text-slate-450 bg-[#14141b] border border-slate-800 px-3 py-1.5 rounded-xl">
          📦 {orders.length} Total orders
        </div>
      </div>

      {/* Orders queue grid and inspector layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Orders queue table list */}
        <div className="xl:col-span-2 bg-[#14141b] border border-slate-800 rounded-3xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 bg-slate-900/60">
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs font-medium text-slate-300">
                {orders.length > 0 ? (
                  [...orders].reverse().map((o) => (
                    <tr key={o.id} className={`hover:bg-slate-900/35 transition-colors ${
                      selectedOrder?.id === o.id ? "bg-slate-900/60" : ""
                    }`}>
                      <td className="p-4">
                        <div className="font-bold text-white font-mono">{o.id}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">
                          {new Date(o.createdAt).toLocaleDateString()} &middot; {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.customerName}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{o.city}</div>
                      </td>
                      <td className="p-4 font-bold text-white">Rs. {o.totalPrice.toLocaleString()}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value as Order['status'])}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg outline-none cursor-pointer ${
                            o.status === "Pending"
                              ? "bg-purple-950 text-purple-400 border border-purple-900/40"
                              : o.status === "Shipped"
                              ? "bg-blue-950 text-blue-400 border border-blue-900/40"
                              : o.status === "Delivered"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-900/40"
                              : "bg-red-950 text-red-400 border border-red-900/40"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300"
                        >
                          Details &rarr;
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">
                      <span className="text-4xl block mb-2">📭</span>
                      <h4 className="font-bold text-sm">No orders received</h4>
                      <p className="text-[10px] text-slate-600 max-w-xs mx-auto mt-0.5">
                        Once client orders are submitted via checkout, they will appear here in chronological sequence.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Selected Order Details panel */}
        <aside className="xl:col-span-1">
          {selectedOrder ? (
            <div className="p-6 bg-[#14141b] border border-slate-800 rounded-3xl space-y-6 shadow-md animate-in fade-in duration-200">
              
              {/* Box header */}
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">Inspect Order</h3>
                  <div className="text-[9px] font-mono text-primary font-bold mt-0.5">{selectedOrder.id}</div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs font-semibold text-slate-400 hover:text-white"
                >
                  ✕ Close
                </button>
              </div>

              {/* Customer info list */}
              <div className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Customer Details</span>
                  <div className="font-bold text-white">{selectedOrder.customerName}</div>
                  <div className="text-slate-400">{selectedOrder.customerPhone}</div>
                  <div className="text-slate-500">{selectedOrder.customerEmail}</div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Delivery Destination</span>
                  <p className="text-slate-300 leading-relaxed">{selectedOrder.address}, {selectedOrder.city}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Payment Status</span>
                  <div className="font-bold text-white">{selectedOrder.paymentMethod}</div>
                </div>
              </div>

              {/* Items in receipt list */}
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Items Purchased</span>
                
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 items-center justify-between text-xs font-medium">
                    <div className="flex gap-2 items-center min-w-0">
                      <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-800 flex-shrink-0 relative bg-slate-900">
                        <img src={item.image} alt={item.productTitle} className="object-cover w-full h-full" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate max-w-[120px]">{item.productTitle}</div>
                        <div className="text-[9px] text-slate-500">
                          Qty: {item.quantity} {item.variant ? `(${item.variant})` : ""}
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-white flex-shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="border-t border-slate-800 pt-4 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Total Price Paid:</span>
                <span className="text-sm font-black text-secondary">Rs. {selectedOrder.totalPrice.toLocaleString()}</span>
              </div>

              {/* Actions panel */}
              <div className="border-t border-slate-800 pt-4 space-y-2">
                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider block">Update Progress Stage</span>
                <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold">
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, "Shipped")}
                    disabled={selectedOrder.status === "Shipped"}
                    className="p-2 rounded-lg bg-blue-950 border border-blue-900/50 text-blue-400 hover:bg-blue-900/30 disabled:opacity-40"
                  >
                    Set Shipped 🚚
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedOrder.id, "Delivered")}
                    disabled={selectedOrder.status === "Delivered"}
                    className="p-2 rounded-lg bg-emerald-950 border border-emerald-900/50 text-emerald-400 hover:bg-emerald-900/30 disabled:opacity-40"
                  >
                    Set Delivered 🎁
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-3xl py-12">
              <span>📋</span>
              <p className="text-xs font-bold mt-2">Select an order entry</p>
              <p className="text-[9px] text-slate-650 mt-0.5">Click details on any queue order to inspect its items and customer notes here.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
