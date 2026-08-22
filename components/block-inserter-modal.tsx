"use client";

import React, { useState } from "react";
import { BlockType } from "@/lib/cms-store";
import {
  Type,
  AlignLeft,
  Image as ImageIcon,
  Video,
  MousePointerClick,
  Columns2,
  LayoutGrid,
  CheckCircle2,
  MessageSquareQuote,
  HelpCircle,
  Timer,
  BarChart3,
  Mail,
  Minus,
  MoveVertical,
  ShoppingBag,
  X,
  Search,
  Plus
} from "lucide-react";

interface BlockDefinition {
  type: BlockType;
  title: string;
  category: 'essential' | 'media' | 'layout' | 'marketing' | 'commerce';
  description: string;
  icon: React.ElementType;
  badge?: string;
}

const ALL_BLOCKS: BlockDefinition[] = [
  // ── Essential
  {
    type: 'heading',
    title: 'Heading',
    category: 'essential',
    description: 'Attention-grabbing headlines with customizable H1-H4 size and alignment.',
    icon: Type,
    badge: 'Popular'
  },
  {
    type: 'paragraph',
    title: 'Text / Paragraph',
    category: 'essential',
    description: 'Rich narrative text for descriptions, announcements, and store stories.',
    icon: AlignLeft
  },
  {
    type: 'button',
    title: 'Action Button',
    category: 'essential',
    description: 'Call-to-action button linking directly to categories, products, or deals.',
    icon: MousePointerClick
  },
  {
    type: 'divider',
    title: 'Divider Line',
    category: 'essential',
    description: 'Sleek horizontal line separator to structure content cleanly.',
    icon: Minus
  },
  {
    type: 'spacer',
    title: 'Spacer / Whitespace',
    category: 'essential',
    description: 'Adjustable vertical spacing block between elements.',
    icon: MoveVertical
  },

  // ── Media
  {
    type: 'image',
    title: 'Photo Banner / Image',
    category: 'media',
    description: 'High-res image banner with live upload, rounded corners, and captions.',
    icon: ImageIcon,
    badge: 'Media'
  },
  {
    type: 'video',
    title: 'Video Player',
    category: 'media',
    description: 'Responsive video player supporting MP4 direct URLs, YouTube & Vimeo.',
    icon: Video,
    badge: 'Media'
  },

  // ── Layout
  {
    type: 'columns',
    title: '2-Column Split',
    category: 'layout',
    description: 'Side-by-side split layout with independent editable content in each column.',
    icon: Columns2
  },
  {
    type: 'cards',
    title: 'Feature Card Grid',
    category: 'layout',
    description: '3-card responsive grid highlighting key benefits or services.',
    icon: LayoutGrid,
    badge: 'Grid'
  },
  {
    type: 'features',
    title: 'Feature Checklist',
    category: 'layout',
    description: 'Bullet list with verified icons highlighting guarantees or specifications.',
    icon: CheckCircle2
  },

  // ── Marketing
  {
    type: 'countdown',
    title: 'Countdown Timer',
    category: 'marketing',
    description: 'Live ticking countdown clock for flash discounts and limited-time sales.',
    icon: Timer,
    badge: 'Sales'
  },
  {
    type: 'stats',
    title: 'Stats & Counters',
    category: 'marketing',
    description: 'Numerical counters showcasing trusted metrics like repairs and ratings.',
    icon: BarChart3
  },
  {
    type: 'newsletter',
    title: 'Newsletter Signup',
    category: 'marketing',
    description: 'Email capture form for promotions, discounts, and tech newsletter.',
    icon: Mail
  },

  // ── Commerce & Trust
  {
    type: 'products',
    title: 'Product Showcase',
    category: 'commerce',
    description: 'Curated product cards with live prices, tags, and buy buttons.',
    icon: ShoppingBag,
    badge: 'Shop'
  },
  {
    type: 'testimonials',
    title: 'Customer Reviews',
    category: 'commerce',
    description: '5-star testimonial cards with customer quotes and avatars.',
    icon: MessageSquareQuote
  },
  {
    type: 'accordion',
    title: 'FAQ Accordion',
    category: 'commerce',
    description: 'Interactive expanding question & answer list for help and FAQs.',
    icon: HelpCircle
  }
];

interface BlockInserterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBlock: (type: BlockType) => void;
  targetIndex?: number;
}

export default function BlockInserterModal({
  isOpen,
  onClose,
  onSelectBlock,
  targetIndex
}: BlockInserterModalProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Blocks' },
    { id: 'essential', label: 'Essential' },
    { id: 'media', label: 'Media' },
    { id: 'layout', label: 'Layout' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'commerce', label: 'Commerce & Trust' }
  ];

  const filteredBlocks = ALL_BLOCKS.filter(block => {
    const matchesCategory = activeCategory === 'all' || block.category === activeCategory;
    const matchesSearch = 
      block.title.toLowerCase().includes(search.toLowerCase()) || 
      block.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-md">
              +
            </div>
            <div>
              <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                Block Library
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Choose any block to insert into this section
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blocks (e.g. heading, video, countdown, products)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
              autoFocus
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Block Grid */}
        <div className="p-6 overflow-y-auto max-h-[55vh] grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/30 dark:bg-slate-900/30">
          {filteredBlocks.map(block => {
            const Icon = block.icon;
            return (
              <div
                key={block.type}
                onClick={() => {
                  onSelectBlock(block.type);
                  onClose();
                }}
                className="group flex items-start gap-3.5 p-3.5 bg-white dark:bg-slate-800/80 hover:bg-primary/5 dark:hover:bg-primary/10 border border-gray-200 dark:border-slate-700 hover:border-primary/40 rounded-2xl cursor-pointer transition-all duration-150 hover:shadow-md relative overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-700 group-hover:bg-primary group-hover:text-white text-gray-700 dark:text-gray-200 flex items-center justify-center flex-shrink-0 transition-colors shadow-sm">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-primary transition-colors truncate">
                      {block.title}
                    </h4>
                    {block.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                        {block.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {block.description}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity self-center">
                  <span className="p-1 rounded-lg bg-primary text-white flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}

          {filteredBlocks.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400">
              <p className="text-sm font-medium">No blocks found matching &quot;{search}&quot;</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('all'); }}
                className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{filteredBlocks.length} block types available</span>
          <span className="font-medium text-primary">Click any block to insert instantly</span>
        </div>
      </div>
    </div>
  );
}
