import React, { useState, useEffect } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { SiteSettings, SiteKpiCard, Brand, SitePresentationSettings } from '../../types';
import { 
  Sliders, Layout, Sparkles, FolderArchive, Globe, Monitor, 
  Layers, Save, Check, Plus, Trash2, Edit3, Shield, Mail, 
  Send, ExternalLink, RefreshCw
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

export const SiteSettingsEditor: React.FC = () => {
  const { 
    siteSettings, 
    updateSiteSettings, 
    updateHeroSettings, 
    updateKpiCards, 
    updateSectionVisibility, 
    updateProfileSettings,
    updatePresentationSettings,
    brands,
    createBrand,
    updateBrand,
    deleteBrand
  } = useProjects();

  const [activeSubTab, setActiveSubTab] = useState<'hero' | 'kpis' | 'sections' | 'profile' | 'brands' | 'presentation'>('hero');
  const [heroForm, setHeroForm] = useState(siteSettings.hero);
  const [kpisForm, setKpisForm] = useState<SiteKpiCard[]>(siteSettings.kpis);
  const [sectionsForm, setSectionsForm] = useState(siteSettings.sections);
  const [profileForm, setProfileForm] = useState(siteSettings.profile);
  const [presentationForm, setPresentationForm] = useState(siteSettings.presentation || {
    introBadge: '', introTitle: '', introDescription: '',
    introStat1Value: '', introStat1Label: '', introStat2Value: '', introStat2Label: '',
    introStat3Value: '', introStat3Label: '', introButtonText: '',
    closingBadge: '', closingTitle: '', closingDescription: '', closingButtonText: ''
  });
  
  // Brand creation state
  const [newBrandModalOpen, setNewBrandModalOpen] = useState(false);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [brandForm, setBrandForm] = useState<Partial<Brand>>({
    name: '',
    nameFa: '',
    slug: '',
    description: '',
    color: '#0066FF',
    isRecognized: true
  });

  useEffect(() => { setHeroForm(siteSettings.hero); }, [siteSettings.hero]);
  useEffect(() => { setKpisForm(siteSettings.kpis); }, [siteSettings.kpis]);
  useEffect(() => { setSectionsForm(siteSettings.sections); }, [siteSettings.sections]);
  useEffect(() => { setProfileForm(siteSettings.profile); }, [siteSettings.profile]);
  useEffect(() => { if (siteSettings.presentation) setPresentationForm(siteSettings.presentation); }, [siteSettings.presentation]);

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  const triggerSaveFeedback = (msg: string) => {
    setSavedFeedback(msg);
    setTimeout(() => setSavedFeedback(null), 2500);
  };

  const handleSaveHero = () => {
    updateHeroSettings(heroForm);
    triggerSaveFeedback('بنر معرفی ذخیره شد.');
  };

  const handleSaveKpis = () => {
    updateKpiCards(kpisForm);
    triggerSaveFeedback('شاخص‌های کلیدی ذخیره شدند.');
  };

  const handleSaveSections = () => {
    updateSectionVisibility(sectionsForm);
    triggerSaveFeedback('بخش‌های سایت ذخیره شدند.');
  };

  const handleSaveProfile = () => {
    updateProfileSettings(profileForm);
    triggerSaveFeedback('هویت برند و اطلاعات تماس ذخیره شدند.');
  };

  const handleSavePresentation = () => {
    updatePresentationSettings(presentationForm);
    triggerSaveFeedback('تنظیمات پرزنتیشن ذخیره شد.');
  };

  // KPI card helper
  const updateKpiItem = (index: number, updates: Partial<SiteKpiCard>) => {
    const updated = [...kpisForm];
    updated[index] = { ...updated[index], ...updates };
    setKpisForm(updated);
  };

  const addKpiItem = () => {
    const newKpi: SiteKpiCard = {
      id: `kpi-${Date.now()}`,
      label: 'شاخص جدید',
      value: '۱۰۰٪',
      sublabel: 'توضیحات کوتاه شاخص',
      accentColor: '#0066FF',
      icon: 'Sparkles'
    };
    setKpisForm(prev => [...prev, newKpi]);
  };

  const removeKpiItem = (index: number) => {
    setKpisForm(prev => prev.filter((_, i) => i !== index));
  };

  // Brand save
  const handleSaveBrand = () => {
    if (!brandForm.name || !brandForm.nameFa) {
      alert('لطفاً نام انگلیسی و فارسی برند را وارد کنید.');
      return;
    }

    if (editingBrandId) {
      updateBrand(editingBrandId, brandForm);
    } else {
      const id = brandForm.slug || brandForm.name.toLowerCase().replace(/\s+/g, '-');
      createBrand({
        id,
        name: brandForm.name,
        nameFa: brandForm.nameFa,
        slug: id,
        description: brandForm.description || '',
        color: brandForm.color || '#0066FF',
        isRecognized: Boolean(brandForm.isRecognized)
      });
    }

    setNewBrandModalOpen(false);
    setEditingBrandId(null);
    setBrandForm({ name: '', nameFa: '', slug: '', description: '', color: '#0066FF', isRecognized: true });
    triggerSaveFeedback('برند ذخیره شد.');
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Sub tabs navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#080b15] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveSubTab('hero')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'hero'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>بنر معرفی</span>
          </button>

          <button
            onClick={() => setActiveSubTab('kpis')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'kpis'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>شاخص‌های کلیدی</span>
          </button>

          <button
            onClick={() => setActiveSubTab('sections')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'sections'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>بخش‌های سایت</span>
          </button>

          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'profile'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>پروفایل و تماس</span>
          </button>

          <button
            onClick={() => setActiveSubTab('brands')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'brands'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>برندها ({brands.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('presentation')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'presentation'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>پرزنتیشن</span>
          </button>
        </div>

        {savedFeedback && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{savedFeedback}</span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. HERO BANNER SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'hero' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">تنظیمات بنر معرفی</h3>
              <p className="text-xs text-slate-400">تیتر، توضیحات، نشان و دکمه‌های اقدام</p>
            </div>
            <button
              onClick={handleSaveHero}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-[#0066FF]/30 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره بنر</span>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نشان (Badge)</label>
              <input
                type="text"
                value={heroForm.badgeText || ''}
                onChange={e => setHeroForm({ ...heroForm, badgeText: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-[#0066FF] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان اصلی</label>
              <input
                type="text"
                value={heroForm.title || ''}
                onChange={e => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-[#0066FF] outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">توضیحات</label>
              <textarea
                rows={3}
                value={heroForm.description || ''}
                onChange={e => setHeroForm({ ...heroForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-[#0066FF] outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">دکمه ارائه</label>
                <input
                  type="text"
                  value={heroForm.ctaPrimaryText || ''}
                  onChange={e => setHeroForm({ ...heroForm, ctaPrimaryText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">دکمه ۱۰ پروژه شاخص</label>
                <input
                  type="text"
                  value={heroForm.ctaSecondaryText || ''}
                  onChange={e => setHeroForm({ ...heroForm, ctaSecondaryText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">دکمه آرشیو</label>
                <input
                  type="text"
                  value={heroForm.ctaArchiveText || ''}
                  onChange={e => setHeroForm({ ...heroForm, ctaArchiveText: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. EXECUTIVE KPI CARDS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'kpis' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">شاخص‌های کلیدی عملکرد</h3>
              <p className="text-xs text-slate-400">تنظیم مقادیر، عناوین، رنگ و توضیحات هر شاخص</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={addKpiItem}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-bold cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>افزودن شاخص</span>
              </button>
              <button
                onClick={handleSaveKpis}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-[#0066FF]/30"
              >
                <Save className="w-4 h-4" />
                <span>ذخیره شاخص‌ها</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpisForm.map((kpi, idx) => (
              <div key={kpi.id || idx} className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: kpi.accentColor }} />
                    <span className="text-xs font-bold text-white">شاخص #{toPersianDigits(idx + 1)}</span>
                  </div>
                  <button
                    onClick={() => removeKpiItem(idx)}
                    className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">مقدار</label>
                    <input
                      type="text"
                      value={kpi.value || ''}
                      onChange={e => updateKpiItem(idx, { value: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-sm font-bold font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">عنوان</label>
                    <input
                      type="text"
                      value={kpi.label || ''}
                      onChange={e => updateKpiItem(idx, { label: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">توضیحات</label>
                  <input
                    type="text"
                    value={kpi.sublabel || ''}
                    onChange={e => updateKpiItem(idx, { sublabel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">رنگ</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={kpi.accentColor || '#0066FF'}
                        onChange={e => updateKpiItem(idx, { accentColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={kpi.accentColor || '#0066FF'}
                        onChange={e => updateKpiItem(idx, { accentColor: e.target.value })}
                        className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">نام آیکون</label>
                    <select
                      value={kpi.icon || 'FolderArchive'}
                      onChange={e => updateKpiItem(idx, { icon: e.target.value })}
                      className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs"
                    >
                      <option value="FolderArchive">FolderArchive (پروژه‌ها)</option>
                      <option value="Globe">Globe (برندها)</option>
                      <option value="Monitor">Monitor (محیط‌ها)</option>
                      <option value="Layers">Layers (دیزاین سیستم)</option>
                      <option value="Sparkles">Sparkles (ویژه)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. SECTION VISIBILITY & TITLES */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'sections' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">نمایش و عناوین بخش‌های سایت</h3>
              <p className="text-xs text-slate-400">فعال/غیرفعال‌سازی سکشن‌ها و ویرایش عناوین</p>
            </div>
            <button
              onClick={handleSaveSections}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-[#0066FF]/30"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره بخش‌ها</span>
            </button>
          </div>

          <div className="space-y-5">
            {/* Top 10 Section */}
            <div className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showTop10"
                    checked={sectionsForm.showTop10}
                    onChange={e => setSectionsForm({ ...sectionsForm, showTop10: e.target.checked })}
                    className="w-4 h-4 rounded text-[#0066FF] cursor-pointer"
                  />
                  <label htmlFor="showTop10" className="text-xs sm:text-sm font-bold text-white cursor-pointer">
                    نمایش سکشن ۱۰ پروژه شاخص
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">عنوان سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.top10SectionTitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, top10SectionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">توضیحات سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.top10SectionSubtitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, top10SectionSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Pictograms Section */}
            <div className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showPictograms"
                    checked={sectionsForm.showPictograms}
                    onChange={e => setSectionsForm({ ...sectionsForm, showPictograms: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="showPictograms" className="text-xs sm:text-sm font-bold text-white cursor-pointer">
                    نمایش سکشن پیکتوگرام و آیکونوگرافی
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">عنوان سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.pictogramsSectionTitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, pictogramsSectionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">توضیحات سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.pictogramsSectionSubtitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, pictogramsSectionSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Digital Catalogs Section */}
            <div className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="showCatalogs"
                    checked={sectionsForm.showCatalogs}
                    onChange={e => setSectionsForm({ ...sectionsForm, showCatalogs: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-400 cursor-pointer"
                  />
                  <label htmlFor="showCatalogs" className="text-xs sm:text-sm font-bold text-white cursor-pointer">
                    نمایش سکشن کاتالوگ دیجیتال
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">عنوان سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.catalogsSectionTitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, catalogsSectionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">توضیحات سکشن</label>
                  <input
                    type="text"
                    value={sectionsForm.catalogsSectionSubtitle || ''}
                    onChange={e => setSectionsForm({ ...sectionsForm, catalogsSectionSubtitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. SITE PROFILE & FOOTER */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'profile' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">هویت برند و اطلاعات تماس</h3>
              <p className="text-xs text-slate-400">نام تجاری، تگ‌لاین، یادداشت فوتر و لینک‌های ارتباطی</p>
            </div>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-[#0066FF]/30"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره هویت</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نام برند (انگلیسی)</label>
              <input
                type="text"
                value={profileForm.siteName || ''}
                onChange={e => setProfileForm({ ...profileForm, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-bold font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان برند (فارسی)</label>
              <input
                type="text"
                value={profileForm.brandTitle || ''}
                onChange={e => setProfileForm({ ...profileForm, brandTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">نشان هدر</label>
              <input
                type="text"
                value={profileForm.headerBadge || ''}
                onChange={e => setProfileForm({ ...profileForm, headerBadge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">تگ‌لاین (انگلیسی)</label>
              <input
                type="text"
                value={profileForm.tagline || ''}
                onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">بازه سال‌های آرشیو</label>
              <input
                type="text"
                value={profileForm.footerArchiveYears || ''}
                onChange={e => setProfileForm({ ...profileForm, footerArchiveYears: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">ایمیل ارتباطی</label>
              <input
                type="email"
                value={profileForm.contactEmail || ''}
                onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                placeholder="contact@shadowstudio.design"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">لینک تلگرام</label>
              <input
                type="url"
                value={profileForm.telegramUrl || ''}
                onChange={e => setProfileForm({ ...profileForm, telegramUrl: e.target.value })}
                placeholder="https://t.me/username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">لینک لینکدین</label>
              <input
                type="url"
                value={profileForm.linkedinUrl || ''}
                onChange={e => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/company/name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">لینک گیت‌هاب</label>
              <input
                type="url"
                value={profileForm.githubUrl || ''}
                onChange={e => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">متن یادداشت فوتر</label>
            <textarea
              rows={2}
              value={profileForm.footerNote || ''}
              onChange={e => setProfileForm({ ...profileForm, footerNote: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. BRANDS MANAGER */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'brands' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">مدیریت برندها</h3>
              <p className="text-xs text-slate-400">افزودن، ویرایش و مدیریت رنگ و توضیحات برندها</p>
            </div>
            <button
              onClick={() => {
                setEditingBrandId(null);
                setBrandForm({ name: '', nameFa: '', slug: '', description: '', color: '#0066FF', isRecognized: true });
                setNewBrandModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>افزودن برند جدید</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.map(b => (
              <div key={b.id} className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: b.color }} />
                      <span className="text-sm font-bold text-white">{b.nameFa}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{b.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {b.description || 'بدون توضیحات ثبت‌شده'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-[11px] text-slate-500 font-mono">ID: {b.slug || b.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingBrandId(b.id);
                        setBrandForm(b);
                        setNewBrandModalOpen(true);
                      }}
                      className="p-1.5 text-slate-300 hover:text-cyan-400 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`آیا از حذف برند ${b.nameFa} اطمینان دارید؟`)) {
                          deleteBrand(b.id);
                        }
                      }}
                      className="p-1.5 text-slate-300 hover:text-rose-400 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Brand Create/Edit */}
          {newBrandModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-[#0e1324] border border-white/20 rounded-2xl w-full max-w-md p-6 space-y-4 text-right">
                <h3 className="text-base font-bold text-white">
                  {editingBrandId ? 'ویرایش اطلاعات برند' : 'افزودن برند جدید'}
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">نام فارسی برند</label>
                    <input
                      type="text"
                      value={brandForm.nameFa || ''}
                      onChange={e => setBrandForm({ ...brandForm, nameFa: e.target.value })}
                      placeholder="مثال: دوو"
                      className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">نام انگلیسی برند</label>
                    <input
                      type="text"
                      value={brandForm.name || ''}
                      onChange={e => setBrandForm({ ...brandForm, name: e.target.value })}
                      placeholder="Daewoo"
                      className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">رنگ سازمانی</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={brandForm.color || '#0066FF'}
                        onChange={e => setBrandForm({ ...brandForm, color: e.target.value })}
                        className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={brandForm.color || '#0066FF'}
                        onChange={e => setBrandForm({ ...brandForm, color: e.target.value })}
                        className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">توضیحات برند</label>
                    <textarea
                      rows={3}
                      value={brandForm.description || ''}
                      onChange={e => setBrandForm({ ...brandForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="brandIsRecognized"
                      checked={Boolean(brandForm.isRecognized)}
                      onChange={e => setBrandForm({ ...brandForm, isRecognized: e.target.checked })}
                      className="w-4 h-4 rounded text-[#0066FF] cursor-pointer"
                    />
                    <label htmlFor="brandIsRecognized" className="text-xs text-slate-400 cursor-pointer">
                      برند شناخته‌شده (Recognized Brand)
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                  <button
                    onClick={() => setNewBrandModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleSaveBrand}
                    className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold cursor-pointer"
                  >
                    ذخیره برند
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. PRESENTATION SETTINGS */}
      {/* ------------------------------------------------------------- */}
      {activeSubTab === 'presentation' && (
        <div className="p-6 rounded-2xl bg-[#0c1020] border border-white/10 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-bold text-white">تنظیمات پرزنتیشن</h3>
              <p className="text-xs text-slate-400">ویرایش متن اسلاید افتتاحیه و جمع‌بندی</p>
            </div>
            <button
              onClick={handleSavePresentation}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white font-bold text-xs sm:text-sm cursor-pointer shadow-lg shadow-[#0066FF]/30 transition-transform active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>ذخیره پرزنتیشن</span>
            </button>
          </div>

          {/* INTRO SLIDE */}
          <div className="p-5 rounded-xl bg-[#12172b] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-[#0066FF] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#0066FF]/20 flex items-center justify-center text-xs">۱</span>
              اسلاید افتتاحیه
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">متن نشان (Badge)</label>
                <input type="text" value={presentationForm.introBadge}
                  onChange={e => setPresentationForm({ ...presentationForm, introBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">دکمه شروع</label>
                <input type="text" value={presentationForm.introButtonText}
                  onChange={e => setPresentationForm({ ...presentationForm, introButtonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">عنوان اصلی</label>
              <input type="text" value={presentationForm.introTitle}
                onChange={e => setPresentationForm({ ...presentationForm, introTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-sm font-bold" />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">توضیحات</label>
              <textarea rows={2} value={presentationForm.introDescription}
                onChange={e => setPresentationForm({ ...presentationForm, introDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs leading-relaxed" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">شاخص ۱ — مقدار</label>
                <input type="text" value={presentationForm.introStat1Value}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat1Value: e.target.value })}
                  className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs font-mono" />
                <input type="text" value={presentationForm.introStat1Label}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat1Label: e.target.value })}
                  placeholder="برچسب" className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-[10px]" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">شاخص ۲ — مقدار</label>
                <input type="text" value={presentationForm.introStat2Value}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat2Value: e.target.value })}
                  className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs font-mono" />
                <input type="text" value={presentationForm.introStat2Label}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat2Label: e.target.value })}
                  placeholder="برچسب" className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-[10px]" />
              </div>
              <div className="space-y-1">
                <label className="block text-[11px] text-slate-400">شاخص ۳ — مقدار</label>
                <input type="text" value={presentationForm.introStat3Value}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat3Value: e.target.value })}
                  className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-xs font-mono" />
                <input type="text" value={presentationForm.introStat3Label}
                  onChange={e => setPresentationForm({ ...presentationForm, introStat3Label: e.target.value })}
                  placeholder="برچسب" className="w-full px-2 py-1.5 rounded bg-[#080b15] border border-white/10 text-white text-[10px]" />
              </div>
            </div>
          </div>

          {/* CLOSING SLIDE */}
          <div className="p-5 rounded-xl bg-[#12172b] border border-white/10 space-y-4">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs">۱۱</span>
              اسلاید جمع‌بندی
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">متن نشان (Badge)</label>
                <input type="text" value={presentationForm.closingBadge}
                  onChange={e => setPresentationForm({ ...presentationForm, closingBadge: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs" />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">دکمه پایان</label>
                <input type="text" value={presentationForm.closingButtonText}
                  onChange={e => setPresentationForm({ ...presentationForm, closingButtonText: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">عنوان اصلی</label>
              <input type="text" value={presentationForm.closingTitle}
                onChange={e => setPresentationForm({ ...presentationForm, closingTitle: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-sm font-bold" />
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">توضیحات</label>
              <textarea rows={2} value={presentationForm.closingDescription}
                onChange={e => setPresentationForm({ ...presentationForm, closingDescription: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs leading-relaxed" />
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
