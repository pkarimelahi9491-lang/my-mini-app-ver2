import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { toPersianDigits } from '../utils/persian';
import { getProjectImage } from '../data/projectImages';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  ArrowUp, 
  ArrowDown,
  Maximize2, 
  MousePointer, 
  Globe,
  Columns3,
  RotateCcw,
  Sparkles,
  Sliders,
  CheckCircle2,
  ZoomIn,
  Eye,
  Play,
  Pause
} from 'lucide-react';

interface ScrollableBrowserFrameProps {
  project: Project;
  onOpenLightbox?: (src: string, title: string) => void;
}

type ViewportMode = 'desktop' | 'tablet' | 'mobile' | 'matrix';

export const ScrollableBrowserFrame: React.FC<ScrollableBrowserFrameProps> = ({
  project,
  onOpenLightbox
}) => {
  const [activeDevice, setActiveDevice] = useState<ViewportMode>('desktop');

  // Determine which devices have actual user-provided images (not system fallbacks)
  const hasDesktop = true; // Always available (falls back to cover)

  const tabletAsset = project.assets?.find(a => a.category === 'tablet')?.src;
  const tabletFallback = getProjectImage(project.id, project.type, 'tablet');
  const tabletSrc = project.tablet || tabletAsset || tabletFallback;
  const hasTablet = Boolean(tabletSrc);

  const mobileAsset = project.mobile || project.assets?.find(a => a.category === 'mobile')?.src;
  const mobileFallback = getProjectImage(project.id, project.type, 'mobile');
  const mobileSrc = mobileAsset || mobileFallback;
  const hasMobile = Boolean(mobileSrc);

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollSpeed, setScrollSpeed] = useState<'normal' | 'slow' | 'fast'>('normal');

  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scrollAccumulatorRef = useRef<number>(0);
  const isHoveredRef = useRef<boolean>(false);

  // Extract device images with curated smart fallbacks
  const desktopSrc = project.hero || project.cover || getProjectImage(project.id, project.type, 'hero');

  const currentImageSrc = 
    activeDevice === 'desktop' ? desktopSrc :
    activeDevice === 'tablet' ? tabletSrc : mobileSrc;

  // Track scroll progress inside the viewport container
  const handleScroll = () => {
    if (scrollViewportRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollViewportRef.current;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable > 0) {
        const progress = Math.round((scrollTop / totalScrollable) * 100);
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    }
  };

  const handleScrollToTop = () => {
    if (scrollViewportRef.current) {
      scrollAccumulatorRef.current = 0;
      scrollViewportRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTo({ 
        top: scrollViewportRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  // Reset scroll upon changing device or project
  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = 0;
      scrollAccumulatorRef.current = 0;
      setScrollProgress(0);
    }
    setIsAutoScrolling(false);
    setImageLoaded(false);
  }, [activeDevice, project.id]);

  // Auto-fallback if active device becomes unavailable
  useEffect(() => {
    if (activeDevice === 'tablet' && !hasTablet) setActiveDevice('desktop');
    if (activeDevice === 'mobile' && !hasMobile) setActiveDevice('desktop');
    if (activeDevice === 'matrix' && (!hasTablet || !hasMobile)) setActiveDevice('desktop');
  }, [hasTablet, hasMobile, activeDevice]);

  // Buttery-smooth Auto-scroll Loop using requestAnimationFrame (syncs with 60/120fps)
  useEffect(() => {
    if (!isAutoScrolling || activeDevice === 'matrix') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    const container = scrollViewportRef.current;
    if (!container) return;

    scrollAccumulatorRef.current = container.scrollTop;

    const speedMap = { slow: 0.8, normal: 1.5, fast: 2.5 };
    const speed = speedMap[scrollSpeed];
    let lastTime = performance.now();

    const loop = (now: number) => {
      if (!isAutoScrolling || !scrollViewportRef.current) return;

      const delta = Math.min((now - lastTime) / 16.67, 2.5);
      lastTime = now;

      if (!isHoveredRef.current) {
        const el = scrollViewportRef.current;
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

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAutoScrolling, scrollSpeed, activeDevice]);

  // Keyboard shortcut listeners (1: Desktop, 2: Tablet, 3: Mobile, 4/M: Matrix, T: Top)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore typing contexts, modified shortcuts and select/copy combos
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.isContentEditable) return;

      if (e.key === '1') { if (hasDesktop) setActiveDevice('desktop'); }
      else if (e.key === '2') { if (hasTablet) setActiveDevice('tablet'); }
      else if (e.key === '3') { if (hasMobile) setActiveDevice('mobile'); }
      else if (e.key === '4' || e.key.toLowerCase() === 'm') { if (hasTablet && hasMobile) setActiveDevice('matrix'); }
      else if (e.key.toLowerCase() === 't') handleScrollToTop();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentTitle = `${project.displayNameFa || project.name} — ${
    activeDevice === 'desktop' ? 'نمای دسکتاپ (۱۴۴۰px)' : 
    activeDevice === 'tablet' ? 'نمای تبلت (۷۶۸px)' : 
    activeDevice === 'mobile' ? 'نمای موبایل (۳۹۰px)' : 'نمای هم‌زمان چندپلتفرمی'
  }`;

  return (
    <div className="w-full space-y-3.5">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BROWSER TITLEBAR & CONTROLS */}
      {/* ------------------------------------------------------------- */}
      <div className="rounded-2xl bg-[#090d1a] border border-white/15 overflow-hidden shadow-2xl shadow-black/60">
        
        {/* Browser Top Navigation Bar */}
        <div className="h-14 px-4 bg-[#0c1222] border-b border-white/10 flex items-center justify-between gap-3 text-xs">
          
          {/* Left: Window Control Dots + Active Viewport Dimension Tag */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm shadow-[#ff5f56]/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm shadow-[#ffbd2e]/30 inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm shadow-[#27c93f]/30 inline-block" />
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[11px] text-slate-300">
              <span className="text-[#0066FF] font-bold">ابعاد:</span>
              <span>
                {activeDevice === 'desktop' && '۱۴۴۰ × ۹۰۰ px'}
                {activeDevice === 'tablet' && '۷۶۸ × ۱۰۲۴ px'}
                {activeDevice === 'mobile' && '۳۹۰ × ۸۴۴ px'}
                {activeDevice === 'matrix' && 'پلتفرم سه‌گانه واکنش‌گرا'}
              </span>
            </div>
          </div>

          {/* Center: Interactive URL / Project Identifier Pill */}
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black/50 border border-white/10 text-slate-300 font-mono text-[11px] max-w-md w-full justify-center truncate shadow-inner">
            <Globe className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
            <span className="text-slate-400">https://</span>
            <span className="text-white font-medium truncate">design.sayeh.ir/{project.slug || project.id}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#0066FF]/20 text-[#0066FF] font-bold mr-1">
              SSL فعال
            </span>
          </div>

          {/* Right: Device Viewport Tabs & Quick Actions */}
          <div className="flex items-center gap-2">
            
            {/* Viewport Mode Switcher */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
              
              {/* Desktop Mode */}
              <button
                onClick={() => setActiveDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  activeDevice === 'desktop' 
                    ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
                title="نمای دسکتاپ — کلید ۱"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">دسکتاپ</span>
              </button>

              {/* Tablet Mode (only if tablet image exists) */}
              {hasTablet && (
                <button
                  onClick={() => setActiveDevice('tablet')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeDevice === 'tablet' 
                      ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="نمای تبلت — کلید ۲"
                >
                  <Tablet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">تبلت</span>
                </button>
              )}

              {/* Mobile Mode (only if mobile image exists) */}
              {hasMobile && (
                <button
                  onClick={() => setActiveDevice('mobile')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeDevice === 'mobile' 
                      ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="نمای موبایل — کلید ۳"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">موبایل</span>
                </button>
              )}

              {/* Responsive Matrix (only if both tablet and mobile exist) */}
              {hasTablet && hasMobile && (
                <button
                  onClick={() => setActiveDevice('matrix')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    activeDevice === 'matrix' 
                      ? 'bg-gradient-to-r from-[#0066FF] to-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                  title="نمای هم‌زمان ۳ سایز (ماتریس ریسپانسیو) — کلید ۴"
                >
                  <Columns3 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">مقایسه‌ای (۳ سایز)</span>
                </button>
              )}
            </div>

            {/* Auto Scroll Toggle */}
            {activeDevice !== 'matrix' && (
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                  isAutoScrolling
                    ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="اسکرول خودکار بدون لگ (کلید P)"
              >
                {isAutoScrolling ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current text-[#0066FF]" />}
                <span className="hidden sm:inline">{isAutoScrolling ? 'توقف' : 'اسکرول خودکار'}</span>
              </button>
            )}

            {/* Quick Scroll To Top */}
            <button
              onClick={handleScrollToTop}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
              title="بازگشت به ابتدای طرح (کلید T)"
              aria-label="بازگشت به بالا"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            {/* Lightbox / Full-Res Zoom */}
            {onOpenLightbox && (
              <button
                onClick={() => onOpenLightbox(currentImageSrc, currentTitle)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
                title="مشاهده تصویر با کیفیت اصلی و بزرگ‌نمایی"
                aria-label="بزرگ‌نمایی"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            )}

          </div>

        </div>

        {/* Scroll Progress Bar */}
        <div className="h-0.5 w-full bg-white/5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#0066FF] to-cyan-400 transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* ----------------------------------------------------------- */}
        {/* 2. SCROLLABLE VIEWPORT CONTAINER */}
        {/* ----------------------------------------------------------- */}
        <div 
          ref={scrollViewportRef}
          onScroll={handleScroll}
          onMouseEnter={() => { isHoveredRef.current = true; }}
          onMouseLeave={() => { isHoveredRef.current = false; }}
          className="relative h-[560px] sm:h-[680px] lg:h-[760px] overflow-y-auto overflow-x-hidden bg-[#04060d]"
          style={{ scrollbarWidth: 'thin' }}
        >

          {/* ========================================================= */}
          {/* MODE A: DESKTOP VIEWPORT (1440px FULL WIDTH) */}
          {/* ========================================================= */}
          {activeDevice === 'desktop' && (
            <div className="w-full min-h-full flex flex-col items-center">
              <img
                src={desktopSrc}
                alt={`${project.name} Desktop View`}
                className="w-full h-auto block select-none"
                referrerPolicy="no-referrer"
                loading="eager"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE B: TABLET VIEWPORT (768px REALISTIC IPAD ENCLOSURE) */}
          {/* ========================================================= */}
          {activeDevice === 'tablet' && (
            <div className="py-8 px-4 flex justify-center min-h-full">
              <div className="w-full max-w-[768px] rounded-[24px] overflow-hidden border-[10px] border-[#161a29] bg-black shadow-2xl relative shadow-black/80">
                
                {/* Tablet Top Camera Hole */}
                <div className="h-5 bg-[#161a29] flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-black/70 border border-white/10" />
                </div>

                {/* Tablet Display Content */}
                <img
                  src={tabletSrc}
                  alt={`${project.name} Tablet View`}
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE C: MOBILE VIEWPORT (390px REALISTIC SMARTPHONE FRAME) */}
          {/* ========================================================= */}
          {activeDevice === 'mobile' && (
            <div className="py-8 px-4 flex justify-center min-h-full">
              <div className="w-full max-w-[390px] rounded-[40px] overflow-hidden border-[12px] border-[#181d2e] bg-black shadow-2xl relative shadow-black/80 ring-1 ring-white/10">
                
                {/* Smartphone Dynamic Island / Speaker Pill */}
                <div className="h-7 bg-black flex items-center justify-center relative">
                  <div className="w-24 h-4 rounded-full bg-[#121624] border border-white/10 flex items-center justify-end px-2">
                    <span className="w-2 h-2 rounded-full bg-[#0066FF]/80" />
                  </div>
                </div>

                {/* Mobile Display Content */}
                <img
                  src={mobileSrc}
                  alt={`${project.name} Mobile View`}
                  className="w-full h-auto block select-none"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  onLoad={() => setImageLoaded(true)}
                />

                {/* Smartphone Bottom Home Indicator Bar */}
                <div className="h-5 bg-black flex items-center justify-center">
                  <div className="w-28 h-1 rounded-full bg-white/30" />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* MODE D: RESPONSIVE MATRIX (SIDE-BY-SIDE) */}
          {/* ========================================================= */}
          {activeDevice === 'matrix' && (
            <div className="p-6 min-h-full space-y-6">
              
              <div className={`grid grid-cols-1 gap-6 items-start ${
                hasTablet && hasMobile ? 'lg:grid-cols-[6fr_3.5fr_2.5fr]' :
                hasTablet ? 'lg:grid-cols-[6fr_3.5fr]' :
                hasMobile ? 'lg:grid-cols-[6fr_2.5fr]' : ''
              }`}>

                {/* Desktop Preview Column */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>دسکتاپ سازمانی (۱۴۴۰px)</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">DESKTOP</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg">
                    <img
                      src={desktopSrc}
                      alt={`${project.name} Desktop`}
                      className="w-full h-auto block"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Tablet Preview Column (only if tablet image exists) */}
                {hasTablet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span className="flex items-center gap-1.5">
                      <Tablet className="w-3.5 h-3.5 text-cyan-400" />
                      <span>تبلت (۷۶۸px)</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">TABLET</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg">
                    <img
                      src={tabletSrc}
                      alt={`${project.name} Tablet`}
                      className="w-full h-auto block"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                </div>
                )}

                {/* Mobile Preview Column (only if mobile image exists) */}
                {hasMobile && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300 font-bold px-1">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>موبایل (۳۹۰px)</span>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400">MOBILE</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/15 bg-black/60 shadow-lg">
                    <img
                      src={mobileSrc}
                      alt={`${project.name} Mobile`}
                      className="w-full h-auto block"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                </div>
                )}

              </div>

            </div>
          )}

        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. SUBTEXT & VIEWPORT AUDIT SPECS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span>موتور رندرینگ ریسپانسیو فعال</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleScrollToBottom}
            className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>انتهای طرح</span>
            <ArrowDown className="w-3 h-3" />
          </button>
          <span className="text-slate-600">•</span>
          <span className="text-white font-bold">{activeDevice.toUpperCase()} VIEWPORT</span>
        </div>
      </div>

    </div>
  );
};
