import React, { useEffect, useState, useRef } from 'react';
import { Project, GalleryItem } from '../types';
import { toPersianDigits } from '../utils/persian';
import { ScrollableBrowserFrame } from './ScrollableBrowserFrame';
import { WebsiteExplorer } from './WebsiteExplorer';
import { ProjectPdfExportModal } from './ProjectPdfExportModal';
import { getProjectImage } from '../data/projectImages';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { 
  ArrowRight, 
  ArrowLeft, 
  FileDown, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Eye,
  CheckCircle2,
  Target,
  Sparkles,
  ExternalLink,
  Code2,
  Layout,
  Palette,
  ShieldCheck,
  FolderArchive,
  X,
  Maximize2,
  FileText
} from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  onBack: () => void;
  onSelectProject: (project: Project) => void;
  onOpenLightbox: (item: GalleryItem, galleryList: GalleryItem[]) => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({
  project,
  allProjects,
  onBack,
  onSelectProject,
  onOpenLightbox
}) => {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfPage, setPdfPage] = useState(1);

  // Next / Previous projects navigation
  const currentIndex = allProjects.findIndex(p => p.id === project.id);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const nextProject = allProjects[(safeIndex + 1) % allProjects.length];
  const prevProject = allProjects[(safeIndex - 1 + allProjects.length) % allProjects.length];

  // Exactly 3 other related projects
  const otherProjects = allProjects
    .filter(p => p.id !== project.id)
    .slice(0, 3);

  // Global keyboard shortcuts for Next / Prev / ESC back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        onBack();
      } else if (e.key === 'ArrowLeft' && project.id !== 'snowa-summer-1405-app') {
        // در پروژه قرعه‌کشی، فلش‌ها توسط اسلایدر مراحل مدیریت می‌شوند
        onSelectProject(nextProject);
      } else if (e.key === 'ArrowRight' && project.id !== 'snowa-summer-1405-app') {
        onSelectProject(prevProject);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextProject, prevProject, onBack, onSelectProject, project.id]);

  // Combine and deduplicate project gallery assets
  const combinedGallery: GalleryItem[] = [
    ...(project.gallery || []).map(g => ({
      ...g,
      image: g.image || g.imageUrl || '',
      imageUrl: g.imageUrl || g.image || ''
    })),
    ...(project.assets || []).map(a => ({
      id: a.id,
      title: a.title || 'فریم رابط کاربری',
      caption: a.caption || '',
      category: (a.category?.toUpperCase() === 'UX' ? 'UX' : a.category === 'mobile' ? 'Mobile' : a.category === 'desktop' ? 'Desktop' : 'UI') as any,
      image: a.src,
      imageUrl: a.src,
      aspectRatio: '16:10'
    }))
  ];

  const uniqueGallery = combinedGallery.filter((v, i, a) => {
    const src = v.image || v.imageUrl;
    return a.findIndex(t => (t.image || t.imageUrl) === src) === i;
  });

  const handleOpenPDF = () => {
    setPdfModalOpen(true);
  };

  const handleFrameLightbox = (src: string, title: string) => {
    onOpenLightbox(
      {
        id: 'main-frame-view',
        title: title,
        category: 'UI',
        caption: project.displayNameFa || project.name,
        image: src,
        imageUrl: src
      },
      uniqueGallery.length > 0 ? uniqueGallery : [{
        id: 'main-frame-view',
        title: title,
        category: 'UI',
        caption: project.displayNameFa || project.name,
        image: src,
        imageUrl: src
      }]
    );
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-24 space-y-12 text-right print:pt-4 print:pb-4 print:space-y-6">
      
      {/* ------------------------------------------------------------- */}
      {/* TOP NAVIGATION & ACTIONS */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span>بازگشت به آرشیو پروژه‌ها</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* Export PDF Button */}
          <button
            onClick={handleOpenPDF}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-xs font-bold text-white transition-all cursor-pointer shadow-md shadow-[#0066FF]/20 hover:scale-[1.02]"
            title="مشاهده و چاپ گزارش رسمی PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>خروجی و چاپ پرونده PDF</span>
          </button>

          {/* Next / Prev Project */}
          <div className="flex items-center gap-1 border-r border-white/10 pr-2 mr-1">
            <button
              onClick={() => onSelectProject(prevProject)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="پروژه قبلی (→)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectProject(nextProject)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="پروژه بعدی (←)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* GALLERY-FOCUSED LAYOUT: snowa-summer-1405-app (Lottery Platform) */}
      {/* ------------------------------------------------------------- */}
      {project.id === 'snowa-summer-1405-app' ? (
        <>
          {/* Project Header - Compact */}
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3.5 py-1 rounded-lg bg-[#0066FF]/15 text-[#388bfd] border border-[#0066FF]/30 font-bold">
                {project.clientFa || project.brand}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                {project.typeFa}
              </span>
              {project.year && (
                <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-mono">
                  سال {toPersianDigits(project.year)}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              {project.displayNameFa || project.name}
            </h1>
            {project.description && (
              <p className="text-sm text-slate-300 leading-loose max-w-3xl">
                {project.description}
              </p>
            )}
          </section>

          {/* Lottery Process Slider (TV / Desktop Screens) */}
          {uniqueGallery.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#0066FF]" />
                  <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    مراحل فرآیند قرعه‌کشی ({toPersianDigits(uniqueGallery.length)} صفحه — نسخه تلویزیون)
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  با فلش‌ها، کشیدن انگشت یا کلیک ورق بزنید
                </span>
              </div>
              <FestivalTVGallery items={uniqueGallery} />
            </section>
          )}
        </>
      ) : (
      <>
      {/* ------------------------------------------------------------- */}
      {/* 1. PROJECT HEADER & SUMMARY INFO */}
      {/* ------------------------------------------------------------- */}
      <section className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Title & Overview */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <span className="px-3.5 py-1 rounded-lg bg-[#0066FF]/15 text-[#388bfd] border border-[#0066FF]/30 font-bold">
                {project.clientFa || project.brand}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10">
                {project.typeFa}
              </span>
              {project.year && (
                <span className="px-3 py-1 rounded-lg bg-white/5 text-slate-400 border border-white/10 font-mono">
                  سال {toPersianDigits(project.year)}
                </span>
              )}
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                آماده لانچ و استقرار
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug">
              {project.displayNameFa || project.name}
            </h1>

            {project.description && (
              <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl pt-1">
                {project.description}
              </p>
            )}
          </div>

          {/* Clean Specs Card */}
          <div className="lg:col-span-4 rounded-2xl bg-[#0a0e1c] border border-white/10 p-5 space-y-3.5 shadow-xl">
            <div className="text-xs sm:text-sm font-bold text-white border-b border-white/5 pb-2.5 flex items-center justify-between">
              <span>شناسنامه و مشخصات اجرایی</span>
              <Layers className="w-4 h-4 text-[#0066FF]" />
            </div>
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">کارفرما / برند:</span>
                <span className="text-white font-bold">{project.clientFa || project.brand}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">دسته‌بندی پلتفرم:</span>
                <span className="text-white font-medium">{project.typeFa}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-slate-400">سال انتشار و بازطراحی:</span>
                <span className="text-white font-mono">{toPersianDigits(project.year || '—')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">محیط کاربری:</span>
                <span className="text-[#0066FF] font-medium">{project.platformFa || 'دسکتاپ، تبلت و موبایل'}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 2. DESIGN ARCHITECTURE & SPECS (4-PILLAR BENTO GRID) */}
      {/* ------------------------------------------------------------- */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Challenge & Goals */}
        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF]">
            <Target className="w-4 h-4" />
            <span>هدف و صورت‌مسئله دیزاین</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.challenge || 'ارتقای نرخ تعامل کاربران، بهبود شاخص‌های بارگذاری بصری و خلق تجربه کاربری روان در راستای جایگاه برند.'}
          </p>
        </div>

        {/* Pillar 2: UX Architecture */}
        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <Layout className="w-4 h-4" />
            <span>معماری اطلاعات و ساختار</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.approach || 'تدوین سلسله‌مراتب بصری داده‌ها، ناوبری ماژولار چندسطحی و دسترسی سریع به کاتالوگ و مشخصات فنی.'}
          </p>
        </div>

        {/* Pillar 3: Design System & Tokens */}
        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
            <Palette className="w-4 h-4" />
            <span>دیزاین سیستم و هویت برند</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {project.solution || 'استفاده از تایپوگرافی مهندسی‌شده ایران‌یکان، سیستم گرید ۱۲ ستونه، متغیرهای توکن رنگی و کامپوننت‌های اتمیک.'}
          </p>
        </div>

        {/* Pillar 4: Deliverables */}
        <div className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 space-y-2.5 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>دستاوردها و خروجی‌ها</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            پروتوتایپ تعاملی کامل، راهنمای استقرار مهندسی، سناریوهای واکنش‌گرایی دسکتاپ، تبلت و موبایل بدون افت کیفیت.
          </p>
        </div>

      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. WEBSITE EXPLORER (multi-page) OR BROWSER FRAME (landing) */}
      {/* ------------------------------------------------------------- */}
      {project.websitePages && project.websitePages.length > 0 ? (
        <WebsiteExplorer project={project} />
      ) : (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066FF]" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                ویترین و فریم مرورگر خروجی دیزاین (دسکتاپ، تبلت، موبایل)
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              اسکرول عمودی تعاملی داخل فریم
            </span>
          </div>

          <ScrollableBrowserFrame
            project={project}
            onOpenLightbox={handleFrameLightbox}
          />
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PDF LIVE VIEWER (IF AVAILABLE) */}
      {/* ------------------------------------------------------------- */}
      {project.pdfUrl && (
        <section className="space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <FileText className="w-4 h-4 text-[#0066FF]" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              نمایشگر زنده PDF
            </h2>
          </div>

          {/* PDF Navigation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#090d1a] border border-white/10">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfPage(p => Math.max(1, p - 1))}
                disabled={pdfPage <= 1}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30 cursor-pointer hover:bg-white/10 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-1.5 text-sm text-white font-bold">
                <span>صفحه</span>
                <input
                  type="number"
                  min={1}
                  value={pdfPage}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 1) setPdfPage(v);
                  }}
                  className="w-14 text-center px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#0066FF]"
                />
              </div>
              <button
                onClick={() => setPdfPage(p => p + 1)}
                className="p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <a
              href={project.pdfUrl}
              download
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold transition-all cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>دانلود PDF</span>
            </a>
          </div>

          {/* PDF Iframe */}
          <div className="rounded-2xl overflow-hidden bg-[#0c0e1a] border border-white/10 shadow-2xl">
            <div className="aspect-[4/3] w-full">
              <iframe
                src={`${project.pdfUrl}#page=${pdfPage}`}
                className="w-full h-full border-0"
                title={`PDF پروژه ${project.displayNameFa || project.name}`}
                key={`${project.pdfUrl}#${pdfPage}`}
              />
            </div>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. DESIGN FRAMES & SCREENS GALLERY (IF AVAILABLE) */}
      {/* ------------------------------------------------------------- */}
      {uniqueGallery.length > 0 && (
        <section className="space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#0066FF]" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                فریم‌ها و اسکرین‌های تکمیلی ({toPersianDigits(uniqueGallery.length)})
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              جهت بزرگ‌نمایی روی هر کارت کلیک کنید
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {uniqueGallery.map((item) => (
              <div
                key={item.id}
                onClick={() => onOpenLightbox(item, uniqueGallery)}
                className="group rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-[#0066FF] transition-all p-3 space-y-3 cursor-pointer shadow-md hover:shadow-xl hover:shadow-[#0066FF]/10"
              >
                <div className="aspect-[16/10] rounded-xl bg-black/40 border border-white/5 overflow-hidden relative">
                  <img
                    src={item.image || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover object-top rounded-lg group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3.5 py-1.5 rounded-xl bg-black/80 text-white text-xs font-bold border border-white/20">
                      مشاهده بزرگ‌نمایی
                    </span>
                  </div>
                </div>

                <div className="px-1 flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#0066FF] transition-colors truncate">
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. OTHER PROJECTS (EXACTLY 3 STANDARDIZED CARDS) */}
      {/* ------------------------------------------------------------- */}
      {otherProjects.length > 0 && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              سایر پروژه‌های طراحی
            </h2>
            <span className="text-xs text-slate-400">
              نمایش ۳ پروژه منتخب
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherProjects.map((oProj) => (
              <div
                key={oProj.id}
                onClick={() => onSelectProject(oProj)}
                className="bg-[#0a0e1c] rounded-2xl border border-white/10 hover:border-[#0066FF] p-3.5 space-y-3 cursor-pointer group transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#0066FF]/20 flex flex-col justify-between"
              >
                {/* Standardized 16:10 Aspect Ratio Image */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/50 border border-white/5 relative">
                  <img 
                    src={oProj.cover || getProjectImage(oProj.id, oProj.type, 'cover')} 
                    alt={oProj.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Only Project Title */}
                <div className="px-1 py-1">
                  <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-[#0066FF] transition-colors truncate leading-snug">
                    {oProj.displayNameFa || oProj.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. PREVIOUS / NEXT FOOTER CONTROLS */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 print:hidden">
        <button
          onClick={() => onSelectProject(prevProject)}
          className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-[#0066FF] text-right space-y-2 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-[#0066FF] transition-colors">
            <ArrowRight className="w-4 h-4" />
            <span>پروژه قبلی (کلید →)</span>
          </div>
          <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#0066FF] transition-colors">
            {prevProject.displayNameFa || prevProject.name}
          </div>
        </button>

        <button
          onClick={() => onSelectProject(nextProject)}
          className="p-5 rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-[#0066FF] text-left space-y-2 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-end gap-2 text-xs text-slate-400 group-hover:text-[#0066FF] transition-colors">
            <span>پروژه بعدی (کلید ←)</span>
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div className="text-sm sm:text-base font-bold text-white group-hover:text-[#0066FF] transition-colors">
            {nextProject.displayNameFa || nextProject.name}
          </div>
        </button>
      </div>

      {/* PDF Export & Print Sheet Modal */}
      <ProjectPdfExportModal
        project={project}
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />

    </div>
  );
};

// -----------------------------------------------------------
// Festival TV App: Step-by-step Lottery Process Slider (TV/Desktop)
// -----------------------------------------------------------
const FestivalTVGallery: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
  const [index, setIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const safeIndex = Math.min(index, Math.max(0, items.length - 1));
  const currentItem = items[safeIndex];

  const goTo = (i: number) => setIndex(Math.max(0, Math.min(items.length - 1, i)));
  const goNext = () => goTo(safeIndex + 1);
  const goPrev = () => goTo(safeIndex - 1);

  useBodyScrollLock(isFullscreen);

  // Reset to first step when gallery data changes
  useEffect(() => {
    setIndex(0);
  }, [items.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
      else if (e.key === 'ArrowLeft') goNext();
      else if (e.key === 'ArrowRight') goPrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFullscreen, safeIndex, items.length]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) goNext();
      else goPrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <>
      {/* Slider Stage */}
      <div className="space-y-4">
        <div
          className="relative rounded-2xl overflow-hidden bg-[#04060d] border border-white/10 shadow-2xl group aspect-video select-none"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            key={safeIndex}
            src={currentItem?.image || currentItem?.imageUrl}
            alt={currentItem?.title || `مرحله ${toPersianDigits(safeIndex + 1)}`}
            className="w-full h-full object-contain cursor-zoom-in animate-fade-in"
            referrerPolicy="no-referrer"
            onClick={() => setIsFullscreen(true)}
          />

          {/* Step Counter */}
          <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-bold pointer-events-none">
            مرحله {toPersianDigits(safeIndex + 1)} از {toPersianDigits(items.length)}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-black/80 transition-all cursor-pointer flex items-center gap-1.5"
            title="نمایش تمام‌صفحه"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>تمام‌صفحه</span>
          </button>

          {/* Navigation Arrows (RTL) */}
          <button
            onClick={goPrev}
            disabled={safeIndex === 0}
            aria-label="مرحله قبلی"
            className="absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={goNext}
            disabled={safeIndex === items.length - 1}
            aria-label="مرحله بعدی"
            className="absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Step Caption */}
        {currentItem?.title && (
          <div className="text-center space-y-1">
            <h3 className="text-sm sm:text-base font-bold text-white">{currentItem.title}</h3>
            {currentItem.caption && (
              <p className="text-xs text-slate-400">{currentItem.caption}</p>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 px-1 max-w-md mx-auto w-full" dir="rtl">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              aria-label={`رفتن به مرحله ${toPersianDigits(idx + 1)}`}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                idx === safeIndex
                  ? 'bg-[#0066FF] flex-[3]'
                  : idx < safeIndex
                  ? 'bg-[#0066FF]/40 flex-1'
                  : 'bg-white/10 flex-1'
              }`}
            />
          ))}
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:justify-center">
          {items.map((item, idx) => (
            <button
              key={item.id || idx}
              onClick={() => goTo(idx)}
              aria-label={`رفتن به مرحله ${toPersianDigits(idx + 1)}`}
              className={`flex-shrink-0 w-24 sm:w-28 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                idx === safeIndex
                  ? 'border-[#0066FF] shadow-lg shadow-[#0066FF]/30 scale-105'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="aspect-video bg-black/40">
                <img
                  src={item.image || item.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              </div>
              <div className={`px-1.5 py-1 text-[9px] font-bold truncate ${idx === safeIndex ? 'text-[#388bfd]' : 'text-slate-400'}`}>
                {item.title || `مرحله ${toPersianDigits(idx + 1)}`}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && currentItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center cursor-pointer"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute top-6 right-6 z-10 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white text-sm font-bold">
            مرحله {toPersianDigits(safeIndex + 1)} از {toPersianDigits(items.length)}
          </div>
          <img
            src={currentItem.image || currentItem.imageUrl}
            alt={currentItem.title}
            className="max-w-[92vw] max-h-[85vh] object-contain rounded-lg animate-fade-in"
            referrerPolicy="no-referrer"
            onClick={(e) => e.stopPropagation()}
          />
          {currentItem.title && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-sm font-bold whitespace-nowrap">
              {currentItem.title}
            </div>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            disabled={safeIndex === 0}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            disabled={safeIndex === items.length - 1}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white disabled:opacity-30 cursor-pointer flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        </div>
      )}
    </>
  );
};
