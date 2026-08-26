import React from 'react';
import { ArrowUp } from 'lucide-react';
import { useProjects } from '../context/ProjectContext';

interface FooterProps {
  onSelectTab: (tab: 'overview' | 'selected' | 'archive') => void;
  onOpenPresentation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { siteSettings } = useProjects();
  const { profile } = siteSettings;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#030305] border-t border-white/10 text-slate-400 mt-16 py-6 sm:py-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        
        {/* Brand & Note */}
        <div className="flex items-center gap-3">
          <svg className="w-10 h-8 shrink-0" viewBox="0 0 125 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_12996_1811_footer)">
              <path d="M18.6589 29.516H0.578125V19.74C0.578125 14.6272 4.62549 10.4827 9.61849 10.4827C14.6115 10.4827 18.6589 14.6272 18.6589 19.74V29.516Z" fill="white"/>
              <path d="M39.7012 23.7475C39.7012 26.5445 37.3923 29.5175 33.1124 29.5175C33.0379 29.5175 32.9687 29.5141 32.8996 29.5097L27.2335 29.5031C27.0682 29.5031 26.9342 29.3659 26.9342 29.1955V26.1916C26.9342 26.0223 27.0682 25.884 27.2346 25.884L32.8877 25.894C32.9817 25.9028 33.0682 25.9117 33.1622 25.9117C34.6661 25.9117 35.6775 25.1449 35.6775 24.0053C35.6775 23.0937 34.9622 22.4121 33.764 22.1765L31.3264 21.7129C28.3313 21.1265 26.4707 19.0729 26.4707 16.3556C26.4707 13.116 29.2303 10.537 32.7548 10.4872H38.1529C38.3182 10.4872 38.4533 10.6244 38.4533 10.7948V13.7987C38.4533 13.968 38.3193 14.1063 38.1529 14.1063H33.0595C33.0249 14.1063 32.9925 14.1007 32.9612 14.0897L32.7591 14.0941C31.2788 14.1284 30.3951 15.1131 30.3951 16.0447C30.3951 16.9763 30.9871 17.5771 32.154 17.7951L34.5452 18.2597C37.725 18.8627 39.7012 20.9649 39.7023 23.7465" fill="white"/>
              <path d="M41.2717 17.845H45.9199V10.8502C45.9199 10.6776 46.0571 10.536 46.2268 10.536H49.6714C49.841 10.536 49.9782 10.6776 49.9782 10.8502V28.8615C49.9782 29.0341 49.841 29.1747 49.6714 29.1747H46.2268C46.0582 29.1747 45.9199 29.0341 45.9199 28.8615V21.7617H41.2717C41.1031 21.7617 40.9648 21.6211 40.9648 21.4475V18.1581C40.9648 17.9844 41.102 17.845 41.2717 17.845Z" fill="white"/>
              <path d="M66.8706 21.2982C66.9045 21.3933 66.8914 21.4984 66.8348 21.5803C66.7788 21.6644 66.6883 21.7131 66.5887 21.7131H63.0662C62.9388 21.7131 62.8242 21.6301 62.7821 21.5062L60.7141 15.401L56.0053 28.9258C55.9632 29.0486 55.8498 29.1304 55.7222 29.1304H52.1934C52.0951 29.1304 52.0032 29.0807 51.946 28.9977C51.8898 28.9147 51.8768 28.8096 51.9125 28.7156L58.4019 11.0694C58.4451 10.9488 58.5574 10.8691 58.6828 10.8691H62.8696C62.9961 10.8691 63.1073 10.9499 63.1517 11.0694L66.8706 21.2971V21.2982Z" fill="white"/>
              <path d="M79.8112 20.0384C79.8112 25.3248 76.0866 29.3035 70.9551 29.4982H67.0723C66.9069 29.4982 66.7715 29.361 66.7715 29.1907V25.7364C66.7715 25.5671 66.9069 25.4289 67.0723 25.4289H70.9661C73.2272 25.2617 75.6868 23.5037 75.6868 20.0384C75.6868 16.5731 73.2956 14.6258 70.9251 14.4632H67.0729C66.9076 14.4632 66.7728 14.326 66.7728 14.1567V10.8065C66.7728 10.6372 66.9069 10.4989 67.0729 10.4989H70.9349C76.082 10.6826 79.8112 14.6944 79.8112 20.0384Z" fill="white"/>
              <path d="M95.9622 19.9868C95.9622 16.1818 93.3021 14.4492 90.8314 14.4492C88.36 14.4492 85.6751 16.1818 85.6751 19.9868C85.6751 23.7917 88.347 25.4978 90.8314 25.4978C93.3151 25.4978 95.9622 23.7729 95.9622 19.9868ZM100.089 20.0122C100.089 25.5188 96.196 29.5163 90.8327 29.5163C85.4688 29.5163 81.5508 25.5188 81.5508 20.0122C81.5508 14.5056 85.4538 10.4827 90.8327 10.4827C96.2109 10.4827 100.089 14.4901 100.089 20.0122Z" fill="white"/>
              <path d="M124.939 10.9894C124.996 11.0657 125.015 11.1653 124.99 11.2572L120.298 28.9033C120.263 29.0372 120.145 29.1301 120.009 29.1301H116.357C116.226 29.1301 116.111 29.0438 116.072 28.9166L112.341 17.0238L108.584 28.9166C108.544 29.0427 108.429 29.129 108.298 29.129H104.571C104.436 29.129 104.317 29.0361 104.281 28.9022L101.495 18.4178C101.47 18.326 101.49 18.2264 101.546 18.1501C101.602 18.0738 101.69 18.0284 101.785 18.0284H105.282C105.419 18.0284 105.538 18.1236 105.572 18.2596L106.655 22.5602L110.286 11.079C110.326 10.9518 110.442 10.8666 110.572 10.8666H114.21C114.34 10.8666 114.457 10.9529 114.496 11.0801L118.126 22.5846L120.963 11.0978C120.996 10.9606 121.117 10.8655 121.253 10.8655H124.701C124.794 10.8655 124.882 10.9097 124.939 10.9861" fill="white"/>
            </g>
            <defs>
              <clipPath id="clip0_12996_1811_footer">
                <rect width="125" height="20" fill="white" transform="translate(0 10)"/>
              </clipPath>
            </defs>
          </svg>
          <span className="font-mono text-slate-400">{profile.footerArchiveYears}</span>
        </div>

        {/* Navigation & Back to Top */}
        <div className="flex items-center gap-3 sm:gap-6">
          <button 
            onClick={() => onSelectTab('overview')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            خلاصه مدیریتی
          </button>
          <button 
            onClick={() => onSelectTab('selected')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            ۱۰ پروژه ویژه
          </button>
          <button 
            onClick={() => onSelectTab('archive')} 
            className="hover:text-white transition-colors cursor-pointer"
          >
            کاتالوگ کامل
          </button>
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer sm:pr-2 sm:border-r sm:border-white/10"
          >
            <span className="hidden sm:inline">بازگشت به بالا</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-3 text-center sm:text-right text-[11px] text-slate-600 font-mono">
        {profile.footerNote}
      </div>
      {/* Hamidreza Derhami */}
    </footer>
  );
};
