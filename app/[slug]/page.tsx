"use client";

import React, { useEffect, useState } from "react";
import { useCmsStore, CustomSectionConfig } from "@/lib/cms-store";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FileText, Home, AlertTriangle, Sparkles, Check, ArrowRight, Shield, Zap, Star } from "lucide-react";
import SectionEditorWrapper from "@/components/section-editor-wrapper";
import CustomBlankSection from "@/components/custom-blank-section";

export default function DynamicRootPage() {
  const params = useParams();
  const rawSlug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const slug = rawSlug.replace(/^\//, '').replace(/^p\//, '');
  
  const { 
    customPages, 
    sectionsByRoute, 
    setCurrentRoute, 
    isEditMode,
    customSectionsData,
    setCustomSectionData
  } = useCmsStore();

  const [mounted, setMounted] = useState(false);
  const [, setTick] = useState(0);

  const routeKey = `/${slug}`;
  const legacyRouteKey = `/p/${slug}`;

  useEffect(() => {
    setMounted(true);
    if (slug) {
      setCurrentRoute(routeKey);
    }
    const handleUpdate = () => {
      setTick(t => t + 1);
    };
    window.addEventListener('cms-section-added', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cms-section-added', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [slug, setCurrentRoute, routeKey]);

  const page = customPages.find(
    p => p.slug === slug || 
         p.slug === `/${slug}` || 
         p.slug.replace(/^\//, '') === slug
  );

  // Fallback / Default section IDs for this custom page
  const defaultSectionIds = [
    `custom_hero_${slug}`,
    `custom_cards_${slug}`
  ];

  const currentSections = (mounted && sectionsByRoute)
    ? (sectionsByRoute[routeKey] && sectionsByRoute[routeKey].length > 0)
      ? sectionsByRoute[routeKey]
      : (sectionsByRoute[legacyRouteKey] && sectionsByRoute[legacyRouteKey].length > 0)
        ? sectionsByRoute[legacyRouteKey]
        : defaultSectionIds
    : defaultSectionIds;

  // Initialize default content data for fallback sections if not present
  useEffect(() => {
    if (!mounted || !page) return;

    const heroId = `custom_hero_${slug}`;
    if (!customSectionsData[heroId]) {
      setCustomSectionData(heroId, {
        id: heroId,
        layout: 'centered',
        badge: 'FEATURED PAGE',
        title: page.title,
        subtitle: page.metaDescription || 'Explore our official catalog, offers, and services',
        body: page.content || `Welcome to ${page.title}. Discover premium devices, warranty coverage, and certified customer support.`,
        ctaText: 'Shop All Products',
        ctaLink: '/category/all',
        secondaryCtaText: 'Contact Store',
        secondaryCtaLink: '/#locations',
        theme: 'primary',
        minHeight: 320,
        paddingY: 4
      });
    }

    const cardsId = `custom_cards_${slug}`;
    if (!customSectionsData[cardsId]) {
      setCustomSectionData(cardsId, {
        id: cardsId,
        layout: 'cards',
        badge: 'KEY HIGHLIGHTS',
        title: 'Why Choose Our Store',
        subtitle: 'Official Guarantee & Fast Support',
        body: 'We deliver genuine technology products with full warranty and express shipping.',
        ctaText: 'Explore Category',
        ctaLink: '/category/all',
        theme: 'light',
        minHeight: 280,
        paddingY: 3,
        cards: [
          { id: '1', title: '100% Genuine Tech', description: 'Official brand warranties on laptops, tablets, and smartphones.', icon: 'Shield', badge: 'VERIFIED' },
          { id: '2', title: 'Express Delivery', description: 'Fast same-day delivery inside the Valley with careful packaging.', icon: 'Zap', badge: 'FAST' },
          { id: '3', title: '0% EMI Installments', description: 'Hassle-free installment plans available across multiple banks.', icon: 'Star', badge: 'POPULAR' }
        ]
      });
    }
  }, [mounted, page, slug, customSectionsData, setCustomSectionData]);

  // Page not found
  if (mounted && !page) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Page Not Found</h1>
          <p className="text-sm text-foreground/60">
            The page <span className="font-mono font-bold text-foreground/80">/{slug}</span> doesn't exist or hasn't been created yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  // Draft page — show notice unless admin in editor mode
  if (page && page.status === 'draft' && !isEditMode) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Page is a Draft</h1>
          <p className="text-sm text-foreground/60">
            This page is currently unpublished. Publish it from the Admin CMS to make it public.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const renderCustomSection = (sectionId: string) => {
    return (
      <SectionEditorWrapper key={sectionId} sectionId={sectionId}>
        <CustomBlankSection sectionId={sectionId} />
      </SectionEditorWrapper>
    );
  };

  return (
    <div className="min-h-[70vh] w-full space-y-12 pb-16">
      
      {/* 1. Breadcrumb Bar */}
      <div className="bg-card-bg/60 border-b border-card-border py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground/80 font-bold">{page?.title || slug}</span>
          </div>
          {page && (
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                page.status === 'published' 
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-300 dark:border-emerald-800' 
                  : 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 border border-amber-300 dark:border-amber-800'
              }`}>
                {page.status}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Visual Dynamic Sections (Customizable via Section Builder) */}
      <div className="space-y-12">
        {currentSections.map(renderCustomSection)}
      </div>

      {/* 3. Optional Rich Text / Article Block if page has content */}
      {page?.content && (
        <div className="max-w-4xl mx-auto px-6">
          <SectionEditorWrapper sectionId={`article-content-${slug}`}>
            <div className="bg-card-bg border border-card-border rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
              <div className="border-b border-card-border pb-4 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest text-primary">Page Details</span>
                <span className="text-xs text-foreground/40 font-mono">/{slug}</span>
              </div>
              <div
                className="prose prose-sm max-w-none text-foreground/80 leading-relaxed font-sans"
                style={{ lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: page.content.replace(/\n/g, '<br/>') }}
              />
            </div>
          </SectionEditorWrapper>
        </div>
      )}

    </div>
  );
}
