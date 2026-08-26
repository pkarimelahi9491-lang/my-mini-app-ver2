import React, { useState, useRef, useEffect } from 'react';
import { Project } from '../types';
import { getProjectImage } from '../data/projectImages';
import { toPersianDigits } from '../utils/persian';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Globe,
  Sliders
} from 'lucide-react';

interface FullPageShowcaseProps {
  project: Project;
  initialDevice?: 'desktop' | 'tablet' | 'mobile';
  heightClassName?: string;
  showAllControls?: boolean;
}

export const FullPageShowcase: React.FC<FullPageShowcaseProps> = ({
  project,
  initialDevice = 'desktop',
  heightClassName = 'h-[580px] sm:h-[680px]',
  showAllControls = true
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(initialDevice);
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);

  // Handle scroll progress tracking
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll <= 0) return;
    const currentProgress = Math.round((scrollTop / maxScroll) * 100);
    setScrollProgress(currentProgress);

    // Section detection
    if (currentProgress < 25) setActiveSection('hero');
    else if (currentProgress < 50) setActiveSection('features');
    else if (currentProgress < 75) setActiveSection('specs');
    else setActiveSection('footer');
  };

  // Auto-scroll loop
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = window.setInterval(() => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const maxScroll = scrollHeight - clientHeight;
        
        if (scrollTop >= maxScroll - 5) {
          containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          containerRef.current.scrollTop += 2;
        }
      }, 30);
    } else {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling]);

  // Jump to section
  const scrollToSection = (section: 'hero' | 'features' | 'specs' | 'footer') => {
    if (!containerRef.current) return;
    const { scrollHeight, clientHeight } = containerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    let target = 0;

    if (section === 'hero') target = 0;
    if (section === 'features') target = maxScroll * 0.35;
    if (section === 'specs') target = maxScroll * 0.7;
    if (section === 'footer') target = maxScroll;

    containerRef.current.scrollTo({ top: target, behavior: 'smooth' });
    setActiveSection(section);
  };

  const handleResetScroll = () => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    setIsAutoScrolling(false);
  };

  return (
    <div className={`relative w-full rounded-xl bg-[#050508] border border-white/5 shadow-sm overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-32px)]' : ''}`}>
      
      {/* ------------------------------------------------------------- */}
      {/* TOP CONTROL BAR (Obsidian + Signature Blue) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#08080c] border-b border-white/5 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-30">
        
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => { setDevice('desktop'); setZoomLevel(100); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              device === 'desktop'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="نمای دسکتاپ (۱۴۴۰ پیکسل)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">دسکتاپ</span>
          </button>

          <button
            onClick={() => { setDevice('tablet'); setZoomLevel(100); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              device === 'tablet'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="نمای تبلت"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">تبلت</span>
          </button>

          <button
            onClick={() => { setDevice('mobile'); setZoomLevel(100); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
              device === 'mobile'
                ? 'bg-[#0066FF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="نمای موبایل"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">موبایل</span>
          </button>
        </div>

        {/* Section Navigator & Auto-Scroll */}
        <div className="flex items-center gap-2">
          {/* Quick Jump Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5 text-[11px]">
            <button
              onClick={() => scrollToSection('hero')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeSection === 'hero' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              هیرو
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeSection === 'features' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              محصولات
            </button>
            <button
              onClick={() => scrollToSection('specs')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeSection === 'specs' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              مشخصات
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className={`px-2 py-0.5 rounded transition-colors ${
                activeSection === 'footer' ? 'bg-white/10 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              فوتر
            </button>
          </div>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isAutoScrolling
                ? 'bg-[#0066FF]/20 border-[#0066FF] text-[#0066FF]'
                : 'bg-black/50 border-white/5 text-slate-300 hover:text-white'
            }`}
            title="پیمایش خودکار"
          >
            {isAutoScrolling ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current text-[#0066FF]" />}
            <span>{isAutoScrolling ? 'توقف' : 'اسکرول خودکار'}</span>
          </button>

          {/* Reset Scroll */}
          <button
            onClick={handleResetScroll}
            className="p-1 rounded-lg bg-black/50 border border-white/5 text-slate-400 hover:text-white transition-colors"
            title="ابتدای صفحه"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scroll Depth & Zoom */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-medium text-[11px] text-slate-400 bg-black/50 px-2 py-1 rounded border border-white/5">
            <span className="text-[#0066FF] font-bold">اسکرول:</span>
            <span>{toPersianDigits(scrollProgress)}٪</span>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-black/50 p-1 rounded border border-white/5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(60, prev - 15))}
              className="p-0.5 text-slate-400 hover:text-white"
              title="کوچک‌نمایی"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-medium text-slate-400 px-1">{toPersianDigits(zoomLevel)}٪</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(120, prev + 15))}
              className="p-0.5 text-slate-400 hover:text-white"
              title="بزرگ‌نمایی"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded bg-black/50 border border-white/5 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* VIEWPORT CANVAS */}
      {/* ------------------------------------------------------------- */}
      <div className={`relative flex-1 bg-[#020204] overflow-hidden flex items-start justify-center p-2 sm:p-4 ${heightClassName}`}>
        
        {/* DESKTOP VIEW */}
        {device === 'desktop' && (
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[1080px] h-full rounded-xl bg-[#040407] border border-white/5 overflow-hidden flex flex-col shadow-sm transition-transform duration-200"
          >
            {/* Desktop Browser Top Bar */}
            <div className="h-8 bg-[#08080c] border-b border-white/5 px-3 flex items-center justify-between text-xs text-slate-400 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded bg-black/60 border border-white/5 text-[11px] font-mono text-slate-300 max-w-[300px] truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" />
                <span>https://{project.client.toLowerCase()}.design</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">1440 PX</span>
            </div>

            {/* Scrollable Landing Page Canvas */}
            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto overflow-x-hidden bg-[#030305] scroll-smooth relative"
            >
              <LandingPageContent project={project} device="desktop" />
            </div>
          </div>
        )}

        {/* TABLET VIEW */}
        {device === 'tablet' && (
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[580px] h-full rounded-xl bg-[#08080c] border border-white/10 shadow-sm overflow-hidden flex flex-col p-1.5 transition-transform duration-200"
          >
            <div className="h-5 bg-[#08080c] flex items-center justify-between px-3 text-[10px] text-slate-400 select-none">
              <span>09:41</span>
              <div className="w-1.5 h-1.5 rounded-full bg-black border border-white/10" />
              <span>۱۰۰٪</span>
            </div>

            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 rounded-lg overflow-y-auto overflow-x-hidden bg-[#030305] border border-white/5 scroll-smooth"
            >
              <LandingPageContent project={project} device="tablet" />
            </div>
          </div>
        )}

        {/* MOBILE VIEW */}
        {device === 'mobile' && (
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-[320px] h-full rounded-3xl bg-black border-2 border-white/10 shadow-sm overflow-hidden flex flex-col p-1 transition-transform duration-200"
          >
            <div className="h-7 bg-black flex items-center justify-between px-4 text-[10px] text-slate-400 select-none">
              <span className="font-bold text-white">9:41</span>
              <div className="w-16 h-3 bg-[#111118] rounded-full border border-white/5" />
              <span className="font-mono text-[9px]">5G</span>
            </div>

            <div
              ref={containerRef}
              onScroll={handleScroll}
              className="flex-1 rounded-2xl overflow-y-auto overflow-x-hidden bg-[#030305] border border-white/5 scroll-smooth pb-4"
            >
              <LandingPageContent project={project} device="mobile" />
            </div>

            <div className="h-3 bg-black flex items-center justify-center">
              <div className="w-20 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        )}

      </div>

      {/* Mini-Map Bar */}
      <div className="h-1 w-full bg-black relative">
        <div 
          className="h-full bg-[#0066FF] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

    </div>
  );
};

// ----------------------------------------------------------------------
// FULL HIGH-FIDELITY SCROLLABLE PHOTOGRAPHIC LANDING PAGE SIMULATOR
// ----------------------------------------------------------------------
interface LandingContentProps {
  project: Project;
  device: 'desktop' | 'tablet' | 'mobile';
}

const LandingPageContent: React.FC<LandingContentProps> = ({ project, device }) => {
  const isMobile = device === 'mobile';
  const heroImg = project.hero || getProjectImage(project.id, project.type, 'hero');
  const pdpImg = getProjectImage(project.id, project.type, 'gallery');
  const mobileImg = project.mobile || getProjectImage(project.id, project.type, 'mobile');

  return (
    <div className="w-full text-right text-slate-200 select-none">
      
      {/* 1. BRAND NAVIGATION BAR */}
      <nav className="sticky top-0 z-20 w-full bg-[#050508]/95 backdrop-blur-md border-b border-white/5 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#0066FF] text-white flex items-center justify-center font-bold text-[10px]">
            {project.client.charAt(0)}
          </div>
          <span className="font-bold text-white text-xs">
            {project.client}
          </span>
          {!isMobile && (
            <span className="text-[10px] text-slate-400 border-s border-white/10 ps-2 ms-2">
              {project.clientFa}
            </span>
          )}
        </div>

        {!isMobile && (
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="text-white font-medium">محصولات</span>
            <span>نوآوری‌ها</span>
            <span>مشخصات فنی</span>
            <span>نمایندگی‌ها</span>
          </div>
        )}

        <div className="px-2.5 py-1 rounded text-[10px] font-medium bg-[#0066FF] text-white">
          {isMobile ? 'سفارش' : 'استعلام قیمت'}
        </div>
      </nav>

      {/* 2. PHOTOGRAPHIC HERO BANNER */}
      <section className="relative px-4 sm:px-6 py-6 sm:py-8 border-b border-white/5 overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
            <Sparkles className="w-3 h-3 text-[#0066FF]" />
            <span>تجربه دیجیتال • {project.year}</span>
          </div>

          <h1 className={`${isMobile ? 'text-lg' : 'text-2xl sm:text-3xl'} font-extrabold text-white leading-tight`}>
            {project.name}
          </h1>

          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-slate-300 leading-relaxed max-w-xl`}>
            {project.description}
          </p>
        </div>

        {/* Hero Photographic Banner Container */}
        <div className="mt-5 rounded-lg overflow-hidden border border-white/5 bg-[#08080c]">
          <img
            src={heroImg}
            alt={project.name}
            className="w-full h-48 sm:h-72 object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
      </section>

      {/* 3. PRODUCT SHOWCASE & IMAGES */}
      <section className="px-4 sm:px-6 py-6 border-b border-white/5 bg-[#040406] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-white`}>
            نمای محصول و جزئیات بصری
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">UI DETAIL</span>
        </div>

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
          <div className="rounded-lg overflow-hidden border border-white/5 bg-[#08080c]">
            <img
              src={pdpImg}
              alt={`نمای صفحه محصول ${project.name}`}
              className="w-full h-40 sm:h-52 object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="p-2.5 text-xs text-slate-300 font-medium">
              صفحه مشخصات فنی و تجربه انتخاب مدل
            </div>
          </div>

          <div className="rounded-lg overflow-hidden border border-white/5 bg-[#08080c]">
            <img
              src={mobileImg}
              alt={`نسخه موبایل ${project.name}`}
              className="w-full h-40 sm:h-52 object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="p-2.5 text-xs text-slate-300 font-medium">
              نسخه بهینه‌سازی شده موبایل و تعاملات لمسی
            </div>
          </div>
        </div>
      </section>

      {/* 4. DESIGN DECISION MATRIX */}
      <section className="px-4 sm:px-6 py-6 border-b border-white/5 space-y-4">
        <h2 className={`${isMobile ? 'text-sm' : 'text-lg'} font-bold text-white`}>
          ماتریس تصمیم‌گیری طراحی
        </h2>

        <div className="space-y-2.5">
          {project.designDecisions?.slice(0, 3).map((d, idx) => (
            <div key={idx} className="rounded-lg bg-[#08080c] border border-white/5 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-4 h-4 rounded bg-[#0066FF] text-white font-mono text-[10px] flex items-center justify-center">
                    {d.number}
                  </span>
                  <span>{d.title}</span>
                </div>
                {d.impactArea && (
                  <span className="text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                    {d.impactArea}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pr-5">
                {d.decision}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="px-4 py-6 bg-[#020203] text-center space-y-2">
        <div className="text-xs font-bold text-white">{project.clientFa} — طراحی و توسعه تجربه کاربری</div>
        <div className="text-[10px] font-mono text-slate-500">
          SHADOW UI/UX ARCHIVE • {project.year}
        </div>
      </footer>

    </div>
  );
};
