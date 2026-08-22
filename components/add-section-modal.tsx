"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCmsStore } from '@/lib/cms-store';
import { 
  X, 
  LayoutTemplate, 
  Grid, 
  Wrench, 
  Sparkles, 
  Clock, 
  MessageSquare, 
  PlusCircle, 
  Flame,
  Check
} from 'lucide-react';

export default function AddSectionModal({
  isOpen,
  onClose,
  afterId
}: {
  isOpen: boolean;
  onClose: () => void;
  afterId: string | null;
}) {
  const currentRoute = useCmsStore((state) => state.currentRoute);
  const addSection = useCmsStore((state) => state.addSection);
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const sections = [
    { 
      id: 'blank_section', 
      name: 'Blank Custom Section', 
      desc: 'Clean responsive canvas with customizable headline, banner & cards',
      icon: PlusCircle,
      badge: 'RECOMMENDED',
      highlight: true
    },
    { 
      id: 'hero_section', 
      name: 'Hero Carousel', 
      desc: 'Interactive device slider with side promo cards',
      icon: LayoutTemplate 
    },
    { 
      id: 'categories_section', 
      name: 'Categories Grid', 
      desc: 'Round thumbnail grid of all product categories',
      icon: Grid 
    },
    { 
      id: 'new_arrivals_section', 
      name: 'New Arrivals Tabs', 
      desc: 'Filterable product tabs by device category',
      icon: Flame 
    },
    { 
      id: 'services_section', 
      name: 'Services List', 
      desc: '3-card grid for repair, academy & seller hub',
      icon: Wrench 
    },
    { 
      id: 'promo_banner_section', 
      name: 'EMI Promo Banner', 
      desc: 'High-contrast installment & financing banner',
      icon: Sparkles 
    },
    { 
      id: 'limited_deals_section', 
      name: 'Limited Deals with Timer', 
      desc: 'Flash sale cards with live countdown clock',
      icon: Clock 
    },
    { 
      id: 'testimonials_section', 
      name: 'Customer Reviews', 
      desc: 'Testimonials carousel with star ratings',
      icon: MessageSquare 
    }
  ];

  const handleSelect = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(sectionId);
    
    // Resolve exact route of the current page
    let targetRoute = "/";
    if (typeof window !== "undefined" && window.location && window.location.pathname) {
      const p = window.location.pathname;
      targetRoute = p.startsWith("/admin/cms") ? "/" : p;
    } else if (currentRoute) {
      targetRoute = currentRoute.startsWith("/admin/cms") ? "/" : currentRoute;
    }

    // Add section directly into the store
    const newId = addSection(targetRoute, afterId, sectionId);

    // Notify parent CMS frame of unsaved changes
    if (typeof window !== 'undefined') {
      window.parent?.postMessage({ type: 'CMS_UNSAVED_CHANGES', newSectionId: newId }, '*');
      window.dispatchEvent(new CustomEvent('cms-section-added', { detail: { sectionId, targetRoute, newId } }));
    }

    setTimeout(() => {
      setSelectedId(null);
      onClose();
    }, 120);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <div 
        className="bg-white dark:bg-slate-900 border border-card-border rounded-3xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 text-foreground"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-card-border flex justify-between items-center bg-gray-50/70 dark:bg-slate-800/40">
          <div>
            <h3 className="font-extrabold text-lg tracking-tight">Add New Section Below</h3>
            <p className="text-xs text-foreground/60">Choose a section type to insert immediately into your page</p>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }} 
            className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-foreground/60 hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Grid */}
        <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {sections.map((section) => {
            const Icon = section.icon;
            const isSelected = selectedId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={(e) => handleSelect(e, section.id)}
                className={`flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-all group cursor-pointer active:scale-98 ${
                  isSelected
                    ? 'border-primary bg-primary/15 ring-2 ring-primary'
                    : section.highlight 
                      ? 'border-primary/60 bg-primary/5 hover:bg-primary/10 shadow-sm' 
                      : 'border-card-border hover:border-foreground/30 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                  section.highlight ? 'bg-primary text-[#0d1e1c]' : 'bg-background border border-card-border text-foreground/70'
                }`}>
                  {isSelected ? <Check className="w-5 h-5 text-primary animate-bounce" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold leading-tight group-hover:text-primary transition-colors">
                      {section.name}
                    </span>
                    {section.badge && (
                      <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-primary text-[#0d1e1c] rounded-md tracking-wider">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-foreground/60 leading-normal line-clamp-2">
                    {section.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
