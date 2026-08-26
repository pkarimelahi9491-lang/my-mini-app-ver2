import React, { useState, useEffect } from 'react';
import { BrandPictogramProject, PictogramIconItem, PictogramCategory } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { 
  X, Save, Plus, Trash2, Image, Layers, Sparkles, 
  Grid, Palette, Download, ArrowRight, Eye, Check, Sliders
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

interface PictogramEditorModalProps {
  isOpen: boolean;
  project: BrandPictogramProject | null;
  onClose: () => void;
  onPreview?: (project: BrandPictogramProject) => void;
}

export const PictogramEditorModal: React.FC<PictogramEditorModalProps> = ({
  isOpen,
  project,
  onClose,
  onPreview
}) => {
  const { createPictogramProject, updatePictogramProject, brands } = useProjects();
  
  const [formData, setFormData] = useState<Partial<BrandPictogramProject>>({});
  const [activeTab, setActiveTab] = useState<'general' | 'mockups' | 'icons' | 'guidelines'>('general');
  const [keyTokenInput, setKeyTokenInput] = useState('');
  const [guidelineInput, setGuidelineInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData(JSON.parse(JSON.stringify(project)));
    } else {
      setFormData({
        titleFa: '',
        titleEn: '',
        slug: '',
        brand: 'Daewoo',
        client: 'Daewoo',
        clientFa: 'دوو',
        year: 1403,
        category: 'smart-home',
        categoryFa: 'پیکتوگرام و سیستم آیکونوگرافی',
        descriptionFa: '',
        cover: '/uploads/Daewoo RF Landing/Daewoo RF Landing - Desktop.png',
        accentColor: '#0066FF',
        iconCount: 24,
        gridSystem: '24×24dp Optical Pixel Grid / 2.0px Stroke Weight',
        keyTokens: ['گرید ۲۴ پیکسلی استاندارد', 'ضخامت خطوط ۲ پیکسل ثابت'],
        guidelines: ['حفظ حاشیه امن ۲ پیکسلی در اطراف کادر گرید', 'گردی گوشه‌ها بر اساس شعاع ۴ پیکسلی'],
        mockups: [],
        icons: []
      });
    }
  }, [project, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(project?.id);

  const handleSave = () => {
    if (!formData.titleFa?.trim()) {
      alert('لطفاً عنوان فارسی پروژه را وارد کنید.');
      return;
    }

    const payload: Partial<BrandPictogramProject> = {
      ...formData,
      slug: formData.slug || formData.titleEn?.toLowerCase().replace(/\s+/g, '-') || `pictogram-${Date.now()}`,
      iconCount: formData.icons?.length || formData.iconCount || 0
    };

    let result: BrandPictogramProject;
    if (isEditing && project?.id) {
      updatePictogramProject(project.id, payload);
      result = { ...project, ...payload } as BrandPictogramProject;
    } else {
      result = createPictogramProject(payload);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  // Mockup handlers
  const addMockup = () => {
    const newMockup = {
      id: `mockup-${Date.now()}`,
      title: 'موکاپ جدید',
      description: 'توضیحات کاربرد پیکتوگرام در رابط سخت‌افزاری یا نرم‌افزاری',
      imageUrl: '/uploads/Daewoo RF Landing/Daewoo RF Landing - Mobile.png',
      tag: 'Display Mockup'
    };
    setFormData(prev => ({
      ...prev,
      mockups: [...(prev.mockups || []), newMockup]
    }));
  };

  const updateMockup = (index: number, updates: any) => {
    setFormData(prev => {
      const updated = [...(prev.mockups || [])];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, mockups: updated };
    });
  };

  const removeMockup = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mockups: (prev.mockups || []).filter((_, i) => i !== index)
    }));
  };

  // Icon handlers
  const addIcon = () => {
    const newIcon: PictogramIconItem = {
      id: `icon-${Date.now()}`,
      name: 'Smart Feature Icon',
      nameFa: 'آیکون ویژگی جدید',
      category: 'smart-home',
      tags: ['IoT', 'Home']
    };
    setFormData(prev => ({
      ...prev,
      icons: [...(prev.icons || []), newIcon],
      iconCount: (prev.icons?.length || 0) + 1
    }));
  };

  const updateIcon = (index: number, updates: Partial<PictogramIconItem>) => {
    setFormData(prev => {
      const updated = [...(prev.icons || [])];
      updated[index] = { ...updated[index], ...updates };
      return { ...prev, icons: updated };
    });
  };

  const removeIcon = (index: number) => {
    setFormData(prev => ({
      ...prev,
      icons: (prev.icons || []).filter((_, i) => i !== index),
      iconCount: Math.max(0, (prev.icons?.length || 1) - 1)
    }));
  };

  // Token add
  const addKeyToken = () => {
    if (!keyTokenInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      keyTokens: [...(prev.keyTokens || []), keyTokenInput.trim()]
    }));
    setKeyTokenInput('');
  };

  const removeKeyToken = (index: number) => {
    setFormData(prev => ({
      ...prev,
      keyTokens: (prev.keyTokens || []).filter((_, i) => i !== index)
    }));
  };

  // Guideline add
  const addGuideline = () => {
    if (!guidelineInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      guidelines: [...(prev.guidelines || []), guidelineInput.trim()]
    }));
    setGuidelineInput('');
  };

  const removeGuideline = (index: number) => {
    setFormData(prev => ({
      ...prev,
      guidelines: (prev.guidelines || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0b0e1b] border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden text-right">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 bg-[#0e1324] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isEditing ? 'ویرایش سیستم پیکتوگرام و آیکونوگرافی' : 'ایجاد سیستم پیکتوگرام جدید'}
              </h2>
              <p className="text-xs text-slate-400">
                تنظیم توکن‌های طراحی، موکاپ‌های پنل لمسی و آیکون‌های وکتور
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-lg ${
                savedSuccess 
                  ? 'bg-emerald-600 shadow-emerald-500/30' 
                  : 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30 hover:scale-[1.02]'
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
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>مشخصات اصلی و هویت</span>
          </button>

          <button
            onClick={() => setActiveTab('mockups')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'mockups'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>موکاپ‌ها و تصاویر پنل ({formData.mockups?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('icons')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'icons'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>آیکون‌ها و سمبل‌ها ({formData.icons?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('guidelines')}
            className={`py-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'guidelines'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>گرید و گایدلاین‌ها</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان فارسی سیستم</label>
                  <input
                    type="text"
                    value={formData.titleFa || ''}
                    onChange={e => setFormData({ ...formData, titleFa: e.target.value })}
                    placeholder="مثال: سیستم جامع پیکتوگرام‌های اینترنت اشیاء دوو"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">عنوان انگلیسی</label>
                  <input
                    type="text"
                    value={formData.titleEn || ''}
                    onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                    placeholder="Daewoo Smart IoT Iconography System"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none font-mono text-left"
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
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.name}>{b.nameFa} ({b.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">سال شمسی</label>
                  <input
                    type="number"
                    value={formData.year || 1403}
                    onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) || 1403 })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">رنگ تم (Accent Color)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.accentColor || '#0066FF'}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <input
                      type="text"
                      value={formData.accentColor || '#0066FF'}
                      onChange={e => setFormData({ ...formData, accentColor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left focus:border-cyan-400 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">تصویر کاور اصلی (Cover URL)</label>
                <input
                  type="text"
                  value={formData.cover || ''}
                  onChange={e => setFormData({ ...formData, cover: e.target.value })}
                  placeholder="/uploads/... یا لینک تصویر"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none font-mono text-left mb-2"
                />
                {formData.cover && (
                  <div className="h-28 rounded-xl overflow-hidden bg-black/40 border border-white/10 max-w-sm">
                    <img src={formData.cover} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">توضیحات راهبردی سیستم</label>
                <textarea
                  rows={3}
                  value={formData.descriptionFa || ''}
                  onChange={e => setFormData({ ...formData, descriptionFa: e.target.value })}
                  placeholder="توضیح دهید این سیستم پیکتوگرام برای چه اهدافی، چه دستگاه‌هایی و با چه استاندارد بصری طراحی شده است..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">لینک دانلود فایل‌های وکتور (اختیاری)</label>
                <input
                  type="text"
                  value={formData.downloadVectorUrl || ''}
                  onChange={e => setFormData({ ...formData, downloadVectorUrl: e.target.value })}
                  placeholder="https://... (لینک بسته Figma یا SVG)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm focus:border-cyan-400 outline-none font-mono text-left"
                />
              </div>
            </div>
          )}

          {/* TAB 2: MOCKUPS */}
          {activeTab === 'mockups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">موکاپ‌ها و کاربردهای بصری</h3>
                  <p className="text-xs text-slate-400">تصاویر پنل‌های لمسی سخت‌افزار، اپلیکیشن موبایل یا دفترچه‌های راهنما</p>
                </div>
                <button
                  onClick={addMockup}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن موکاپ جدید</span>
                </button>
              </div>

              {(!formData.mockups || formData.mockups.length === 0) ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  هیچ موکاپی ثبت نشده است. با کلیک بر روی دکمه بالا اولین موکاپ را اضافه کنید.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.mockups.map((m, idx) => (
                    <div key={m.id || idx} className="p-4 rounded-xl bg-[#12172b] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-cyan-400">موکاپ #{toPersianDigits(idx + 1)}</span>
                        <button
                          onClick={() => removeMockup(idx)}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">عنوان موکاپ</label>
                          <input
                            type="text"
                            value={m.title || ''}
                            onChange={e => updateMockup(idx, { title: e.target.value })}
                            placeholder="مثال: پنل لمسی یخچال ساید دوو"
                            className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">تگ موکاپ</label>
                          <input
                            type="text"
                            value={m.tag || ''}
                            onChange={e => updateMockup(idx, { tag: e.target.value })}
                            placeholder="Hardware Display / Mobile App"
                            className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">آدرس تصویر (Image URL)</label>
                        <input
                          type="text"
                          value={m.imageUrl || ''}
                          onChange={e => updateMockup(idx, { imageUrl: e.target.value })}
                          placeholder="/uploads/..."
                          className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs font-mono text-left"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">توضیح کاربرد</label>
                        <textarea
                          rows={2}
                          value={m.description || ''}
                          onChange={e => updateMockup(idx, { description: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-[#080b15] border border-white/10 text-white text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ICONS */}
          {activeTab === 'icons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">لیست آیکون‌ها و سمبل‌ها</h3>
                  <p className="text-xs text-slate-400">آیکون‌های طراحی‌شده در این مجموعه</p>
                </div>
                <button
                  onClick={addIcon}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>افزودن آیکون</span>
                </button>
              </div>

              {(!formData.icons || formData.icons.length === 0) ? (
                <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl text-slate-400 text-xs">
                  هیچ آیکونی تعریف نشده است.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
                  {formData.icons.map((ic, idx) => (
                    <div key={ic.id || idx} className="p-3 rounded-xl bg-[#12172b] border border-white/10 flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xs font-bold font-mono shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={ic.nameFa || ''}
                              onChange={e => updateIcon(idx, { nameFa: e.target.value })}
                              placeholder="نام فارسی"
                              className="w-full bg-transparent text-white text-xs font-bold border-b border-transparent focus:border-cyan-400 outline-none pb-0.5"
                            />
                            <input
                              type="text"
                              value={ic.name || ''}
                              onChange={e => updateIcon(idx, { name: e.target.value })}
                              placeholder="English Name"
                              className="w-full bg-transparent text-slate-400 text-[11px] font-mono border-b border-transparent focus:border-cyan-400 outline-none"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => removeIcon(idx)}
                          className="p-1 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pl-[42px]">
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">SVG Path</label>
                          <input
                            type="text"
                            value={ic.svgPath || ''}
                            onChange={e => updateIcon(idx, { svgPath: e.target.value })}
                            placeholder="M12 2L..."
                            className="w-full px-2 py-1 rounded-lg bg-[#080b15] border border-white/10 text-[11px] text-slate-300 font-mono text-left focus:border-cyan-400 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-500 mb-0.5">Icon Name (Lucide)</label>
                          <input
                            type="text"
                            value={ic.iconName || ''}
                            onChange={e => updateIcon(idx, { iconName: e.target.value })}
                            placeholder="e.g. Wifi, Home"
                            className="w-full px-2 py-1 rounded-lg bg-[#080b15] border border-white/10 text-[11px] text-slate-300 font-mono text-left focus:border-cyan-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GUIDELINES */}
          {activeTab === 'guidelines' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">فرمول گرید سیستم (Grid System Formula)</label>
                <input
                  type="text"
                  value={formData.gridSystem || ''}
                  onChange={e => setFormData({ ...formData, gridSystem: e.target.value })}
                  placeholder="24×24dp Optical Pixel Grid / 2.0px Stroke Weight / 4px Corner Radii"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#12172b] border border-white/10 text-white text-sm font-mono text-left focus:border-cyan-400 outline-none"
                />
              </div>

              {/* Key Tokens Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300">توکن‌های کلیدی طراحی (Key Design Tokens)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keyTokenInput}
                    onChange={e => setKeyTokenInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyToken())}
                    placeholder="مثال: گرید هندسی ۲۴ پیکسلی با نقاط کانونی اپتیکال"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                  />
                  <button
                    onClick={addKeyToken}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                  >
                    افزودن توکن
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {(formData.keyTokens || []).map((token, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs"
                    >
                      <span>{token}</span>
                      <button onClick={() => removeKeyToken(idx)} className="hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Guidelines Bullet points */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-300">قوانین و استانداردهای طراحی (Design Guidelines)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guidelineInput}
                    onChange={e => setGuidelineInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addGuideline())}
                    placeholder="مثال: ضخامت خطوط در تمام زاویه‌ها ۲ پیکسل ثابت باشد"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#12172b] border border-white/10 text-white text-xs focus:border-cyan-400 outline-none"
                  />
                  <button
                    onClick={addGuideline}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer"
                  >
                    افزودن قانون
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {(formData.guidelines || []).map((guide, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-[#12172b] border border-white/10 text-xs text-slate-300">
                      <span>• {guide}</span>
                      <button onClick={() => removeGuideline(idx)} className="text-rose-400 hover:text-rose-300 cursor-pointer p-1">
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
