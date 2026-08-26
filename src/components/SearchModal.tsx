import React, { useState, useEffect, useRef } from 'react';
import { Project } from '../types';
import { toPersianDigits } from '../utils/persian';
import { Search, X, ArrowLeft, Star, FolderArchive, Layers } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  projects: Project[];
  onClose: () => void;
  onSelectProject: (project: Project) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  projects,
  onClose,
  onSelectProject
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key listener for ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? projects.filter(p => {
        const q = query.toLowerCase().trim();
        const name = (p.name || '').toLowerCase();
        const nameEn = (p.nameEn || p.displayNameEn || '').toLowerCase();
        const nameFa = (p.displayNameFa || '').toLowerCase();
        const originalName = (p.originalName || '').toLowerCase();
        const brand = (p.brand || p.client || '').toLowerCase();
        const brandFa = (p.clientFa || '').toLowerCase();
        const desc = (p.description || p.shortDescription || '').toLowerCase();
        const tagsMatch = (p.tags || []).some(t => t.toLowerCase().includes(q));

        return (
          name.includes(q) ||
          nameEn.includes(q) ||
          nameFa.includes(q) ||
          originalName.includes(q) ||
          brand.includes(q) ||
          brandFa.includes(q) ||
          desc.includes(q) ||
          tagsMatch
        );
      }).slice(0, 10)
    : projects.filter(p => p.featured).slice(0, 6);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#09090e] border border-white/10 shadow-2xl overflow-hidden text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3 relative">
          <Search className="w-5 h-5 text-[#0066FF] flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی سریع بین تمام پروژه‌ها (دوو، اسنوا، آردزیا، تکنوگاز...)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-white/5">
          <div className="px-3 py-1.5 text-[11px] text-slate-400">
            {query.trim() ? `نتایج منطبق (${toPersianDigits(results.length)} مورد)` : 'پروژه‌های شاخص پیشنهادی'}
          </div>

          {results.map((project) => (
            <div
              key={project.id}
              onClick={() => {
                onSelectProject(project);
                onClose();
              }}
              className="p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white group-hover:text-[#0066FF] transition-colors">
                    {project.displayNameFa || project.name}
                  </span>
                  {project.featured && (
                    <Star className="w-3 h-3 text-[#0066FF] fill-[#0066FF]" />
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium">{project.clientFa || project.brand}</span>
                  <span>•</span>
                  <span>{project.typeFa || (Array.isArray(project.type) ? project.type[0] : project.type)}</span>
                  <span>•</span>
                  <span>{toPersianDigits(project.year || '—')}</span>
                </div>
              </div>

              <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-[#0066FF] group-hover:-translate-x-1 transition-all" />
            </div>
          ))}

          {query.trim() && results.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              هیچ پروژه‌ای مطابق با عبارت جستجو پیدا نشد.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#050508] border-t border-white/10 text-[11px] text-slate-500 flex justify-between">
          <span>برای انتخاب روی پروژه کلیک کنید</span>
          <span>مجموع {toPersianDigits(projects.length)} پروژه</span>
        </div>
      </div>
    </div>
  );
};
