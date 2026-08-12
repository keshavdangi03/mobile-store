"use client";

import React from "react";
import { Search, Plus, ChevronUp, Info, Home, Laptop, Smartphone, Tablet, Cpu, Monitor, Projector, Headphones, Compass, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 170 170" fill="currentColor" {...props}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.17-2.76-2.28-6.5-6.73-11.22-13.38-5.78-8.2-10.21-17.76-13.27-28.7-3.17-11.36-4.77-22.1-4.77-32.22 0-16.27 3.86-29.93 11.59-40.97 7.73-11.05 17.65-16.63 29.77-16.75 6.13 0 12.52 2.21 19.16 6.64 6.63 4.41 11.19 6.62 13.68 6.62 2.12 0 6.44-2.12 12.98-6.35 6.53-4.24 12.56-6.23 18.08-5.97 15.18 1.13 26.64 6.79 34.39 16.99-13.2 8.01-19.69 19.14-19.46 33.39.24 10.6 4.11 19.34 11.62 26.23 7.51 6.89 16.5 10.51 26.97 10.86-2.12 6.36-4.66 12.35-7.61 17.97zM119.33 26.54c0-8.08 2.84-15.65 8.52-22.7 7.21-8.91 16.21-13.72 26.98-14.42.12 1.04.18 1.83.18 2.37 0 7.73-3.03 15.35-9.08 22.86-5.83 7.15-13.64 12.27-23.44 13.56-.35-2.54-.51-5.18-.51-7.79z" />
  </svg>
);

const STORE_PAGES = [
  { slug: "laptop", name: "Laptop", icon: Laptop },
  { slug: "apple", name: "Apple", icon: AppleIcon },
  { slug: "smartphone", name: "Smart Phone", icon: Smartphone },
  { slug: "tablet", name: "Tablet", icon: Tablet },
  { slug: "pc-components", name: "PC Components", icon: Cpu },
  { slug: "monitor", name: "Monitor", icon: Monitor },
  { slug: "projector", name: "Projector", icon: Projector },
  { slug: "earbuds", name: "Earbuds", icon: Headphones },
  { slug: "drone", name: "Drone", icon: Compass },
  { slug: "headphone", name: "Headphone", icon: Headphones },
];

export default function PagesPanel() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="p-6 pb-2 flex justify-between items-center sticky top-0 bg-[#f9f9f9] z-10">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Pages</h2>
        <button className="p-1 rounded hover:bg-gray-200 text-gray-600 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 py-4 space-y-6 overflow-y-auto flex-1">
        
        {/* Main Navigation Section */}
        <div>
          <div className="flex justify-between items-center px-2 mb-3">
            <h3 className="text-sm font-bold text-gray-900">Main Navigation</h3>
            <div className="flex items-center gap-1 text-gray-900">
              <button className="p-1 hover:bg-gray-200 rounded"><Plus className="w-4 h-4" /></button>
              <button className="p-1 hover:bg-gray-200 rounded"><ChevronUp className="w-4 h-4" /></button>
            </div>
          </div>
          
          <ul className="space-y-1">
            {STORE_PAGES.map((page) => {
              const Icon = page.icon;
              return (
                <li 
                  key={page.slug} 
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('cms-navigate', { 
                      detail: { url: `/category/${page.slug}`, title: page.name } 
                    }));
                  }}
                  className="flex items-center gap-3 px-3 py-2 text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{page.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

      </div>
    </div>
  );
}
