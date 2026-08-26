import React, { useState, useEffect, useRef } from 'react';
import { GalleryItem } from '../types';
import { toPersianDigits } from '../utils/persian';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Pause, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Maximize, 
  SlidersHorizontal,
  Image as ImageIcon,
  Check,
  Globe
} from 'lucide-react';

interface LightboxGalleryProps {
  item: GalleryItem;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (item: GalleryItem) => void;
}

type DisplayMode = 'scroll' | 'fit';
type DeviceWidth = 'desktop' | 'tablet' | 'mobile' | 'full';

export const LightboxGallery: React.FC<LightboxGalleryProps> = ({
  item,
  items,
  onClose,
  onNavigate
}) => {
  // Display & Navigation state
  const [displayMode, setDisplayMode] = useState<DisplayMode>('scroll');
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('desktop');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);

  // References for scrolling & loop
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollAccumulatorRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const currentIndex = items.findIndex(i => i.id === item.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextItem = items[(safeIndex + 1) % items.length];
  const prevItem = items[(safeIndex - 1 + items.length) % items.length];

  const currentImageSrc = item.image || item.imageUrl || '';

  // Track scroll progress inside container
  const handleContainerScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const total = scrollHeight - clientHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, Math.round((scrollTop / total) * 100))));
      } else {
        setScrollProgress(0);
      }
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollAccumulatorRef.current = 0;
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Reset scroll & zoom on item navigation
  useEffect(() => {
    setZoomLevel(1);
    setIsAutoScrolling(false);
    setScrollProgress(0);
    setImgLoaded(false);
    setImgError(false);

    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollAccumulatorRef.current = 0;
    }
  }, [item.id]);

  // Smooth Auto-scroll Engine using requestAnimationFrame
  useEffect(() => {
    if (!isAutoScrolling || displayMode !== 'scroll') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    scrollAccumulatorRef.current = container.scrollTop;

    const speedMap = { slow: 0.8, normal: 1.6, fast: 2.8 };
    const speed = speedMap[scrollSpeed];
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!isAutoScrolling || !scrollContainerRef.current) return;

      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      if (!isHoveredRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;

        if (maxScroll > 10) {
          scrollAccumulatorRef.current += speed * delta;

          if (scrollAccumulatorRef.current >= maxScroll) {
            // Reached bottom: Jump to top and stop
            scrollAccumulatorRef.current = 0;
            el.scrollTop = 0;
            setIsAutoScrolling(false);
            return;
          } else {
            el.scrollTop = scrollAccumulatorRef.current;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAutoScrolling, scrollSpeed, displayMode]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        onNavigate(nextItem);
      } else if (e.key === 'ArrowRight') {
        onNavigate(prevItem);
      } else if (e.key.toLowerCase() === 'p' || e.key === ' ') {
        e.preventDefault();
        setIsAutoScrolling(prev => !prev);
      } else if (e.key.toLowerCase() === 't') {
        scrollToTop();
      } else if (e.key.toLowerCase() === 'b') {
        scrollToBottom();
      } else if (e.key.toLowerCase() === 'f') {
        setDisplayMode(prev => prev === 'scroll' ? 'fit' : 'scroll');
      } else if (e.key === '1') {
        setDeviceWidth('desktop');
      } else if (e.key === '2') {
        setDeviceWidth('tablet');
      } else if (e.key === '3') {
        setDeviceWidth('mobile');
      } else if (e.key === '4') {
        setDeviceWidth('full');
      } else if (e.key === '+' || e.key === '=') {
        setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
      } else if (e.key === '-') {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
      } else if (e.key === '0') {
        setZoomLevel(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextItem, prevItem, onClose, onNavigate]);

  const toggleNativeFullscreen = () => {
    if (!document.fullscreenElement) {
      modalContainerRef.current?.requestFullscreen().catch(err => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(err => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Compute container width based on device width setting
  const getContainerWidthClass = () => {
    if (deviceWidth === 'mobile') return 'max-w-[420px]';
    if (deviceWidth === 'tablet') return 'max-w-[780px]';
    if (deviceWidth === 'desktop') return 'max-w-[1280px]';
    return 'max-w-full';
  };

  return (
    <div 
      ref={modalContainerRef}
      className="fixed inset-0 z-50 bg-[#030408]/98 backdrop-blur-2xl flex flex-col text-slate-100 selection:bg-blue-500/30 overflow-hidden text-right"
      dir="rtl"
    >
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BROWSER & SHOWCASE HEADER */}
      {/* ------------------------------------------------------------- */}
      <div className="h-16 px-4 sm:px-6 bg-[#070913] border-b border-white/10 flex items-center justify-between gap-3 z-30 flex-shrink-0">
        
        {/* Left: Project & Frame Title with Close Button */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer border border-white/10 flex-shrink-0"
            title="بستن (ESC)"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0066FF]/20 text-[#388bfd] border border-[#0066FF]/30 text-xs font-bold font-mono">
                {item.category || 'UI/UX'}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {item.title}
              </h2>
            </div>
            {item.caption && (
              <p className="text-[11px] text-slate-400 truncate max-w-sm hidden sm:block">
                {item.caption}
              </p>
            )}
          </div>
        </div>

        {/* Center: Mode & Device Viewport Switcher */}
        <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-white/10 shadow-inner">
          
          {/* Scrollable Mode (Primary) */}
          <button
            onClick={() => setDisplayMode('scroll')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'scroll'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="نمای اسکرولی با وضوح ۱۰۰٪ (پیش‌فرض)"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نمای اسکرولی</span>
          </button>

          {/* Fit Screen Mode */}
          <button
            onClick={() => {
              setDisplayMode('fit');
              setIsAutoScrolling(false);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              displayMode === 'fit'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
            title="فیت در صفحه (نمایش کل طرح)"
          >
            <Maximize className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">فیت در صفحه</span>
          </button>

          {/* Width Presets (Available in Scroll Mode) */}
          {displayMode === 'scroll' && (
            <div className="hidden md:flex items-center gap-1 border-r border-white/10 pr-1.5 mr-0.5">
              <button
                onClick={() => setDeviceWidth('desktop')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  deviceWidth === 'desktop' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض استاندارد دسکتاپ (کلید ۱)"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceWidth('tablet')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  deviceWidth === 'tablet' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض تبلت (کلید ۲)"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeviceWidth('mobile')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  deviceWidth === 'mobile' ? 'bg-white/15 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="عرض موبایل (کلید ۳)"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Quick Action Controls (Auto-scroll, Top/Bottom, Zoom, Fullscreen) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Auto-scroll Toggle (Scroll Mode) */}
          {displayMode === 'scroll' && (
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isAutoScrolling
                    ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="اسکرول خودکار بدون لگ (کلید P یا Space)"
              >
                {isAutoScrolling ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current text-[#0066FF]" />}
                <span className="hidden lg:inline">{isAutoScrolling ? 'توقف' : 'اسکرول خودکار'}</span>
              </button>

              {/* Speed Buttons */}
              <div className="hidden sm:flex items-center gap-0.5 px-1 border-r border-white/10">
                <button
                  onClick={() => setScrollSpeed('slow')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${scrollSpeed === 'slow' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                  title="سرعت آرام (۰.۸x)"
                >
                  ۰.۸x
                </button>
                <button
                  onClick={() => setScrollSpeed('normal')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${scrollSpeed === 'normal' ? 'bg-[#0066FF]/50 text-white font-bold' : 'text-slate-400'}`}
                  title="سرعت استاندارد (۱.۵x)"
                >
                  ۱x
                </button>
                <button
                  onClick={() => setScrollSpeed('fast')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${scrollSpeed === 'fast' ? 'bg-white/20 text-white font-bold' : 'text-slate-400'}`}
                  title="سرعت سریع (۲.۵x)"
                >
                  ۲x
                </button>
              </div>
            </div>
          )}

          {/* Quick Scroll To Top & Bottom */}
          {displayMode === 'scroll' && (
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={scrollToTop}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="ابتدای طرح (کلید T)"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={scrollToBottom}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="انتهای طرح (کلید B)"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Zoom controls */}
          <div className="hidden lg:flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.7))}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              title="کوچک‌نمایی (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 w-10 text-center">
              {toPersianDigits(Math.round(zoomLevel * 100))}٪
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              title="بزرگ‌نمایی (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Native Fullscreen Toggle */}
          <button
            onClick={toggleNativeFullscreen}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="تمام‌صفحه مرورگر"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Thin Scroll Progress Indicator */}
      <div className="h-0.5 w-full bg-white/5 overflow-hidden flex-shrink-0">
        <div 
          className="h-full bg-gradient-to-r from-[#0066FF] to-cyan-400 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN SCROLLABLE VIEWPORT STAGE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden bg-[#030408]">
        
        {/* Navigation Arrows for Previous / Next Projects & Frames */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(prevItem)}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-3.5 rounded-2xl bg-[#080a14]/90 hover:bg-[#0066FF] text-white border border-white/15 shadow-2xl transition-all cursor-pointer group hover:scale-105"
              title="فریم قبلی (کلید →)"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate(nextItem)}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-3.5 rounded-2xl bg-[#080a14]/90 hover:bg-[#0066FF] text-white border border-white/15 shadow-2xl transition-all cursor-pointer group hover:scale-105"
              title="فریم بعدی (کلید ←)"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}

        {/* Loading Spinner */}
        {!imgLoaded && !imgError && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-400 font-medium">بارگذاری با کیفیت اصلی...</span>
            </div>
          </div>
        )}

        {/* =========================================================== */}
        {/* MODE A: SCROLLABLE FULL-LENGTH PREVIEW (DEFAULT & RECOMMENDED) */}
        {/* =========================================================== */}
        {displayMode === 'scroll' ? (
          <div 
            ref={scrollContainerRef}
            onScroll={handleContainerScroll}
            onMouseEnter={() => { isHoveredRef.current = true; }}
            onMouseLeave={() => { isHoveredRef.current = false; }}
            className="w-full h-full overflow-y-auto overflow-x-hidden p-4 sm:p-6 flex justify-center items-start"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div 
              className={`w-full ${getContainerWidthClass()} rounded-2xl overflow-hidden bg-[#070913] border border-white/15 shadow-2xl shadow-black/80 transition-all duration-200`}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
            >
              {/* Browser Window Bar */}
              <div className="h-9 px-4 bg-[#0a0d1a] border-b border-white/10 flex items-center justify-between text-xs text-slate-400 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                </div>
                
                <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-black/50 border border-white/5 font-mono text-[10px] text-slate-300">
                  <Globe className="w-3 h-3 text-[#0066FF]" />
                  <span className="truncate max-w-xs">{item.title}</span>
                </div>

                <div className="text-[10px] font-mono text-slate-400">
                  پیش‌نمایش اسکرولی
                </div>
              </div>

              {/* Full Resolution Scrollable Mockup Image */}
              {currentImageSrc && !imgError ? (
                <img
                  src={currentImageSrc}
                  alt={item.title}
                  onLoad={() => setImgLoaded(true)}
                  onError={() => setImgError(true)}
                  className={`w-full h-auto block select-none transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
              ) : (
                <div className="p-16 text-center space-y-3">
                  <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400">پیش‌نمایش تصویر یافت نشد.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* MODE B: FIT-TO-SCREEN PREVIEW */
          /* ========================================================= */
          <div 
            className="w-full h-full flex items-center justify-center p-4 sm:p-8"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {currentImageSrc && !imgError ? (
              <img
                src={currentImageSrc}
                alt={item.title}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
                className={`max-w-full max-h-[82vh] object-contain rounded-2xl shadow-2xl border border-white/15 transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="p-16 rounded-2xl bg-[#08080c] border border-white/10 text-center space-y-3">
                <ImageIcon className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. BOTTOM FOOTER & KEYBOARD SHORTCUTS BAR */}
      {/* ------------------------------------------------------------- */}
      <div className="h-14 px-4 sm:px-6 bg-[#070913] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 z-30 flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white">
            فریم {toPersianDigits(safeIndex + 1)} از {toPersianDigits(items.length)}
          </span>
          <span className="hidden sm:inline text-slate-400 border-r border-white/10 pr-4 font-mono">
            میزان اسکرول: {toPersianDigits(scrollProgress)}٪
          </span>
        </div>

        <div className="text-slate-400 text-[11px] hidden md:flex items-center gap-3">
          <span>کلیدهای ← / → : فریم بعدی و قبلی</span>
          <span>•</span>
          <span>P یا Space : اسکرول خودکار</span>
          <span>•</span>
          <span>T / B : ابتدا و انتها</span>
          <span>•</span>
          <span>F : فیت/اسکرول</span>
          <span>•</span>
          <span>ESC : بستن</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToTop}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs transition-colors cursor-pointer sm:hidden"
          >
            بالا
          </button>
        </div>
      </div>

    </div>
  );
};
