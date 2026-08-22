"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCmsStore, CustomSectionConfig, CustomBlock, BlockType } from "@/lib/cms-store";
import BlockInserterModal from "@/components/block-inserter-modal";
import EditableImage from "@/components/editable-image";
import { 
  Sparkles, 
  Pencil, 
  Layout, 
  Palette, 
  ArrowRight, 
  Zap, 
  Shield, 
  Star, 
  Check, 
  X,
  Plus,
  Sliders,
  Image as ImageIcon,
  Video as VideoIcon,
  Type,
  LayoutGrid,
  Play,
  Upload,
  Link2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Copy,
  Settings2,
  Clock,
  HelpCircle,
  MessageSquareQuote,
  BarChart3,
  Mail,
  Minus,
  MoveVertical,
  ShoppingBag,
  ExternalLink,
  Wrench,
  Headphones,
  Maximize2
} from "lucide-react";

const THEME_STYLES = {
  primary: {
    bg: "bg-gradient-to-br from-[#edf7f6] to-[#e4f0ee] dark:from-[#112825] dark:to-[#17332f]",
    border: "border-primary/20",
    badge: "bg-primary/10 text-primary border-primary/20",
    textPrimary: "text-foreground",
    textMuted: "text-foreground/70",
    cta: "bg-primary hover:bg-primary-hover text-[#0d1e1c] font-black",
    secondaryCta: "border border-card-border bg-card-bg/60 text-foreground hover:bg-black/5",
    cardBg: "bg-card-bg/80 border-card-border",
    builderBox: "bg-white/80 dark:bg-slate-900/80 border-dashed border-primary/40",
  },
  dark: {
    bg: "bg-gradient-to-br from-slate-950 via-[#0a1e1b] to-slate-950 text-white",
    border: "border-card-border/20",
    badge: "bg-white/10 text-emerald-400 border-white/10",
    textPrimary: "text-white",
    textMuted: "text-slate-300",
    cta: "bg-primary hover:bg-primary-hover text-[#0d1e1c] font-black",
    secondaryCta: "border border-white/20 bg-white/5 text-white hover:bg-white/10",
    cardBg: "bg-slate-900/80 border-slate-800 text-white",
    builderBox: "bg-slate-900/90 border-dashed border-white/20",
  },
  light: {
    bg: "bg-card-bg border-card-border",
    border: "border-card-border",
    badge: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300",
    textPrimary: "text-foreground",
    textMuted: "text-foreground/70",
    cta: "bg-slate-900 dark:bg-white dark:text-black text-white hover:opacity-90 font-black",
    secondaryCta: "border border-card-border bg-transparent text-foreground hover:bg-black/5",
    cardBg: "bg-background border-card-border",
    builderBox: "bg-gray-50/90 dark:bg-slate-800/80 border-dashed border-gray-300 dark:border-gray-700",
  },
  amber: {
    bg: "bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-500/15 border-amber-500/20",
    border: "border-amber-500/30",
    badge: "bg-amber-500 text-black font-black border-amber-500",
    textPrimary: "text-foreground",
    textMuted: "text-foreground/75",
    cta: "bg-amber-500 hover:bg-amber-600 text-black font-black",
    secondaryCta: "border border-amber-500/30 bg-card-bg/60 text-foreground hover:bg-amber-500/10",
    cardBg: "bg-card-bg border-amber-500/20",
    builderBox: "bg-amber-500/5 border-dashed border-amber-500/40",
  },
  purple: {
    bg: "bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-purple-500/15 border-purple-500/20",
    border: "border-purple-500/30",
    badge: "bg-purple-600 text-white font-black border-purple-600",
    textPrimary: "text-foreground",
    textMuted: "text-foreground/75",
    cta: "bg-purple-600 hover:bg-purple-700 text-white font-black",
    secondaryCta: "border border-purple-500/30 bg-card-bg/60 text-foreground hover:bg-purple-500/10",
    cardBg: "bg-card-bg border-purple-500/20",
    builderBox: "bg-purple-500/5 border-dashed border-purple-500/40",
  },
  slate: {
    bg: "bg-gradient-to-br from-slate-900 to-slate-800 text-white",
    border: "border-slate-700",
    badge: "bg-primary text-black font-black border-primary",
    textPrimary: "text-white",
    textMuted: "text-slate-300",
    cta: "bg-primary hover:bg-primary-hover text-black font-black",
    secondaryCta: "border border-slate-600 bg-slate-800 text-white hover:bg-slate-700",
    cardBg: "bg-slate-800/90 border-slate-700 text-white",
    builderBox: "bg-slate-800/80 border-dashed border-slate-600",
  }
};

const CARD_ICONS: Record<string, React.ElementType> = {
  Zap,
  Shield,
  Star,
  Sparkles,
  Wrench,
  Headphones,
  ShoppingBag
};

export default function CustomBlankSection({ sectionId }: { sectionId: string }) {
  const isEditMode = useCmsStore((state) => state.isEditMode);
  const customSectionsData = useCmsStore((state) => state.customSectionsData);
  const setCustomSectionData = useCmsStore((state) => state.setCustomSectionData);
  const addBlockToSection = useCmsStore((state) => state.addBlockToSection);
  const updateBlockInSection = useCmsStore((state) => state.updateBlockInSection);
  const removeBlockFromSection = useCmsStore((state) => state.removeBlockFromSection);
  const moveBlock = useCmsStore((state) => state.moveBlock);
  const duplicateBlock = useCmsStore((state) => state.duplicateBlock);

  // Inserter modal state
  const [isInserterOpen, setIsInserterOpen] = useState(false);
  const [insertTargetIndex, setInsertTargetIndex] = useState<number | undefined>(undefined);

  // Section styling panel state
  const [isSectionSettingsOpen, setIsSectionSettingsOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'theme' | 'templates' | 'spacing'>('theme');

  // Currently focused block for popup settings
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const config: CustomSectionConfig = customSectionsData[sectionId] || {
    id: sectionId,
    layout: 'custom_blocks',
    badge: 'FEATURED',
    title: 'Custom Content Section',
    subtitle: '',
    body: '',
    ctaText: '',
    ctaLink: '',
    theme: 'primary',
    minHeight: 220,
    paddingY: 4,
    blocks: []
  };

  const currentTheme = THEME_STYLES[config.theme] || THEME_STYLES.primary;
  const blocks = config.blocks || [];

  // Helper to open block inserter at specific index
  const handleOpenInserter = (index?: number) => {
    setInsertTargetIndex(index);
    setIsInserterOpen(true);
  };

  // Helper for applying quick templates
  const applyTemplate = (templateName: string) => {
    let newBlocks: CustomBlock[] = [];
    if (templateName === 'hero_banner') {
      newBlocks = [
        {
          id: `block-heading-${Date.now()}-1`,
          type: 'heading',
          data: { text: 'Elevate Your Digital Lifestyle with Next-Gen Devices', badge: 'SPECIAL ANNOUNCEMENT', level: 'h1', alignment: 'center', size: 'text-4xl' }
        },
        {
          id: `block-paragraph-${Date.now()}-2`,
          type: 'paragraph',
          data: { text: 'Shop official brand laptops, flagship smartphones, and genuine accessories with authorized warranty and 0% EMI financing.', alignment: 'center', size: 'text-base' }
        },
        {
          id: `block-button-${Date.now()}-3`,
          type: 'button',
          data: { text: 'Shop Featured Deals Now', link: '/category/all', variant: 'primary', alignment: 'center' }
        },
        {
          id: `block-image-${Date.now()}-4`,
          type: 'image',
          data: { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80', caption: 'Official Brand Showroom Collection' }
        }
      ];
    } else if (templateName === 'three_cards') {
      newBlocks = [
        {
          id: `block-heading-${Date.now()}-1`,
          type: 'heading',
          data: { text: 'Why Thousands Trust Our Service', badge: 'EXPERIENCE & QUALITY', level: 'h2', alignment: 'center' }
        },
        {
          id: `block-cards-${Date.now()}-2`,
          type: 'cards',
          data: {
            items: [
              { id: '1', title: 'Certified Repair Lab', description: 'Class-100 cleanroom repair with certified technicians and 90-day warranty.', icon: 'Wrench', badge: 'LAB' },
              { id: '2', title: '100% Genuine Parts', description: 'Direct factory replacement parts for Apple, Samsung, Asus, Acer and HP.', icon: 'Shield', badge: 'ORIGINAL' },
              { id: '3', title: 'Express Same-Day Delivery', description: 'Doorstep pickup and return delivery across Kathmandu Valley within 24 hours.', icon: 'Zap', badge: 'FAST' }
            ]
          }
        }
      ];
    } else if (templateName === 'video_demo') {
      newBlocks = [
        {
          id: `block-heading-${Date.now()}-1`,
          type: 'heading',
          data: { text: 'Watch How We Masterclass Device Repairs', badge: 'VIDEO SHOWCASE', level: 'h2', alignment: 'center' }
        },
        {
          id: `block-video-${Date.now()}-2`,
          type: 'video',
          data: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Repair Facility Walkthrough' }
        },
        {
          id: `block-button-${Date.now()}-3`,
          type: 'button',
          data: { text: 'Book A Live Diagnostic Session', link: '/#services', variant: 'primary', alignment: 'center' }
        }
      ];
    } else if (templateName === 'flash_sale') {
      newBlocks = [
        {
          id: `block-countdown-${Date.now()}-1`,
          type: 'countdown',
          data: { title: 'Flash Deals Closing In:', targetDate: new Date(Date.now() + 86400000 * 2).toISOString(), badge: 'MEGA DISCOUNT' }
        },
        {
          id: `block-products-${Date.now()}-2`,
          type: 'products',
          data: {
            title: 'Limited Stock Hardware Deals',
            subtitle: 'Unbeatable prices on flagship laptops and accessories',
            items: [
              { id: '1', name: 'ROG Strix G16 Gaming Laptop', price: 'Rs. 189,999', originalPrice: 'Rs. 210,000', tag: '30% OFF', image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
              { id: '2', name: 'iPad Air M2 11-inch', price: 'Rs. 98,500', originalPrice: 'Rs. 108,000', tag: 'POPULAR', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
              { id: '3', name: 'iPhone 16 Pro Max 256GB', price: 'Rs. 209,999', originalPrice: 'Rs. 225,000', tag: 'BEST DEAL', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' }
            ]
          }
        }
      ];
    } else if (templateName === 'faq_accordion') {
      newBlocks = [
        {
          id: `block-heading-${Date.now()}-1`,
          type: 'heading',
          data: { text: 'Everything You Need To Know', badge: 'HELP & SUPPORT', level: 'h2', alignment: 'center' }
        },
        {
          id: `block-accordion-${Date.now()}-2`,
          type: 'accordion',
          data: {
            title: 'Store & Warranty Policies',
            items: [
              { id: '1', question: 'How long does a screen or battery replacement take?', answer: 'Standard mobile and laptop battery or screen replacements are completed within 45 to 90 minutes at our store.' },
              { id: '2', question: 'Do you provide EMI installment options without a credit card?', answer: 'We support partner bank EMI and financing plans with minimal paperwork and instant pre-approval.' },
              { id: '3', question: 'What is your warranty policy on brand-new gadgets?', answer: 'Every laptop and phone purchased from Expert Mobile Solution includes a minimum of 1-year official brand warranty.' }
            ]
          }
        }
      ];
    } else if (templateName === 'stats_proof') {
      newBlocks = [
        {
          id: `block-stats-${Date.now()}-1`,
          type: 'stats',
          data: {
            items: [
              { id: '1', value: '15,000+', label: 'Successful Repairs', icon: 'Wrench' },
              { id: '2', value: '99.4%', label: 'Customer Satisfaction', icon: 'Star' },
              { id: '3', value: '12+ Yrs', label: 'In Business', icon: 'Shield' },
              { id: '4', value: '500+', label: 'Technicians Trained', icon: 'Zap' }
            ]
          }
        },
        {
          id: `block-testimonials-${Date.now()}-2`,
          type: 'testimonials',
          data: {
            items: [
              { id: '1', name: 'Bibek Pokharel', role: 'Full Stack Engineer', quote: 'Saved my liquid damaged MacBook Pro when all other centers gave up. Truly expert level technicians!', rating: 5, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80' },
              { id: '2', name: 'Sushma Shrestha', role: 'Business Owner', quote: 'Ordered 5 laptops for our team with EMI and express delivery. Superb service and communication.', rating: 5, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80' }
            ]
          }
        }
      ];
    } else {
      // Empty canvas
      newBlocks = [];
    }

    setCustomSectionData(sectionId, {
      layout: 'custom_blocks',
      blocks: newBlocks
    });
    setIsSectionSettingsOpen(false);
  };

  return (
    <section 
      id={sectionId}
      className={`relative w-full transition-all duration-300 ${currentTheme.bg} ${
        isEditMode ? 'group/section border-2 border-dashed border-transparent hover:border-primary/40' : ''
      }`}
      style={{
        minHeight: `${config.minHeight}px`,
        paddingTop: `${config.paddingY || 4}rem`,
        paddingBottom: `${config.paddingY || 4}rem`
      }}
    >
      {/* ── Visual Editor Section Controls (Top Left) ── */}
      {isEditMode && (
        <div className="absolute top-3 left-3 z-[60] flex items-center gap-2">
          {/* Section Settings / Customization Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsSectionSettingsOpen(v => !v);
            }}
            className="bg-white/95 dark:bg-slate-900/95 hover:bg-white text-gray-800 dark:text-gray-100 px-3.5 py-1.5 rounded-xl shadow-xl border border-gray-200 dark:border-slate-700 flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-primary" />
            <span>Customize Section</span>
          </button>

          {/* Quick Add Block Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenInserter(blocks.length);
            }}
            className="bg-primary hover:bg-primary-hover text-[#0d1e1c] px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      )}

      {/* ── Section Settings Drawer / Modal ── */}
      {isSectionSettingsOpen && isEditMode && (
        <div 
          className="absolute top-14 left-3 z-[70] w-80 sm:w-96 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-2xl rounded-3xl overflow-hidden font-sans animate-in zoom-in-95 duration-150"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/60">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" />
              <span className="font-extrabold text-xs uppercase tracking-wider text-gray-900 dark:text-white">
                Section Customizer
              </span>
            </div>
            <button 
              onClick={() => setIsSectionSettingsOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900">
            <button 
              onClick={() => setActiveSettingsTab('theme')}
              className={`flex-1 py-2.5 text-center transition-all ${
                activeSettingsTab === 'theme' 
                  ? 'border-b-2 border-primary text-primary font-black' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Colors & Theme
            </button>
            <button 
              onClick={() => setActiveSettingsTab('templates')}
              className={`flex-1 py-2.5 text-center transition-all ${
                activeSettingsTab === 'templates' 
                  ? 'border-b-2 border-primary text-primary font-black' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Templates
            </button>
            <button 
              onClick={() => setActiveSettingsTab('spacing')}
              className={`flex-1 py-2.5 text-center transition-all ${
                activeSettingsTab === 'spacing' 
                  ? 'border-b-2 border-primary text-primary font-black' 
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
              }`}
            >
              Spacing
            </button>
          </div>

          <div className="p-5 max-h-[420px] overflow-y-auto space-y-4 bg-white dark:bg-slate-900">
            {/* Tab: Theme */}
            {activeSettingsTab === 'theme' && (
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                  Background Color Palette
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['primary', 'dark', 'light', 'amber', 'purple', 'slate'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setCustomSectionData(sectionId, { theme: t })}
                      className={`p-2.5 rounded-xl border text-xs font-bold capitalize flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        config.theme === t 
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20' 
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${
                        t === 'primary' ? 'bg-[#00AFA2]' :
                        t === 'dark' ? 'bg-black' :
                        t === 'light' ? 'bg-white border border-gray-300' :
                        t === 'amber' ? 'bg-amber-500' :
                        t === 'purple' ? 'bg-purple-600' : 'bg-slate-800'
                      }`} />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Templates */}
            {activeSettingsTab === 'templates' && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">
                  1-Click Layout Presets
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'hero_banner', title: '🚀 Hero Promotional Banner', desc: 'Heading + Text + CTA + Image' },
                    { id: 'three_cards', title: '📦 3-Feature Card Grid', desc: '3 benefit cards with custom icons' },
                    { id: 'video_demo', title: '🎥 Video Showcase', desc: 'Heading + Video Player + Button' },
                    { id: 'flash_sale', title: '⏱️ Flash Sale & Products', desc: 'Countdown clock + 3 product cards' },
                    { id: 'stats_proof', title: '⭐ Stats & Testimonials', desc: '4 metrics + 2 customer reviews' },
                    { id: 'faq_accordion', title: '❓ FAQ Accordion', desc: 'Expanding help and Q&A items' },
                    { id: 'blank', title: '📄 Blank Slate', desc: 'Start completely empty and add blocks' }
                  ].map(tmpl => (
                    <button
                      key={tmpl.id}
                      onClick={() => applyTemplate(tmpl.id)}
                      className="w-full text-left p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                    >
                      <div className="font-bold text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {tmpl.title}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {tmpl.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Spacing */}
            {activeSettingsTab === 'spacing' && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Vertical Padding</span>
                    <span>{config.paddingY || 4} rem</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={config.paddingY || 4}
                    onChange={e => setCustomSectionData(sectionId, { paddingY: parseFloat(e.target.value) })}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>Minimum Section Height</span>
                    <span>{config.minHeight} px</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="800"
                    step="50"
                    value={config.minHeight}
                    onChange={e => setCustomSectionData(sectionId, { minHeight: parseInt(e.target.value) })}
                    className="w-full accent-primary cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Main Section Content Container ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Render Blocks */}
        {blocks.length > 0 ? (
          <div className="space-y-6">
            {blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                {/* In-between Inserter (visible in edit mode) */}
                {isEditMode && (
                  <div className="relative flex items-center justify-center py-1 group/inserter">
                    <div className="h-px bg-transparent group-hover/inserter:bg-primary/30 w-full transition-colors" />
                    <button
                      onClick={() => handleOpenInserter(index)}
                      className="absolute opacity-0 group-hover/inserter:opacity-100 scale-90 group-hover/inserter:scale-100 bg-primary hover:bg-primary-hover text-[#0d1e1c] px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md transition-all cursor-pointer z-20"
                    >
                      <Plus className="w-3 h-3" /> Insert Block Here
                    </button>
                  </div>
                )}

                {/* Individual Block Wrapper with Action Bar */}
                <div className={`relative group/block transition-all rounded-2xl ${
                  isEditMode ? 'hover:ring-2 hover:ring-primary/40 hover:bg-black/5 dark:hover:bg-white/5 p-2 -m-2' : ''
                }`}>
                  {/* Block Hover Toolbar */}
                  {isEditMode && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover/block:opacity-100 transition-opacity flex items-center gap-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-xl rounded-xl p-1 z-30">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 px-2 select-none border-r border-gray-100 dark:border-slate-800">
                        {block.type}
                      </span>
                      <button
                        onClick={() => moveBlock(sectionId, block.id, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveBlock(sectionId, block.id, 'down')}
                        disabled={index === blocks.length - 1}
                        title="Move Down"
                        className="p-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => duplicateBlock(sectionId, block.id)}
                        title="Duplicate Block"
                        className="p-1 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => removeBlockFromSection(sectionId, block.id)}
                        title="Delete Block"
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Block Content Component Renderer */}
                  <BlockContentRenderer
                    block={block}
                    sectionId={sectionId}
                    isEditMode={isEditMode}
                    themeStyles={currentTheme}
                    onUpdate={data => updateBlockInSection(sectionId, block.id, data)}
                  />
                </div>
              </React.Fragment>
            ))}

            {/* Bottom Inserter Button */}
            {isEditMode && (
              <div className="pt-4 flex justify-center">
                <button
                  onClick={() => handleOpenInserter(blocks.length)}
                  className="bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-200 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-primary px-6 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-primary" />
                  <span>+ Add Another Block</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Empty Canvas / Start Builder State ── */
          <div className="py-12 px-6 rounded-3xl border-2 border-dashed border-gray-300 dark:border-slate-700 text-center space-y-6 max-w-2xl mx-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-md">
              <Plus className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                Content Block Canvas
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This section is currently empty. Add any block from the library or choose a 1-click preset.
              </p>
            </div>

            {isEditMode ? (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenInserter(0)}
                  className="bg-primary hover:bg-primary-hover text-[#0d1e1c] px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-primary/20 transition-all cursor-pointer hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>Browse Block Library</span>
                </button>
                <button
                  onClick={() => applyTemplate('hero_banner')}
                  className="bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700 px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Load Hero Template</span>
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* ── Block Inserter Modal ── */}
      <BlockInserterModal
        isOpen={isInserterOpen}
        onClose={() => setIsInserterOpen(false)}
        onSelectBlock={blockType => {
          addBlockToSection(sectionId, blockType, insertTargetIndex);
        }}
      />
    </section>
  );
}

// ─── Sub-Component: Dynamic Block Content Renderer ───────────────────────────
function BlockContentRenderer({
  block,
  sectionId,
  isEditMode,
  themeStyles,
  onUpdate
}: {
  block: CustomBlock;
  sectionId: string;
  isEditMode: boolean;
  themeStyles: any;
  onUpdate: (data: Record<string, any>) => void;
}) {
  const data = block.data || {};

  // 1. Heading Block
  if (block.type === 'heading') {
    const alignClass = data.alignment === 'left' ? 'text-left' : data.alignment === 'right' ? 'text-right' : 'text-center';
    return (
      <div className={`space-y-2.5 ${alignClass}`}>
        {data.badge && (
          <div>
            {isEditMode ? (
              <input
                type="text"
                value={data.badge}
                onChange={e => onUpdate({ badge: e.target.value })}
                className="inline-block text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 outline-none focus:ring-1 focus:ring-primary max-w-xs text-center"
              />
            ) : (
              <span className="inline-block text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                {data.badge}
              </span>
            )}
          </div>
        )}

        {isEditMode ? (
          <textarea
            value={data.text || ''}
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="Type your heading..."
            rows={2}
            className={`w-full bg-transparent font-black tracking-tight ${data.size || 'text-3xl sm:text-4xl'} ${themeStyles.textPrimary} border-b border-dashed border-gray-300 dark:border-slate-700 outline-none focus:border-primary resize-none ${alignClass}`}
          />
        ) : (
          <h2 className={`font-black tracking-tight ${data.size || 'text-3xl sm:text-4xl'} ${themeStyles.textPrimary} leading-tight`}>
            {data.text}
          </h2>
        )}
      </div>
    );
  }

  // 2. Paragraph Block
  if (block.type === 'paragraph') {
    const alignClass = data.alignment === 'left' ? 'text-left' : data.alignment === 'right' ? 'text-right' : 'text-center mx-auto';
    return (
      <div className={`space-y-2 ${data.maxWidth || 'max-w-3xl'} ${alignClass}`}>
        {isEditMode ? (
          <textarea
            value={data.text || ''}
            onChange={e => onUpdate({ text: e.target.value })}
            placeholder="Type narrative text or description..."
            rows={3}
            className={`w-full bg-transparent font-normal ${data.size || 'text-base'} ${themeStyles.textMuted} border-b border-dashed border-gray-300 dark:border-slate-700 outline-none focus:border-primary resize-none ${alignClass}`}
          />
        ) : (
          <p className={`${data.size || 'text-base'} ${themeStyles.textMuted} leading-relaxed`}>
            {data.text}
          </p>
        )}
      </div>
    );
  }

  // 3. Action Button Block
  if (block.type === 'button') {
    const alignClass = data.alignment === 'left' ? 'justify-start' : data.alignment === 'right' ? 'justify-end' : 'justify-center';
    return (
      <div className={`flex items-center gap-3 ${alignClass} py-2`}>
        {isEditMode ? (
          <div className="flex flex-wrap items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
            <input
              type="text"
              value={data.text || ''}
              onChange={e => onUpdate({ text: e.target.value })}
              placeholder="Button Label"
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-transparent text-foreground outline-none focus:border-primary"
            />
            <input
              type="text"
              value={data.link || ''}
              onChange={e => onUpdate({ link: e.target.value })}
              placeholder="/category/all or https://"
              className="text-xs px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-transparent text-foreground outline-none focus:border-primary"
            />
            <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider ${themeStyles.cta}`}>
              Preview: {data.text || 'Click Here'} &rarr;
            </span>
          </div>
        ) : (
          <Link
            href={data.link || '/category/all'}
            className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg transition-all hover:scale-105 ${themeStyles.cta}`}
          >
            <span>{data.text || 'Explore Deals'}</span>
            {data.showArrow !== false && <ArrowRight className="w-4 h-4" />}
          </Link>
        )}
      </div>
    );
  }

  // 4. Image Block
  if (block.type === 'image') {
    return (
      <div className="space-y-2 py-2">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-card-border max-h-[460px] relative group/img">
          <EditableImage
            imageId={`custom-block-img-${block.id}`}
            defaultSrc={data.url || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1000&q=80'}
            alt={data.alt || 'Section Image'}
            className="w-full h-auto object-cover max-h-[460px]"
          />
        </div>
        {isEditMode ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={data.caption || ''}
              onChange={e => onUpdate({ caption: e.target.value })}
              placeholder="Add image caption..."
              className="w-full text-xs text-center bg-transparent border-b border-dashed border-gray-300 dark:border-slate-700 text-gray-500 outline-none focus:border-primary py-1"
            />
          </div>
        ) : (
          data.caption && (
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 italic">
              {data.caption}
            </p>
          )
        )}
      </div>
    );
  }

  // 5. Video Player Block
  if (block.type === 'video') {
    return (
      <div className="space-y-3 py-2">
        <div className="rounded-3xl overflow-hidden shadow-2xl border border-card-border bg-black max-h-[480px]">
          {data.url && (data.url.includes('youtube.com') || data.url.includes('youtu.be')) ? (
            <iframe
              src={data.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
              className="w-full aspect-video min-h-[300px]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : data.url && data.url.includes('vimeo.com') ? (
            <iframe
              src={`https://player.vimeo.com/video/${data.url.split('/').pop()}`}
              className="w-full aspect-video min-h-[300px]"
              allowFullScreen
            />
          ) : (
            <video
              src={data.url || 'https://www.w3schools.com/html/mov_bbb.mp4'}
              controls={data.controls !== false}
              autoPlay={data.autoplay || false}
              loop={data.loop || false}
              className="w-full aspect-video max-h-[480px] object-cover"
            />
          )}
        </div>
        {isEditMode && (
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-2xl border border-gray-200 dark:border-slate-700">
            <VideoIcon className="w-4 h-4 text-primary" />
            <input
              type="text"
              value={data.url || ''}
              onChange={e => onUpdate({ url: e.target.value })}
              placeholder="Paste direct MP4, YouTube, or Vimeo video URL..."
              className="flex-1 text-xs bg-transparent text-foreground outline-none"
            />
          </div>
        )}
      </div>
    );
  }

  // 6. 2-Column Split Block
  if (block.type === 'columns') {
    const cols = data.columns || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-3">
        {cols.map((col: any, idx: number) => (
          <div 
            key={col.id || idx}
            className="p-6 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-card-border shadow-lg space-y-3"
          >
            {isEditMode ? (
              <>
                <input
                  type="text"
                  value={col.title || ''}
                  onChange={e => {
                    const newCols = [...cols];
                    newCols[idx] = { ...newCols[idx], title: e.target.value };
                    onUpdate({ columns: newCols });
                  }}
                  placeholder="Column Title"
                  className="w-full text-lg font-black text-foreground bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none"
                />
                <textarea
                  value={col.description || ''}
                  onChange={e => {
                    const newCols = [...cols];
                    newCols[idx] = { ...newCols[idx], description: e.target.value };
                    onUpdate({ columns: newCols });
                  }}
                  placeholder="Column Description"
                  rows={2}
                  className="w-full text-xs text-foreground/70 bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none resize-none"
                />
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={col.linkText || ''}
                    onChange={e => {
                      const newCols = [...cols];
                      newCols[idx] = { ...newCols[idx], linkText: e.target.value };
                      onUpdate({ columns: newCols });
                    }}
                    placeholder="Action Text"
                    className="text-xs font-bold text-primary bg-transparent outline-none"
                  />
                  <input
                    type="text"
                    value={col.linkUrl || ''}
                    onChange={e => {
                      const newCols = [...cols];
                      newCols[idx] = { ...newCols[idx], linkUrl: e.target.value };
                      onUpdate({ columns: newCols });
                    }}
                    placeholder="Link URL"
                    className="text-xs text-foreground/60 bg-transparent outline-none flex-1"
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-black text-foreground">{col.title}</h3>
                <p className="text-xs text-foreground/70 leading-relaxed">{col.description}</p>
                {col.linkText && (
                  <Link href={col.linkUrl || '/'} className="inline-flex items-center gap-1.5 text-xs font-black text-primary hover:underline">
                    <span>{col.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 7. Cards Grid Block
  if (block.type === 'cards') {
    const items = data.items || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-3">
        {items.map((card: any, idx: number) => {
          const IconComp = CARD_ICONS[card.icon] || Sparkles;
          return (
            <div
              key={card.id || idx}
              className={`p-5 rounded-3xl transition-all ${themeStyles.cardBg} border shadow-md space-y-3`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-sm">
                  <IconComp className="w-5 h-5" />
                </div>
                {card.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {card.badge}
                  </span>
                )}
              </div>

              {isEditMode ? (
                <>
                  <input
                    type="text"
                    value={card.title || ''}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx] = { ...newItems[idx], title: e.target.value };
                      onUpdate({ items: newItems });
                    }}
                    placeholder="Card Title"
                    className="w-full font-bold text-sm text-foreground bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none"
                  />
                  <textarea
                    value={card.description || ''}
                    onChange={e => {
                      const newItems = [...items];
                      newItems[idx] = { ...newItems[idx], description: e.target.value };
                      onUpdate({ items: newItems });
                    }}
                    placeholder="Card Description"
                    rows={2}
                    className="w-full text-xs text-foreground/70 bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none resize-none"
                  />
                </>
              ) : (
                <>
                  <h4 className="font-bold text-sm text-foreground">{card.title}</h4>
                  <p className="text-xs text-foreground/70 leading-relaxed">{card.description}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // 8. Feature Bullet Checklist Block
  if (block.type === 'features') {
    const items = data.items || [];
    return (
      <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 border border-card-border space-y-4">
        {data.title && (
          <h3 className="font-black text-base text-foreground">{data.title}</h3>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((item: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {isEditMode ? (
                <input
                  type="text"
                  value={item}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx] = e.target.value;
                    onUpdate({ items: newItems });
                  }}
                  className="w-full bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none"
                />
              ) : (
                <span>{item}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 9. Testimonials Block
  if (block.type === 'testimonials') {
    const items = data.items || [];
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-3">
        {items.map((rev: any, idx: number) => (
          <div key={rev.id || idx} className="p-6 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-card-border shadow-lg space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(rev.rating || 5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            {isEditMode ? (
              <textarea
                value={rev.quote || ''}
                onChange={e => {
                  const newItems = [...items];
                  newItems[idx] = { ...newItems[idx], quote: e.target.value };
                  onUpdate({ items: newItems });
                }}
                rows={2}
                className="w-full text-xs italic text-foreground bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none resize-none"
              />
            ) : (
              <p className="text-xs italic text-foreground leading-relaxed">&ldquo;{rev.quote}&rdquo;</p>
            )}
            <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-slate-700/60">
              <img src={rev.avatar} alt={rev.name} className="w-9 h-9 rounded-full object-cover border border-card-border" />
              <div>
                <h5 className="font-bold text-xs text-foreground">{rev.name}</h5>
                <p className="text-[11px] text-gray-500">{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 10. FAQ Accordion Block
  if (block.type === 'accordion') {
    const items = data.items || [];
    return (
      <div className="space-y-3 py-3 max-w-3xl mx-auto">
        {items.map((faq: any, idx: number) => (
          <details key={faq.id || idx} className="group p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-card-border shadow-sm">
            <summary className="font-bold text-xs sm:text-sm text-foreground flex items-center justify-between cursor-pointer select-none">
              {isEditMode ? (
                <input
                  type="text"
                  value={faq.question || ''}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], question: e.target.value };
                    onUpdate({ items: newItems });
                  }}
                  className="w-full bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none font-bold"
                />
              ) : (
                <span>{faq.question}</span>
              )}
              <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2" />
            </summary>
            <div className="pt-2 text-xs text-foreground/75 leading-relaxed">
              {isEditMode ? (
                <textarea
                  value={faq.answer || ''}
                  onChange={e => {
                    const newItems = [...items];
                    newItems[idx] = { ...newItems[idx], answer: e.target.value };
                    onUpdate({ items: newItems });
                  }}
                  rows={2}
                  className="w-full bg-transparent border-b border-dashed border-gray-300 dark:border-slate-600 outline-none resize-none pt-1"
                />
              ) : (
                <p>{faq.answer}</p>
              )}
            </div>
          </details>
        ))}
      </div>
    );
  }

  // 11. Countdown Timer Block
  if (block.type === 'countdown') {
    return (
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border border-red-500/30 text-center space-y-4 max-w-xl mx-auto shadow-xl">
        {data.badge && (
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-500 text-white shadow-sm inline-block">
            {data.badge}
          </span>
        )}
        <h3 className="text-base sm:text-lg font-black text-foreground">{data.title || 'Flash Offer Ending Soon:'}</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: 'DAYS', val: '02' },
            { label: 'HOURS', val: '14' },
            { label: 'MINUTES', val: '48' },
            { label: 'SECONDS', val: '32' }
          ].map((t, i) => (
            <div key={i} className="p-2.5 bg-white dark:bg-slate-900 rounded-2xl border border-card-border shadow-sm">
              <span className="font-black text-lg sm:text-2xl text-foreground block">{t.val}</span>
              <span className="text-[9px] font-bold text-gray-500 uppercase">{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 12. Stats & Counter Block
  if (block.type === 'stats') {
    const items = data.items || [];
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3">
        {items.map((st: any, idx: number) => {
          const IconComp = CARD_ICONS[st.icon] || BarChart3;
          return (
            <div key={st.id || idx} className="p-5 rounded-3xl bg-white/70 dark:bg-slate-800/70 border border-card-border shadow-md text-center space-y-1">
              <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <IconComp className="w-4 h-4" />
              </div>
              <div className="font-black text-xl sm:text-2xl text-foreground">{st.value}</div>
              <div className="text-[11px] font-bold text-foreground/60">{st.label}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // 13. Newsletter Signup Block
  if (block.type === 'newsletter') {
    return (
      <div className="p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center space-y-4 max-w-xl mx-auto shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mx-auto shadow-md">
          <Mail className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-foreground">{data.title || 'Join Our VIP Store Club'}</h3>
          <p className="text-xs text-foreground/70">{data.subtitle || 'Get exclusive coupons and instant flash sale notifications.'}</p>
        </div>
        <div className="flex items-center gap-2 max-w-md mx-auto bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-card-border shadow-sm">
          <input
            type="email"
            placeholder={data.placeholder || 'Enter your email...'}
            className="flex-1 px-3 py-2 text-xs bg-transparent outline-none text-foreground"
          />
          <button className="bg-primary hover:bg-primary-hover text-[#0d1e1c] font-black text-xs px-4 py-2 rounded-xl transition-all cursor-pointer">
            {data.buttonText || 'Subscribe'}
          </button>
        </div>
      </div>
    );
  }

  // 14. Product Showcase Block
  if (block.type === 'products') {
    const items = data.items || [];
    return (
      <div className="space-y-4 py-3">
        {(data.title || isEditMode) && (
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-foreground">{data.title || 'Store Products'}</h3>
            <p className="text-xs text-foreground/70">{data.subtitle || 'High performance devices with manufacturer seals'}</p>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {items.map((prod: any, idx: number) => (
            <div key={prod.id || idx} className="rounded-3xl overflow-hidden bg-white dark:bg-slate-800 border border-card-border shadow-lg flex flex-col group/p">
              <div className="h-44 relative bg-gray-100 dark:bg-slate-900 overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover/p:scale-105 transition-transform duration-300" />
                {prod.tag && (
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-primary text-white shadow-md">
                    {prod.tag}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-foreground line-clamp-1">{prod.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-black text-sm text-primary">{prod.price}</span>
                    {prod.originalPrice && <span className="text-xs text-gray-400 line-through">{prod.originalPrice}</span>}
                  </div>
                </div>
                <Link href="/category/all" className="w-full py-2 bg-primary hover:bg-primary-hover text-[#0d1e1c] rounded-xl text-xs font-black text-center transition-all block">
                  Buy Now &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 15. Divider Block
  if (block.type === 'divider') {
    return (
      <div className="py-4">
        <div className={`h-px w-full ${data.color || 'bg-card-border'}`} />
      </div>
    );
  }

  // 16. Spacer Block
  if (block.type === 'spacer') {
    return (
      <div style={{ height: `${data.height || 32}px` }} className="w-full flex items-center justify-center">
        {isEditMode && <span className="text-[10px] text-gray-400 border border-dashed border-gray-300 dark:border-slate-700 px-2 py-0.5 rounded select-none">Spacer: {data.height || 32}px</span>}
      </div>
    );
  }

  return (
    <div className="p-4 text-center text-xs text-gray-400 border border-dashed rounded-xl">
      Custom Block ({block.type})
    </div>
  );
}
