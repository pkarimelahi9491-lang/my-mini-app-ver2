import React, { useState, useRef, useEffect } from 'react';
import { ProjectAsset, AssetCategory } from '../../types';
import { 
  Upload, Plus, Trash2, CheckCircle, ArrowUp, ArrowDown, 
  Folder, FolderPlus, Image as ImageIcon, Loader2, Check, 
  Sparkles, Monitor, Tablet, Smartphone, FileText, AlertCircle
} from 'lucide-react';

interface AssetUploaderProps {
  projectId: string;
  projectName?: string;
  projectFolderName?: string;
  assets: ProjectAsset[];
  coverUrl?: string;
  onSetCover: (src: string) => void;
  onAddAsset: (asset: Omit<ProjectAsset, 'id' | 'projectId'>) => void;
  onUpdateAsset: (assetId: string, updates: Partial<ProjectAsset>) => void;
  onDeleteAsset: (assetId: string) => void;
  onReorderAssets: (assetIds: string[]) => void;
}

interface ServerFolderFile {
  fileName: string;
  url: string;
  isMarkdown: boolean;
  isImage: boolean;
}

interface ServerFolder {
  name: string;
  path: string;
  filesCount: number;
  files: ServerFolderFile[];
}

const CATEGORIES: { key: AssetCategory; label: string; description: string; icon: any }[] = [
  { key: 'desktop', label: 'اسکرین دسکتاپ', description: 'تصاویر رابط کاربری در اندازه دسکتاپ (۱۴۴۰px)', icon: Monitor },
  { key: 'tablet', label: 'اسکرین تبلت', description: 'نماهای ریسپانسیو سایز تبلت (۷۶۸px)', icon: Tablet },
  { key: 'mobile', label: 'اسکرین موبایل', description: 'نماهای واکنش‌گرا و دیوایس موبایل (۳۹۰px)', icon: Smartphone },
  { key: 'cover', label: 'کاور اصلی (Cover)', description: 'تصویر اصلی نمایش در لیست‌ها و هدر', icon: ImageIcon },
  { key: 'ux', label: 'مستندات UX و استپ‌ها', description: 'دیاگرام‌های معماری اطلاعات و فلوچارت‌ها / Step Flow', icon: FileText },
  { key: 'ui', label: 'گالری عمومی UI', description: 'اسکرین‌شات‌ها و نماهای رابط کاربری', icon: Sparkles },
  { key: 'campaign', label: 'کمپین و بنرها', description: 'مواد تبلیغاتی و بصری کمپین', icon: Sparkles }
];

export const AssetUploader: React.FC<AssetUploaderProps> = ({
  projectId,
  projectName,
  projectFolderName,
  assets,
  coverUrl,
  onSetCover,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  onReorderAssets
}) => {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>('desktop');
  const [targetFolder, setTargetFolder] = useState<string>(
    projectFolderName || projectName || 'Daewoo General Landing'
  );
  
  // Update target folder when props change
  useEffect(() => {
    if (projectFolderName) {
      setTargetFolder(projectFolderName);
    } else if (projectName) {
      setTargetFolder(projectName);
    }
  }, [projectFolderName, projectName]);

  const [availableFolders, setAvailableFolders] = useState<ServerFolder[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const [uploadErrorMsg, setUploadErrorMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Manual URL fallback input
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetCaption, setNewAssetCaption] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch available folders and their contents from server
  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/uploads/folders');
      if (res.ok) {
        const data = await res.json();
        if (data.folders) {
          setAvailableFolders(data.folders);
        }
      }
    } catch (e) {
      // Graceful fallback in case offline
      console.log('Folders listing not available:', e);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const filteredAssets = assets
    .filter(a => a.category === activeCategory)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Handle direct file upload from user's computer
  const handleFilesUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);
    setUploadErrorMsg(null);

    const folderName = targetFolder.trim() || 'General';
    let uploadedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`در حال پردازش و آپلود فایل ${i + 1} از ${files.length}: ${file.name}...`);

      try {
        // Read file as base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Determine friendly title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        let detectedCategory: AssetCategory = activeCategory;
        if (file.name.toLowerCase().includes('desktop')) detectedCategory = 'desktop';
        else if (file.name.toLowerCase().includes('tablet')) detectedCategory = 'tablet';
        else if (file.name.toLowerCase().includes('mobile')) detectedCategory = 'mobile';
        else if (file.name.toLowerCase().includes('step')) detectedCategory = 'ux';

        let uploadedAssetUrl = base64Data;
        let isServerSaved = false;

        try {
          // Call backend API if available to save the file in public/uploads/{folderName}/
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              folderName: folderName,
              fileName: file.name,
              fileData: base64Data,
              category: detectedCategory
            })
          });

          if (response.ok) {
            const result = await response.json();
            if (result && result.url) {
              uploadedAssetUrl = result.url;
              isServerSaved = true;
            }
          }
        } catch {
          // Backend not present, seamlessly use local base64 data
        }

        uploadedCount++;

        // Register newly uploaded asset
        onAddAsset({
          type: 'image',
          category: detectedCategory,
          title: cleanName,
          caption: isServerSaved ? `فایل اختصاصی پوشه ${folderName}` : 'فایل بارگذاری‌شده پروژه',
          src: uploadedAssetUrl,
          order: assets.length + uploadedCount,
          featured: detectedCategory === 'desktop' || detectedCategory === 'cover'
        });

        // If it's a desktop or cover and no cover is set, auto-set cover
        if (detectedCategory === 'desktop' || detectedCategory === 'cover' || !coverUrl) {
          onSetCover(uploadedAssetUrl);
        }
      } catch (err: any) {
        console.error('Error processing file:', file.name, err);
        setUploadErrorMsg(`خطا در پردازش فایل ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    setUploadProgress('');
    if (uploadedCount > 0) {
      setUploadSuccessMsg(`${uploadedCount} تصویر با موفقیت در پوشه «${folderName}» ذخیره شد.`);
      fetchFolders();
    }
  };

  const handleManualAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl.trim()) return;

    onAddAsset({
      type: 'image',
      category: activeCategory,
      title: newAssetTitle || `${activeCategory} screen`,
      caption: newAssetCaption || '',
      src: newAssetUrl.trim(),
      order: assets.length + 1,
      featured: false
    });

    setNewAssetUrl('');
    setNewAssetTitle('');
    setNewAssetCaption('');
  };

  const handleMove = (assetId: string, direction: 'up' | 'down') => {
    const list = [...assets];
    const index = list.findIndex(a => a.id === assetId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    onReorderAssets(list.map(a => a.id));
  };

  // Find currently active folder's existing files on server
  const currentServerFolder = availableFolders.find(
    f => f.name.toLowerCase() === targetFolder.trim().toLowerCase()
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      
      {/* Hidden File Input for Native OS Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFilesUpload(e.target.files);
            e.target.value = '';
          }
        }}
      />

      {/* Target Folder Selector Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/30 to-indigo-950/20 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Folder className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span>پوشه اختصاصی ذخیره در سرور:</span>
              <span className="font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                public/uploads/{targetFolder}/
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              تصاویر آپلود شده مستقیماً در این پوشه ذخیره و نام‌گذاری می‌شوند.
            </p>
          </div>
        </div>

        {/* Quick Folder Switch / Custom Input */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {availableFolders.length > 0 && (
            <select
              value={targetFolder}
              onChange={(e) => setTargetFolder(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {availableFolders.map(f => (
                <option key={f.name} value={f.name}>
                  پوشه: {f.name} ({f.filesCount} فایل)
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            value={targetFolder}
            onChange={(e) => setTargetFolder(e.target.value)}
            placeholder="نام پوشه دلخواه..."
            className="w-40 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          const count = assets.filter(a => a.category === cat.key).length;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                activeCategory === cat.key
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Direct Computer Upload Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesUpload(e.dataTransfer.files);
          }
        }}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-4 ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
            : 'border-white/15 bg-white/[0.02] hover:border-blue-500/50 hover:bg-white/[0.04]'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 border border-blue-500/30 mx-auto flex items-center justify-center text-blue-400 shadow-inner">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          ) : (
            <Upload className="w-6 h-6" />
          )}
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-slate-100">
            تصاویر دیزاین را از کامپیوتر بکشید و اینجا رها کنید (Drag & Drop)
          </h4>
          <p className="text-xs text-slate-400">
            یا بر روی دکمه زیر کلیک کرده و فایل‌های PNG/JPG/WebP را مستقیماً از سیستم انتخاب کنید.
          </p>
        </div>

        {/* Upload Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <FolderPlus className="w-4 h-4" />
            <span>انتخاب تصویر از کامپیوتر ({CATEGORIES.find(c => c.key === activeCategory)?.label})</span>
          </button>
        </div>

        {/* Uploading Status Indicator */}
        {isUploading && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{uploadProgress || 'در حال آپلود و ذخیره فایل در پوشه پروژه...'}</span>
          </div>
        )}

        {/* Success Alert */}
        {uploadSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{uploadSuccessMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {uploadErrorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{uploadErrorMsg}</span>
          </div>
        )}
      </div>

      {/* Existing Files inside Current Project Folder on Server */}
      {currentServerFolder && currentServerFolder.files.length > 0 && (
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
              <Folder className="w-4 h-4 text-blue-400" />
              <span>فایل‌های موجود در پوشه «{currentServerFolder.name}» روی سرور ({currentServerFolder.files.length})</span>
            </div>
            <span className="text-[10px] text-slate-400">کلیک برای افزودن فوری به پروژه</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto p-1" style={{ scrollbarWidth: 'thin' }}>
            {currentServerFolder.files.filter(f => f.isImage).map(f => {
              const isAlreadyAdded = assets.some(a => a.src === f.url);
              const isCover = coverUrl === f.url;

              return (
                <div
                  key={f.url}
                  className={`p-2 rounded-xl border flex flex-col gap-1.5 transition-all text-right ${
                    isAlreadyAdded
                      ? 'bg-blue-950/20 border-blue-500/30'
                      : 'bg-black/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-black/60 relative border border-white/5">
                    <img src={f.url} alt={f.fileName} className="w-full h-full object-cover" />
                    {isCover && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold">
                        کاور
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate font-mono" title={f.fileName}>
                    {f.fileName}
                  </div>
                  <div className="flex items-center gap-1 mt-auto">
                    {!isAlreadyAdded ? (
                      <button
                        type="button"
                        onClick={() => {
                          let cat: AssetCategory = activeCategory;
                          if (f.fileName.toLowerCase().includes('desktop')) cat = 'desktop';
                          else if (f.fileName.toLowerCase().includes('tablet')) cat = 'tablet';
                          else if (f.fileName.toLowerCase().includes('mobile')) cat = 'mobile';

                          onAddAsset({
                            type: 'image',
                            category: cat,
                            title: f.fileName.replace(/\.[^/.]+$/, ''),
                            caption: `فایل سرور ${currentServerFolder.name}`,
                            src: f.url,
                            order: assets.length + 1,
                            featured: cat === 'desktop'
                          });
                        }}
                        className="w-full py-1 rounded-lg bg-white/5 hover:bg-blue-600 hover:text-white text-slate-300 text-[10px] font-medium transition-colors"
                      >
                        + افزودن به اسکرین‌ها
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSetCover(f.url)}
                        className={`w-full py-1 rounded-lg text-[10px] font-medium transition-colors ${
                          isCover
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isCover ? '✓ کاور پروژه' : 'انتخاب کاور'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Manual Link Input (Optional Collapse) */}
      <details className="text-xs text-slate-400 group">
        <summary className="cursor-pointer py-1 text-slate-400 hover:text-slate-200 transition-colors list-none flex items-center gap-1.5 font-medium">
          <span>+ یا درج لینک مستقیم تصویر (URL)</span>
        </summary>
        <form onSubmit={handleManualAddSubmit} className="mt-3 flex flex-col sm:flex-row gap-2 pt-1">
          <input
            type="url"
            value={newAssetUrl}
            onChange={(e) => setNewAssetUrl(e.target.value)}
            placeholder="https://... (آدرس مستقیم تصویر اینترنتی یا فیگما)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={newAssetTitle}
            onChange={(e) => setNewAssetTitle(e.target.value)}
            placeholder="عنوان اسکرین (اختیاری)"
            className="sm:w-44 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!newAssetUrl.trim()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>افزودن لینک</span>
          </button>
        </form>
      </details>

      {/* Registered Asset Grid for Current Category */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">
            فایل‌های ثبت‌شده در بخش «{CATEGORIES.find(c => c.key === activeCategory)?.label}» ({filteredAssets.length})
          </span>
          <span className="text-[11px] text-slate-500 font-mono">ترتیب فایل‌ها با دکمه‌های بالا/پایین تعیین می‌شود</span>
        </div>

        {filteredAssets.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/[0.01] border border-white/5 text-center text-slate-500 text-xs">
            هنوز فایلی در دسته‌بندی «{CATEGORIES.find(c => c.key === activeCategory)?.label}» اضافه نشده است. می‌توانید با درگ و دراپ از کامپیوتر آپلود کنید.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAssets.map((asset, idx) => {
              const isCover = coverUrl === asset.src;
              return (
                <div
                  key={asset.id}
                  className={`group relative rounded-2xl bg-[#0c0c14] border p-3 space-y-3 transition-all ${
                    isCover ? 'border-blue-500 ring-1 ring-blue-500/30' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/5">
                    <img
                      src={asset.src}
                      alt={asset.title || 'Asset preview'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {isCover && (
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-bold flex items-center gap-1 shadow-md">
                        <CheckCircle className="w-3 h-3" />
                        <span>کاور اصلی پروژه</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-slate-300">
                      #{idx + 1}
                    </div>
                  </div>

                  {/* Metadata Fields */}
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={asset.title || ''}
                      onChange={(e) => onUpdateAsset(asset.id, { title: e.target.value })}
                      placeholder="عنوان اسکرین..."
                      className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={asset.caption || ''}
                      onChange={(e) => onUpdateAsset(asset.id, { caption: e.target.value })}
                      placeholder="توضیح کوتاه / کپشن..."
                      className="w-full px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-xs">
                    <button
                      type="button"
                      onClick={() => onSetCover(asset.src)}
                      className={`text-[11px] font-medium transition-colors cursor-pointer ${
                        isCover ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {isCover ? '✓ کاور فعال' : 'انتخاب به عنوان کاور'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMove(asset.id, 'up')}
                        title="انتقال به بالا"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(asset.id, 'down')}
                        title="انتقال به پایین"
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteAsset(asset.id)}
                        title="حذف مدیا"
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
