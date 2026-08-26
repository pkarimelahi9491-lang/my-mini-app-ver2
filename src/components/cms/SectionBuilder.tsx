import React, { useState } from 'react';
import { ProjectSection, SectionType } from '../../types';
import { Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, Layers, FileText, BarChart2, Smartphone, GitCommit, LayoutGrid, Quote, Copy, LayoutTemplate } from 'lucide-react';

interface SectionBuilderProps {
  sections: ProjectSection[];
  onAddSection: (section: Omit<ProjectSection, 'id'>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<ProjectSection>) => void;
  onDeleteSection: (sectionId: string) => void;
  onReorderSections: (sectionIds: string[]) => void;
}

const AVAILABLE_SECTION_TYPES: { type: SectionType; label: string; icon: any; defaultTitle: string; defaultContent?: string }[] = [
  { type: 'hero', label: 'هیرو اصلی (Hero Header)', icon: Layers, defaultTitle: 'معرفی کلان پروژه', defaultContent: 'خلاصه راهبردی تحول محصول و ارزش خلق‌شده.' },
  { type: 'text', label: 'کانتکست و چالش (Context)', icon: FileText, defaultTitle: 'چالش و بستر مسئله', defaultContent: 'بررسی ریشه‌ای چالش‌های کسب‌وکار و نیازمندی‌های کاربران.' },
  { type: 'metrics', label: 'شاخص‌های مقیاس (Design Scale)', icon: BarChart2, defaultTitle: 'شاخص‌های مقیاس دیزاین', defaultContent: 'آمار اسکرین‌ها، کامپوننت‌های سیستم و نرخ بهبود.' },
  { type: 'device-showcase', label: 'نمایش دیوایس‌ها (Multi-Device)', icon: Smartphone, defaultTitle: 'پیش‌نمایش تعاملی در دیوایس‌ها' },
  { type: 'ux-flow', label: 'فلوچارت و نقشه UX (Flow)', icon: GitCommit, defaultTitle: 'معماری اطلاعات و جریان کاربری', defaultContent: 'ساختار دسته‌بندی و مسیر حرکت کاربر.' },
  { type: 'design-system', label: 'سیستم دیزاین (Tokens)', icon: LayoutGrid, defaultTitle: 'سیستم دیزاین و توکن‌های بصری', defaultContent: 'رنگ‌ها، تایپوگرافی پلاک و الگوهای ماژولار.' },
  { type: 'quote', label: 'تصمیمات کلیدی (Key Decisions)', icon: Quote, defaultTitle: 'تصمیمات استراتژیک دیزاین' },
  { type: 'gallery', label: 'آلبوم کامل اسکرین‌ها (Gallery)', icon: LayoutGrid, defaultTitle: 'آلبوم کامل رابط کاربری' },
  { type: 'related-projects', label: 'پروژه‌های مرتبط (Ecosystem)', icon: Layers, defaultTitle: 'پروژه‌های مرتبط در این اکوسیستم' },
  { type: 'wireframe', label: 'وایرفریم و پروتوتایپ (Wireframe)', icon: Layers, defaultTitle: 'وایرفریم و پروتوتایپ' },
  { type: 'image-grid', label: 'گالری تصاویر (Image Grid)', icon: LayoutGrid, defaultTitle: 'گالری تصاویر پروژه' },
  { type: 'full-width-image', label: 'تصویر تمام‌عرض (Full Width Hero)', icon: LayoutTemplate, defaultTitle: 'تصویر تمام‌عرض هیرو' },
  { type: 'split-image', label: 'مقایسه تصویری (Split Image)', icon: LayoutTemplate, defaultTitle: 'مقایسه تصویری قبل و بعد' },
  { type: 'before-after', label: 'قبل و بعد (Before/After)', icon: LayoutTemplate, defaultTitle: 'مقایسه قبل و بعد' },
  { type: 'components', label: 'کتابخانه کامپوننت (Component Library)', icon: LayoutGrid, defaultTitle: 'کتابخانه کامپوننت‌ها' },
  { type: 'project-scale', label: 'مقیاس و آمار (Project Scale)', icon: BarChart2, defaultTitle: 'مقیاس و آمار پروژه' },
  { type: 'impact', label: 'تأثیر و نتایج (Impact & Results)', icon: BarChart2, defaultTitle: 'تأثیر و نتایج پروژه' },
];

const LAYOUT_OPTIONS = [
  { value: 'default', label: 'پیش‌فرض (Default)' },
  { value: 'full-width', label: 'تمام‌عرض (Full Width)' },
  { value: 'split', label: 'تقسیم‌شده (Split)' },
  { value: 'centered', label: 'مرکز (Centered)' },
  { value: 'boxed', label: 'جعبه‌ای (Boxed)' },
];

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  sections,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onReorderSections
}) => {
  const [selectedType, setSelectedType] = useState<SectionType>('text');

  const handleAdd = () => {
    const meta = AVAILABLE_SECTION_TYPES.find(s => s.type === selectedType);
    onAddSection({
      type: selectedType,
      title: meta?.defaultTitle || 'بخش جدید',
      subtitle: meta?.type,
      content: meta?.defaultContent || '',
      order: sections.length + 1,
      visible: true
    });
  };

  const handleDuplicate = (section: ProjectSection) => {
    const meta = AVAILABLE_SECTION_TYPES.find(s => s.type === section.type);
    onAddSection({
      type: section.type,
      title: `${section.title || meta?.defaultTitle || 'بخش'} (کپی)`,
      subtitle: section.subtitle,
      content: section.content,
      assets: section.assets,
      layout: section.layout,
      order: sections.length + 1,
      visible: section.visible
    });
  };

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const list = [...sections];
    const index = list.findIndex(s => s.id === id);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onReorderSections(list.map(s => s.id));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Top Creation Bar */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-300 whitespace-nowrap">افزودن سکشن:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as SectionType)}
            className="flex-1 sm:w-60 px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#0066FF]"
          >
            {AVAILABLE_SECTION_TYPES.map(item => (
              <option key={item.type} value={item.type}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-[#0052cc] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-[#0066FF]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>افزودن به کیس‌استادی</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-slate-500 text-xs">
            سکشنی تعریف نشده است. از منوی بالا می‌توانید سکشن‌های دلخواه را به چیدمان کیس‌استادی بیفزایید.
          </div>
        ) : (
          sections.map((section, idx) => {
            const typeMeta = AVAILABLE_SECTION_TYPES.find(t => t.type === section.type);
            const Icon = typeMeta?.icon || Layers;

            return (
              <div
                key={section.id}
                className={`p-4 rounded-2xl bg-[#0c0c14] border transition-all space-y-3 ${
                  section.visible ? 'border-white/10' : 'border-white/5 opacity-50'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white/5 border border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <Icon className="w-4 h-4 text-[#0066FF]" />
                    <span className="text-xs font-bold text-slate-200">{typeMeta?.label || section.type}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                      type: {section.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateSection(section.id, { visible: !section.visible })}
                      title={section.visible ? 'مخفی‌سازی در نمایش عمومی' : 'نمایش در کیس‌استادی'}
                      className={`p-1.5 rounded-lg text-xs ${
                        section.visible ? 'bg-white/5 text-slate-300 hover:text-white' : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(section.id, 'up')}
                      disabled={idx === 0}
                      title="انتقال به بالا"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(section.id, 'down')}
                      disabled={idx === sections.length - 1}
                      title="انتقال به پایین"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicate(section)}
                      title="کپی سکشن"
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteSection(section.id)}
                      title="حذف سکشن"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Editable Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">تیتر سکشن (Title):</label>
                    <input
                      type="text"
                      value={section.title || ''}
                      onChange={(e) => onUpdateSection(section.id, { title: e.target.value })}
                      placeholder="عنوان سکشن..."
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">زیرتیتر انگلیسی (Subtitle):</label>
                    <input
                      type="text"
                      value={section.subtitle || ''}
                      onChange={(e) => onUpdateSection(section.id, { subtitle: e.target.value })}
                      placeholder="Section English Subtitle..."
                      className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                {/* Content Textarea */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">شرح و متن سکشن:</label>
                  <textarea
                    rows={2}
                    value={section.content || ''}
                    onChange={(e) => onUpdateSection(section.id, { content: e.target.value })}
                    placeholder="متن روایی یا توضیحات فنی..."
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                {/* Layout Selector */}
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">لی‌اوت سکشن (Layout):</label>
                  <select
                    value={section.layout || 'default'}
                    onChange={(e) => onUpdateSection(section.id, { layout: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#0066FF]"
                  >
                    {LAYOUT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
