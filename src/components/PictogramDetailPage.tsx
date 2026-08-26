import React, { useState, useEffect } from 'react';
import { BrandPictogramProject } from '../types';
import { toPersianDigits } from '../utils/persian';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { 
  ArrowRight, 
  ArrowLeft,
  Sparkles, 
  Layers, 
  Grid, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight,
  X,
  Image as ImageIcon
} from 'lucide-react';

interface PictogramDetailPageProps {
  project: BrandPictogramProject;
  allProjects: BrandPictogramProject[];
  onBack: () => void;
  onSelectProject: (project: BrandPictogramProject) => void;
}

export const PictogramDetailPage: React.FC<PictogramDetailPageProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject
}) => {
  const mockups = project.mockups || [];
  const icons = project.icons || [];

  const [fullscreenIconIndex, setFullscreenIconIndex] = useState<number | null>(null);
  const [popupIndex, setPopupIndex] = useState<number | null>(null);

  // Reset states when switching between projects
  useEffect(() => {
    setFullscreenIconIndex(null);
    setPopupIndex(null);
  }, [project.id]);

  useBodyScrollLock(Boolean(fullscreenIconIndex !== null || popupIndex !== null));

  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextProject = allProjects.length > 1 ? allProjects[(safeIndex + 1) % allProjects.length] : null;
  const prevProject = allProjects.length > 1 ? allProjects[(safeIndex - 1 + allProjects.length) % allProjects.length] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape') {
        if (fullscreenIconIndex !== null) setFullscreenIconIndex(null);
        else if (popupIndex !== null) setPopupIndex(null);
        else onBack();
      } else if (fullscreenIconIndex !== null) {
        if (e.key === 'ArrowLeft') setFullscreenIconIndex((fullscreenIconIndex + 1) % icons.length);
        else if (e.key === 'ArrowRight') setFullscreenIconIndex((fullscreenIconIndex - 1 + icons.length) % icons.length);
      } else if (popupIndex !== null) {
        if (e.key === 'ArrowLeft') setPopupIndex((popupIndex + 1) % mockups.length);
        else if (e.key === 'ArrowRight') setPopupIndex((popupIndex - 1 + mockups.length) % mockups.length);
      } else if (e.key === 'ArrowLeft' && nextProject) {
        onSelectProject(nextProject);
      } else if (e.key === 'ArrowRight' && prevProject) {
        onSelectProject(prevProject);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextProject, prevProject, onBack, onSelectProject, fullscreenIconIndex, popupIndex, mockups.length, icons.length]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 space-y-12 text-right">
      
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>بازگشت به بخش پیکتوگرام</span>
        </button>
        {(nextProject || prevProject) && (
          <div className="flex items-center gap-1 border-r border-white/10 pr-2">
            {prevProject && (
              <button
                onClick={() => onSelectProject(prevProject)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="پروژه قبلی"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {nextProject && (
              <button
                onClick={() => onSelectProject(nextProject)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="پروژه بعدی"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Header */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 font-bold">
                {project.clientFa}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                {project.categoryFa}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-mono">
                سال {toPersianDigits(project.year)}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
              {project.titleFa}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl pt-1">
              {project.descriptionFa}
            </p>
          </div>

          {/* Specs Card */}
          <div className="lg:col-span-4 rounded-2xl bg-[#0a0e1c] border border-white/10 p-5 space-y-3.5 shadow-xl">
            <div className="text-xs sm:text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center justify-between">
              <span>شناسنامه پیکتوگرام</span>
              <Layers className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">تعداد آیکون‌ها:</span>
                <span className="text-white font-bold">{toPersianDigits(project.iconCount || icons.length)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">سیستم گرید:</span>
                <span className="text-white font-mono text-[11px]">{project.gridSystem}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">رنگ اصلی:</span>
                <span className="text-white font-mono">{project.accentColor}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mockup Gallery */}
      {mockups.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">گالری موکاپ‌ها ({toPersianDigits(mockups.length)})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockups.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setPopupIndex(idx)}
                className="group rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-cyan-500/50 transition-all p-3 space-y-3 cursor-pointer"
              >
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/40 border border-white/5 relative">
                  <img
                    src={m.imageUrl}
                    alt={m.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <div className="px-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">{m.title}</h4>
                  {m.description && <p className="text-[11px] text-slate-400 mt-0.5 truncate">{m.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Icons Gallery */}
      {icons.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Grid className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">گالری پیکتوگرام‌ها ({toPersianDigits(icons.length)} آیکون)</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {icons.map((icon) => (
              <div
                key={icon.id}
                className="group rounded-2xl bg-[#0c0f1e] border border-white/[0.08] hover:border-cyan-500/40 p-4 space-y-3 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/5"
                onClick={() => setFullscreenIconIndex(icons.indexOf(icon))}
              >
                <div className="aspect-square rounded-xl bg-gradient-to-br from-white to-slate-100 flex items-center justify-center overflow-hidden p-3 group-hover:scale-105 transition-transform duration-300">
                  {(icon.svgUrl || icon.pngUrl) ? (
                    <img
                      src={icon.svgUrl || icon.pngUrl}
                      alt={icon.nameFa}
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  ) : (
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight">{icon.nameFa}</h4>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">{icon.name}</p>
                  {icon.category && (
                    <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[9px] font-bold border border-cyan-500/20">
                      {icon.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Previous / Next Footer */}
      {(nextProject || prevProject) && (
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevProject && (
            <button
              onClick={() => onSelectProject(prevProject)}
              className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-cyan-500 text-right space-y-2 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
                <span>پروژه قبلی</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {prevProject.titleFa}
              </div>
            </button>
          )}
          {nextProject && (
            <button
              onClick={() => onSelectProject(nextProject)}
              className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-cyan-500 text-left space-y-2 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-end gap-2 text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
                <span>پروژه بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                {nextProject.titleFa}
              </div>
            </button>
          )}
        </div>
      )}

      {/* Mockup Popup Slider */}
      {popupIndex !== null && mockups.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setPopupIndex(null)}
        >
          <button
            onClick={() => setPopupIndex(null)}
            className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            {toPersianDigits(popupIndex + 1)} از {toPersianDigits(mockups.length)}
          </div>

          <img
            src={mockups[popupIndex].imageUrl}
            alt={mockups[popupIndex].title}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg select-none"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />

          {mockups[popupIndex].tag && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-cyan-400 text-xs font-bold">
              {mockups[popupIndex].tag}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); setPopupIndex((popupIndex + 1) % mockups.length); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setPopupIndex((popupIndex - 1 + mockups.length) % mockups.length); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Icon Fullscreen Slider */}
      {fullscreenIconIndex !== null && icons.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setFullscreenIconIndex(null)}
        >
          <button
            onClick={() => setFullscreenIconIndex(null)}
            className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            {toPersianDigits(fullscreenIconIndex + 1)} از {toPersianDigits(icons.length)}
          </div>

          <div
            className="max-w-[80vw] max-h-[80vh] flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-3xl bg-white flex items-center justify-center p-8 shadow-2xl">
              <img
                src={icons[fullscreenIconIndex].svgUrl || icons[fullscreenIconIndex].pngUrl}
                alt={icons[fullscreenIconIndex].nameFa}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-white">{icons[fullscreenIconIndex].nameFa}</h3>
              <p className="text-sm text-slate-400 font-mono">{icons[fullscreenIconIndex].name}</p>
              {icons[fullscreenIconIndex].category && (
                <span className="inline-block px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
                  {icons[fullscreenIconIndex].category}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); setFullscreenIconIndex((fullscreenIconIndex + 1) % icons.length); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreenIconIndex((fullscreenIconIndex - 1 + icons.length) % icons.length); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
