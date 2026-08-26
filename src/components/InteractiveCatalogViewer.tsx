import React, { useState, useEffect, useRef } from 'react';
import { DigitalCatalogProject, CatalogPage } from '../types';
import { toPersianDigits } from '../utils/persian';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  FileText, 
  Sparkles, 
  ZoomIn, 
  ZoomOut, 
  Share2, 
  Check, 
  ExternalLink,
  Layers,
  BookOpen,
  Eye
} from 'lucide-react';

interface InteractiveCatalogViewerProps {
  catalog: DigitalCatalogProject;
  onClose: () => void;
}

export const InteractiveCatalogViewer: React.FC<InteractiveCatalogViewerProps> = ({
  catalog,
  onClose
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'mobile-frame' | 'full-preview' | 'pdf-embed'>(
    catalog.isMobileOptimized ? 'mobile-frame' : 'full-preview'
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = catalog.pages.length;
  const currentPage: CatalogPage = catalog.pages[currentPageIndex] || catalog.pages[0];

  // Keyboard navigation for flipping pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        // Next page in RTL or flip right
        handleNextPage();
      } else if (e.key === 'ArrowRight') {
        // Previous page in RTL or flip left
        handlePrevPage();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, totalPages]);

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-[#05070e]/95 backdrop-blur-2xl flex flex-col text-slate-100 selection:bg-blue-500/30 overflow-hidden text-right"
      dir="rtl"
    >
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between gap-3 bg-[#080b16]/90 z-20 flex-shrink-0">
        
        {/* Left: Close & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="بستن پنجره"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {catalog.clientFa}
              </span>
              <h2 className="text-sm font-bold text-white truncate max-w-md">
                {catalog.titleFa}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              سال {toPersianDigits(catalog.year)} • {toPersianDigits(totalPages)} صفحه ورق‌خور • فرمت دیجیتال و PDF
            </span>
          </div>
        </div>

        {/* Center: Device & Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('mobile-frame')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'mobile-frame'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">فریم موبایل</span>
          </button>

          <button
            onClick={() => setViewMode('full-preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'full-preview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">پیش‌نمایش گسترده</span>
          </button>
        </div>

        {/* Right: Quick Tools */}
        <div className="flex items-center gap-2">
          {/* Zoom controls (Active in full mode) */}
          {viewMode === 'full-preview' && (
            <div className="hidden sm:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.15))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                title="کوچک‌نمایی"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-1.5 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.15))}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
                title="بزرگ‌نمایی"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Download PDF Button */}
          {catalog.pdfUrl && (
            <a
              href={catalog.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={`${catalog.slug}.pdf`}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دانلود PDF ({catalog.fileSizeMb || 4} مگابایت)</span>
            </a>
          )}

          {/* Fullscreen Trigger */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="تمام صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-between p-4 sm:p-6 gap-6 overflow-hidden relative">
        
        {/* Left Side: Page Information & Highlights Panel */}
        <div className="w-full lg:w-80 rounded-2xl bg-[#0b0e1b]/80 border border-white/10 p-5 space-y-4 flex-shrink-0 hidden lg:block overflow-y-auto max-h-full" style={{ scrollbarWidth: 'thin' }}>
          
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-blue-400">
              صفحه {toPersianDigits(currentPage.pageNumber)} از {toPersianDigits(totalPages)}
            </span>
            <h3 className="text-base font-bold text-white leading-snug">
              {currentPage.title}
            </h3>
            {currentPage.subtitle && (
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {currentPage.subtitle}
              </p>
            )}
          </div>

          {/* Key Bullet points for current page */}
          {currentPage.summaryBullets && currentPage.summaryBullets.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-white/10">
              <span className="text-xs font-bold text-slate-300">نکات برجسته این صفحه:</span>
              <ul className="space-y-1.5">
                {currentPage.summaryBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Catalog Highlights */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-xs font-bold text-slate-300">مشخصات سند و کاتالوگ:</span>
            <div className="space-y-1 text-xs text-slate-400">
              <div>قطع: <span className="text-slate-200">{catalog.aspectRatio === 'mobile-portrait' ? 'عمودی موبایل (۹:۱۶)' : 'استاندارد A4'}</span></div>
              <div>بهینه‌سازی: <span className="text-emerald-400 font-bold">بومی موبایل و وب</span></div>
              <div>برند: <span className="text-slate-200">{catalog.brand}</span></div>
            </div>
          </div>

          {/* Interactive Navigation helper */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 leading-relaxed">
            💡 راهنما: می‌توانید با کلیدهای جهت‌نمای کیبورد (چپ / راست) صفحات را ورق بزنید.
          </div>
        </div>

        {/* Center: Flipbook Viewer Stage */}
        <div className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden">
          
          {/* Previous Page Button (Left / RTL Navigation) */}
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl cursor-pointer hover:scale-110"
            title="صفحه قبلی"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Next Page Button (Right / RTL Navigation) */}
          <button
            onClick={handleNextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-blue-600 border border-white/20 text-white flex items-center justify-center transition-all disabled:opacity-30 disabled:pointer-events-none shadow-xl cursor-pointer hover:scale-110"
            title="صفحه بعدی"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Device Mockup Frame vs Standard Spread */}
          {viewMode === 'mobile-frame' ? (
            /* Sleek Smartphone Mockup with Realistic Notch & Shadow */
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[9/19.5] rounded-[48px] bg-[#11131a] p-3 border-[6px] border-[#222533] shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col transition-all duration-300">
              
              {/* Dynamic Island / Notch */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 rounded-full bg-black z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1a1c29] border border-white/10" />
              </div>

              {/* Status Bar */}
              <div className="h-6 px-6 pt-1 flex items-center justify-between text-[10px] font-mono text-slate-400 z-20">
                <span>۹:۴۱</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <div className="w-4 h-2 rounded-sm border border-slate-400 p-0.5">
                    <div className="w-full h-full bg-slate-300" />
                  </div>
                </div>
              </div>

              {/* Screen Content Container with Smooth Flip Animation */}
              <div className="flex-1 rounded-[36px] overflow-hidden bg-[#0a0c16] relative border border-white/5 select-none shadow-inner">
                <img
                  key={currentPageIndex}
                  src={currentPage.imageUrl}
                  alt={currentPage.title}
                  className="w-full h-full object-cover animate-fade-in duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Interactive Swipe / Tap Zones */}
                <div 
                  className="absolute inset-y-0 right-0 w-1/3 cursor-e-resize z-10" 
                  onClick={handlePrevPage}
                  title="صفحه قبل"
                />
                <div 
                  className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize z-10" 
                  onClick={handleNextPage}
                  title="صفحه بعد"
                />

                {/* Page Indicator Tag */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-white shadow-md z-20">
                  {toPersianDigits(currentPage.pageNumber)} / {toPersianDigits(totalPages)}
                </div>
              </div>

              {/* Home Indicator Bar */}
              <div className="h-4 flex items-center justify-center">
                <div className="w-32 h-1 rounded-full bg-white/30" />
              </div>
            </div>
          ) : (
            /* Full Spread / Document Preview */
            <div 
              className="max-w-4xl max-h-full rounded-2xl overflow-hidden bg-[#090c18] border border-white/10 shadow-2xl flex items-center justify-center p-2 relative transition-all duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <img
                key={currentPageIndex}
                src={currentPage.imageUrl}
                alt={currentPage.title}
                className="max-h-[70vh] sm:max-h-[75vh] w-auto object-contain rounded-xl shadow-lg animate-fade-in"
                referrerPolicy="no-referrer"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white shadow-xl">
                صفحه {toPersianDigits(currentPage.pageNumber)} از {toPersianDigits(totalPages)}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Thumbnail Strip Carousel */}
      <div className="h-24 px-4 sm:px-6 bg-[#080b16]/90 border-t border-white/10 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar flex-shrink-0 z-20">
        <div className="flex items-center gap-2.5">
          {catalog.pages.map((p, idx) => {
            const isActive = idx === currentPageIndex;
            return (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`relative rounded-xl overflow-hidden transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'ring-2 ring-blue-500 scale-105 shadow-lg shadow-blue-500/20'
                    : 'opacity-50 hover:opacity-100 hover:scale-100'
                }`}
                style={{ width: '48px', height: '64px' }}
                title={`رفتن به صفحه ${p.pageNumber}: ${p.title}`}
              >
                <img
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className={`absolute bottom-0 inset-x-0 text-center text-[9px] font-mono font-bold py-0.5 ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-black/70 text-slate-300'
                }`}>
                  {toPersianDigits(p.pageNumber)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
