import React, { useRef } from 'react';
import { Project } from '../types';
import { toPersianDigits } from '../utils/persian';
import { getProjectImage } from '../data/projectImages';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Target, 
  Layout, 
  Palette, 
  ShieldCheck, 
  Globe,
  FileCode
} from 'lucide-react';

interface ProjectPdfExportModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectPdfExportModal: React.FC<ProjectPdfExportModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const printSheetRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# شناسنامه و گزارش اجرایی دیزاین: ${project.displayNameFa || project.name}
**کارفرما / برند:** ${project.clientFa || project.brand}
**دسته‌بندی:** ${project.typeFa}
**سال:** ${project.year || 1403}
**محیط کاربری:** ${project.platformFa || 'دسکتاپ، تبلت و موبایل'}

---

## ۱. خلاصه مدیریتی پروژه
${project.description || project.shortDescription || 'طراحی رابط و تجربه کاربری سامانه بر اساس استانداردهای ملی و شرکتی.'}

---

## ۲. صورت‌مسئله و اهداف دیزاین (Challenge)
${project.challenge || 'ارتقای تجربه کاربری، بهینه‌سازی جریان‌های تعاملی و ارتقای هویت بصری برند.'}

---

## ۳. معماری اطلاعات و استراتژی تجربه کاربری (UX Strategy)
${project.approach || 'تدوین ساختار اطلاعاتی منعطف، تسهیل دسترسی به خدمات و ایجاد پروتوتایپ‌های تعاملی.'}

---

## ۴. دیزاین سیستم و هویت بصری (Design System)
${project.solution || 'استفاده از تایپوگرافی استاندارد ایران‌یکان، سیستم گرید ۱۲ ستونه و کتابخانه کامپوننت‌های مدرن.'}

---

## ۵. دستاوردها و شاخص‌های فنی (Deliverables)
- پیاده‌سازی ۱۰۰٪ واکنش‌گرا (دسکتاپ، تبلت، موبایل)
- تطابق با استانداردهای وب سازمانی و پرفورمنس بالا
- مستندسازی کامل برای تیم توسعه فرانت‌اند

---
*تولید شده توسط پلتفرم جامع ارائه نمونه‌کارهای طراحی UI/UX*
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `case-study-${project.slug || project.id}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJSON = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-${project.slug || project.id}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-right">
      <div className="w-full max-w-5xl h-[92vh] rounded-3xl bg-[#0b0f1d] border border-white/15 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Modal Header & Controls (Hidden in Print) */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/[0.02] print:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  خروجی پرونده و گزارش رسمی PDF پروژه
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تولید سند استاندارد A4 مناسب ارائه، چاپ یا آرشیو اسناد
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0066FF]/30 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <Printer className="w-4 h-4" />
              <span>چاپ مستقیم یا ذخیره PDF (کلید Ctrl+P)</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              title="دریافت متن کامل خلاصه دیزاین با فرمت Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">دانلود متن (MD)</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              title="دریافت دیتای کامل JSON این پروژه"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON پروژه</span>
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheet Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#05070e] flex justify-center">
          
          {/* ========================================================= */}
          {/* THE PRINTABLE EXECUTIVE DOSSIER (A4 FORMATTED) */}
          {/* ========================================================= */}
          <div 
            id="printable-project-sheet"
            ref={printSheetRef}
            className="w-full max-w-[800px] bg-white text-slate-900 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-8 print:p-0 print:shadow-none print:rounded-none print:max-w-none"
            style={{ minHeight: '1100px' }}
          >
            
            {/* Header: Organization & Briefing Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-[#0066FF] tracking-wider uppercase">
                  EXECUTIVE DESIGN REVIEW & CASE STUDY
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  {project.displayNameFa || project.name}
                </h1>
                <div className="text-xs text-slate-600 font-medium">
                  شناسنامه رسمی طراحی رابط و تجربه کاربری (UI/UX Case Study)
                </div>
              </div>

              {/* Brand & Project Code Stamp */}
              <div className="text-left space-y-1 pl-2 border-l-2 border-slate-200">
                <div className="text-xs font-black text-slate-900 font-mono">
                  {project.clientFa || project.brand}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  سال: {toPersianDigits(project.year || 1403)}
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] font-bold border border-blue-200 inline-block">
                  پروژه تایید شده
                </div>
              </div>
            </div>

            {/* Project Quick Meta Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">کارفرما / برند:</span>
                <strong className="text-slate-900">{project.clientFa || project.brand}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">نوع محصول:</span>
                <strong className="text-slate-900">{project.typeFa}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">محیط اجرایی:</span>
                <strong className="text-slate-900">{project.platformFa || 'دسکتاپ، تبلت، موبایل'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">سیستم طراحی:</span>
                <strong className="text-[#0066FF]">کامپوننت اختصاصی</strong>
              </div>
            </div>

            {/* Executive Overview Paragraph */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-r-4 border-[#0066FF] pr-2">
                <span>۱. خلاصه اجرایی و شرح پروژه</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                {project.description || project.shortDescription || 'این پروژه به منظور استانداردسازی تجربه کاربری، یکپارچگی هویت بصری و ارتقای نرخ تبدیل تعامل کاربران پیاده‌سازی شده و کلیه سناریوهای واکنش‌گرایی آن در محیط‌های دسکتاپ و موبایل طراحی و مستند شده است.'}
              </p>
            </div>

            {/* 4 Core Design Pillars */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-r-4 border-[#0066FF] pr-2">
                <span>۲. ارکان معماری و استراتژی دیزاین</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Target className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>صورت‌مسئله و چالش اصلی (Challenge)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {project.challenge || 'ارتقای نرخ تعامل کاربران، بهبود شاخص‌های بارگذاری بصری و خلق تجربه کاربری روان در راستای جایگاه برند.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Layout className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>معماری اطلاعات و ساختار (IA)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {project.approach || 'تدوین سلسله‌مراتب بصری داده‌ها، ناوبری ماژولار چندسطحی و دسترسی سریع به کاتالوگ و خدمات.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Palette className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>دیزاین سیستم و هویت بصری</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    {project.solution || 'استفاده از تایپوگرافی مهندسی‌شده ایران‌یکان، سیستم گرید ۱۲ ستونه و متغیرهای رنگی اختصاصی.'}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0066FF]" />
                    <span>دستاوردهای پیاده‌سازی</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    طراحی پروتوتایپ تعاملی کامل، آماده‌سازی فایل‌های فیگما برای برنامه‌نویسان و تضمین پرفورمنس بصری.
                  </p>
                </div>

              </div>
            </div>

            {/* Visual Snapshots Preview */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-slate-950 flex items-center gap-1.5 border-r-4 border-[#0066FF] pr-2">
                <span>۳. پیش‌نمایش گرافیکی طرح نهایی</span>
              </h2>

              <div className="rounded-xl overflow-hidden border border-slate-300 bg-slate-100 shadow-sm">
                <img
                  src={project.hero || project.cover || getProjectImage(project.id, project.type, 'hero')}
                  alt={project.name}
                  className="w-full h-auto max-h-[360px] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Document Footer Sign-off Block */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div>
                <span>تیم دیزاین و تجربه کاربری سایه</span>
                <span className="mx-2">•</span>
                <span>پاییز ۱۴۰۲ - بهار ۱۴۰۵</span>
              </div>
              <div className="text-left">
                <span>صفحه ۱ از ۱</span>
                <span className="mx-2">•</span>
                <span>CONFIDENTIAL / داخلی</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
