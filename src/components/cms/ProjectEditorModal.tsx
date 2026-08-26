import React, { useState, useEffect, useRef } from 'react';
import { Project, NormalizedProjectType, NormalizedPlatform } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { 
  X, Save, Eye, Upload, Link2, Image as ImageIcon, 
  Trash2, Plus, Check, Star, Folder, ExternalLink, Sparkles,
  Layers, Palette, Target, Layout, ShieldCheck, ArrowRight, Hash,
  Monitor, Smartphone, Tablet
} from 'lucide-react';
import { toPersianDigits } from '../../utils/persian';

interface ProjectEditorModalProps {
  project?: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onPreview: (project: Project) => void;
}

const PROJECT_TYPES: { key: NormalizedProjectType; label: string }[] = [
  { key: 'landing-page', label: 'لندینگ پیج و کمپین' },
  { key: 'website', label: 'وب‌سایت و پورتال مرجع' },
  { key: 'mobile-app', label: 'اپلیکیشن موبایل (App)' },
  { key: 'product', label: 'طراحی محصول دیجیتال و IoT' },
  { key: 'design-system', label: 'دیزاین سیستم و توکن‌ها' },
  { key: 'campaign', label: 'کمپین تبلیغاتی و بازاریابی' }
];

const PLATFORM_OPTIONS: { value: NormalizedPlatform; label: string }[] = [
  { value: 'desktop', label: 'دسکتاپ' },
  { value: 'mobile', label: 'موبایل' },
  { value: 'tablet', label: 'تبلت' },
  { value: 'responsive', label: 'ریسپانسیو' },
  { value: 'web', label: 'وب' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' }
];

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  project,
  isOpen,
  onClose,
  onPreview
}) => {
  const { createProject, updateProject, brands } = useProjects();

  const [activeTab, setActiveTab] = useState<'info' | 'media' | 'casestudy' | 'additional'>('info');

  const [nameFa, setNameFa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [brand, setBrand] = useState('Daewoo');
  const [clientFa, setClientFa] = useState('دوو');
  const [projectType, setProjectType] = useState<NormalizedProjectType>('landing-page');
  const [year, setYear] = useState<number>(1403);
  const [featured, setFeatured] = useState<boolean>(false);
  const [shortDescription, setShortDescription] = useState('');
  const [challenge, setChallenge] = useState('');
  const [approach, setApproach] = useState('');
  const [solution, setSolution] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');

  const [coverImage, setCoverImage] = useState<string>('');
  const [coverSourceType, setCoverSourceType] = useState<'upload' | 'link' | 'picker'>('picker');
  const [coverLinkInput, setCoverLinkInput] = useState('');

  const [heroImage, setHeroImage] = useState<string>('');
  const [heroSourceType, setHeroSourceType] = useState<'upload' | 'link'>('link');
  const [heroLinkInput, setHeroLinkInput] = useState('');

  const [mobileImage, setMobileImage] = useState<string>('');
  const [mobileSourceType, setMobileSourceType] = useState<'upload' | 'link'>('link');
  const [mobileLinkInput, setMobileLinkInput] = useState('');

  const [tabletImage, setTabletImage] = useState<string>('');
  const [tabletSourceType, setTabletSourceType] = useState<'upload' | 'link'>('link');
  const [tabletLinkInput, setTabletLinkInput] = useState('');

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryLink, setNewGalleryLink] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);
  const tabletFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const [platform, setPlatform] = useState<NormalizedPlatform[]>([]);
  const [platformFa, setPlatformFa] = useState('');
  const [scope, setScope] = useState<string[]>([]);
  const [scopeInput, setScopeInput] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [servicesInput, setServicesInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [context, setContext] = useState('');
  const [impact, setImpact] = useState('');
  const [team, setTeam] = useState('');
  const [role, setRole] = useState('');
  const [duration, setDuration] = useState('');
  const [accentColor, setAccentColor] = useState('');
  const [badge, setBadge] = useState('');

  useEffect(() => {
    if (project) {
      setNameFa(project.displayNameFa || project.name || '');
      setNameEn(project.displayNameEn || project.name || '');
      setBrand(project.brand || project.client || 'Daewoo');
      setClientFa(project.clientFa || 'دوو');
      const firstType = Array.isArray(project.type) ? project.type[0] : (project.type as any);
      setProjectType(firstType || 'landing-page');
      setYear(project.year || 1403);
      setFeatured(!!project.featured);
      setShortDescription(project.shortDescription || project.description || '');
      setChallenge(project.challenge || '');
      setApproach(project.approach || '');
      setSolution(project.solution || '');
      setLiveUrl(project.liveUrl || (project as any).url || '');
      setFigmaUrl(project.figmaUrl || '');
      setPdfUrl(project.pdfUrl || '');
      
      const cover = project.cover || (project.assets?.[0]?.src) || '';
      setCoverImage(cover);
      setCoverLinkInput(cover);

      const hero = project.hero || '';
      setHeroImage(hero);
      setHeroLinkInput(hero);

      const mobile = project.mobile || '';
      setMobileImage(mobile);
      setMobileLinkInput(mobile);

      const tablet = project.tablet || '';
      setTabletImage(tablet);
      setTabletLinkInput(tablet);
      
      const gallery = (project.gallery || []).map(g => (typeof g === 'string' ? g : g.image || g.imageUrl || '')).filter(Boolean);
      setGalleryImages(gallery.length ? gallery : (project.assets?.map(a => a.src).filter(Boolean) || []));

      const projPlatform = Array.isArray(project.platform) ? project.platform : (project.platform ? [project.platform as NormalizedPlatform] : []);
      setPlatform(projPlatform as NormalizedPlatform[]);
      setPlatformFa(project.platformFa || '');
      setScope(Array.isArray(project.scope) ? project.scope : []);
      const projServices = Array.isArray(project.services) ? project.services.map(String) : [];
      setServices(projServices);
      setTags(Array.isArray(project.tags) ? project.tags : []);
      setSeoTitle(project.seoTitle || '');
      setSeoDescription(project.seoDescription || '');
      setNotes(project.notes || '');
      setContext(project.context || '');
      setImpact(project.impact || '');
      setTeam(project.team || '');
      setRole(project.role || '');
      setDuration(project.duration || '');
      setAccentColor(project.accentColor || '');
      setBadge(project.badge || '');
    } else {
      setNameFa('');
      setNameEn('');
      setBrand('Daewoo');
      setClientFa('دوو');
      setProjectType('landing-page');
      setYear(1403);
      setFeatured(false);
      setShortDescription('');
      setChallenge('');
      setApproach('');
      setSolution('');
      setLiveUrl('');
      setFigmaUrl('');
      setPdfUrl('');
      setCoverImage('');
      setCoverLinkInput('');
      setHeroImage('');
      setHeroLinkInput('');
      setMobileImage('');
      setMobileLinkInput('');
      setTabletImage('');
      setTabletLinkInput('');
      setGalleryImages([]);
      setPlatform([]);
      setPlatformFa('');
      setScope([]);
      setServices([]);
      setTags([]);
      setSeoTitle('');
      setSeoDescription('');
      setNotes('');
      setContext('');
      setImpact('');
      setTeam('');
      setRole('');
      setDuration('');
      setAccentColor('');
      setBadge('');
    }
    setActiveTab('info');
    setUploadSuccess(null);
    setUploadError(null);
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleCoverFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              folderName: brand ? `${brand} Projects` : 'Custom Uploads',
              fileName: file.name,
              fileData: base64,
              category: 'cover'
            })
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.url) {
              setCoverImage(data.url);
              setCoverLinkInput(data.url);
              setUploadSuccess(`تصویر «${file.name}» با موفقیت ذخیره شد.`);
            } else {
              setUploadError('سرور پاسخ نامعتبری ارسال کرد. تصویر ذخیره نشد.');
            }
          } else {
            const errText = await res.text().catch(() => '');
            setUploadError(`خطا در آپلود تصویر. سرور فعال نیست یا مشکلی پیش آمده است. (${res.status})`);
          }
        } catch {
          setUploadError('سرور آپلود در دسترس نیست. لطفاً سرور را مجدداً راه‌اندازی کنید و دوباره تلاش کنید.');
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setUploadError('خطا در خواندن فایل تصویر.');
    }
  };

  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName: brand ? `${brand} Projects` : 'Custom Uploads', fileName: file.name, fileData: base64, category: 'hero' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.url) { setHeroImage(data.url); setHeroLinkInput(data.url); setUploadSuccess(`تصویر دسکتاپ «${file.name}» ذخیره شد.`); }
            else { setUploadError('سرور پاسخ نامعتبری ارسال کرد.'); }
          } else { setUploadError('خطا در آپلود تصویر دسکتاپ.'); }
        } catch { setUploadError('سرور آپلود در دسترس نیست.'); }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setIsUploading(false); }
  };

  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName: brand ? `${brand} Projects` : 'Custom Uploads', fileName: file.name, fileData: base64, category: 'mobile' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.url) { setMobileImage(data.url); setMobileLinkInput(data.url); setUploadSuccess(`تصویر موبایل «${file.name}» ذخیره شد.`); }
            else { setUploadError('سرور پاسخ نامعتبری ارسال کرد.'); }
          } else { setUploadError('خطا در آپلود تصویر موبایل.'); }
        } catch { setUploadError('سرور آپلود در دسترس نیست.'); }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setIsUploading(false); }
  };

  const handleTabletFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ folderName: brand ? `${brand} Projects` : 'Custom Uploads', fileName: file.name, fileData: base64, category: 'tablet' })
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.url) { setTabletImage(data.url); setTabletLinkInput(data.url); setUploadSuccess(`تصویر تبلت «${file.name}» ذخیره شد.`); }
            else { setUploadError('سرور پاسخ نامعتبری ارسال کرد.'); }
          } else { setUploadError('خطا در آپلود تصویر تبلت.'); }
        } catch { setUploadError('سرور آپلود در دسترس نیست.'); }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch { setIsUploading(false); }
  };

  const handleGalleryFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    const newUrls: string[] = [];
    let failedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folderName: brand ? `${brand} Projects` : 'Custom Uploads',
            fileName: file.name,
            fileData: base64,
            category: 'gallery'
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.url) {
            newUrls.push(data.url);
          } else {
            failedCount++;
          }
        } else {
          failedCount++;
        }
      } catch {
        failedCount++;
      }
    }

    if (newUrls.length > 0) {
      setGalleryImages(prev => [...prev, ...newUrls]);
    }
    if (failedCount > 0) {
      setUploadError(`${failedCount} تصویر از ${files.length} تصویر آپلود نشد. سرور آپلود فعال نیست.`);
    }
    if (newUrls.length > 0 && failedCount === 0) {
      setUploadSuccess(`${files.length} تصویر گالری با موفقیت اضافه شد.`);
    }
    setIsUploading(false);
  };

  const handleAddGalleryLink = () => {
    if (!newGalleryLink.trim()) return;
    setGalleryImages(prev => [...prev, newGalleryLink.trim()]);
    setNewGalleryLink('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const togglePlatform = (p: NormalizedPlatform) => {
    setPlatform(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags(prev => [...prev, trimmed]);
    }
  };

  const removeTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  const addScopeItem = () => {
    const trimmed = scopeInput.trim();
    if (trimmed && !scope.includes(trimmed)) {
      setScope(prev => [...prev, trimmed]);
    }
    setScopeInput('');
  };

  const removeScopeItem = (index: number) => {
    setScope(prev => prev.filter((_, i) => i !== index));
  };

  const addServiceItem = () => {
    const trimmed = servicesInput.trim();
    if (trimmed && !services.includes(trimmed)) {
      setServices(prev => [...prev, trimmed]);
    }
    setServicesInput('');
  };

  const removeServiceItem = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const title = nameFa.trim() || nameEn.trim();
    if (!title) {
      alert('لطفاً عنوان پروژه را وارد نمایید.');
      return;
    }

    const typeFaMap: Record<string, string> = {
      'landing-page': 'لندینگ پیج و کمپین',
      'website': 'وب‌سایت و پورتال مرجع',
      'mobile-app': 'اپلیکیشن موبایل',
      'product': 'طراحی محصول دیجیتال',
      'design-system': 'سیستم دیزاین و توکن‌ها',
      'campaign': 'کمپین تبلیغاتی و بازاریابی'
    };

    const finalCover = coverSourceType === 'link' && coverLinkInput.trim()
      ? coverLinkInput.trim()
      : coverImage;

    const finalHero = heroSourceType === 'link' && heroLinkInput.trim()
      ? heroLinkInput.trim()
      : heroImage;

    const finalMobile = mobileSourceType === 'link' && mobileLinkInput.trim()
      ? mobileLinkInput.trim()
      : mobileImage;

    const finalTablet = tabletSourceType === 'link' && tabletLinkInput.trim()
      ? tabletLinkInput.trim()
      : tabletImage;

    const projectId = project?.id || `project-${Date.now()}`;

    const projectData: Partial<Project> = {
      name: nameEn.trim() || title,
      displayNameFa: nameFa.trim() || title,
      displayNameEn: nameEn.trim() || title,
      brand: brand.trim(),
      client: brand.trim(),
      clientFa: clientFa.trim(),
      year: year || 1403,
      type: [projectType],
      typeFa: typeFaMap[projectType] || 'پورتال اختصاصی',
      featured: featured,
      cover: finalCover,
      hero: finalHero || undefined,
      tablet: finalTablet || undefined,
      mobile: finalMobile || undefined,
      shortDescription: shortDescription.trim(),
      description: shortDescription.trim(),
      challenge: challenge.trim(),
      approach: approach.trim(),
      solution: solution.trim(),
      liveUrl: liveUrl.trim(),
      figmaUrl: figmaUrl.trim(),
      pdfUrl: pdfUrl.trim() || undefined,
      platform: platform,
      platformFa: platformFa.trim(),
      scope: scope,
      services: services,
      tags: tags,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim(),
      notes: notes.trim(),
      context: context.trim(),
      impact: impact.trim(),
      team: team.trim(),
      role: role.trim(),
      duration: duration.trim(),
      accentColor: accentColor.trim(),
      badge: badge.trim(),
      gallery: (galleryImages.length ? galleryImages : [finalCover]).map((img, idx) => ({
        id: `gal-${idx}`,
        title: `${title} - Screen ${idx + 1}`,
        category: 'UI' as const,
        caption: title,
        image: img,
        imageUrl: img
      })),
      assets: [
        {
          id: `asset-cover-${Date.now()}`,
          projectId: projectId,
          src: finalCover,
          type: 'image',
          title: title,
          category: 'cover',
          order: 0
        },
        ...galleryImages.map((gUrl, idx) => ({
          id: `asset-gal-${Date.now()}-${idx}`,
          projectId: projectId,
          src: gUrl,
          type: 'image' as const,
          title: `${title} - Screen ${idx + 1}`,
          category: 'desktop' as const,
          order: idx + 1
        }))
      ]
    };

    if (project) {
      updateProject(project.id, projectData);
    } else {
      createProject({
        ...projectData,
        id: projectId,
        slug: (nameEn || nameFa).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || `project-${Date.now().toString().slice(-4)}`
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto text-right">
      <div className="relative w-full max-w-3xl bg-[#0a0e1c] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0f1428]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0066FF]/20 border border-[#0066FF]/40 flex items-center justify-center text-[#0066FF]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {project ? `ویرایش: ${project.displayNameFa || project.name}` : 'افزودن پروژه جدید'}
              </h2>
              <p className="text-xs text-slate-400">
                مشخصات، تصاویر، روایت کیس‌استادی و اطلاعات تکمیلی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-black/40 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>مشخصات</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>تصاویر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('casestudy')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'casestudy'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>کیس‌استادی</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('additional')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'additional'
                ? 'bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/30'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>تکمیلی</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {uploadSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
          )}

          {uploadError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              <span>{uploadError}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO & BRAND */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    عنوان فارسی <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={nameFa}
                    onChange={(e) => setNameFa(e.target.value)}
                    placeholder="مثال: لندینگ پیج ماشین ظرفشویی دوو"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">عنوان انگلیسی</label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="مثال: Daewoo DW Landing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">برند</label>
                  <select
                    value={brand}
                    onChange={(e) => {
                      const b = e.target.value;
                      setBrand(b);
                      const match = brands.find(p => p.id === b);
                      if (match) setClientFa(match.nameFa);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>{b.nameFa} ({b.id})</option>
                    ))}
                    <option value="Other">سایر برندها</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">دسته‌بندی</label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c18] border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    {PROJECT_TYPES.map(t => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">سال طراحی</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10) || 1403)}
                      className="w-24 px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs sm:text-sm text-center font-mono focus:outline-none focus:border-[#0066FF]"
                    />
                    <button
                      type="button"
                      onClick={() => setFeatured(!featured)}
                      className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        featured
                          ? 'bg-[#0066FF]/20 border-[#0066FF] text-[#0066FF]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${featured ? 'fill-[#0066FF]' : ''}`} />
                      <span>۱۰ پروژه برتر (Top 10)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">خلاصه مدیریتی پروژه</label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  rows={3}
                  placeholder="توضیحاتی در رابطه با اهداف طراحی، تجربه کاربری و دستاوردهای این پروژه..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          {/* TAB 2: COVER IMAGE & GALLERY MEDIA */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>تصویر کاور اصلی پروژه (Cover Image)</span>
                  </h3>
                  
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('upload')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        coverSourceType === 'upload' ? 'bg-[#0066FF] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>آپلود از سیستم</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverSourceType('link')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        coverSourceType === 'link' ? 'bg-[#0066FF] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>درج لینک مستقیم</span>
                    </button>
                  </div>
                </div>

                {coverSourceType === 'upload' && (
                  <div className="space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileUpload}
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/20 hover:border-[#0066FF] rounded-2xl p-6 text-center cursor-pointer bg-white/[0.02] hover:bg-[#0066FF]/5 transition-all space-y-2"
                    >
                      <Upload className="w-8 h-8 text-[#0066FF] mx-auto" />
                      <div className="text-xs sm:text-sm font-bold text-white">
                        کلیک کنید یا فایل تصویر را اینجا رها کنید
                      </div>
                      <p className="text-[11px] text-slate-400">
                        پشتیبانی از فرمت‌های PNG، JPG، WEBP (کیفیت بالا)
                      </p>
                    </div>
                  </div>
                )}

                {coverSourceType === 'link' && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">
                      آدرس URL یا مسیر فایل در پوشه public
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={coverLinkInput}
                        onChange={(e) => {
                          setCoverLinkInput(e.target.value);
                          setCoverImage(e.target.value);
                        }}
                        placeholder="مثال: /uploads/.../image.png"
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {coverImage && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                      <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تصویر کاور فعال</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5" dir="ltr">
                        {coverImage}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* HERO (Desktop) Image Section */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span>تصویر دسکتاپ (Hero Image) — اختیاری</span>
                  </h3>
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                    <button type="button" onClick={() => setHeroSourceType('upload')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${heroSourceType === 'upload' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Upload className="w-3.5 h-3.5" /><span>آپلود</span>
                    </button>
                    <button type="button" onClick={() => setHeroSourceType('link')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${heroSourceType === 'link' ? 'bg-cyan-500/20 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Link2 className="w-3.5 h-3.5" /><span>لینک</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">تصویر اصلی نمای دسکتاپ در فریم مرورگر و ارائه. اگر خالی باشد، تصویر کاور نمایش داده می‌شود.</p>

                {heroSourceType === 'upload' && (
                  <div className="space-y-3">
                    <input ref={heroFileInputRef} type="file" accept="image/*" onChange={handleHeroFileUpload} className="hidden" />
                    <div onClick={() => heroFileInputRef.current?.click()}
                      className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-4 text-center cursor-pointer bg-white/[0.02] hover:bg-cyan-500/5 transition-all space-y-1">
                      <Upload className="w-6 h-6 text-cyan-400 mx-auto" />
                      <div className="text-xs font-bold text-white">آپلود تصویر دسکتاپ</div>
                    </div>
                  </div>
                )}

                {heroSourceType === 'link' && (
                  <input type="text" value={heroLinkInput}
                    onChange={(e) => { setHeroLinkInput(e.target.value); setHeroImage(e.target.value); }}
                    placeholder="آدرس URL یا مسیر فایل تصویر دسکتاپ"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-cyan-400 text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors" />
                )}

                {heroImage && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="w-24 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                      <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span>تصویر دسکتاپ فعال</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5" dir="ltr">{heroImage}</div>
                    </div>
                    <button type="button" onClick={() => { setHeroImage(''); setHeroLinkInput(''); }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* TABLET Image Section */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-violet-400 uppercase tracking-wider flex items-center gap-2">
                    <Tablet className="w-4 h-4" />
                    <span>تصویر تبلت (Tablet Image) — اختیاری</span>
                  </h3>
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                    <button type="button" onClick={() => setTabletSourceType('upload')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${tabletSourceType === 'upload' ? 'bg-violet-500/20 text-violet-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Upload className="w-3.5 h-3.5" /><span>آپلود</span>
                    </button>
                    <button type="button" onClick={() => setTabletSourceType('link')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${tabletSourceType === 'link' ? 'bg-violet-500/20 text-violet-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Link2 className="w-3.5 h-3.5" /><span>لینک</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">تصویر اختصاصی نمای تبلت در فریم آیپد. اگر خالی باشد، تصویر کاور نمایش داده می‌شود.</p>

                {tabletSourceType === 'upload' && (
                  <div className="space-y-3">
                    <input ref={tabletFileInputRef} type="file" accept="image/*" onChange={handleTabletFileUpload} className="hidden" />
                    <div onClick={() => tabletFileInputRef.current?.click()}
                      className="border-2 border-dashed border-violet-500/30 hover:border-violet-400 rounded-2xl p-4 text-center cursor-pointer bg-white/[0.02] hover:bg-violet-500/5 transition-all space-y-1">
                      <Upload className="w-6 h-6 text-violet-400 mx-auto" />
                      <div className="text-xs font-bold text-white">آپلود تصویر تبلت</div>
                    </div>
                  </div>
                )}

                {tabletSourceType === 'link' && (
                  <input type="text" value={tabletLinkInput}
                    onChange={(e) => { setTabletLinkInput(e.target.value); setTabletImage(e.target.value); }}
                    placeholder="آدرس URL یا مسیر فایل تصویر تبلت"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-violet-400 text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors" />
                )}

                {tabletImage && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="w-20 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                      <img src={tabletImage} alt="Tablet Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-violet-400" />
                        <span>تصویر تبلت فعال</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5" dir="ltr">{tabletImage}</div>
                    </div>
                    <button type="button" onClick={() => { setTabletImage(''); setTabletLinkInput(''); }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* MOBILE Image Section */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>تصویر موبایل (Mobile Image) — اختیاری</span>
                  </h3>
                  <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
                    <button type="button" onClick={() => setMobileSourceType('upload')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${mobileSourceType === 'upload' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Upload className="w-3.5 h-3.5" /><span>آپلود</span>
                    </button>
                    <button type="button" onClick={() => setMobileSourceType('link')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${mobileSourceType === 'link' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}>
                      <Link2 className="w-3.5 h-3.5" /><span>لینک</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">تصویر اختصاصی نمای موبایل در فریم آیفون. اگر خالی باشد، تصویر کاور نمایش داده می‌شود.</p>

                {mobileSourceType === 'upload' && (
                  <div className="space-y-3">
                    <input ref={mobileFileInputRef} type="file" accept="image/*" onChange={handleMobileFileUpload} className="hidden" />
                    <div onClick={() => mobileFileInputRef.current?.click()}
                      className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-4 text-center cursor-pointer bg-white/[0.02] hover:bg-emerald-500/5 transition-all space-y-1">
                      <Upload className="w-6 h-6 text-emerald-400 mx-auto" />
                      <div className="text-xs font-bold text-white">آپلود تصویر موبایل</div>
                    </div>
                  </div>
                )}

                {mobileSourceType === 'link' && (
                  <input type="text" value={mobileLinkInput}
                    onChange={(e) => { setMobileLinkInput(e.target.value); setMobileImage(e.target.value); }}
                    placeholder="آدرس URL یا مسیر فایل تصویر موبایل"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-emerald-400 text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors" />
                )}

                {mobileImage && (
                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/40 border border-white/10">
                    <div className="w-16 h-24 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                      <img src={mobileImage} alt="Mobile Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تصویر موبایل فعال</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5" dir="ltr">{mobileImage}</div>
                    </div>
                    <button type="button" onClick={() => { setMobileImage(''); setMobileLinkInput(''); }}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg cursor-pointer shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>تصاویر و اسکرین‌های تکمیلی گالری ({toPersianDigits(galleryImages.length)})</span>
                  </h3>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newGalleryLink}
                    onChange={(e) => setNewGalleryLink(e.target.value)}
                    placeholder="درج لینک فایل (مثال: /uploads/...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryLink}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن لینک</span>
                  </button>

                  <input
                    ref={galleryFileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryFilesUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => galleryFileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-[#0066FF]/20 hover:bg-[#0066FF]/30 border border-[#0066FF]/40 text-[#0066FF] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود فایل‌ها</span>
                  </button>
                </div>

                {galleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                    {galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden bg-black border border-white/10 aspect-video">
                        <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-500/90 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="حذف این تصویر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CASE STUDY PILLARS & EXTERNAL LINKS */}
          {activeTab === 'casestudy' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>چالش و هدف پروژه</span>
                </label>
                <textarea
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  rows={2}
                  placeholder="مثال: ارتقای نرخ تعامل کاربران و بهبود شاخص‌های بارگذاری بصری..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Layout className="w-3.5 h-3.5 text-cyan-400" />
                  <span>رویکرد و معماری تجربه کاربری</span>
                </label>
                <textarea
                  value={approach}
                  onChange={(e) => setApproach(e.target.value)}
                  rows={2}
                  placeholder="مثال: تدوین سلسله‌مراتب بصری داده‌ها، ناوبری ماژولار و دسترسی سریع به کاتالوگ..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  <span>راه‌حل نهایی و خروجی دیزاین</span>
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={2}
                  placeholder="مثال: استفاده از سیستم گرید ۱۲ ستونه، متغیرهای توکن رنگی و کامپوننت‌های اتمیک..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">لینک وب‌سایت</label>
                  <input
                    type="text"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://daewoo.ir/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs font-mono focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">لینک فیگما</label>
                  <input
                    type="text"
                    value={figmaUrl}
                    onChange={(e) => setFigmaUrl(e.target.value)}
                    placeholder="https://figma.com/file/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">فایل PDF پروژه (اختیاری)</label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  placeholder="/uploads/catalog/.../file.pdf یا https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs font-mono focus:outline-none"
                />
                <p className="text-[10px] text-slate-500">آدرس فایل PDF جهت نمایش زنده در صفحه پروژه</p>
              </div>
            </div>
          )}

          {/* TAB 4: ADDITIONAL INFO */}
          {activeTab === 'additional' && (
            <div className="space-y-5">
              {/* Platform Multi-Select */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">پلتفرم‌ها</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORM_OPTIONS.map(opt => {
                    const isSelected = platform.includes(opt.value);
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => togglePlatform(opt.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#0066FF]/20 border-[#0066FF] text-[#0066FF]'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 inline ml-1" />}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  value={platformFa}
                  onChange={(e) => setPlatformFa(e.target.value)}
                  placeholder="برچسب فارسی پلتفرم‌ها (مثال: دسکتاپ و موبایل)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Scope */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">دامنه کاری</label>
                <div className="flex flex-wrap gap-1.5">
                  {scope.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs">
                      {item}
                      <button type="button" onClick={() => removeScopeItem(idx)} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scopeInput}
                    onChange={(e) => setScopeInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addScopeItem(); } }}
                    placeholder="آیتم جدید را وارد کرده و Enter بزنید"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs focus:outline-none"
                  />
                  <button type="button" onClick={addScopeItem} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Services */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">خدمات</label>
                <div className="flex flex-wrap gap-1.5">
                  {services.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs">
                      {item}
                      <button type="button" onClick={() => removeServiceItem(idx)} className="text-slate-400 hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={servicesInput}
                    onChange={(e) => setServicesInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addServiceItem(); } }}
                    placeholder="آیتم جدید را وارد کرده و Enter بزنید"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs focus:outline-none"
                  />
                  <button type="button" onClick={addServiceItem} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">برچسب‌ها (Tags)</label>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0066FF]/20 border border-[#0066FF]/40 text-[#0066FF] text-xs font-bold">
                      {item}
                      <button type="button" onClick={() => removeTag(idx)} className="text-[#0066FF]/60 hover:text-rose-400 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(tagInput); setTagInput(''); } }}
                    placeholder="برچسب جدید را وارد کرده و Enter بزنید"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs focus:outline-none"
                  />
                  <button type="button" onClick={() => { addTag(tagInput); setTagInput(''); }} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Team / Role / Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">تیم پروژه</label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="مثال: ۳ نفر"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">نقش</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="مثال: Lead UI/UX Designer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">مدت زمان</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="مثال: ۳ ماه"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Accent Color & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">رنگ پروژه</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor || '#0066FF'}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#0066FF"
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm font-mono focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">بج / نشان</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="مثال: Winner Awwwards"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Context & Impact */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">بستر پروژه</label>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={2}
                  placeholder="زمینه و شرایط پروژه..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">تاثیر و دستاوردها</label>
                <textarea
                  value={impact}
                  onChange={(e) => setImpact(e.target.value)}
                  rows={2}
                  placeholder="توضیحات تاثیر و دستاوردهای پروژه..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* SEO */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-xs font-bold text-[#0066FF] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>بهینه‌سازی سئو (SEO)</span>
                </h4>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">عنوان متا</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="عنوان صفحه برای موتورهای جستجو"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">توضیحات متا</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    rows={2}
                    placeholder="توضیحات متا برای موتورهای جستجو"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">یادداشت‌ها</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="یادداشت‌های داخلی و توضیحات تکمیلی..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-[#0066FF] text-white text-xs sm:text-sm focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-[#0f1428]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white text-xs font-medium hover:bg-white/5 transition-colors cursor-pointer"
          >
            انصراف
          </button>

          <div className="flex items-center gap-3">
            {project && (
              <button
                type="button"
                onClick={() => onPreview(project)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 transition-colors cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                <span>مشاهده کیس‌استادی</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0066FF]/25 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{project ? 'ذخیره تغییرات' : 'ایجاد و ذخیره پروژه'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
