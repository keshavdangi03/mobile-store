"use client";

import React, { useState } from 'react';
import { useCmsStore, SectionCustomization, defaultSectionCustomizations } from '@/lib/cms-store';
import {
  X,
  Sliders,
  Plus,
  Trash2,
  Sparkles,
  Wrench,
  GraduationCap,
  Store,
  Shield,
  Truck,
  Phone,
  Award,
  Zap,
  Star,
  Layers,
  Palette,
  Image as ImageIcon,
  Check,
  ChevronDown
} from 'lucide-react';

interface SectionCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId: string;
}

const AVAILABLE_ICONS: Record<string, React.ElementType> = {
  Wrench,
  GraduationCap,
  Store,
  Shield,
  Truck,
  Phone,
  Award,
  Zap,
  Sparkles,
  Star
};

export default function SectionCustomizerModal({
  isOpen,
  onClose,
  sectionId
}: SectionCustomizerModalProps) {
  const { sectionCustomizations, setSectionCustomization } = useCmsStore();
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'spacing'>('content');

  if (!isOpen) return null;

  const baseId = sectionId.split('-')[0];
  const defaults = defaultSectionCustomizations[baseId] || defaultSectionCustomizations[sectionId] || {};
  const currentConfig: SectionCustomization = {
    ...defaults,
    ...(sectionCustomizations[sectionId] || {})
  };

  const handleUpdate = (updates: Partial<SectionCustomization>) => {
    setSectionCustomization(sectionId, updates);
  };

  // Section Type Label
  const getSectionTypeLabel = () => {
    switch (baseId) {
      case 'hero_section':
      case 'hero':
        return 'Hero Carousel & Promo Banners';
      case 'services_section':
      case 'services':
        return 'Our Core Services';
      case 'promo_banner_section':
      case 'promo_banner':
        return 'EMI & Installment Promo Banner';
      case 'categories_section':
      case 'categories':
        return 'Shop By Categories';
      case 'new_arrivals_section':
      case 'new_arrivals':
        return 'New Arrivals Grid';
      case 'limited_deals_section':
      case 'limited_deals':
        return 'Limited Deals with Timer';
      case 'testimonials_section':
      case 'testimonials':
        return 'Customer Reviews & Testimonials';
      case 'blank_section':
      case 'custom_section':
        return 'Custom Block Section';
      default:
        return 'Section Customizer';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] font-sans animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-sm">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                  Customize Section
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                  {getSectionTypeLabel()}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Update texts, cards, buttons, background colors, and layouts
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

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 text-xs font-bold bg-white dark:bg-slate-900 px-6">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 px-4 transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'content'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Content & Text</span>
          </button>
          <button
            onClick={() => setActiveTab('theme')}
            className={`py-3 px-4 transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'theme'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Colors</span>
          </button>
          <button
            onClick={() => setActiveTab('spacing')}
            className={`py-3 px-4 transition-all flex items-center gap-1.5 border-b-2 cursor-pointer ${
              activeTab === 'spacing'
                ? 'border-primary text-primary font-black'
                : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Spacing & Padding</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">
          {/* ══════════════ TAB: CONTENT ══════════════ */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              
              {/* ── 1. HERO SECTION CONTENT ── */}
              {(baseId === 'hero_section' || baseId === 'hero') && (
                <div className="space-y-6">
                  {/* Slides Manager */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Carousel Slides ({(currentConfig.slides || []).length})
                      </label>
                      <button
                        onClick={() => {
                          const newSlide = {
                            id: `slide-${Date.now()}`,
                            title: 'New Featured Device',
                            subtitle: 'Official Warranty & Best Price',
                            image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
                            dealPrice: 'Rs. 99,999',
                            buttonText: 'Shop Now',
                            buttonLink: '/category/all',
                            specs: ['Brand Authorized Genuine', '1 Year Official Warranty', 'Free Doorstep Delivery']
                          };
                          handleUpdate({ slides: [...(currentConfig.slides || []), newSlide] });
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Slide
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(currentConfig.slides || []).map((slide, idx) => (
                        <div key={slide.id || idx} className="p-4 bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                            <span className="text-xs font-black text-primary uppercase tracking-wider">
                              Slide {idx + 1}
                            </span>
                            {(currentConfig.slides || []).length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = (currentConfig.slides || []).filter((_, i) => i !== idx);
                                  handleUpdate({ slides: updated });
                                }}
                                className="text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-xs flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Subtitle / Tag</label>
                              <input
                                type="text"
                                value={slide.subtitle || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.slides || [])];
                                  updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                  handleUpdate({ slides: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Main Title / Headline</label>
                              <input
                                type="text"
                                value={slide.title || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.slides || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  handleUpdate({ slides: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Price Display (e.g. Rs. 48,999)</label>
                              <input
                                type="text"
                                value={slide.dealPrice || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.slides || [])];
                                  updated[idx] = { ...updated[idx], dealPrice: e.target.value };
                                  handleUpdate({ slides: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Button Text & Link</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="Text"
                                  value={slide.buttonText || ''}
                                  onChange={(e) => {
                                    const updated = [...(currentConfig.slides || [])];
                                    updated[idx] = { ...updated[idx], buttonText: e.target.value };
                                    handleUpdate({ slides: updated });
                                  }}
                                  className="w-1/2 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                                />
                                <input
                                  type="text"
                                  placeholder="/link"
                                  value={slide.buttonLink || ''}
                                  onChange={(e) => {
                                    const updated = [...(currentConfig.slides || [])];
                                    updated[idx] = { ...updated[idx], buttonLink: e.target.value };
                                    handleUpdate({ slides: updated });
                                  }}
                                  className="w-1/2 p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="font-bold text-gray-500">Image Mockup URL</label>
                            <input
                              type="text"
                              value={slide.image || ''}
                              onChange={(e) => {
                                const updated = [...(currentConfig.slides || [])];
                                updated[idx] = { ...updated[idx], image: e.target.value };
                                handleUpdate({ slides: updated });
                              }}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Side Promo Banners */}
                  <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                    <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 block">
                      Right Side Promo Banners
                    </label>
                    {(currentConfig.sideBanners || []).map((banner, bIdx) => (
                      <div key={banner.id || bIdx} className="p-3.5 bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl space-y-2 text-xs">
                        <span className="font-bold text-primary">Side Promo Card {bIdx + 1}</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Card Title"
                            value={banner.title || ''}
                            onChange={(e) => {
                              const updated = [...(currentConfig.sideBanners || [])];
                              updated[bIdx] = { ...updated[bIdx], title: e.target.value };
                              handleUpdate({ sideBanners: updated });
                            }}
                            className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                          />
                          <input
                            type="text"
                            placeholder="Badge (e.g. EXCHANGE BONUS)"
                            value={banner.badge || ''}
                            onChange={(e) => {
                              const updated = [...(currentConfig.sideBanners || [])];
                              updated[bIdx] = { ...updated[bIdx], badge: e.target.value };
                              handleUpdate({ sideBanners: updated });
                            }}
                            className="p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                          />
                        </div>
                        <textarea
                          placeholder="Description"
                          rows={2}
                          value={banner.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...(currentConfig.sideBanners || [])];
                            updated[bIdx] = { ...updated[bIdx], subtitle: e.target.value };
                            handleUpdate({ sideBanners: updated });
                          }}
                          className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 2. SERVICES SECTION CONTENT ── */}
              {(baseId === 'services_section' || baseId === 'services') && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Section Title</label>
                      <input
                        type="text"
                        value={currentConfig.title || ''}
                        onChange={(e) => handleUpdate({ title: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Section Subtitle / Tag</label>
                      <input
                        type="text"
                        value={currentConfig.subtitle || ''}
                        onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Service Cards ({(currentConfig.services || []).length})
                      </label>
                      <button
                        onClick={() => {
                          const newService = {
                            id: `service-${Date.now()}`,
                            title: 'New Service Item',
                            description: 'High-quality certified mobile repair and electronic diagnostics.',
                            icon: 'Wrench',
                            linkText: 'Learn More →',
                            linkUrl: '/repair'
                          };
                          handleUpdate({ services: [...(currentConfig.services || []), newService] });
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Service Card
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(currentConfig.services || []).map((card, idx) => (
                        <div key={card.id || idx} className="p-4 bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl space-y-3 text-xs">
                          <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                            <span className="font-black text-primary uppercase">Card {idx + 1}</span>
                            {(currentConfig.services || []).length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = (currentConfig.services || []).filter((_, i) => i !== idx);
                                  handleUpdate({ services: updated });
                                }}
                                className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Card Heading</label>
                              <input
                                type="text"
                                value={card.title || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.services || [])];
                                  updated[idx] = { ...updated[idx], title: e.target.value };
                                  handleUpdate({ services: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Icon</label>
                              <select
                                value={card.icon || 'Wrench'}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.services || [])];
                                  updated[idx] = { ...updated[idx], icon: e.target.value };
                                  handleUpdate({ services: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              >
                                {Object.keys(AVAILABLE_ICONS).map(iconName => (
                                  <option key={iconName} value={iconName}>{iconName}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-500">Description Body</label>
                            <textarea
                              rows={2}
                              value={card.description || ''}
                              onChange={(e) => {
                                const updated = [...(currentConfig.services || [])];
                                updated[idx] = { ...updated[idx], description: e.target.value };
                                handleUpdate({ services: updated });
                              }}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">CTA Button Text</label>
                              <input
                                type="text"
                                value={card.linkText || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.services || [])];
                                  updated[idx] = { ...updated[idx], linkText: e.target.value };
                                  handleUpdate({ services: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">CTA Link URL</label>
                              <input
                                type="text"
                                value={card.linkUrl || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.services || [])];
                                  updated[idx] = { ...updated[idx], linkUrl: e.target.value };
                                  handleUpdate({ services: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3. PROMO BANNER SECTION CONTENT ── */}
              {(baseId === 'promo_banner_section' || baseId === 'promo_banner') && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Top Badge / Pill</label>
                    <input
                      type="text"
                      value={currentConfig.bannerBadge || ''}
                      onChange={(e) => handleUpdate({ bannerBadge: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Main Banner Headline</label>
                    <input
                      type="text"
                      value={currentConfig.bannerHeading || ''}
                      onChange={(e) => handleUpdate({ bannerHeading: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-black text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Description Sub-text</label>
                    <textarea
                      rows={2}
                      value={currentConfig.bannerDescription || ''}
                      onChange={(e) => handleUpdate({ bannerDescription: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Button Text</label>
                      <input
                        type="text"
                        value={currentConfig.bannerButtonText || ''}
                        onChange={(e) => handleUpdate({ bannerButtonText: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Button Link URL</label>
                      <input
                        type="text"
                        value={currentConfig.bannerButtonLink || ''}
                        onChange={(e) => handleUpdate({ bannerButtonLink: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 4. CATEGORIES SECTION CONTENT ── */}
              {(baseId === 'categories_section' || baseId === 'categories') && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Section Title</label>
                    <input
                      type="text"
                      value={currentConfig.categoriesTitle || currentConfig.title || ''}
                      onChange={(e) => handleUpdate({ categoriesTitle: e.target.value, title: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">View All Link Text</label>
                      <input
                        type="text"
                        value={currentConfig.categoriesViewAllText || ''}
                        onChange={(e) => handleUpdate({ categoriesViewAllText: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">View All Link URL</label>
                      <input
                        type="text"
                        value={currentConfig.categoriesViewAllLink || ''}
                        onChange={(e) => handleUpdate({ categoriesViewAllLink: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 5. NEW ARRIVALS SECTION CONTENT ── */}
              {(baseId === 'new_arrivals_section' || baseId === 'new_arrivals') && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Section Title</label>
                    <input
                      type="text"
                      value={currentConfig.arrivalsTitle || currentConfig.title || ''}
                      onChange={(e) => handleUpdate({ arrivalsTitle: e.target.value, title: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Maximum Products to Display</label>
                    <input
                      type="number"
                      min={2}
                      max={20}
                      value={currentConfig.arrivalsLimit || 5}
                      onChange={(e) => handleUpdate({ arrivalsLimit: parseInt(e.target.value) || 5 })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {/* ── 6. LIMITED DEALS SECTION CONTENT ── */}
              {(baseId === 'limited_deals_section' || baseId === 'limited_deals') && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Section Title</label>
                    <input
                      type="text"
                      value={currentConfig.dealsTitle || currentConfig.title || ''}
                      onChange={(e) => handleUpdate({ dealsTitle: e.target.value, title: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">Timer Label (e.g. ENDS IN)</label>
                      <input
                        type="text"
                        value={currentConfig.dealsBadgeText || 'ENDS IN'}
                        onChange={(e) => handleUpdate({ dealsBadgeText: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-gray-500">View Deals Link Text</label>
                      <input
                        type="text"
                        value={currentConfig.dealsLinkText || 'View All Hot Deals →'}
                        onChange={(e) => handleUpdate({ dealsLinkText: e.target.value })}
                        className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── 7. TESTIMONIALS SECTION CONTENT ── */}
              {(baseId === 'testimonials_section' || baseId === 'testimonials') && (
                <div className="space-y-5 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Section Heading</label>
                    <input
                      type="text"
                      value={currentConfig.testimonialsTitle || currentConfig.title || ''}
                      onChange={(e) => handleUpdate({ testimonialsTitle: e.target.value, title: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-black text-sm"
                    />
                  </div>

                  <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-gray-700 dark:text-gray-300">
                        Customer Reviews ({(currentConfig.testimonials || []).length})
                      </label>
                      <button
                        onClick={() => {
                          const newReview = {
                            id: `t-${Date.now()}`,
                            name: 'Customer Name',
                            role: 'Verified Buyer',
                            date: 'Just now',
                            stars: 5,
                            text: 'Outstanding store experience! Reliable warranty and quick delivery.',
                            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&fit=crop&q=80'
                          };
                          handleUpdate({ testimonials: [...(currentConfig.testimonials || []), newReview] });
                        }}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Review
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(currentConfig.testimonials || []).map((t, idx) => (
                        <div key={t.id || idx} className="p-4 bg-gray-50 dark:bg-slate-800/70 border border-gray-200 dark:border-slate-700 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-gray-200 dark:border-slate-700 pb-2">
                            <span className="font-bold text-primary">Review {idx + 1}</span>
                            {(currentConfig.testimonials || []).length > 1 && (
                              <button
                                onClick={() => {
                                  const updated = (currentConfig.testimonials || []).filter((_, i) => i !== idx);
                                  handleUpdate({ testimonials: updated });
                                }}
                                className="text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Remove
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Customer Name</label>
                              <input
                                type="text"
                                value={t.name || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.testimonials || [])];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  handleUpdate({ testimonials: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Date / Tag</label>
                              <input
                                type="text"
                                value={t.date || ''}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.testimonials || [])];
                                  updated[idx] = { ...updated[idx], date: e.target.value };
                                  handleUpdate({ testimonials: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="font-bold text-gray-500">Stars (1-5)</label>
                              <input
                                type="number"
                                min={1}
                                max={5}
                                value={t.stars || 5}
                                onChange={(e) => {
                                  const updated = [...(currentConfig.testimonials || [])];
                                  updated[idx] = { ...updated[idx], stars: parseInt(e.target.value) || 5 };
                                  handleUpdate({ testimonials: updated });
                                }}
                                className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-gray-500">Review Text</label>
                            <textarea
                              rows={2}
                              value={t.text || ''}
                              onChange={(e) => {
                                const updated = [...(currentConfig.testimonials || [])];
                                updated[idx] = { ...updated[idx], text: e.target.value };
                                handleUpdate({ testimonials: updated });
                              }}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Generic Fallback Header editing for any other custom section */}
              {baseId !== 'hero_section' && baseId !== 'hero' && baseId !== 'services_section' && baseId !== 'services' && baseId !== 'promo_banner_section' && baseId !== 'promo_banner' && baseId !== 'categories_section' && baseId !== 'categories' && baseId !== 'new_arrivals_section' && baseId !== 'new_arrivals' && baseId !== 'limited_deals_section' && baseId !== 'limited_deals' && baseId !== 'testimonials_section' && baseId !== 'testimonials' && (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Section Title</label>
                    <input
                      type="text"
                      value={currentConfig.title || ''}
                      onChange={(e) => handleUpdate({ title: e.target.value })}
                      placeholder="e.g. Special Deals & Announcements"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-500">Subtitle / Badge</label>
                    <input
                      type="text"
                      value={currentConfig.subtitle || ''}
                      onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                      placeholder="e.g. Authorized Official Warranty"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════ TAB: THEME & COLORS ══════════════ */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">
                  Background Color Palette
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {(['primary', 'dark', 'light', 'amber', 'purple', 'slate'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => handleUpdate({ theme: t })}
                      className={`p-3 rounded-2xl border text-xs font-bold capitalize flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        currentConfig.theme === t 
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary/20 shadow-sm' 
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${
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
            </div>
          )}

          {/* ══════════════ TAB: SPACING ══════════════ */}
          {activeTab === 'spacing' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span>Vertical Padding (Top & Bottom)</span>
                  <span className="text-primary font-black">{currentConfig.paddingY || 4} rem</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={currentConfig.paddingY || 4}
                  onChange={(e) => handleUpdate({ paddingY: parseFloat(e.target.value) })}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                  <span>Compact (1rem)</span>
                  <span>Normal (4rem)</span>
                  <span>Spacious (10rem)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60 flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" />
            Live Preview active • Changes auto-save
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-[#0d1e1c] font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
