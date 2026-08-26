import React, { useState } from 'react';
import { useProjects } from '../../context/ProjectContext';
import { toPersianDigits } from '../../utils/persian';
import { 
  X, 
  Download, 
  Upload, 
  FileJson, 
  CheckCircle2, 
  AlertTriangle, 
  HardDrive, 
  Sparkles, 
  RefreshCw, 
  ShieldCheck, 
  Laptop,
  FolderSync
} from 'lucide-react';

interface DataPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataPackageModal: React.FC<DataPackageModalProps> = ({
  isOpen,
  onClose
}) => {
  const { projects, exportFullBackupJson, importJson, resetAllToInitial } = useProjects();
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    const dataStr = exportFullBackupJson();
    const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sayeh-presentation-bundle-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setImportStatus({
      success: true,
      message: 'فایل بسته ارائه با موفقیت دانلود شد. می‌توانید این فایل را روی هر رایانه یا مرورگری بارگذاری کنید.'
    });
  };

  const processFileContent = (content: string) => {
    const res = importJson(content);
    if (res.success) {
      setImportStatus({
        success: true,
        message: `بسته ارائه با موفقیت بارگذاری شد! (${toPersianDigits(res.count)} پروژه، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و برندها آماده ارائه و نمایش است).`
      });
    } else {
      setImportStatus({
        success: false,
        message: res.error || 'ساختار فایل JSON معتبر نیست.'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      processFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.json')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        processFileContent(content);
      };
      reader.readAsText(file);
    } else {
      setImportStatus({
        success: false,
        message: 'لطفاً فقط فایل با فرمت .json انتخاب کنید.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in text-right">
      <div className="w-full max-w-2xl rounded-3xl bg-[#090c18] border border-white/15 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#0066FF]" />
                <h3 className="text-base sm:text-lg font-bold text-white">
                  مرکز داده و بسته پرتابل ارائه (بدون نیاز به دیتابیس)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                ذخیره، انتقال و لود اطلاعات پروژه‌ها روی هر رایانه یا جلسه کاری
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          
          {/* Status Alert if available */}
          {importStatus && (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs sm:text-sm animate-fade-in ${
              importStatus.success 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {importStatus.success ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <div className="leading-relaxed">
                {importStatus.message}
              </div>
            </div>
          )}

          {/* Explanation Box */}
          <div className="p-4 rounded-2xl bg-[#0e1426] border border-white/10 space-y-2 text-xs leading-relaxed text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <Laptop className="w-4 h-4 text-[#0066FF]" />
              <span>چگونه کار می‌کند؟ (۱۰۰٪ مستقل از اینترنت و سرور)</span>
            </div>
            <p>
              تمام اطلاعات و ویرایش‌های شما به صورت خودکار در حافظه مرورگر ذخیره می‌شوند. شما می‌توانید با کلیک روی <strong>«دانلود فایل بسته ارائه»</strong> یک نسخه پرتابل با پسوند JSON دریافت کنید، آن را با فلش یا ایمیل همراه خود ببرید و در هر جلسه یا روی هر لپ‌تاپی با <strong>«بارگذاری فایل»</strong> تمام پروژه‌ها و دیزاین‌ها را فوراً بالا بیاورید!
            </p>
          </div>

          {/* Action 1: Export Package */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#0066FF]" />
                  <span>۱. خروجی و دانلود فایل بسته ارائه (JSON)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  شامل تمام {toPersianDigits(projects.length)} پروژه ثبت‌شده، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و برندها
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-4 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#0066FF]/20 flex items-center gap-1.5 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>دانلود فایل ارائه</span>
              </button>
            </div>
          </div>

          {/* Action 2: Import / Drag & Drop Package */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>۲. بارگذاری و اجرای بسته ارائه (Import File)</span>
              </h4>
              <p className="text-xs text-slate-400">
                فایل JSON حاوی پروژه‌ها، پیکتوگرام‌ها، کاتالوگ‌ها، تنظیمات و برندها را آپلود کنید تا فوراً در پلتفرم لود شود.
              </p>
            </div>

            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 text-center cursor-pointer ${
                dragOver 
                  ? 'border-[#0066FF] bg-[#0066FF]/10' 
                  : 'border-white/15 bg-black/30 hover:border-white/30'
              }`}
            >
              <FileJson className="w-8 h-8 text-slate-400" />
              <div className="text-xs text-slate-300">
                فایل JSON ارائه را به اینجا بکشید یا برای انتخاب کلیک کنید
              </div>
              <label className="mt-1 px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 cursor-pointer transition-colors">
                <span>انتخاب فایل از سیستم</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Action 3: Reset to Default Registry */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10 text-xs">
            <span className="text-slate-400">نیاز به بازگشت به تنظیمات اولیه دارید؟</span>
            <button
              onClick={() => {
                if (confirm('آیا از بازنشانی کلیه داده‌ها به اطلاعات اولیه اطمینان دارید؟')) {
                  resetAllToInitial();
                  setImportStatus({
                    success: true,
                    message: 'اطلاعات با موفقیت به داده‌های اولیه بازنشانی شد.'
                  });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>بازنشانی به داده‌های پیش‌فرض</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-white/[0.01] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            بستن پنجره
          </button>
        </div>

      </div>
    </div>
  );
};
