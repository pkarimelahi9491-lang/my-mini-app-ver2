import React, { useState, useEffect } from 'react';
import { DigitalCatalogProject, CatalogPage, CatalogCategory } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { 
  X, Save, Plus, Trash2, Image, Layers, Sparkles, 
  BookOpen, FileText, Smartphone, Download, ArrowRight, Eye, Check, Sliders
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

interface CatalogEditorModalProps {
  isOpen: boolean;
  catalog: DigitalCatalogProject | null;
  onClose: () => void;
  onPreview?: (catalog: DigitalCatalogProject) => void;
}

export const CatalogEditorModal: React.FC<CatalogEditorModalProps> = ({
  isOpen,
  catalog,
  onClose,
  onPreview
}) => {
  const { createCatalogProject, updateCatalogProject, brands } = useProjects();
  
  const [formData, setFormData] = useState<Partial<DigitalCatalogProject>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'pages' | 'highlights'>('general');
  const [highlightInput, setHighlightInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (catalog) {
      setFormData(JSON.parse(JSON.stringify(catalog)));
    } else {
      setFormData({
        titleFa: '',
        titleEn: '',
        slug: '',
        brand: 'Daewoo',
        client: 'Daewoo',
        clientFa: 'دوو',
        year: 1403,
        category: 'mobile-catalog',
        categoryFa: 'کاتالوگ تعاملی موبایل (Flipbook)',
        descriptionFa: '',
        cover: '/uploads/Daewoo General Landing/Daewoo General Landing - Desktop.png',
        pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileSizeMb: 4.8,
        pageCount: 6,
        aspectRatio: 'mobile-portrait',
        accentColor: '#10B981',
        isMobileOptimized: true,
        highlights: [
          'طراحی در نسبت ۹:۱۶ جهت تجربه تمام‌صفحه بدون حاشیه در گوشی‌های هوشمند',
          'امکان ورق‌زدن انیمیشنی صفحات و بررسی مشخصات فنی محصولات'
        ],
        pages: []
      });
    }
  }, [catalog, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(catalog?.id);

  const handleSave = () => {
    if (!formData.titleFa?.trim()) {
      alert('لطفاً عنوان کاتالوگ را وارد کنید.');
      return;
    }

    const payload: Partial<DigitalCatalogProject> = {
      ...formData,
      slug: formData.slug || formData.titleEn?.toLowerCase().replace(/\s+/g, '-') || `catalog-${Date.now()}`,
      pageCount: formData.pages?.length || formData.pageCount || 0
    };

    let result: DigitalCatalogProject;
    if (isEditing && catalog?.id) {
      updateCatalogProject(catalog.id, payload);
      result = { ...catalog, ...payload } as DigitalCatalogProject;
    } else {
      result = createCatalogProject(payload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  // Page handlers
  const addPage = () => {
    const nextPageNum = (formData.pages?.length || 0) + 1;
    const newPage: CatalogPage = {
      pageNumber: nextPageNum,
      title: `صفحه ${toPersianDigits(nextPageNum)} - عنوان صفحه`,
      subtitle: 'توضیحات کوتاه یا دسته‌بندی محصولات',
      imageUrl: '/uploads/Daewoo General Landing/Daewoo General Landing - Mobile.png',
      summaryBullets: ['ویژگی کلیدی ۱', 'ویژگی کلیدی ۲']
    };
    setFormData(prev => ({
      ...prev,
      pages: [...(prev.pages || []), newPage],
      pageCount: (prev.pages?.length || 0) + 1
    }));
  };

  const updatePage = (index: number, updates: Partial<CatalogPage>) => {
    setFormData(prev => {
      const updated = [...(prev.pages || [])];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, pages: updated };
    });
  };

  const removePage = (index: number) => {
    setFormData(prev => {
      const filtered = (prev.pages || []).filter((_, i) => i !== index);
      const renumbered = filtered.map((p, i) => ({ ...p, pageNumber: i + 1 }));
      return {
        ...prev,
        pages: renumbered,
        pageCount: renumbered.length
      };
    });
  };

  // Highlights handlers
  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      highlights: [...(prev.highlights || []), highlightInput.trim()]
    }));
    setHighlightInput('');
  };

  const removeHighlight = (index: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b0e1b] border border-emerald-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-emerald-500/10 overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0e1324] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isEditing ? 'ویرایش کاتالوگ دیجیتال و تعاملی' : 'ایجاد کاتالوگ دیجیتال جدید'}
              </h2>
              <p className="text-xs text-slate-400">
                تنظیم نسخه عمودی موبایل (۹:۱۶)، ورق‌زدن انیمیشنی، صفحات و دانلود PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-lg ${
                savedSuccess 
                  ? 'bg-emerald-600 shadow-emerald-500/30' 
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30 hover:scale-[1.02]'
              }`}
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'ذخیره شد!' : 'ذخیره تغییرات'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-white/10 bg-[#080b15]">
          <button
            onClick={() => setActiveTab('general')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'general'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>مشخصات کاتالوگ و دانلود PDF</span>
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'pages'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مدیریت صفحات ({formData.pages?.length || 0} صفحه)</span>
          </button>

          <button
            onClick={() => setActiveTab('highlights')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'highlights'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ویژگی‌های کلیدی و مزایا</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان فارسی کاتالوگ</label>
                  <input
                    type="text"
                    value={formData.titleFa || ''}
                    onChange={e => setFormData({ ...formData, titleFa: e.target.value })}
                    placeholder="مثال: کاتالوگ دیجیتال و تعاملی لوازم خانگی دوو"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان انگلیسی</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Daewoo Mobile Interactive Catalog"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none font-mono text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">برند</label>
                  <select
                    value={formData.brand || 'Daewoo'}
                    onChange={e => {
                      const brandObj = brands.find(b => b.name === e.target.value);
                      setFormData({ 
                        ...formData, 
                        brand: e.target.value,
                        client: e.target.value,
                        clientFa: brandObj?.nameFa || e.target.value,
                        accentColor: brandObj?.color || formData.accentColor
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.nameFa} ({b.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">نسبت ابعاد (Aspect Ratio)</label>
                  <select
                    value={formData.aspectRatio || 'mobile-portrait'}
                    onChange={e => setFormData({ ...formData, aspectRatio: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none cursor-pointer"
                  >
                    <option value="mobile-portrait">موبایل عمودی (۹:۱۶ Full View)</option>
                    <option value="tablet-vertical">تبلت عمودی (۳:۴)</option>
                    <option value="standard-a4">استاندارد A4 چاپی</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رنگ تم (Accent Color)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#10B981'}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#10B981'}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left focus:border-emerald-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">لینک مستقیم فایل PDF (جهت دانلود)</label>
                  <input
                    type="text"
                    value={formData.pdfUrl || ''}
                    onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                    placeholder="https://... یا /uploads/catalogs/file.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">حجم فایل (مگابایت)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.fileSizeMb || 4.8}
                    onChange={e => setFormData({ ...formData, fileSizeMb: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">تصویر کاور کاتالوگ (Cover Image)</label>
                <input
                  type="text"
                  value={formData.cover || ''}
                  onChange={e => setFormData({ ...formData, cover: e.target.value })}
                  placeholder="/uploads/... یا لینک تصویر"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none font-mono text-left mb-2"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">توضیحات معرفی کاتالوگ</label>
                <textarea
                  rows={3}
                  value={formData.descriptionFa || ''}
                  onChange={e => setFormData({ ...formData, descriptionFa: e.target.value })}
                  placeholder="کاتالوگ اختصاصی بهینه‌شده برای مرور سریع در گوشی‌های هوشمند..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-emerald-400 outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-[#12172b] border border-white/10">
                <input
                  type="checkbox"
                  id="mobileOpt"
                  checked={formData.isMobileOptimized ?? true}
                  onChange={e => setFormData({ ...formData, isMobileOptimized: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="mobileOpt" className="text-xs font-bold text-slate-300 cursor-pointer">
                  بهینه‌سازی کامل برای نمایشگر موبایل و سرعت بالا با اینترنت گوشی (Mobile Optimized)
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: PAGES */}
          {activeTab === 'pages' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">صفحات کاتالوگ تعاملی (Flipbook Pages)</h3>
                  <p className="text-xs text-slate-400">به ترتیب ورق زدن در نمای موبایل و دسکتاپ</p>
                </div>
                <button
                  onClick={addPage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن صفحه جدید</span>
                </button>
              </div>

              {(!formData.pages || formData.pages.length === 0) ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  هیچ صفحه‌ای تعریف نشده است. با کلیک بر روی دکمه بالا صفحه اول را اضافه کنید.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.pages.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold font-mono text-xs">
                            صفحه {toPersianDigits(idx + 1)}
                          </span>
                          <span className="text-xs text-slate-400">{p.title}</span>
                        </div>
                        <button
                          onClick={() => removePage(idx)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">عنوان صفحه</label>
                          <input
                            type="text"
                            value={p.title || ''}
                            onChange={e => updatePage(idx, { title: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">زیرعنوان / مدل محصول</label>
                          <input
                            type="text"
                            value={p.subtitle || ''}
                            onChange={e => updatePage(idx, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">آدرس تصویر صفحه (ImageUrl)</label>
                        <input
                          type="text"
                          value={p.imageUrl || ''}
                          onChange={e => updatePage(idx, { imageUrl: e.target.value })}
                          placeholder="/uploads/... یا لینک تصویر"
                          className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">نکات کلیدی صفحه (Summary Bullets)</label>
                        <div className="space-y-1.5">
                          {(p.summaryBullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={e => {
                                  const updated = [...(p.summaryBullets || [])];
                                  updated[bIdx] = e.target.value;
                                  updatePage(idx, { summaryBullets: updated });
                                }}
                                className="flex-1 px-3 py-1.5 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                              />
                              <button
                                onClick={() => {
                                  const updated = (p.summaryBullets || []).filter((_, i) => i !== bIdx);
                                  updatePage(idx, { summaryBullets: updated });
                                }}
                                className="p-1 rounded text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => updatePage(idx, { summaryBullets: [...(p.summaryBullets || []), ''] })}
                            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer mt-1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>افزودن نکته</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: HIGHLIGHTS */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">نقاط قوت و شاخصه‌های کاتالوگ</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={e => setHighlightInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addHighlight())}
                    placeholder="مثال: امکان ورق‌زدن انیمیشنی صفحات و بررسی مشخصات مدل‌های جدید"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs focus:border-emerald-400 outline-none"
                  />
                  <button
                    onClick={addHighlight}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                  >
                    افزودن
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {(formData.highlights || []).map((hl, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#12172b] border border-white/10 text-xs text-slate-300">
                      <span>• {hl}</span>
                      <button onClick={() => removeHighlight(idx)} className="text-rose-400 hover:text-rose-300 cursor-pointer p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
