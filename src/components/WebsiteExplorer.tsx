import React, { useState, useEffect, useRef } from 'react';
import { Project, WebsiteLanguageGroup, WebsitePageItem } from '../types';
import { toPersianDigits } from '../utils/persian';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import {
  Globe,
  Monitor,
  Tablet,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';

interface WebsiteExplorerProps {
  project: Project;
}

type Device = 'desktop' | 'tablet' | 'mobile';

export const WebsiteExplorer: React.FC<WebsiteExplorerProps> = ({ project }) => {
  const groups: WebsiteLanguageGroup[] = project.websitePages || [];

  const [langIdx, setLangIdx] = useState(0);
  const [device, setDevice] = useState<Device>('desktop');
  const [pageIdx, setPageIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const thumbsRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  const safeLangIdx = Math.min(langIdx, groups.length - 1);
  const group: WebsiteLanguageGroup | undefined = groups[safeLangIdx];
  const pages: WebsitePageItem[] = group?.pages || [];
  const safePageIdx = Math.min(pageIdx, pages.length - 1);
  const page: WebsitePageItem | undefined = pages[safePageIdx];

  // Reset everything on project change
  useEffect(() => {
    setLangIdx(0);
    setDevice('desktop');
    setPageIdx(0);
    setIsLightboxOpen(false);
  }, [project.id]);

  // Auto-fallback device if the current page lacks the selected device image
  useEffect(() => {
    if (!page) return;
    if (device === 'desktop' && !page.desktop) setDevice(page.tablet ? 'tablet' : 'mobile');
    else if (device === 'tablet' && !page.tablet) setDevice(page.desktop ? 'desktop' : 'mobile');
    else if (device === 'mobile' && !page.mobile) setDevice(page.desktop ? 'desktop' : (page.tablet ? 'tablet' : 'desktop'));
  }, [safePageIdx, safeLangIdx, project.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the active thumbnail visible in the strip
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [safePageIdx, safeLangIdx]);

  useBodyScrollLock(isLightboxOpen);

  const go = (i: number) => setPageIdx(Math.max(0, Math.min(pages.length - 1, i)));

  const scrollThumbs = (dir: 1 | -1) => {
    thumbsRef.current?.scrollBy({ left: dir * 340, behavior: 'smooth' });
  };

  // Keyboard: arrows navigate pages (also inside lightbox), Esc closes lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') {
        if (isLightboxOpen) setIsLightboxOpen(false);
        return;
      }
      if (e.key === 'ArrowLeft') go(safePageIdx + 1);
      else if (e.key === 'ArrowRight') go(safePageIdx - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safePageIdx, pages.length, isLightboxOpen]);

  if (!groups.length || !pages.length || !page) return null;

  const src =
    device === 'desktop' ? page.desktop :
    device === 'tablet' ? page.tablet :
    page.mobile;

  const hasDesktop = Boolean(page.desktop);
  const hasTablet = Boolean(page.tablet);
  const hasMobile = Boolean(page.mobile);

  const deviceMeta = {
    desktop: { label: 'دسکتاپ', width: '۱۴۴۰px' },
    tablet: { label: 'تبلت', width: '۷۶۸px' },
    mobile: { label: 'موبایل', width: '۳۹۰px' }
  }[device];

  return (
    <section className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#0066FF]" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            صفحات وب‌سایت ({toPersianDigits(pages.length)} صفحه)
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Language Switcher */}
          {groups.length > 1 && (
            <div className="flex items-center gap-1 bg-[#0a0e1c] p-1 rounded-xl border border-white/10">
              {groups.map((g, i) => (
                <button
                  key={g.code}
                  onClick={() => { setLangIdx(i); setPageIdx(0); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    safeLangIdx === i
                      ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-[#0a0e1c] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setDevice('desktop')}
              disabled={!hasDesktop}
              className={`p-2 rounded-lg transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
                device === 'desktop' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title={`دسکتاپ (${deviceMeta.width})`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              disabled={!hasTablet}
              className={`p-2 rounded-lg transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
                device === 'tablet' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="تبلت"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              disabled={!hasMobile}
              className={`p-2 rounded-lg transition-all cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed ${
                device === 'mobile' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="موبایل"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stage */}
      <div className="flex justify-center">
        {device === 'desktop' && (
          <div className="w-full rounded-2xl bg-[#090d1a] border border-white/15 overflow-hidden shadow-2xl">
            {/* Browser Chrome */}
            <div className="h-12 px-4 bg-[#0c1222] border-b border-white/10 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="hidden sm:flex items-center gap-2 px-4 py-1 rounded-lg bg-black/50 border border-white/10 text-[11px] font-mono text-slate-300 max-w-md w-full justify-center">
                  <Globe className="w-3 h-3 text-[#0066FF] shrink-0" />
                  <span className="truncate">{page.title}</span>
                </div>
              </div>
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="تمام صفحه"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Scrollable Page */}
            <div className="h-[70vh] overflow-y-auto overflow-x-hidden bg-[#04060d]" style={{ scrollbarWidth: 'thin' }}>
              {src && (
                <img
                  src={src}
                  alt={`${group.label} — ${page.title}`}
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          </div>
        )}

        {device === 'tablet' && (
          <div className="w-full max-w-[720px] rounded-[28px] overflow-hidden border-[10px] border-[#161a29] bg-black shadow-2xl relative">
            <div className="h-5 bg-[#161a29] flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-black/70 border border-white/10" />
            </div>
            <div className="relative h-[70vh] overflow-y-auto overflow-x-hidden bg-black" style={{ scrollbarWidth: 'thin' }}>
              {src && (
                <img
                  src={src}
                  alt={`${group.label} — ${page.title}`}
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 left-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all cursor-pointer"
                title="تمام صفحه"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {device === 'mobile' && (
          <div className="w-full max-w-[390px] rounded-[40px] overflow-hidden border-[12px] border-[#181d2e] bg-black shadow-2xl relative ring-1 ring-white/10">
            <div className="h-7 bg-black flex items-center justify-center relative">
              <div className="w-24 h-4 rounded-full bg-[#121624] border border-white/10 flex items-center justify-end px-2">
                <span className="w-2 h-2 rounded-full bg-[#0066FF]/80" />
              </div>
            </div>
            <div className="relative h-[68vh] overflow-y-auto overflow-x-hidden bg-black" style={{ scrollbarWidth: 'thin' }}>
              {src && (
                <img
                  src={src}
                  alt={`${group.label} — ${page.title}`}
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                />
              )}
              <button
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-3 left-3 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all cursor-pointer"
                title="تمام صفحه"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-5 bg-black flex items-center justify-center">
              <div className="w-28 h-1 rounded-full bg-white/30" />
            </div>
          </div>
        )}
      </div>

      {/* Page Navigation Footer */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => go(safePageIdx - 1)}
          disabled={safePageIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-200 text-xs font-bold hover:bg-white/10 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
          <span>صفحه قبل</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span className="text-white font-bold">{toPersianDigits(safePageIdx + 1)}</span>
          <span>از</span>
          <span>{toPersianDigits(pages.length)}</span>
          <span className="text-slate-600">•</span>
          <span>{deviceMeta.label}</span>
        </div>

        <button
          onClick={() => go(safePageIdx + 1)}
          disabled={safePageIdx === pages.length - 1}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] border border-[#0066FF] text-white text-xs font-bold hover:bg-[#1a75ff] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-[#0066FF]/20"
        >
          <span>صفحه بعد</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Page Thumbnails Strip (below stage, with scroll arrows) */}
      <div className="flex items-center gap-2">
        {/* Scroll Right (previous pages) */}
        <button
          onClick={() => scrollThumbs(1)}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0a0e1c] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
          aria-label="پیش‌نمایش‌های قبلی"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div
          ref={thumbsRef}
          className="flex-1 flex gap-3 overflow-x-auto pb-2 scrollbar-none"
          role="tablist"
          style={{ scrollbarWidth: 'none' }}
        >
          {pages.map((p, i) => {
            const thumb = p.desktop || p.tablet || p.mobile;
            const isCurrent = safePageIdx === i;
            return (
              <button
                key={p.id}
                ref={isCurrent ? activeThumbRef : undefined}
                onClick={() => go(i)}
                role="tab"
                aria-selected={isCurrent}
                className={`flex-shrink-0 w-32 sm:w-36 rounded-xl overflow-hidden border-2 transition-all cursor-pointer text-right bg-[#0a0e1c] ${
                  isCurrent
                    ? 'border-[#0066FF] shadow-lg shadow-[#0066FF]/25 scale-[1.02]'
                    : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="aspect-[16/10] bg-[#04060d] overflow-hidden relative">
                  {thumb && (
                    <img
                      src={thumb}
                      alt={p.title}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  )}
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-md bg-black/70 backdrop-blur-sm border border-white/20 text-white text-[10px] font-bold flex items-center justify-center font-mono">
                    {toPersianDigits(i + 1)}
                  </span>
                </div>
                <div className={`px-2 py-1.5 text-[10px] font-bold truncate ${
                  isCurrent ? 'text-[#388bfd]' : 'text-slate-300'
                }`}>
                  {p.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Left (next pages) */}
        <button
          onClick={() => scrollThumbs(-1)}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0a0e1c] border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all cursor-pointer"
          aria-label="پیش‌نمایش‌های بعدی"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Fullscreen Lightbox (with page navigation) */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            {page.title} — {deviceMeta.label} ({toPersianDigits(safePageIdx + 1)} از {toPersianDigits(pages.length)})
          </div>

          <img
            src={src}
            alt={`${group.label} — ${page.title}`}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-lg select-none"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Previous page */}
          <button
            onClick={(e) => { e.stopPropagation(); go(safePageIdx - 1); }}
            disabled={safePageIdx === 0}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all"
            aria-label="صفحه قبل"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Next page */}
          <button
            onClick={(e) => { e.stopPropagation(); go(safePageIdx + 1); }}
            disabled={safePageIdx === pages.length - 1}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all"
            aria-label="صفحه بعد"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        </div>
      )}
    </section>
  );
};
