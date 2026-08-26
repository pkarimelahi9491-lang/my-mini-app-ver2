import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Project, MetricSummary, SitePresentationSettings } from '../types';
import { getProjectImage } from '../data/projectImages';
import { toPersianDigits } from '../utils/persian';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw,
  Maximize2, 
  Minimize2,
  Globe,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface PresentationModeProps {
  metrics: MetricSummary;
  featuredProjects: Project[];
  allProjects: Project[];
  presentationSettings?: SitePresentationSettings;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const PresentationMode: React.FC<PresentationModeProps> = ({
  metrics,
  featuredProjects,
  presentationSettings,
  onClose,
  onSelectProject
}) => {
  // Slides: 0 = Overview, 1..10 = Top 10 Projects, 11 = Summary
  const top10 = featuredProjects.slice(0, 10);
  const totalSlides = top10.length + 2; // 12 slides total

  const [currentSlide, setCurrentSlide] = useState(0);
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile' | 'trio'>('desktop');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollAccumulatorRef = useRef<number>(0);
  const isPausedOnHoverRef = useRef<boolean>(false);

  // Lock background scrolling while the fullscreen presentation is open
  useBodyScrollLock(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev < totalSlides - 1 ? prev + 1 : prev));
    setIsAutoScrolling(false);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev > 0 ? prev - 1 : prev));
    setIsAutoScrolling(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'PageDown') {
        nextSlide();
      } else if (e.key === 'ArrowRight' || e.key === 'PageUp') {
        prevSlide();
      } else if (e.key === '1') {
        setDeviceView('desktop');
      } else if (e.key === '2') {
        setDeviceView('tablet');
      } else if (e.key === '3') {
        setDeviceView('mobile');
      } else if (e.key === '4') {
        setDeviceView('trio');
      } else if (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 's') {
        setIsAutoScrolling(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, onClose]);

  // Reset scroll upon changing slide or device view
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      scrollAccumulatorRef.current = 0;
    }
  }, [currentSlide, deviceView]);

  // 60/120fps Hardware-Accelerated Fluid Auto-Scroll Loop using requestAnimationFrame
  useEffect(() => {
    if (!isAutoScrolling) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    // Initialize accumulator to current scrollTop
    scrollAccumulatorRef.current = container.scrollTop;

    // Pixels per frame based on speed setting
    const speedMap = {
      slow: 0.8,
      normal: 1.5,
      fast: 2.5
    };
    const speed = speedMap[scrollSpeed];

    let lastTime = performance.now();

    const step = (now: number) => {
      if (!isAutoScrolling || !scrollContainerRef.current) return;

      const delta = Math.min((now - lastTime) / 16.67, 2.5); // Normalize to 60fps delta
      lastTime = now;

      if (!isPausedOnHoverRef.current) {
        const el = scrollContainerRef.current;
        const maxScroll = el.scrollHeight - el.clientHeight;

        if (maxScroll > 10) {
          scrollAccumulatorRef.current += speed * delta;

          if (scrollAccumulatorRef.current >= maxScroll) {
            // Reached bottom: Jump to top and stop auto-scroll
            scrollAccumulatorRef.current = 0;
            el.scrollTop = 0;
            setIsAutoScrolling(false);
            return;
          } else {
            el.scrollTop = scrollAccumulatorRef.current;
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(step);
    };

    animationFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAutoScrolling, scrollSpeed, currentSlide, deviceView]);

  // Real fullscreen support, synced with browser state (Esc exits cleanly)
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const syncFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', syncFullscreen);
    return () => document.removeEventListener('fullscreenchange', syncFullscreen);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Current project for project slides
  const isProjectSlide = currentSlide >= 1 && currentSlide <= 10;
  const activeProject = isProjectSlide ? top10[currentSlide - 1] : null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-[#030305] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP FLOATING MINIMAL PRESENTATION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="h-14 px-6 bg-[#07070a]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#0066FF] text-white font-bold text-xs flex items-center justify-center shadow-md">
            S
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-white tracking-wide">SHADOW DESIGN REVIEW</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-normal">ارائه مدیریتی</span>
          </div>
        </div>

        {/* Slide Tracker & Controls */}
        <div className="flex items-center gap-3">
          <div className="text-xs font-medium text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <span>اسلاید {toPersianDigits(currentSlide + 1)} از {toPersianDigits(totalSlides)}</span>
          </div>

          <button
            onClick={toggleFullscreen}
            className="hidden sm:flex items-center gap-1 p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="تمام‌صفحه"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="خروج"
          >
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* Thin Slide Progress Bar */}
      <div className="w-full h-0.5 bg-white/5 relative">
        <div 
          className="h-full bg-[#0066FF] transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN PRESENTATION STAGE */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 w-full max-w-[1760px] mx-auto px-3 sm:px-8 py-2 flex flex-col min-h-0 overflow-hidden">
        
        {/* SLIDE 0: EXECUTIVE INTRO (SIMPLE, HIGH-LEVEL) */}
        {currentSlide === 0 && (
          <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#0066FF] font-medium self-center">
              <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>{presentationSettings?.introBadge || 'مرور تخصصی طراحی تجربه و رابط کاربری'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {presentationSettings?.introTitle || 'گزارش عملکرد و آرشیو پروژه‌های دیزاین'}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light max-w-2xl mx-auto">
              {presentationSettings?.introDescription || 'این ارائه به‌صورت تصویری و بر مبنای پیش‌نمایش واقعی خروجی‌ها در ۳ دیوایس دسکتاپ، تبلت و موبایل آماده شده است.'}
            </p>

            {/* 3 High-Level Clean Numbers (Zero box-in-box) */}
            <div className="grid grid-cols-3 gap-4 pt-6 text-center">
              <div className="p-4 rounded-2xl bg-[#08080c] border border-white/10">
                <div className="text-3xl sm:text-4xl font-black text-[#0066FF]">{presentationSettings?.introStat1Value || '۶۰+'}</div>
                <div className="text-xs text-slate-400 mt-1">{presentationSettings?.introStat1Label || 'پروژه تحویل‌شده'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#08080c] border border-white/10">
                <div className="text-3xl sm:text-4xl font-black text-white">{presentationSettings?.introStat2Value || '۱۰+'}</div>
                <div className="text-xs text-slate-400 mt-1">{presentationSettings?.introStat2Label || 'برند مطرح تجاری'}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#08080c] border border-white/10">
                <div className="text-3xl sm:text-4xl font-black text-slate-300">{presentationSettings?.introStat3Value || '۴'}</div>
                <div className="text-xs text-slate-400 mt-1">{presentationSettings?.introStat3Label || 'دسته محصول دیجیتال'}</div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={nextSlide}
                className="px-6 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-lg shadow-[#0066FF]/20 cursor-pointer inline-flex items-center gap-2"
              >
                <span>{presentationSettings?.introButtonText || 'شروع بررسی ۱۰ پروژه شاخص'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SLIDES 1 to 10: FOCUSED PROJECT SHOWCASE IN 3 DEVICES */}
        {isProjectSlide && activeProject && (
          <div className="flex-1 h-full min-h-0 flex flex-col space-y-2 animate-in fade-in duration-300">
            
            {/* Project Header Bar (Minimal, High-Level) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-white/5 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {toPersianDigits(currentSlide)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {activeProject.displayNameFa || activeProject.name}
                    </h2>
                    <span className="text-xs text-slate-400 font-medium px-2 py-0.5 rounded-full bg-white/5">
                      {activeProject.clientFa || activeProject.brand}
                    </span>
                    <span className="text-xs text-slate-500">
                      {toPersianDigits(activeProject.year || '—')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {activeProject.shortDescription || activeProject.description}
                  </p>
                </div>
              </div>

              {/* 3-Device Switcher & Auto-scroll trigger */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* Device Selector */}
                <div className="flex items-center gap-1 bg-[#0a0a0f] p-1 rounded-full border border-white/10">
                  <button
                    onClick={() => setDeviceView('desktop')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      deviceView === 'desktop' ? 'bg-[#0066FF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>دسکتاپ (۱۴۴۰)</span>
                  </button>

                  <button
                    onClick={() => setDeviceView('tablet')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      deviceView === 'tablet' ? 'bg-[#0066FF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tablet className="w-3.5 h-3.5" />
                    <span>تبلت (۷۶۸)</span>
                  </button>

                  <button
                    onClick={() => setDeviceView('mobile')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      deviceView === 'mobile' ? 'bg-[#0066FF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>موبایل (۳۹۰)</span>
                  </button>

                  <button
                    onClick={() => setDeviceView('trio')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      deviceView === 'trio' ? 'bg-[#0066FF] text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                    title="نمایش همزمان هر ۳ دیوایس"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>۳ دیوایس</span>
                  </button>
                </div>

                {/* Auto Scroll Toggle & Speed Controls */}
                {deviceView !== 'trio' && (
                  <div className="flex items-center gap-1.5 bg-[#0a0a0f] p-1 rounded-full border border-white/10">
                    <button
                      onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        isAutoScrolling
                          ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                          : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                      title="پیمایش خودکار بدون لگ (کلید P یا S)"
                    >
                      {isAutoScrolling ? (
                        <>
                          <Pause className="w-3 h-3 fill-current" />
                          <span>توقف</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current text-[#0066FF]" />
                          <span>اسکرول خودکار</span>
                        </>
                      )}
                    </button>

                    {/* Speed Selector (Active when auto-scroll is on or always accessible) */}
                    <div className="flex items-center gap-0.5 px-1">
                      <button
                        onClick={() => setScrollSpeed('slow')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                          scrollSpeed === 'slow' ? 'bg-white/20 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="سرعت آهسته (۰.۸x)"
                      >
                        ۰.۸x
                      </button>
                      <button
                        onClick={() => setScrollSpeed('normal')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                          scrollSpeed === 'normal' ? 'bg-[#0066FF]/40 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="سرعت استاندارد (۱.۵x)"
                      >
                        ۱x
                      </button>
                      <button
                        onClick={() => setScrollSpeed('fast')}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                          scrollSpeed === 'fast' ? 'bg-white/20 text-white font-bold' : 'text-slate-500 hover:text-slate-300'
                        }`}
                        title="سرعت سریع (۲.۵x)"
                      >
                        ۲x
                      </button>
                    </div>

                    {/* Quick Scroll To Top */}
                    <button
                      onClick={() => {
                        if (scrollContainerRef.current) {
                          scrollAccumulatorRef.current = 0;
                          scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="بازگشت به ابتدای صفحه"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Device Viewport (No Redundant Outer Container Box, Maximum Height) */}
            <div className="flex-1 min-h-0 w-full h-full flex items-center justify-center overflow-hidden relative">
              
              {/* 1. DESKTOP VIEWPORT (STANDARD 1440px RATIO - WIDE & HIGH) */}
              {deviceView === 'desktop' && (
                <div className="w-full max-w-[1600px] h-full rounded-2xl bg-[#07070a] border border-white/12 overflow-hidden flex flex-col shadow-2xl">
                  {/* Browser Bar */}
                  <div className="h-8 bg-[#0b0b12] border-b border-white/10 px-4 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-4 py-0.5 rounded-full bg-black/60 text-[10px] text-slate-300 font-mono border border-white/5 min-w-[280px] sm:min-w-[360px] justify-center">
                      <Globe className="w-3 h-3 text-[#0066FF]" />
                      <span className="truncate">https://{activeProject.client?.toLowerCase() || 'preview'}.design/app</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">۱۴۴۰ × ۹۰۰ px</span>
                  </div>

                  {/* Scrollable Image Canvas */}
                  <div 
                    ref={scrollContainerRef}
                    onMouseEnter={() => { isPausedOnHoverRef.current = true; }}
                    onMouseLeave={() => { isPausedOnHoverRef.current = false; }}
                    className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[#030306] relative group"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <img
                      src={activeProject.hero || activeProject.cover || getProjectImage(activeProject.id, activeProject.type, 'hero')}
                      alt={activeProject.name}
                      className="w-full h-auto block select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* 2. TABLET VIEWPORT (STANDARD IPAD 768px PROPORTION) */}
              {deviceView === 'tablet' && (
                <div className="w-[740px] max-w-full h-full rounded-[28px] bg-[#0c0c14] border-4 border-[#222230] p-2 flex flex-col shadow-2xl">
                  <div className="h-6 flex items-center justify-between px-4 text-[10px] text-slate-400 flex-shrink-0 font-medium">
                    <span className="font-bold">۹:۴۱</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-slate-700" />
                      <span className="text-[9px] font-mono text-slate-500">iPad Pro 11" (۷۶۸px)</span>
                    </div>
                    <span className="font-mono text-[9px]">۱۰۰٪</span>
                  </div>
                  <div 
                    ref={scrollContainerRef}
                    onMouseEnter={() => { isPausedOnHoverRef.current = true; }}
                    onMouseLeave={() => { isPausedOnHoverRef.current = false; }}
                    className="flex-1 min-h-0 rounded-2xl overflow-y-auto overflow-x-hidden bg-[#030306] border border-white/5 relative"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <img
                      src={activeProject.assets?.find(a => a.category === 'tablet')?.src || getProjectImage(activeProject.id, activeProject.type, 'tablet')}
                      alt={activeProject.name}
                      className="w-full h-auto block select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* 3. MOBILE VIEWPORT (STANDARD IPHONE 390px PROPORTION WITH DYNAMIC ISLAND) */}
              {deviceView === 'mobile' && (
                <div className="w-[380px] sm:w-[390px] max-w-full h-full rounded-[44px] bg-[#0c0c14] border-[5px] border-[#22222e] p-2 flex flex-col shadow-2xl relative">
                  {/* Status Bar & Dynamic Island */}
                  <div className="h-7 flex items-center justify-between px-5 text-[10px] text-slate-300 flex-shrink-0">
                    <span className="font-bold text-white font-mono text-xs">9:41</span>
                    <div className="w-24 h-5 bg-black rounded-full border border-white/10 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/10 mr-1.5" />
                    </div>
                    <span className="font-mono text-[9px] font-semibold text-slate-400">5G</span>
                  </div>
                  <div 
                    ref={scrollContainerRef}
                    onMouseEnter={() => { isPausedOnHoverRef.current = true; }}
                    onMouseLeave={() => { isPausedOnHoverRef.current = false; }}
                    className="flex-1 min-h-0 rounded-[32px] overflow-y-auto overflow-x-hidden bg-[#030306] relative"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    <img
                      src={activeProject.mobile || activeProject.assets?.find(a => a.category === 'mobile')?.src || getProjectImage(activeProject.id, activeProject.type, 'mobile')}
                      alt={activeProject.name}
                      className="w-full h-auto block select-none"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {/* iOS Home Bar */}
                  <div className="h-4 flex items-center justify-center flex-shrink-0">
                    <div className="w-32 h-1 bg-white/40 rounded-full" />
                  </div>
                </div>
              )}

              {/* 4. TRIO VIEW (SIDE BY SIDE 3 STANDARD DEVICES) */}
              {deviceView === 'trio' && (
                <div className="w-full max-w-[1720px] h-full grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  {/* Desktop */}
                  <div className="md:col-span-6 h-full rounded-2xl bg-[#07070a] border border-white/10 overflow-hidden flex flex-col shadow-xl">
                    <div className="h-7 bg-[#0b0b12] border-b border-white/5 px-3 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                        <span className="font-semibold text-white mr-1">دسکتاپ (۱۴۴۰px)</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">تمام عرض</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#030306]" style={{ scrollbarWidth: 'thin' }}>
                      <img
                        src={activeProject.hero || activeProject.cover || getProjectImage(activeProject.id, activeProject.type, 'hero')}
                        alt="Desktop"
                        className="w-full h-auto object-top block"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="md:col-span-3 h-full rounded-2xl bg-[#07070a] border border-white/10 overflow-hidden flex flex-col shadow-xl">
                    <div className="h-7 bg-[#0b0b12] border-b border-white/5 px-3 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
                      <span className="font-semibold text-white">تبلت (۷۶۸px)</span>
                      <span className="text-[9px] font-mono text-slate-500">iPad</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#030306]" style={{ scrollbarWidth: 'thin' }}>
                      <img
                        src={activeProject.assets?.find(a => a.category === 'tablet')?.src || getProjectImage(activeProject.id, activeProject.type, 'tablet')}
                        alt="Tablet"
                        className="w-full h-auto object-top block"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="md:col-span-3 h-full rounded-2xl bg-[#07070a] border border-white/10 overflow-hidden flex flex-col shadow-xl">
                    <div className="h-7 bg-[#0b0b12] border-b border-white/5 px-3 flex items-center justify-between text-[10px] text-slate-400 flex-shrink-0">
                      <span className="font-semibold text-white">موبایل (۳۹۰px)</span>
                      <span className="text-[9px] font-mono text-slate-500">iPhone</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto bg-[#030306]" style={{ scrollbarWidth: 'thin' }}>
                      <img
                      src={activeProject.mobile || activeProject.assets?.find(a => a.category === 'mobile')?.src || getProjectImage(activeProject.id, activeProject.type, 'mobile')}
                        alt="Mobile"
                        className="w-full h-auto object-top block"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* SLIDE 11: CLOSING SUMMARY */}
        {currentSlide === totalSlides - 1 && (
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-[#0066FF] font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{presentationSettings?.closingBadge || 'پایان ارائه مدیریتی'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              {presentationSettings?.closingTitle || 'طراحی مداوم و تکامل تجربیات دیجیتال'}
            </h2>

            <p className="text-base text-slate-300 leading-relaxed font-light">
              {presentationSettings?.closingDescription || 'آماده پاسخگویی به پرسش‌ها و بررسی جزئیات فنی و متدولوژی هر پروژه هستیم.'}
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-bold transition-all shadow-lg shadow-[#0066FF]/20 cursor-pointer"
              >
                {presentationSettings?.closingButtonText || 'پایان پرزنتیشن و ورود به آرشیو'}
              </button>
            </div>
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FLOATING CAPSULE NAVIGATION */}
      {/* ------------------------------------------------------------- */}
      <footer className="h-16 px-6 bg-[#07070a]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between z-30">
        <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
          {activeProject ? (activeProject.displayNameFa || activeProject.name) : 'ارائه استراتژیک'}
        </div>

        <div className="flex items-center gap-2 ms-auto sm:ms-0">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs text-white transition-colors cursor-pointer border border-white/10"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            <span>قبلی</span>
          </button>

          {/* Quick jump dots / numbers */}
          <div className="hidden lg:flex items-center gap-1 px-2">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setCurrentSlide(idx); setIsAutoScrolling(false); }}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx ? 'bg-[#0066FF] w-5' : 'bg-white/20 hover:bg-white/40'
                }`}
                title={`اسلاید ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={currentSlide === totalSlides - 1}
            className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#0066FF] hover:bg-[#0052cc] disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-xs transition-colors cursor-pointer shadow-md shadow-[#0066FF]/20"
          >
            <span>بعدی</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>

    </div>
  );
};
