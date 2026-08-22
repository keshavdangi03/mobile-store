"use client";

import React, { useState } from "react";
import { 
  Megaphone, Bell, ChevronDown, ChevronRight, 
  Eye, EyeOff, Save, Check, Sparkles, Tag
} from "lucide-react";
import { useCmsStore, PromoBarConfig, AnnouncementBannerConfig } from "@/lib/cms-store";
import { saveDbCmsConfig } from "@/app/actions";

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black" />
    </label>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, description, icon: Icon, enabled, children, onToggle }: {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  enabled: boolean;
  children: React.ReactNode;
  onToggle: (v: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${enabled ? 'border-black/20 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}`}>
      {/* Header Row */}
      <div className="flex items-center gap-3 p-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${enabled ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">{title}</span>
            {enabled && (
              <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                LIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-gray-500 truncate">{description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Toggle checked={enabled} onChange={onToggle} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
          >
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Editor */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Input Field ─────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────
export default function SectionsPanel() {
  const { globalSections, setPromoBar, setAnnouncementBanner } = useCmsStore();
  const promoBar = globalSections?.promoBar;
  const banner = globalSections?.announcementBanner;
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await saveDbCmsConfig({ globalSections });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error("Error saving global sections to DB:", e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f9f9f9]">
      {/* Header */}
      <div className="p-5 pb-2 sticky top-0 bg-[#f9f9f9] z-10 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Global Sections</h2>
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              saved ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {saved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
        <p className="text-[11px] text-gray-500">
          Add promotions and banners — changes reflect instantly on the main site.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* ── Promo Bar ─────────────────────────────────────────────────── */}
        <SectionCard
          title="Promo Bar"
          description="Thin announcement strip above the header"
          icon={Tag}
          enabled={promoBar?.enabled ?? false}
          onToggle={(v) => setPromoBar({ enabled: v })}
        >
          <Field label="Message Text">
            <textarea
              value={promoBar?.text ?? ''}
              onChange={e => setPromoBar({ text: e.target.value })}
              rows={2}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black resize-none bg-white"
              placeholder="Enter promo bar text..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Emoji / Icon">
              <input
                type="text"
                value={promoBar?.emoji ?? ''}
                onChange={e => setPromoBar({ emoji: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
                placeholder="🎉"
              />
            </Field>
            <Field label="Closeable">
              <div className="flex items-center gap-2 pt-1">
                <Toggle checked={promoBar?.closeable ?? true} onChange={v => setPromoBar({ closeable: v })} />
                <span className="text-xs text-gray-600">{promoBar?.closeable ? 'Yes' : 'No'}</span>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Background Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={promoBar?.bgColor ?? '#00AFA2'}
                  onChange={e => setPromoBar({ bgColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs text-gray-600 font-mono">{promoBar?.bgColor}</span>
              </div>
            </Field>
            <Field label="Text Color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={promoBar?.textColor ?? '#ffffff'}
                  onChange={e => setPromoBar({ textColor: e.target.value })}
                  className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <span className="text-xs text-gray-600 font-mono">{promoBar?.textColor}</span>
              </div>
            </Field>
          </div>

          <Field label="CTA Link URL (optional)">
            <input
              type="text"
              value={promoBar?.link ?? ''}
              onChange={e => setPromoBar({ link: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
              placeholder="/category/all or https://..."
            />
          </Field>

          <Field label="CTA Link Text (optional)">
            <input
              type="text"
              value={promoBar?.linkText ?? ''}
              onChange={e => setPromoBar({ linkText: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
              placeholder="Shop Now"
            />
          </Field>

          {/* Live Preview */}
          {promoBar?.text && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Preview</label>
              <div
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold"
                style={{ backgroundColor: promoBar.bgColor, color: promoBar.textColor }}
              >
                {promoBar.emoji && <span>{promoBar.emoji}</span>}
                <span>{promoBar.text}</span>
                {promoBar.linkText && (
                  <span className="underline font-black">{promoBar.linkText} →</span>
                )}
              </div>
            </div>
          )}
        </SectionCard>

        {/* ── Announcement Banner ───────────────────────────────────────── */}
        <SectionCard
          title="Announcement Banner"
          description="Full-width colored banner below the header"
          icon={Bell}
          enabled={banner?.enabled ?? false}
          onToggle={(v) => setAnnouncementBanner({ enabled: v })}
        >
          <Field label="Banner Type">
            <div className="grid grid-cols-4 gap-1.5">
              {(['info', 'warning', 'success', 'promo'] as const).map(type => {
                const colors = {
                  info: 'bg-blue-100 text-blue-700 border-blue-300',
                  warning: 'bg-amber-100 text-amber-700 border-amber-300',
                  success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
                  promo: 'bg-teal-100 text-teal-700 border-teal-300',
                };
                return (
                  <button
                    key={type}
                    onClick={() => setAnnouncementBanner({ type })}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border capitalize transition-all ${
                      banner?.type === type ? colors[type] + ' ring-1 ring-offset-1 ring-current' : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Message">
            <textarea
              value={banner?.message ?? ''}
              onChange={e => setAnnouncementBanner({ message: e.target.value })}
              rows={2}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black resize-none bg-white"
              placeholder="Enter announcement message..."
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Emoji / Icon">
              <input
                type="text"
                value={banner?.icon ?? ''}
                onChange={e => setAnnouncementBanner({ icon: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
                placeholder="🚚"
              />
            </Field>
            <Field label="Closeable">
              <div className="flex items-center gap-2 pt-1">
                <Toggle checked={banner?.closeable ?? true} onChange={v => setAnnouncementBanner({ closeable: v })} />
                <span className="text-xs text-gray-600">{banner?.closeable ? 'Yes' : 'No'}</span>
              </div>
            </Field>
          </div>

          <Field label="CTA Link URL (optional)">
            <input
              type="text"
              value={banner?.link ?? ''}
              onChange={e => setAnnouncementBanner({ link: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
              placeholder="/category/all"
            />
          </Field>

          <Field label="CTA Link Text (optional)">
            <input
              type="text"
              value={banner?.linkText ?? ''}
              onChange={e => setAnnouncementBanner({ linkText: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-black bg-white"
              placeholder="Learn More"
            />
          </Field>
        </SectionCard>

        {/* ── Coming Soon Placeholder ───────────────────────────────────── */}
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 text-center">
          <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-gray-400">More sections coming soon</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Cookie notice, floating CTA, ticker tape...</p>
        </div>
      </div>
    </div>
  );
}
