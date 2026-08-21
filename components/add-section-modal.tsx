import React from 'react';
import { useCmsStore } from '@/lib/cms-store';
import { X, LayoutTemplate, FileText } from 'lucide-react';

export default function AddSectionModal({
  isOpen,
  onClose,
  afterId
}: {
  isOpen: boolean;
  onClose: () => void;
  afterId: string | null;
}) {
  const { currentRoute, addSection } = useCmsStore();

  if (!isOpen) return null;

  const sections = [
    { id: 'hero_section', name: 'Hero Section', icon: LayoutTemplate },
    { id: 'categories_section', name: 'Categories Grid', icon: LayoutTemplate },
    { id: 'services_section', name: 'Services List', icon: LayoutTemplate },
    { id: 'promo_banner_section', name: 'Promo Banner', icon: LayoutTemplate },
    { id: 'limited_deals_section', name: 'Limited Deals', icon: LayoutTemplate },
    { id: 'blank_section', name: 'Blank Section', icon: FileText }
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">Add Section</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 gap-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => {
                  addSection(currentRoute, afterId, section.id);
                  onClose();
                }}
                className="flex flex-col items-center justify-center gap-2 p-6 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{section.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
