import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { toPersianDigits } from '../utils/persian';
import { getProjectImage } from '../data/projectImages';
import {
  Layers,
  ArrowLeft
} from 'lucide-react';

interface SelectedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onOpenPresentation?: () => void;
}

const TYPE_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'landing-page', label: 'لندینگ پیج' },
  { key: 'website', label: 'وب‌سایت' },
  { key: 'campaign', label: 'کمپین' },
  { key: 'mobile-app', label: 'اپلیکیشن' },
  { key: 'product', label: 'محصول دیجیتال' },
  { key: 'design-system', label: 'دیزاین سیستم' }
];

export const SelectedWork: React.FC<SelectedWorkProps> = ({
  projects,
  onSelectProject
}) => {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    if (typeFilter === 'all') return projects;
    return projects.filter(p => {
      const pTypes = Array.isArray(p.type) ? p.type : [p.type];
      return pTypes.includes(typeFilter as any);
    });
  }, [projects, typeFilter]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-20 text-right space-y-8">

      {/* ------------------------------------------------------------- */}
      {/* CATEGORY HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0066FF]">
            <Layers className="w-4 h-4" />
            <span>دسته‌بندی طراحی UI/UX</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-relaxed">
            طراحی رابط و تجربه کاربری ({toPersianDigits(filteredProjects.length)} پروژه)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            وب‌سایت‌ها، لندینگ پیج‌ها، کمپین‌ها و اپلیکیشن‌ها
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TYPE FILTER CHIPS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center gap-2">
        {TYPE_FILTERS.map(f => {
          const count = f.key === 'all'
            ? projects.length
            : projects.filter(p => {
                const pTypes = Array.isArray(p.type) ? p.type : [p.type];
                return pTypes.includes(f.key as any);
              }).length;
          if (f.key !== 'all' && count === 0) return null;
          const isActive = typeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setTypeFilter(f.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-[#0066FF]/30'
                  : 'bg-[#0a0e1c] text-slate-300 border-white/10 hover:border-[#0066FF]/50 hover:text-white'
              }`}
            >
              <span>{f.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
              }`}>
                {toPersianDigits(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PROJECTS GRID (4 COLUMNS) */}
      {/* ------------------------------------------------------------- */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center bg-[#0a0e1c] rounded-2xl border border-white/10 space-y-3">
          <Layers className="w-10 h-10 text-slate-500 mx-auto" />
          <div className="text-base font-bold text-white">پروژه‌ای در این دسته یافت نشد</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              aria-label={`مشاهده پروژه ${project.displayNameFa || project.name}`}
              onClick={() => onSelectProject(project)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectProject(project); } }}
              className="group rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-[#0066FF] transition-all duration-300 p-3.5 space-y-3 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#0066FF]/20 flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0066FF]"
            >
              {/* Image Preview */}
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#04060d] relative border border-white/5">
                <img
                  src={project.cover || getProjectImage(project.id, project.type, 'cover')}
                  alt={project.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>

              {/* Title + Meta */}
              <div className="px-1 py-1 space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#0066FF] transition-colors leading-snug line-clamp-1">
                  {project.displayNameFa || project.name}
                </h3>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span>{project.clientFa || project.brand}</span>
                  <span>•</span>
                  <span className="font-mono">{toPersianDigits(project.year || '—')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
