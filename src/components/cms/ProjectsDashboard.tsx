import React, { useState, useMemo } from 'react';
import { Project, BrandPictogramProject, DigitalCatalogProject } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { detectDuplicates } from '../../utils/readiness';
import { getProjectImage } from '../../data/projectImages';
import { SiteSettingsEditor } from './SiteSettingsEditor';
import { 
  X, Plus, Search, AlertTriangle, Download, Upload, 
  Edit3, Trash2, Copy, Eye, Star, CheckCircle, 
  Sparkles, Layers, ArrowUpDown, ChevronRight, FileJson, FileText,
  Github, Globe, Check, CheckCircle2, ShieldCheck, HardDrive,
  Grid, BookOpen, Sliders, Smartphone, ExternalLink,
  FolderArchive
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

interface ProjectsDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const ProjectsDashboard: React.FC<ProjectsDashboardProps> = ({
  isOpen,
  onClose,
  onSelectProject
}) => {
  const { 
    projects, 
    pictogramProjects,
    catalogProjects,
    siteSettings,
    brands, 
    openEditor, 
    duplicateProject, 
    deleteProject, 
    mergeProjects, 
    toggleFeatured,
    openPictogramEditor,
    duplicatePictogramProject,
    deletePictogramProject,
    openCatalogEditor,
    duplicateCatalogProject,
    deleteCatalogProject,
    exportJson, 
    exportFullBackupJson,
    exportTypeScriptData,
    importJson, 
    importFullBackupJson,
    resetToInitial,
    resetAllToInitial 
  } = useProjects();

  // Active Main CMS Tab
  const [activeMainTab, setActiveMainTab] = useState<'projects' | 'pictograms' | 'catalogs' | 'settings' | 'github_sync' | 'backup'>('projects');
  const [backupDragOver, setBackupDragOver] = useState(false);
  const [backupStatus, setBackupStatus] = useState<{ success?: boolean; message: string } | null>(null);

  // Projects Tab States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'readiness' | 'featured' | 'newest' | 'oldest' | 'alphabetical' | 'brand'>('featured');
  const [duplicateDismissed, setDuplicateDismissed] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Duplicate pairs detection for projects
  const duplicates = useMemo(() => {
    return detectDuplicates(projects);
  }, [projects]);

  // Filtered & Sorted list for projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => {
        const name = (p.name || '').toLowerCase();
        const originalName = (p.originalName || '').toLowerCase();
        const faName = (p.displayNameFa || '').toLowerCase();
        const enName = (p.displayNameEn || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const shortDesc = (p.shortDescription || '').toLowerCase();
        const tags = (p.tags || []).join(' ').toLowerCase();
        const typeVal = Array.isArray(p.type) ? p.type.join(' ') : (p.type || '');
        const typeStr = typeVal ? typeVal.toLowerCase() : '';

        return (
          name.includes(q) ||
          originalName.includes(q) ||
          faName.includes(q) ||
          enName.includes(q) ||
          brand.includes(q) ||
          desc.includes(q) ||
          shortDesc.includes(q) ||
          tags.includes(q) ||
          typeStr.includes(q)
        );
      });
    }

    if (selectedBrand !== 'all') {
      result = result.filter(p => p.brand === selectedBrand);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(p => {
        const pTypes = Array.isArray(p.type) ? p.type : [p.type];
        return pTypes.some(t => t?.toLowerCase().includes(selectedCategory.toLowerCase()));
      });
    }

    if (selectedStatus !== 'all') {
      if (selectedStatus === 'featured') {
        result = result.filter(p => p.featured);
      } else if (selectedStatus === 'missing-cover') {
        result = result.filter(p => !p.cover);
      } else if (selectedStatus === 'missing-assets') {
        result = result.filter(p => (p.gallery?.length || 0) === 0 && (p.assets?.length || 0) === 0);
      } else {
        result = result.filter(p => p.contentStatus === selectedStatus);
      }
    }

    result.sort((a, b) => {
      if (sortBy === 'featured') {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (b.caseStudyReadinessScore || 0) - (a.caseStudyReadinessScore || 0);
      }
      if (sortBy === 'readiness') {
        return (b.caseStudyReadinessScore || 0) - (a.caseStudyReadinessScore || 0);
      }
      if (sortBy === 'newest') {
        return (b.year || 0) - (a.year || 0);
      }
      if (sortBy === 'oldest') {
        return (a.year || 0) - (b.year || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'brand') {
        return (a.brand || '').localeCompare(b.brand || '');
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, selectedBrand, selectedCategory, selectedStatus, sortBy]);

  if (!isOpen) return null;

  // File import handler (auto detects projects array or full backup bundle)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const res = importJson(text);
        if (res.success) {
          setImportError(null);
          alert(`داده‌ها با موفقیت بارگذاری و همگام‌سازی شدند.`);
        } else {
          setImportError(res.error || 'خطا در بارگذاری فایل');
        }
      } catch (err: any) {
        setImportError(err.message || 'خطا در خواندن فایل');
      }
    };
    reader.readAsText(file);
  };

  // Download Handler
  const handleDownloadExport = (type: 'all_json' | 'projects_ts' | 'pictograms_ts' | 'catalogs_ts' | 'settings_ts' | 'brands_ts') => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    if (type === 'all_json') {
      content = exportFullBackupJson();
      filename = `shadow-cms-full-backup-${new Date().toISOString().slice(0, 10)}.json`;
      mimeType = 'application/json';
    } else if (type === 'projects_ts') {
      content = exportTypeScriptData('projects');
      filename = 'initialProjects.ts';
    } else if (type === 'pictograms_ts') {
      content = exportTypeScriptData('pictograms');
      filename = 'pictogramProjects.ts';
    } else if (type === 'catalogs_ts') {
      content = exportTypeScriptData('catalogs');
      filename = 'catalogProjects.ts';
    } else if (type === 'settings_ts') {
      content = exportTypeScriptData('settings');
      filename = 'siteSettings.ts';
    } else if (type === 'brands_ts') {
      content = exportTypeScriptData('brands');
      filename = 'brands.ts';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopyToClipboard = (content: string, label: string) => {
    navigator.clipboard.writeText(content);
    setCopyFeedback(`محتوای ${label} کپی شد!`);
    setTimeout(() => setCopyFeedback(null), 2500);
  };

  // Header Add Action based on active tab
  const handleCreateNew = () => {
    if (activeMainTab === 'pictograms') {
      openPictogramEditor();
    } else if (activeMainTab === 'catalogs') {
      openCatalogEditor();
    } else {
      openEditor();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#070913] border border-white/15 rounded-3xl w-full max-w-7xl h-[94vh] flex flex-col shadow-2xl overflow-hidden text-right">
        
        {/* ============================================================= */}
        {/* 1. TOP EXECUTIVE CMS HEADER */}
        {/* ============================================================= */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0b0e1b] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0066FF] to-cyan-500 flex items-center justify-center text-white font-black text-base shadow-lg shadow-[#0066FF]/30">
              CMS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  مرکز مدیریت محتوا
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#388bfd] text-[11px] font-bold font-mono">
                  v5.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                ویرایش و مدیریت پروژه‌ها، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و استقرار دائمی روی سرور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Cloud & GitHub Deploy Sync Button */}
            <button
              onClick={() => setActiveMainTab('github_sync')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeMainTab === 'github_sync'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/15'
              }`}
            >
              <Github className="w-4 h-4 text-white" />
              <span>استقرار و همگام‌سازی</span>
            </button>

            {/* Quick Full Backup JSON */}
            <button
              onClick={() => handleDownloadExport('all_json')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium cursor-pointer transition-colors"
              title="دانلود فایل پشتیبان کامل"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود بکاپ</span>
            </button>

            {/* Restore Backup Input */}
            <label className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>بارگذاری بکاپ</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Dynamic Add Button */}
            {activeMainTab !== 'settings' && activeMainTab !== 'github_sync' && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0066FF]/30 transition-transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {activeMainTab === 'pictograms' ? 'افزودن پیکتوگرام' :
                   activeMainTab === 'catalogs' ? 'افزودن کاتالوگ' : 'افزودن پروژه'}
                </span>
              </button>
            )}

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="بستن پنل مدیریت"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ============================================================= */}
        {/* 2. PRIMARY CONSOLE TABS */}
        {/* ============================================================= */}
        <div className="flex items-center gap-2 px-6 border-b border-white/10 bg-[#080a14] overflow-x-auto">
          <button
            onClick={() => setActiveMainTab('projects')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'projects'
                ? 'border-[#0066FF] text-[#388bfd]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="w-4 h-4" />
            <span>پروژه‌ها</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-mono text-[11px]">
              {toPersianDigits(projects.length)}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('pictograms')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'pictograms'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>پیکتوگرام و آیکونوگرافی</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px]">
              {toPersianDigits(pictogramProjects.length)}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('catalogs')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'catalogs'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>کاتالوگ دیجیتال</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
              {toPersianDigits(catalogProjects.length)}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('settings')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'settings'
                ? 'border-indigo-400 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>تنظیمات سایت</span>
          </button>

          <button
            onClick={() => setActiveMainTab('github_sync')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'github_sync'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>استقرار</span>
          </button>

          <button
            onClick={() => setActiveMainTab('backup')}
            className={`py-3.5 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeMainTab === 'backup'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>بکاپ و بازیابی</span>
          </button>
        </div>

        {/* Error Alert */}
        {importError && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center justify-between">
            <span>{importError}</span>
            <button onClick={() => setImportError(null)} className="text-rose-400 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================= */}
        {/* 3. TAB CONTENT VIEWS */}
        {/* ============================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ----------------------------------------------------------- */}
          {/* TAB 1: PROJECTS & CASE STUDIES */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'projects' && (
            <div className="space-y-6">
              
              {/* Duplicate Alert Notice */}
              {duplicates.length > 0 && !duplicateDismissed && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span className="text-sm font-bold">
                        {toPersianDigits(duplicates.length)} مورد هم‌پوشانی یا پروژه تکراری احتمالی شناسایی شد:
                      </span>
                    </div>
                    <button
                      onClick={() => setDuplicateDismissed(true)}
                      className="text-xs text-amber-400 hover:text-amber-200 cursor-pointer"
                    >
                      صرف‌نظر
                    </button>
                  </div>

                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {duplicates.map((dup, idx) => (
                      <div key={idx} className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs">
                        <div>
                          <span className="font-bold text-white">{dup.original.name}</span>
                          <span className="mx-2 text-slate-500">↔</span>
                          <span className="font-bold text-white">{dup.duplicate.name}</span>
                          <span className="mr-3 text-slate-400 font-mono">({dup.reason})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => mergeProjects(dup.original.id, dup.duplicate.id)}
                            className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold cursor-pointer"
                          >
                            ادغام در {dup.original.name}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Filters and Search Bar */}
              <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="جستجو در نام، برند، برچسب‌ها یا توضیحات..."
                    className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs focus:border-[#0066FF] outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Brand Filter */}
                  <select
                    value={selectedBrand}
                    onChange={e => setSelectedBrand(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs outline-none cursor-pointer"
                  >
                    <option value="all">تمام برندها</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.nameFa} ({b.name})</option>
                    ))}
                  </select>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs outline-none cursor-pointer"
                  >
                    <option value="all">تمام دسته‌بندی‌ها</option>
                    <option value="website">وب‌سایت مرجع</option>
                    <option value="landing-page">لندینگ پیج</option>
                    <option value="mobile-app">اپلیکیشن</option>
                    <option value="campaign">کمپین</option>
                    <option value="product">طراحی محصول</option>
                    <option value="ecommerce">فروشگاهی</option>
                    <option value="internal-tool">ابزار داخلی</option>
                    <option value="design-system">سیستم دیزاین</option>
                    <option value="uiux">رابط و تجربه کاربری</option>
                    <option value="other">سایر</option>
                  </select>

                  {/* Status Filter */}
                  <select
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="px-3 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs outline-none cursor-pointer"
                  >
                    <option value="all">تمام وضعیت‌ها</option>
                    <option value="featured">پروژه‌های ویژه (Featured)</option>
                    <option value="ready">آماده کیس‌استادی</option>
                    <option value="partial">نیمه‌کامل</option>
                    <option value="assets-only">فقط تصویر</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="px-3 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs outline-none cursor-pointer"
                  >
                    <option value="featured">مرتب‌سازی: ویژه + امتیاز بالا</option>
                    <option value="readiness">مرتب‌سازی: امتیاز آمادگی</option>
                    <option value="newest">مرتب‌سازی: جدیدترین سال</option>
                    <option value="alphabetical">مرتب‌سازی: الفبا</option>
                    <option value="brand">مرتب‌سازی: بر اساس برند</option>
                  </select>
                </div>
              </div>

              {/* Projects Table List */}
              <div className="rounded-2xl bg-[#0c1020] border border-white/10 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-white/10 bg-[#080b15] text-slate-400 font-bold">
                        <th className="py-3.5 px-4">ویژه</th>
                        <th className="py-3.5 px-4">پروژه و برند</th>
                        <th className="py-3.5 px-4">دسته‌بندی و پلتفرم</th>
                        <th className="py-3.5 px-4 text-center">امتیاز آمادگی</th>
                        <th className="py-3.5 px-4 text-center">رسانه‌ها</th>
                        <th className="py-3.5 px-4 text-center">سکشن‌ها</th>
                        <th className="py-3.5 px-4 text-left">عملیات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredProjects.map((p) => {
                        const readiness = p.caseStudyReadinessScore || 0;
                        const assetCount = (p.assets?.length || 0) + (p.gallery?.length || 0);
                        const sectionCount = p.sections?.length || 0;

                        return (
                          <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                            {/* Featured Star */}
                            <td className="py-3 px-4">
                              <button
                                onClick={() => toggleFeatured(p.id)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  p.featured 
                                    ? 'text-amber-400 hover:text-amber-300' 
                                    : 'text-slate-600 hover:text-slate-400'
                                }`}
                                title={p.featured ? 'حذف از پروژه‌های ویژه' : 'افزودن به پروژه‌های ویژه'}
                              >
                                <Star className={`w-4 h-4 ${p.featured ? 'fill-amber-400' : ''}`} />
                              </button>
                            </td>

                            {/* Project Identity */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-8 rounded-lg overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                                  <img
                                    src={p.cover || getProjectImage(p.id, p.type, 'cover')}
                                    alt={p.name}
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-white group-hover:text-[#0066FF] transition-colors line-clamp-1">
                                    {p.displayNameFa || p.name}
                                  </div>
                                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                                    <span className="font-mono">{p.brand}</span>
                                    <span>•</span>
                                    <span>{toPersianDigits(p.year || 1403)}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category & Platform */}
                            <td className="py-3 px-4 text-slate-300">
                              <div>{p.typeFa || 'وب‌سایت و رابط کاربری'}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                                {Array.isArray(p.platform) ? p.platform.join(' / ') : p.platform}
                              </div>
                            </td>

                            {/* Readiness Bar */}
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-white/10 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      readiness >= 80 ? 'bg-emerald-400' :
                                      readiness >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                                    }`}
                                    style={{ width: `${readiness}%` }}
                                  />
                                </div>
                                <span className="font-mono text-xs font-bold text-slate-300">
                                  {readiness}٪
                                </span>
                              </div>
                            </td>

                            {/* Media Count */}
                            <td className="py-3 px-4 text-center text-slate-400 font-mono">
                              {toPersianDigits(assetCount)} تصویر
                            </td>

                            {/* Sections Count */}
                            <td className="py-3 px-4 text-center text-slate-400 font-mono">
                              {toPersianDigits(sectionCount)} بخش
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-left">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => onSelectProject(p)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                  title="مشاهده صفحه پروژه"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openEditor(p)}
                                  className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                                  title="ویرایش کامل پروژه"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => duplicateProject(p.id)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-colors cursor-pointer"
                                  title="ایجاد نسخه کپی"
                                >
                                  <Copy className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`آیا از حذف پروژه "${p.name}" اطمینان دارید؟`)) {
                                      deleteProject(p.id);
                                    }
                                  }}
                                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                                  title="حذف پروژه"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 2: BRAND PICTOGRAMS & ICONOGRAPHY */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'pictograms' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1020] border border-cyan-500/20">
                <div>
                   <h3 className="text-base font-bold text-white">سیستم پیکتوگرام و آیکونوگرافی برندها</h3>
                  <p className="text-xs text-slate-400">
                    تعریف گرید طراحی، توکن‌های بصری، موکاپ‌های سخت‌افزاری و مجموعه آیکون‌های وکتور
                  </p>
                </div>

                <button
                  onClick={() => openPictogramEditor()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن سیستم پیکتوگرام جدید</span>
                </button>
              </div>

              {/* Grid of Pictograms */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pictogramProjects.map(proj => (
                  <div 
                    key={proj.id}
                    className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 hover:border-cyan-500/50 transition-all space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Cover preview */}
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                        <img 
                          src={proj.mockups[0]?.imageUrl || proj.cover} 
                          alt={proj.titleFa}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-bold text-cyan-300 border border-cyan-500/30 font-mono">
                          {toPersianDigits(proj.icons?.length || proj.iconCount || 0)} آیکون
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: proj.accentColor }} />
                          <span className="text-xs font-mono text-slate-400">{proj.brand}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-mono">{toPersianDigits(proj.year)}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                          {proj.titleFa}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {proj.descriptionFa}
                        </p>
                      </div>

                      {/* Key tokens */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(proj.keyTokens || []).slice(0, 2).map((token, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {token}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {toPersianDigits(proj.mockups?.length || 0)} موکاپ
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openPictogramEditor(proj)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 hover:bg-cyan-500/25 text-xs font-bold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          onClick={() => duplicatePictogramProject(proj.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                          title="کپی"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`آیا از حذف سیستم پیکتوگرام "${proj.titleFa}" اطمینان دارید؟`)) {
                              deletePictogramProject(proj.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 3: DIGITAL CATALOGS & FLIPBOOKS */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'catalogs' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0c1020] border border-emerald-500/20">
                <div>
                   <h3 className="text-base font-bold text-white">کاتالوگ‌های دیجیتال و اسناد تعاملی</h3>
                  <p className="text-xs text-slate-400">
                    تنظیم صفحات عمودی موبایل، لینک دانلود PDF، حجم فایل و ویژگی‌های پروموشن
                  </p>
                </div>

                <button
                  onClick={() => openCatalogEditor()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن کاتالوگ جدید</span>
                </button>
              </div>

              {/* Grid of Catalogs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catalogProjects.map(cat => (
                  <div 
                    key={cat.id}
                    className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 hover:border-emerald-500/50 transition-all space-y-3.5 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Cover preview */}
                      <div className="aspect-[16/9] rounded-xl overflow-hidden bg-black/50 border border-white/10 relative">
                        <img 
                          src={cat.pages[0]?.imageUrl || cat.cover} 
                          alt={cat.titleFa}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[11px] font-bold text-emerald-300 border border-emerald-500/30 font-mono">
                          {toPersianDigits(cat.pages?.length || cat.pageCount || 0)} صفحه
                        </div>
                        {cat.isMobileOptimized && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500/80 backdrop-blur-sm text-[10px] font-bold text-white">
                            موبایل ۹:۱۶
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                          <span className="text-xs font-mono text-slate-400">{cat.brand}</span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-400 font-mono">{toPersianDigits(cat.fileSizeMb || 4)} MB</span>
                        </div>
                        <h4 className="text-sm font-bold text-white line-clamp-1 leading-snug">
                          {cat.titleFa}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {cat.descriptionFa}
                        </p>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1 pt-1">
                        {(cat.highlights || []).slice(0, 2).map((hl, i) => (
                          <div key={i} className="text-[11px] text-slate-300 line-clamp-1 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-400" />
                            <span>{hl}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {toPersianDigits(cat.year)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openCatalogEditor(cat)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-xs font-bold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>ویرایش</span>
                        </button>
                        <button
                          onClick={() => duplicateCatalogProject(cat.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                          title="کپی"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`آیا از حذف کاتالوگ "${cat.titleFa}" اطمینان دارید؟`)) {
                              deleteCatalogProject(cat.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
                          title="حذف"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 4: SITE SECTIONS & GENERAL SETTINGS */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'settings' && (
            <SiteSettingsEditor />
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 5: GITHUB + VERCEL DEPLOYMENT & EXPORT HUB */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'github_sync' && (
            <div className="space-y-6">
              
              {/* GitHub Instructions Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0e1628] via-[#090d18] to-[#04060d] border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                    <Github className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      راهنمای استقرار دائمی روی GitHub و Vercel
                    </h3>
                    <p className="text-xs text-slate-400">
                      تغییرات CMS در حافظه مرورگر ذخیره می‌شوند. برای انتشار دائمی، فایل‌ها را دانلود و روی گیت‌هاب پوش کنید.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-[#070914] border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold font-mono text-xs flex items-center justify-center">
                      ۱
                    </div>
                    <h4 className="text-xs font-bold text-white">دانلود فایل‌های داده</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      فایل‌های TypeScript را دانلود کرده و در پوشه <code className="text-amber-300">src/data/</code> پروژه جایگزین کنید.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#070914] border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 font-bold font-mono text-xs flex items-center justify-center">
                      ۲
                    </div>
                    <h4 className="text-xs font-bold text-white">ارسال تغییرات به سرور</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      دستور <code className="text-cyan-300 font-mono">git commit -am "Update" && git push</code> را اجرا کنید.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#070914] border border-white/10 space-y-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs flex items-center justify-center">
                      ۳
                    </div>
                    <h4 className="text-xs font-bold text-white">انتشار خودکار</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      ورسل تغییرات را شناسایی کرده و وب‌سایت با داده‌های جدید در چند ثانیه لایو می‌شود.
                    </p>
                  </div>
                </div>
              </div>

              {/* Individual Export Cards */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">فایل‌های داده قابل دانلود و کپی</h4>
                  {copyFeedback && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>{copyFeedback}</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  {/* 1. Full Backup JSON */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">فایل پشتیبان جامع (JSON)</span>
                        <FileJson className="w-4 h-4 text-amber-400" />
                      </div>
                        <p className="text-xs text-slate-400">
                          شامل تمامی پروژه‌ها، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و برندها در یک فایل.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('all_json')}
                        className="flex-1 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود JSON</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportFullBackupJson(), 'پک کامل JSON')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                        title="کپی در کلیپ‌بورد"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 2. Projects TS */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">initialProjects.ts</span>
                        <FileText className="w-4 h-4 text-[#0066FF]" />
                      </div>
                      <p className="text-xs text-slate-400">
                        داده‌های پروژه‌ها جهت قرارگیری در <code className="text-[#388bfd]">src/data/initialProjects.ts</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('projects_ts')}
                        className="flex-1 py-2 rounded-xl bg-[#0066FF]/20 hover:bg-[#0066FF]/30 text-[#388bfd] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل TS</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportTypeScriptData('projects'), 'initialProjects.ts')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 3. Pictograms TS */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">pictogramProjects.ts</span>
                        <Grid className="w-4 h-4 text-cyan-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        داده‌های پیکتوگرام‌ها جهت قرارگیری در <code className="text-cyan-400">src/data/pictogramProjects.ts</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('pictograms_ts')}
                        className="flex-1 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل TS</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportTypeScriptData('pictograms'), 'pictogramProjects.ts')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 4. Catalogs TS */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">catalogProjects.ts</span>
                        <BookOpen className="w-4 h-4 text-emerald-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        داده‌های کاتالوگ‌ها جهت قرارگیری در <code className="text-emerald-400">src/data/catalogProjects.ts</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('catalogs_ts')}
                        className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل TS</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportTypeScriptData('catalogs'), 'catalogProjects.ts')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 5. Site Settings TS */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">siteSettings.ts</span>
                        <Sliders className="w-4 h-4 text-indigo-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        تنظیمات بنر، شاخص‌ها، عناوین و فوتر جهت قرارگیری در <code className="text-indigo-400">src/data/siteSettings.ts</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('settings_ts')}
                        className="flex-1 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل TS</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportTypeScriptData('settings'), 'siteSettings.ts')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 6. Brands TS */}
                  <div className="p-4 rounded-2xl bg-[#0c1020] border border-white/10 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">brands.ts</span>
                        <Globe className="w-4 h-4 text-purple-400" />
                      </div>
                      <p className="text-xs text-slate-400">
                        لیست برندها و رنگ‌های سازمانی جهت قرارگیری در <code className="text-purple-400">src/data/brands.ts</code>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <button
                        onClick={() => handleDownloadExport('brands_ts')}
                        className="flex-1 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>دانلود فایل TS</span>
                      </button>
                      <button
                        onClick={() => handleCopyToClipboard(exportTypeScriptData('brands'), 'brands.ts')}
                        className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Reset to Factory Defaults */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-rose-300">بازنشانی به داده‌های اولیه</span>
                  <p className="text-[11px] text-rose-300/70">
                    تمام تغییرات محلی پاک شده و داده‌های پیش‌فرض بارگذاری می‌شوند.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('آیا از بازنشانی کلیه داده‌ها به مقادیر اولیه اطمینان دارید؟')) {
                      resetAllToInitial();
                      alert('تمام داده‌ها به حالت اولیه بازگردانی شدند.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer"
                >
                  بازنشانی کامل داده‌ها
                </button>
              </div>

            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 6: BACKUP & RESTORE (PORTABLE BUNDLE) */}
          {/* ----------------------------------------------------------- */}
          {activeMainTab === 'backup' && (
            <div className="space-y-6">
              
              {/* Status Alert */}
              {backupStatus && (
                <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm animate-fade-in ${
                  backupStatus.success 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {backupStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                  )}
                  <div className="leading-relaxed">{backupStatus.message}</div>
                </div>
              )}

              {/* How it works */}
              <div className="p-5 rounded-2xl bg-[#0e1426] border border-white/10 space-y-3 text-xs leading-relaxed text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <HardDrive className="w-4 h-4 text-[#0066FF]" />
                  <span>بکاپ پرتابل — بدون نیاز به سرور یا دیتابیس</span>
                </div>
                <p>
                  تمام اطلاعات CMS در حافظه مرورگر ذخیره می‌شوند. با دانلود فایل بکاپ، اطلاعات را به هر رایانه یا جلسه‌ای منتقل کنید و با بارگذاری مجدد فایل، همه چیز را بازیابی نمایید.
                </p>
              </div>

              {/* Export Section */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#0066FF]" />
                      <span>دانلود فایل بکاپ</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      شامل تمامی پروژه‌ها، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و برندها
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const dataStr = exportFullBackupJson();
                      const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `shadow-backup-${new Date().toISOString().slice(0, 10)}.json`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                      setBackupStatus({ success: true, message: 'فایل بکاپ با موفقیت دانلود شد. این فایل را در جای امنی نگهداری کنید.' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0066FF]/20 flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود فایل بکاپ</span>
                  </button>
                </div>
              </div>

              {/* Import Section with Drag & Drop */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Upload className="w-4 h-4 text-emerald-400" />
                      <span>بارگذاری فایل بکاپ</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      فایل JSON بکاپ را آپلود یا به اینجا بکشید تا اطلاعات بازیابی شود.
                    </p>
                </div>

                <div
                  onDragOver={(e) => { e.preventDefault(); setBackupDragOver(true); }}
                  onDragLeave={() => setBackupDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setBackupDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.name.endsWith('.json')) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const text = event.target?.result as string;
                          const res = importJson(text);
                          if (res.success) {
                            setBackupStatus({ success: true, message: `بکاپ با موفقیت بارگذاری شد! (${toPersianDigits(res.count)} پروژه و تمام تنظیمات بازیابی شد)` });
                          } else {
                            setBackupStatus({ success: false, message: res.error || 'خطا در بارگذاری فایل' });
                          }
                        } catch (err: any) {
                          setBackupStatus({ success: false, message: err.message || 'خطا در خواندن فایل' });
                        }
                      };
                      reader.readAsText(file);
                    } else {
                      setBackupStatus({ success: false, message: 'لطفاً فقط فایل با فرمت .json انتخاب کنید.' });
                    }
                  }}
                  className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 text-center cursor-pointer ${
                    backupDragOver 
                      ? 'border-[#0066FF] bg-[#0066FF]/10' 
                      : 'border-white/15 bg-black/30 hover:border-white/30'
                  }`}
                >
                  <FileJson className="w-10 h-10 text-slate-400" />
                  <div className="text-sm text-slate-300">
                    فایل بکاپ را به اینجا بکشید
                  </div>
                  <div className="text-xs text-slate-500">یا</div>
                  <label className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors">
                    <span>انتخاب فایل</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const text = event.target?.result as string;
                            const res = importJson(text);
                            if (res.success) {
                              setBackupStatus({ success: true, message: `بکاپ با موفقیت بارگذاری شد! (${toPersianDigits(res.count)} پروژه و تمام تنظیمات بازیابی شد)` });
                            } else {
                              setBackupStatus({ success: false, message: res.error || 'خطا در بارگذاری فایل' });
                            }
                          } catch (err: any) {
                            setBackupStatus({ success: false, message: err.message || 'خطا در خواندن فایل' });
                          }
                        };
                        reader.readAsText(file);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Defaults */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex flex-wrap items-center justify-between gap-3">
                <div>
                <span className="text-xs font-bold text-rose-300">بازنشانی به داده‌های پیش‌فرض</span>
                <p className="text-[11px] text-rose-300/70">
                  تمام تغییرات محلی پاک شده و داده‌های اولیه بازنشانی می‌شوند.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('آیا از بازنشانی کلیه داده‌ها به مقادیر اولیه اطمینان دارید؟ این عمل غیرقابل بازگشت است.')) {
                      resetAllToInitial();
                      setBackupStatus({ success: true, message: 'داده‌ها با موفقیت به حالت اولیه بازگردانی شدند.' });
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold cursor-pointer"
                >
                  بازنشانی کامل داده‌ها
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
