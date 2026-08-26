import React from 'react';
import { Project, MetricSummary, SiteKpiCard, BrandPictogramProject, DigitalCatalogProject } from '../types';
import { toPersianDigits } from '../utils/persian';
import { getProjectImage } from '../data/projectImages';
import { useProjects } from '../context/ProjectContext';
import { BrandPictogramsSection } from './BrandPictogramsSection';
import { DigitalCatalogsSection } from './DigitalCatalogsSection';
import { 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  Globe, 
  FolderArchive, 
  Star, 
  Monitor, 
  MonitorPlay,
  ArrowUpLeft,
  Grid,
  BookOpen
} from 'lucide-react';

interface OverviewProps {
  metrics: MetricSummary;
  featuredProjects: Project[];
  onSelectProject: (project: Project) => void;
  onSelectPictogram?: (project: BrandPictogramProject) => void;
  onSelectCatalog?: (catalog: DigitalCatalogProject) => void;
  onNavigateTab: (tab: 'overview' | 'selected' | 'archive') => void;
  onOpenPresentation: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  metrics,
  featuredProjects,
  onSelectProject,
  onSelectPictogram,
  onSelectCatalog,
  onNavigateTab,
  onOpenPresentation
}) => {
  const { siteSettings, pictogramProjects, catalogProjects } = useProjects();
  const { hero, kpis, sections } = siteSettings;

  // All UI/UX design projects displayed in the presentation
  const uiuxProjects = featuredProjects;

  // Helper icon renderer for dynamic KPI cards
  const renderKpiIcon = (iconName: string, color: string) => {
    switch (iconName) {
      case 'Globe':
        return <Globe className="w-4 h-4" style={{ color }} />;
      case 'Monitor':
        return <Monitor className="w-4 h-4" style={{ color }} />;
      case 'Layers':
        return <Layers className="w-4 h-4" style={{ color }} />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4" style={{ color }} />;
      case 'FolderArchive':
      default:
        return <FolderArchive className="w-4 h-4" style={{ color }} />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 space-y-16 text-right">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. EXECUTIVE BRIEFING BANNER (VIBRANT MIDNIGHT THEME) */}
      {/* ------------------------------------------------------------- */}
      {sections.showHero && (
        <section className="relative rounded-3xl bg-gradient-to-br from-[#0c1224] via-[#080c18] to-[#04060d] border border-[#0066FF]/25 p-7 sm:p-10 lg:p-12 overflow-hidden shadow-2xl shadow-[#0066FF]/10">
          
          {/* Subtle Ambient Light Gradients in Background */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0066FF]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-7">
            
            {/* Executive Tag */}
            {hero.badgeText && (
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0066FF]/15 border border-[#0066FF]/40 text-xs sm:text-sm font-bold text-[#388bfd] shadow-sm">
                <Sparkles className="w-4 h-4 text-[#0066FF]" />
                <span>{hero.badgeText}</span>
              </div>
            )}

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-relaxed">
                {hero.title}
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-loose max-w-3xl font-normal">
                {hero.description}
              </p>
            </div>

            {/* Interactive Actions */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onOpenPresentation}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#0066FF]/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <MonitorPlay className="w-4 h-4" />
                <span>{hero.ctaPrimaryText || 'شروع ارائه تمام‌صفحه'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('selected')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer hover:border-white/30"
              >
                <Star className="w-4 h-4 text-[#0066FF] fill-[#0066FF]" />
                <span>{hero.ctaSecondaryText || 'بررسی نمونه‌کارها'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('archive')}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition-colors cursor-pointer hover:bg-white/5"
              >
                <FolderArchive className="w-4 h-4 text-slate-400" />
                <span>{hero.ctaArchiveText || `کاتالوگ کامل (${toPersianDigits(metrics.totalProjects)} پروژه)`}</span>
              </button>
            </div>

          </div>
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EXECUTIVE KPI CARDS (DYNAMICALLY CONFIGURED VIA CMS) */}
      {/* ------------------------------------------------------------- */}
      {sections.showKpis && kpis && kpis.length > 0 && (
        <section className={`grid gap-5 ${
          kpis.length === 1 ? 'grid-cols-1' :
          kpis.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
          kpis.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 lg:grid-cols-4'
        }`}>
          {kpis.map((kpi, idx) => (
            <div 
              key={kpi.id || idx}
              className="p-6 rounded-2xl bg-[#0b0f1d] border border-white/10 hover:border-white/20 transition-all space-y-3 shadow-md hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-slate-400 font-bold">{kpi.label}</span>
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center border"
                  style={{ 
                    backgroundColor: `${kpi.accentColor}15`,
                    borderColor: `${kpi.accentColor}30`
                  }}
                >
                  {renderKpiIcon(kpi.icon, kpi.accentColor)}
                </div>
              </div>
              <div 
                className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                style={{ color: kpi.accentColor === '#0066FF' ? '#ffffff' : kpi.accentColor }}
              >
                {kpi.value}
              </div>
              <div className="text-xs text-slate-400 leading-normal">
                {kpi.sublabel}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. UI/UX DESIGN CATEGORY (DYNAMIC VISIBILITY & TITLES) */}
      {/* ------------------------------------------------------------- */}
      {sections.showTop10 && (
        <section id="top10-section" className="space-y-7">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0066FF] shadow-sm shadow-[#0066FF]" />
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {sections.top10SectionTitle || 'طراحی UI/UX'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {sections.top10SectionSubtitle || 'طراحی رابط و تجربه کاربری وب‌سایت‌ها و لندینگ پیج‌ها'}
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('selected')}
              className="text-xs sm:text-sm font-bold text-[#0066FF] hover:text-[#3385ff] flex items-center gap-1.5 cursor-pointer transition-colors self-start sm:self-auto group"
            >
              <span>مشاهده کامل</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          {/* UI/UX Projects Gallery Grid (4 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {uiuxProjects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className="group rounded-2xl bg-[#0a0e1c] border border-white/10 hover:border-[#0066FF] transition-all duration-300 p-3.5 space-y-3 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#0066FF]/20 flex flex-col justify-between"
              >
                {/* Image Preview */}
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#04060d] relative border border-white/5">
                  <img
                    src={proj.cover || getProjectImage(proj.id, proj.type, 'cover')}
                    alt={proj.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Only Project Title */}
                <div className="px-1 py-1">
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#0066FF] transition-colors leading-snug line-clamp-1">
                    {proj.displayNameFa || proj.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. BRAND PICTOGRAMS & ICONOGRAPHY SYSTEM (DYNAMIC CMS DATA) */}
      {/* ------------------------------------------------------------- */}
      {sections.showPictograms && (
        <BrandPictogramsSection 
          projects={pictogramProjects} 
          title={sections.pictogramsSectionTitle}
          subtitle={sections.pictogramsSectionSubtitle}
          onSelectProject={onSelectPictogram}
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. DIGITAL CATALOGS & MOBILE-OPTIMIZED PDF (DYNAMIC CMS DATA) */}
      {/* ------------------------------------------------------------- */}
      {sections.showCatalogs && (
        <DigitalCatalogsSection 
          catalogs={catalogProjects} 
          title={sections.catalogsSectionTitle}
          subtitle={sections.catalogsSectionSubtitle}
          onSelectCatalog={onSelectCatalog}
        />
      )}

    </div>
  );
};
