import React, { useState, useEffect } from 'react';
import { DigitalCatalogProject } from '../types';
import { toPersianDigits } from '../utils/persian';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronRight, 
  ChevronLeft, 
  X,
  BookOpen,
  Smartphone,
  Maximize2,
  Layers,
  Eye,
  FileText
} from 'lucide-react';

interface CatalogDetailPageProps {
  catalog: DigitalCatalogProject;
  allCatalogs: DigitalCatalogProject[];
  onBack: () => void;
  onSelectCatalog: (catalog: DigitalCatalogProject) => void;
}

export const CatalogDetailPage: React.FC<CatalogDetailPageProps> = ({
  catalog,
  allCatalogs,
  onBack,
  onSelectCatalog
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'full-preview'>(
    catalog.isMobileOptimized ? 'mobile-frame' : 'full-preview'
  );
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [pdfPage, setPdfPage] = useState(1);

  const totalPages = catalog.pages.length;
  const currentPage = catalog.pages[currentPageIndex] || catalog.pages[0];

  // Reset page position when switching catalogs (safety net alongside key remount)
  useEffect(() => {
    setCurrentPageIndex(0);
    setPdfPage(1);
  }, [catalog.id]);

  useBodyScrollLock(Boolean(fullscreenImage));

  const currentIndex = allCatalogs.findIndex(c => c.id === catalog.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const hasMultipleCatalogs = allCatalogs.length > 1;
  const nextCatalog = hasMultipleCatalogs ? allCatalogs[(safeIndex + 1) % allCatalogs.length] : null;
  const prevCatalog = hasMultipleCatalogs ? allCatalogs[(safeIndex - 1 + allCatalogs.length) % allCatalogs.length] : null;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape') {
        if (fullscreenImage) setFullscreenImage(null);
        else onBack();
      } else if (e.key === 'ArrowLeft' && !fullscreenImage) {
        if (currentPageIndex < totalPages - 1) setCurrentPageIndex(prev => prev + 1);
      } else if (e.key === 'ArrowRight' && !fullscreenImage) {
        if (currentPageIndex > 0) setCurrentPageIndex(prev => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages, onBack, fullscreenImage]);

  const goTo = (idx: number) => setCurrentPageIndex(Math.max(0, Math.min(totalPages - 1, idx)));

  // Live PDF viewer section (mobile portrait frame, single fitted page — no scrolling)
  const pdfSection = catalog.pdfUrl ? (
    <section className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 max-w-[420px] mx-auto w-full">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">کاتالوگ تعاملی</h2>
        </div>
        <a
          href={catalog.pdfUrl}
          download
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>دانلود</span>
        </a>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setPdfPage(p => Math.max(1, p - 1))}
          disabled={pdfPage <= 1}
          aria-label="صفحه قبل"
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2 text-sm text-white font-bold">
          <span>صفحه</span>
          <input
            type="number"
            min={1}
            max={catalog.pageCount || 999}
            value={pdfPage}
            onChange={(e) => {
              const v = parseInt(e.target.value, 10);
              if (!isNaN(v) && v >= 1) setPdfPage(Math.min(v, catalog.pageCount || 999));
            }}
            className="w-14 text-center px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-emerald-400"
          />
          <span className="text-slate-400">از {toPersianDigits(catalog.pageCount || 1)}</span>
        </div>
        <button
          onClick={() => setPdfPage(p => Math.min(catalog.pageCount || 999, p + 1))}
          disabled={pdfPage >= (catalog.pageCount || 999)}
          aria-label="صفحه بعد"
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* PDF Iframe — Mobile Portrait Frame, fitted page */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden bg-[#0c0e1a] border-[10px] border-[#181d2e] shadow-2xl ring-1 ring-white/10">
          {/* Speaker Pill */}
          <div className="h-7 bg-black flex items-center justify-center">
            <div className="w-24 h-4 rounded-full bg-[#121624] border border-white/10 flex items-center justify-end px-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
            </div>
          </div>
          <div className="aspect-[9/16] w-full bg-[#2a2e3a]">
            <iframe
              src={`${catalog.pdfUrl}#page=${pdfPage}&view=Fit`}
              className="w-full h-full border-0"
              title={`PDF کاتالوگ ${catalog.titleFa}`}
              key={`${catalog.pdfUrl}#${pdfPage}`}
            />
          </div>
          {/* Home Indicator */}
          <div className="h-5 bg-black flex items-center justify-center">
            <div className="w-28 h-1 rounded-full bg-white/30" />
          </div>
        </div>
      </div>
    </section>
  ) : null;

  // If no image pages defined, show compact cover + live PDF viewer
  if (totalPages === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 space-y-12 text-right">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span>بازگشت به بخش کاتالوگ</span>
          </button>
        </div>

        <section className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5 text-xs">
                <span className="px-3.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">{catalog.clientFa}</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">{catalog.categoryFa}</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-mono">سال {toPersianDigits(catalog.year)}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">{catalog.titleFa}</h1>
              <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl">{catalog.descriptionFa}</p>
            </div>
            <div className="lg:col-span-4 rounded-2xl bg-[#0a0e1c] border border-white/10 p-5 space-y-3.5 shadow-xl">
              <div className="text-xs sm:text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center justify-between">
                <span>شناسنامه کاتالوگ</span>
                <Layers className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">تعداد صفحات:</span>
                  <span className="text-white font-bold">{toPersianDigits(catalog.pageCount)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">فرمت:</span>
                  <span className="text-white font-mono">{catalog.aspectRatio === 'mobile-portrait' ? 'موبایل 9:16' : 'A4'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">بهره‌مندی موبایل:</span>
                  <span className={catalog.isMobileOptimized ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{catalog.isMobileOptimized ? 'بله' : 'خیر'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        {catalog.highlights.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Eye className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-white">نکات کلیدی طراحی</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {catalog.highlights.map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#0a0e1c] border border-white/10 text-sm text-slate-300 flex items-center gap-2.5 hover:border-emerald-500/50 transition-all">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Live PDF Viewer */}
        {pdfSection}

        {fullscreenImage && (
          <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center cursor-pointer" onClick={() => setFullscreenImage(null)}>
            <button onClick={() => setFullscreenImage(null)} className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <img src={fullscreenImage} alt={catalog.titleFa} className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" referrerPolicy="no-referrer" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 space-y-8 text-right">
      
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>بازگشت به بخش کاتالوگ</span>
        </button>
        {(prevCatalog || nextCatalog) && (
          <div className="flex items-center gap-1 border-s border-white/10 ps-2">
            {prevCatalog && (
              <button onClick={() => onSelectCatalog(prevCatalog)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer" title="کاتالوگ قبلی">
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
            {nextCatalog && (
              <button onClick={() => onSelectCatalog(nextCatalog)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer" title="کاتالوگ بعدی">
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Project Header */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">{catalog.clientFa}</span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">{catalog.categoryFa}</span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-mono">سال {toPersianDigits(catalog.year)}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">{catalog.titleFa}</h1>
            <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl">{catalog.descriptionFa}</p>
          </div>
          <div className="lg:col-span-4 rounded-2xl bg-[#0a0e1c] border border-white/10 p-5 space-y-3.5 shadow-xl">
            <div className="text-xs sm:text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center justify-between">
              <span>شناسنامه کاتالوگ</span>
              <Layers className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">صفحات:</span>
                <span className="text-white font-bold">{toPersianDigits(totalPages)} از {toPersianDigits(catalog.pageCount)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">فرمت:</span>
                <span className="text-white font-mono">{catalog.aspectRatio === 'mobile-portrait' ? 'موبایل 9:16' : 'A4'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">موبایل بهینه:</span>
                <span className={catalog.isMobileOptimized ? 'text-emerald-400 font-bold' : 'text-slate-400'}>{catalog.isMobileOptimized ? 'بله' : 'خیر'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1 bg-[#0a0e1c] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('mobile-frame')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'mobile-frame' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>فریم موبایل</span>
          </button>
          <button
            onClick={() => setViewMode('full-preview')}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'full-preview' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>پیش‌نمایش گسترده</span>
          </button>
        </div>
      </div>

      {/* Catalog Viewer */}
      <div className="flex justify-center">
        <div className={`relative rounded-2xl overflow-hidden bg-[#0c0e1a] border border-white/10 shadow-2xl ${
          viewMode === 'mobile-frame' ? 'w-full max-w-[400px]' : 'w-full max-w-[900px]'
        }`}>
          {/* Page Image */}
          <div className={`relative ${viewMode === 'mobile-frame' ? 'aspect-[9/16]' : 'aspect-[4/3]'}`} onClick={() => setFullscreenImage(currentPage?.imageUrl)}>
            <img
              src={currentPage?.imageUrl || catalog.cover}
              alt={currentPage?.title || catalog.titleFa}
              className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
              referrerPolicy="no-referrer"
            />
            {/* Page Counter */}
            <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold">
              صفحه {toPersianDigits(currentPageIndex + 1)} از {toPersianDigits(totalPages)}
            </div>
            {/* Fullscreen Button */}
            <button
              onClick={(e) => { e.stopPropagation(); setFullscreenImage(currentPage?.imageUrl || catalog.cover); }}
              className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-black/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>تمام صفحه</span>
            </button>
          </div>

          {/* Page Title */}
          <div className="p-4 border-t border-white/10">
            <h3 className="text-sm font-bold text-white">{currentPage?.title || `صفحه ${toPersianDigits(currentPageIndex + 1)}`}</h3>
            {currentPage?.subtitle && <p className="text-xs text-slate-400 mt-1">{currentPage.subtitle}</p>}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => goTo(currentPageIndex - 1)}
            disabled={currentPageIndex === 0}
            className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => goTo(currentPageIndex + 1)}
            disabled={currentPageIndex === totalPages - 1}
            className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {catalog.pages.map((page, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`رفتن به صفحه ${toPersianDigits(idx + 1)}`}
            className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
              idx === currentPageIndex
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/30 scale-110'
                : 'border-white/10 hover:border-white/30 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={page.imageUrl} alt={page.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-1.5 px-1 max-w-lg mx-auto w-full">
        {catalog.pages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`صفحه ${toPersianDigits(idx + 1)}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentPageIndex
                ? 'bg-emerald-500 flex-[3]'
                : idx < currentPageIndex
                ? 'bg-emerald-500/40 flex-1'
                : 'bg-white/10 flex-1'
            }`}
          />
        ))}
      </div>

      {/* Highlights */}
      {catalog.highlights.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Eye className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">نکات کلیدی طراحی</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {catalog.highlights.map((h, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#0a0e1c] border border-white/10 text-sm text-slate-300 flex items-center gap-2.5 hover:border-emerald-500/50 transition-all">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Live PDF Viewer */}
      {pdfSection}

      {/* Previous / Next Footer */}
      {(prevCatalog || nextCatalog) && (
        <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevCatalog && (
            <button
              onClick={() => onSelectCatalog(prevCatalog)}
              className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-emerald-500 text-right space-y-2 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                <ArrowRight className="w-4 h-4" />
                <span>کاتالوگ قبلی</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{prevCatalog.titleFa}</div>
            </button>
          )}
          {nextCatalog && (
            <button
              onClick={() => onSelectCatalog(nextCatalog)}
              className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-emerald-500 text-left space-y-2 transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center justify-end gap-2 text-xs text-slate-400 group-hover:text-emerald-400 transition-colors">
                <span>کاتالوگ بعدی</span>
                <ArrowLeft className="w-4 h-4" />
              </div>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-400 transition-colors">{nextCatalog.titleFa}</div>
            </button>
          )}
        </div>
      )}

      {/* Fullscreen Lightbox */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center cursor-pointer" onClick={() => setFullscreenImage(null)}>
          <button onClick={() => setFullscreenImage(null)} className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer">
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            صفحه {toPersianDigits(currentPageIndex + 1)} از {toPersianDigits(totalPages)}
          </div>
          <img src={fullscreenImage} alt={catalog.titleFa} className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" referrerPolicy="no-referrer" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); goTo(currentPageIndex - 1); }} disabled={currentPageIndex === 0} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all">
            <ChevronRight className="w-7 h-7" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); goTo(currentPageIndex + 1); }} disabled={currentPageIndex === totalPages - 1} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all">
            <ChevronLeft className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
};
