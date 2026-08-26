import React, { useState } from 'react';
import { BrandPictogramProject, PictogramIconItem } from '../types';
import { toPersianDigits } from '../utils/persian';
import { 
  X, 
  Sparkles, 
  Layers, 
  Grid, 
  Copy, 
  Check, 
  Download, 
  Maximize2, 
  ShieldCheck, 
  Sliders, 
  Eye, 
  ChevronLeft, 
  Folder,
  Image as ImageIcon
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface PictogramDetailModalProps {
  project: BrandPictogramProject;
  onClose: () => void;
}

export const PictogramDetailModal: React.FC<PictogramDetailModalProps> = ({
  project,
  onClose
}) => {
  const [selectedMockup, setSelectedMockup] = useState(project.mockups[0]);
  const [selectedIcon, setSelectedIcon] = useState<PictogramIconItem | null>(project.icons[0] || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [iconSize, setIconSize] = useState<number>(32);
  const [iconTheme, setIconTheme] = useState<'dark' | 'light'>('dark');

  const handleCopyIconName = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedId(name);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to dynamically render Lucide Icon by name
  const renderDynamicIcon = (iconName?: string, size = 28) => {
    if (!iconName) return <Sparkles style={{ width: size, height: size }} />;
    const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
    return <IconComponent style={{ width: size, height: size }} />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05070e]/95 backdrop-blur-2xl flex flex-col text-slate-100 selection:bg-blue-500/30 overflow-y-auto text-right" dir="rtl">
      
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 h-16 px-4 sm:px-8 border-b border-white/10 bg-[#080b16]/95 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="بستن"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {project.clientFa}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {project.titleFa}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400">
              {project.categoryFa} • {toPersianDigits(project.iconCount)} آیکون و پیکتوگرام • سال {toPersianDigits(project.year)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 font-mono hidden sm:block">
            {project.gridSystem}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* 1. HERO & INTRO SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-bold text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>طراحی زبان بصری و دیزاین‌توکن اختصاصی برند {project.brand}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-snug">
              {project.titleEn}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {project.descriptionFa}
            </p>

            {/* Key tokens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {project.keyTokens.map((token, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  <span>{token}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Hero Mockup Display */}
          <div className="lg:col-span-5 rounded-2xl overflow-hidden bg-[#0c0e1a] border border-white/10 p-3 shadow-2xl space-y-3">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-black/60 relative border border-white/5">
              <img
                src={selectedMockup.imageUrl}
                alt={selectedMockup.title}
                className="w-full h-full object-cover transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-bold text-blue-400 border border-white/10">
                {selectedMockup.tag || 'موکاپ اجرا شده'}
              </div>
            </div>
            
            <div className="p-2 space-y-1">
              <h4 className="text-xs font-bold text-white">{selectedMockup.title}</h4>
              <p className="text-[11px] text-slate-400">{selectedMockup.description}</p>
            </div>
          </div>
        </div>

        {/* 2. MOCKUP GALLERY GRID */}
        {project.mockups.length > 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-base font-bold text-white">موکاپ‌ها و نماهای واقعی اجرای پیکتوگرام‌ها</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {project.mockups.map((m) => {
                const isSelected = selectedMockup.id === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMockup(m)}
                    className={`rounded-2xl p-3 border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-blue-950/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'bg-[#090b16] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="aspect-[16/10] rounded-xl overflow-hidden bg-black/50 relative">
                      <img src={m.imageUrl} alt={m.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {m.tag && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/75 text-[10px] text-slate-300">
                          {m.tag}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-xs font-bold text-white truncate">{m.title}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. INTERACTIVE ICON MATRIX & INSPECTOR */}
        <div className="rounded-3xl bg-[#090c19] border border-white/10 p-6 sm:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-blue-400" />
                <h3 className="text-lg font-bold text-white">ماتریس و مجموعه آیکون‌های استاندارد</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                روی هر آیکون کلیک کنید تا مشخصات، ابعاد و توکن اختصاصی آن را مشاهده کنید.
              </p>
            </div>

            {/* Controls: Size slider & Theme */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
                <span className="text-slate-400">اندازه:</span>
                <input
                  type="range"
                  min="24"
                  max="48"
                  value={iconSize}
                  onChange={(e) => setIconSize(Number(e.target.value))}
                  className="w-20 accent-blue-500 cursor-pointer"
                />
                <span className="font-mono text-blue-400">{iconSize}px</span>
              </div>

              <button
                onClick={() => setIconTheme(iconTheme === 'dark' ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition-colors"
              >
                پس‌زمینه: {iconTheme === 'dark' ? 'تیره' : 'روشن'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Icons Grid */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto p-1" style={{ scrollbarWidth: 'thin' }}>
              {project.icons.map((icon) => {
                const isSelected = selectedIcon?.id === icon.id;
                return (
                  <button
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon)}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500/50 shadow-md'
                        : iconTheme === 'dark'
                        ? 'bg-black/40 border-white/5 hover:border-white/20 text-slate-300 hover:text-white'
                        : 'bg-slate-100 border-slate-300 text-slate-800 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center justify-center text-blue-400">
                      {renderDynamicIcon(icon.iconName, iconSize)}
                    </div>
                    <div className="text-center space-y-0.5 w-full">
                      <div className={`text-xs font-bold truncate ${iconTheme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>
                        {icon.nameFa}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 truncate">
                        {icon.name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Icon Inspector Sidebar */}
            {selectedIcon && (
              <div className="lg:col-span-4 rounded-2xl bg-black/60 border border-white/10 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-400">مشخصات پیکتوگرام انتخابی</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                    {selectedIcon.category}
                  </span>
                </div>

                {/* Big Preview */}
                <div className="aspect-square max-w-[140px] mx-auto rounded-2xl bg-gradient-to-tr from-blue-950/40 to-indigo-950/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  {renderDynamicIcon(selectedIcon.iconName, 56)}
                </div>

                <div className="space-y-1 text-center">
                  <h4 className="text-sm font-bold text-white">{selectedIcon.nameFa}</h4>
                  <div className="text-xs font-mono text-slate-400">{selectedIcon.name}</div>
                </div>

                {/* Details */}
                <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>گرید پایه:</span>
                    <span className="font-mono text-slate-200">24×24 dp</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضخامت خط:</span>
                    <span className="font-mono text-slate-200">2.0 px Solid</span>
                  </div>
                  <div className="flex justify-between">
                    <span>گوشه‌ها:</span>
                    <span className="font-mono text-slate-200">4px Rounded</span>
                  </div>
                </div>

                {/* Copy Name Trigger */}
                <button
                  onClick={() => handleCopyIconName(selectedIcon.name)}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
                >
                  {copiedId === selectedIcon.name ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>نام کپی شد!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>کپی نام و توکن آیکون</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
