import React from 'react';
import { BrandPictogramProject } from '../types';
import { toPersianDigits } from '../utils/persian';

interface BrandPictogramsSectionProps {
  projects: BrandPictogramProject[];
  title?: string;
  subtitle?: string;
  onSelectProject?: (project: BrandPictogramProject) => void;
  onOpenCMS?: () => void;
}

export const BrandPictogramsSection: React.FC<BrandPictogramsSectionProps> = ({
  projects,
  title,
  subtitle,
  onSelectProject,
  onOpenCMS
}) => {

  return (
    <section className="space-y-8 text-right" id="pictograms-section">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title || 'پیکتوگرام'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-mono">
              {toPersianDigits(projects.length)} سیستم جامع
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {subtitle || 'سیستم آیکونوگرافی اختصاصی برندها'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono hidden md:block">
            Optical Grid • Vector Tokens
          </div>
        </div>
      </div>

      {/* Projects Showcase Cards Grid (Only Image + Title) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          return (
            <div
              key={proj.id}
              role="button"
              tabIndex={0}
              aria-label={`مشاهده سیستم پیکتوگرام ${proj.titleFa}`}
              onClick={() => onSelectProject?.(proj)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject?.(proj); } }}
              className="group rounded-2xl bg-[#090d1a] border border-white/10 hover:border-cyan-500/60 transition-all duration-300 p-3.5 space-y-3 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            >
              {/* Cover Mockup (portrait mockups shown fully over a blurred backdrop) */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#04060d] relative border border-white/5">
                <img
                  src={proj.mockups[0]?.imageUrl || proj.cover}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <img
                  src={proj.mockups[0]?.imageUrl || proj.cover}
                  alt={proj.titleFa}
                  className="relative w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Title Only */}
              <div className="px-1 py-1">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-1">
                  {proj.titleFa}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
