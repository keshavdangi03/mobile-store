"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Order, Product } from "@/lib/db-simulation";
import { getDbProducts, getDbOrders } from "@/app/actions";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getDbProducts().then((res) => setProducts(res));
    getDbOrders().then((res) => setOrders(res));
  }, []);

  // Calculations
  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const outOfStockItems = products.filter((p) => !p.inStock).length;

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  // Mock sales data for the SVG bar chart
  const weeklySalesData = [
    { day: "Sun", amount: 45000 },
    { day: "Mon", amount: 120000 },
    { day: "Tue", amount: 75000 },
    { day: "Wed", amount: 190000 },
    { day: "Thu", amount: 110000 },
    { day: "Fri", amount: 160000 },
    { day: "Sat", amount: 50000 },
  ];

  const maxAmount = Math.max(...weeklySalesData.map((d) => d.amount));

  return (
    <div className="space-y-8 font-sans">
      
      {/* Dashboard Page Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Metrics & Sales Performance</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-bold">Local Standard Time</div>
          <div className="text-xs text-primary font-black mt-0.5">{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Stats indicators grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Sales Card */}
        <div className="p-6 bg-[#14141b] border border-slate-850 rounded-3xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Sales</span>
            <span className="text-base">💰</span>
          </div>
          <div className="text-xl font-black text-white">Rs. {totalSales.toLocaleString()}</div>
          <p className="text-[9px] text-emerald-400 font-bold">↑ 14% growth compared to last week</p>
        </div>

        {/* Total Orders Card */}
        <div className="p-6 bg-[#14141b] border border-slate-850 rounded-3xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Orders</span>
            <span className="text-base">📝</span>
          </div>
          <div className="text-xl font-black text-white">{orders.length} orders</div>
          <p className="text-[9px] text-purple-400 font-bold">{pendingOrders} order requests currently pending</p>
        </div>

        {/* Inventory Stock Card */}
        <div className="p-6 bg-[#14141b] border border-slate-850 rounded-3xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Stock Alert</span>
            <span className="text-base">⚠️</span>
          </div>
          <div className="text-xl font-black text-white">{outOfStockItems} items</div>
          <p className="text-[9px] text-orange-400 font-bold">{outOfStockItems > 0 ? "Needs inventory restock" : "All products in stock"}</p>
        </div>

        {/* Registered Products Card */}
        <div className="p-6 bg-[#14141b] border border-slate-850 rounded-3xl space-y-2 shadow-md">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">Shop Items</span>
            <span className="text-base">💻</span>
          </div>
          <div className="text-xl font-black text-white">{products.length} models</div>
          <p className="text-[9px] text-slate-400 font-bold">10 categories represented</p>
        </div>

      </div>

      {/* Sales Charts and Activity panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Weekly sales SVG chart */}
        <div className="lg:col-span-2 p-6 bg-[#14141b] border border-slate-800 rounded-3xl space-y-4 shadow-md">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">📊 Weekly Sales Volume</h3>
            <span className="text-[9px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded">Rs. aggregate</span>
          </div>
          
          <div className="h-64 w-full flex items-end justify-between px-2 pt-6">
            {weeklySalesData.map((d, i) => {
              const heightPercent = maxAmount > 0 ? (d.amount / maxAmount) * 85 : 0;
              return (
                <div key={i} className="flex flex-col items-center flex-1 group">
                  {/* Hover tooltip value */}
                  <span className="text-[9px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                    Rs. {(d.amount / 1000)}k
                  </span>
                  
                  {/* Column Bar */}
                  <div
                    className="w-8 bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-700"
                    style={{ height: `${heightPercent}%` }}
                  />
                  
                  {/* Label */}
                  <span className="text-[10px] font-bold text-slate-400 mt-2">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent orders overview list */}
        <div className="p-6 bg-[#14141b] border border-slate-800 rounded-3xl space-y-4 shadow-md">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">📝 Recent Orders</h3>
            <Link href="/admin/orders" className="text-[10px] font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
            {orders.length > 0 ? (
              [...orders].reverse().slice(0, 4).map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-slate-800/40 pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate max-w-[140px]">{order.customerName}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{order.id} &middot; {order.city}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">Rs. {order.totalPrice.toLocaleString()}</div>
                    <span className={`text-[8px] font-extrabold px-1.5 py-0.2 rounded mt-0.5 inline-block ${
                      order.status === "Pending"
                        ? "bg-purple-900/30 text-purple-300"
                        : order.status === "Shipped"
                        ? "bg-blue-900/30 text-blue-300"
                        : order.status === "Delivered"
                        ? "bg-emerald-900/30 text-emerald-300"
                        : "bg-red-900/30 text-red-300"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <span className="text-3xl mb-2">📭</span>
                <p className="text-[10px] font-bold">No orders placed yet</p>
                <p className="text-[9px] text-slate-600 max-w-[160px] mx-auto mt-0.5">Submit customer checkouts in store front to view stats.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
