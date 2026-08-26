import React from 'react';
import { DigitalCatalogProject } from '../types';
import { toPersianDigits } from '../utils/persian';

interface DigitalCatalogsSectionProps {
  catalogs: DigitalCatalogProject[];
  title?: string;
  subtitle?: string;
  onSelectCatalog?: (catalog: DigitalCatalogProject) => void;
  onOpenCMS?: () => void;
}

export const DigitalCatalogsSection: React.FC<DigitalCatalogsSectionProps> = ({
  catalogs,
  title,
  subtitle,
  onSelectCatalog,
  onOpenCMS
}) => {

  return (
    <section className="space-y-8 text-right" id="catalogs-section">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title || 'کاتالوگ‌ها'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              {toPersianDigits(catalogs.length)} سند تعاملی
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {subtitle || 'نسخه‌های دیجیتال و تعاملی محصولات'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden md:block">
            Mobile-First PDF • Interactive Flipbook
          </span>
        </div>
      </div>

      {/* Catalogs Cards Grid (Only Image + Title) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => {
          return (
            <div
              key={catalog.id}
              role="button"
              tabIndex={0}
              aria-label={`مشاهده کاتالوگ ${catalog.titleFa}`}
              onClick={() => onSelectCatalog?.(catalog)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectCatalog?.(catalog); } }}
              className="group rounded-2xl bg-[#090d1a] border border-white/10 hover:border-emerald-500/60 transition-all duration-300 p-3.5 space-y-3 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              {/* Cover Mockup (portrait pages shown fully over a blurred backdrop) */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#04060d] relative border border-white/5">
                <img
                  src={catalog.pages[0]?.imageUrl || catalog.cover}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <img
                  src={catalog.pages[0]?.imageUrl || catalog.cover}
                  alt={catalog.titleFa}
                  className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Title Only */}
              <div className="px-1 py-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug line-clamp-1">
                  {catalog.titleFa}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
