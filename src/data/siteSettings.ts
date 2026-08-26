import { SiteSettings } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  hero: {
    badgeText: 'آرشیو پروژه‌های UI/UX (۱۴۰۲ – ۱۴۰۵)',
    title: 'محیط جامع ارائه پروژه‌ها',
    description: 'مرور دستاوردهای طراحی تجربه کاربری شامل پورتال‌های ملی، سوپراپ‌های سازمانی و دیزاین‌سیستم‌های اختصاصی تیم.',
    ctaPrimaryText: 'ارائه تمام‌صفحه',
    ctaSecondaryText: '۱۰ پروژه شاخص',
    ctaArchiveText: 'آرشیو کامل'
  },
  kpis: [
    {
      id: 'kpi-1',
      label: 'پروژه‌های لانچ‌شده',
      value: '۲۲+',
      sublabel: 'پورتال، لندینگ، داشبورد و اپلیکیشن',
      accentColor: '#0066FF',
      icon: 'FolderArchive'
    },
    {
      id: 'kpi-2',
      label: 'برندها و هلدینگ‌ها',
      value: '۱۰+',
      sublabel: 'دوو، اسنوا، تکنوگاز، آردزیا و...',
      accentColor: '#06b6d4',
      icon: 'Globe'
    },
    {
      id: 'kpi-3',
      label: 'پوشش پلتفرمی',
      value: '۳ محیط',
      sublabel: 'دسکتاپ سازمانی، تبلت و موبایل',
      accentColor: '#6366f1',
      icon: 'Monitor'
    },
    {
      id: 'kpi-4',
      label: 'دیزاین سیستم اختصاصی',
      value: '۱۰۰٪',
      sublabel: 'استانداردسازی کامل کامپوننت‌ها',
      accentColor: '#10b981',
      icon: 'Layers'
    }
  ],
  sections: {
    showHero: true,
    showKpis: true,
    showTop10: true,
    showPictograms: true,
    showCatalogs: true,
    top10SectionTitle: 'پروژه‌های شاخص',
    top10SectionSubtitle: '۱۰ نمونه‌کار برتر با بالاترین اثرگذاری',
    pictogramsSectionTitle: 'پیکتوگرام',
    pictogramsSectionSubtitle: 'سیستم آیکونوگرافی اختصاصی برندها',
    catalogsSectionTitle: 'کاتالوگ‌ها',
    catalogsSectionSubtitle: 'نسخه‌های دیجیتال و تعاملی محصولات'
  },
  profile: {
    siteName: 'SHADOW',
    brandTitle: 'استودیو سایه',
    tagline: 'PORTFOLIO & DESIGN REVIEW',
    headerBadge: 'ارائه پروژه‌ها',
    footerArchiveYears: '۱۴۰۲–۱۴۰۵ آرشیو',
    footerNote: 'تمامی پروژه‌ها و مستندات متعلق به تیم UI/UX استودیو سایه است.',
    contactEmail: 'contact@shadowstudio.design',
    telegramUrl: '',
    linkedinUrl: '',
    githubUrl: ''
  },
  presentation: {
    introBadge: 'مرور تخصصی طراحی تجربه و رابط کاربری',
    introTitle: 'گزارش عملکرد و آرشیو پروژه‌های دیزاین',
    introDescription: 'این ارائه به‌صورت تصویری و بر مبنای پیش‌نمایش واقعی خروجی‌ها در ۳ دیوایس دسکتاپ، تبلت و موبایل آماده شده است.',
    introStat1Value: '۶۰+',
    introStat1Label: 'پروژه تحویل‌شده',
    introStat2Value: '۱۰+',
    introStat2Label: 'برند مطرح تجاری',
    introStat3Value: '۴',
    introStat3Label: 'دسته محصول دیجیتال',
    introButtonText: 'شروع بررسی ۱۰ پروژه شاخص',
    closingBadge: 'پایان ارائه مدیریتی',
    closingTitle: 'طراحی مداوم و تکامل تجربیات دیجیتال',
    closingDescription: 'آماده پاسخگویی به پرسش‌ها و بررسی جزئیات فنی و متدولوژی هر پروژه هستیم.',
    closingButtonText: 'پایان پرزنتیشن و ورود به آرشیو'
  }
};
