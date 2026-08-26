import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { getProjectImage } from '../data/projectImages';
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Globe, 
  ArrowLeft,
  ArrowDown,
  Layers
} from 'lucide-react';

interface ProjectMockupProps {
  project: Project;
  variant?: 'browser' | 'mobile' | 'tablet' | 'card' | 'interactive';
  aspectHeight?: string;
  showDetailsOnHover?: boolean;
  onOpenDetail?: () => void;
}

export const ProjectMockup: React.FC<ProjectMockupProps> = ({
  project,
  variant = 'browser',
  aspectHeight = 'h-64 sm:h-72',
  showDetailsOnHover = true,
  onOpenDetail
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(
    variant === 'mobile' ? 'mobile' : variant === 'tablet' ? 'tablet' : 'desktop'
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get responsive realistic images (check project.hero/mobile first, then fallback to lookup)
  const desktopImg = project.hero || getProjectImage(project.id, project.type, 'hero');
  const tabletImg = getProjectImage(project.id, project.type, 'tablet');
  const mobileImg = project.mobile || getProjectImage(project.id, project.type, 'mobile');

  const currentImage = device === 'mobile' ? mobileImg : device === 'tablet' ? tabletImg : desktopImg;

  // Calculate dynamic scroll distance based on image aspect ratio
  const [scrollTranslate, setScrollTranslate] = useState<string>('calc(-100% + 260px)');

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    if (containerRef.current) {
      const containerH = containerRef.current.clientHeight || 260;
      const naturalH = target.naturalHeight;
      const naturalW = target.naturalWidth;
      const renderedW = target.clientWidth || 400;
      const renderedH = naturalW > 0 ? (naturalH / naturalW) * renderedW : containerH;
      
      if (renderedH > containerH) {
        const offset = -(renderedH - containerH);
        setScrollTranslate(`${offset}px`);
      } else {
        setScrollTranslate('0px');
      }
    }
  };

  // 1. Sleek Minimal Thumbnail Card (Zero Box-in-Box, Pure Luxury)
  if (variant === 'card') {
    return (
      <div 
        className="relative w-full rounded-xl overflow-hidden bg-[#060609] border border-white/10 group transition-all duration-300 select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Minimal Browser Bar Header */}
        <div className="h-7 bg-[#0b0b10] border-b border-white/5 px-3 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500/80" />
            <span className="w-2 h-2 rounded-full bg-amber-500/80" />
            <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
          </div>
          
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/50 text-[10px] text-slate-400 font-mono max-w-[200px] truncate">
            <Globe className="w-2.5 h-2.5 text-[#0066FF]" />
            <span>{project.client.toLowerCase()}.design</span>
          </div>

          <span className="text-[10px] font-mono text-slate-500">{project.year}</span>
        </div>

        {/* Viewport Window with Smooth Hover-Scroll */}
        <div 
          ref={containerRef}
          className={`relative w-full ${aspectHeight} overflow-hidden bg-[#020204] cursor-pointer`}
          onClick={onOpenDetail}
        >
          <img
            ref={imgRef}
            src={currentImage}
            alt={project.name}
            onLoad={handleImageLoad}
            className="w-full h-auto object-top transition-transform duration-[4000ms] ease-in-out"
            style={{
              transform: isHovered ? `translateY(${scrollTranslate})` : 'translateY(0px)'
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
          />

          {/* Smooth Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-transparent to-transparent opacity-60 pointer-events-none" />
        </div>
      </div>
    );
  }

  // 2. Standard Browser Window Preview with Real Hover-Scroll
  return (
    <div 
      className="relative w-full rounded-2xl overflow-hidden bg-[#07070c] border border-white/10 group transition-all duration-300 select-none shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Luxury Browser Bar */}
      <div className="h-9 bg-[#0b0b12] border-b border-white/10 px-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>

          {/* Device Switcher Controls (if interactive) */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5 mr-3">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1 rounded transition-colors ${device === 'desktop' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="دسکتاپ"
            >
              <Monitor className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1 rounded transition-colors ${device === 'tablet' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="تبلت"
            >
              <Tablet className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1 rounded transition-colors ${device === 'mobile' ? 'bg-[#0066FF] text-white' : 'text-slate-400 hover:text-white'}`}
              title="موبایل"
            >
              <Smartphone className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Minimal Address URL */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 border border-white/5 text-[11px] text-slate-300 font-mono max-w-[280px] truncate">
          <Globe className="w-3 h-3 text-[#0066FF]" />
          <span>https://{project.client.toLowerCase()}.design/{project.slug}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span>{device === 'desktop' ? '1440px' : device === 'tablet' ? '768px' : '375px'}</span>
        </div>
      </div>

      {/* Viewport Area with Full-Height Hover-Scroll */}
      <div 
        ref={containerRef}
        className={`relative w-full ${aspectHeight} overflow-hidden bg-[#030306] flex justify-center`}
      >
        <div className={`h-full ${device === 'mobile' ? 'w-[320px]' : device === 'tablet' ? 'w-[640px]' : 'w-full'} overflow-hidden relative`}>
          <img
            ref={imgRef}
            src={currentImage}
            alt={project.name}
            onLoad={handleImageLoad}
            className="w-full h-auto object-top transition-transform duration-[5000ms] ease-in-out"
            style={{
              transform: isHovered ? `translateY(${scrollTranslate})` : 'translateY(0px)'
            }}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* Floating Bottom Bar with Project Highlights (Optional) */}
        {showDetailsOnHover && (
          <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between z-10 pointer-events-none">
            <div className="bg-[#050508]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{project.clientFa}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-300">{project.name}</span>
              </div>
            </div>

            {onOpenDetail && (
              <button
                onClick={onOpenDetail}
                className="px-3.5 py-2 rounded-xl bg-[#0066FF] hover:bg-[#1a75ff] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer pointer-events-auto shadow-md"
              >
                <span>کیس‌استادی</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
