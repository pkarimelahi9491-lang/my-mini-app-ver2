import { BrandPictogramProject } from '../types';

export const INITIAL_PICTOGRAM_PROJECTS: BrandPictogramProject[] = [
  {
    id: 'pictogram-daewoo',
    slug: 'pictogram-daewoo',
    titleFa: 'سیستم پیکتوگرام هوشمند دوو',
    titleEn: 'Daewoo Smart Home Pictogram System',
    client: 'Daewoo',
    clientFa: 'دوو',
    brand: 'Daewoo',
    year: 1404,
    category: 'smart-home',
    categoryFa: 'پیکتوگرام و آیکونوگرافی هوشمند',
    descriptionFa: 'طراحی سیستم آیکونوگرافی اختصاصی برای پلتفرم خانه هوشمند دوو شامل آیکون\u200Cهای محصولات لوازم خانگی، سنسورها و تعاملات IoT.',
    cover: '/uploads/pictogram/daewoo/daewoo-pictogram.gif',
    accentColor: '#0066FF',
    iconCount: 6,
    gridSystem: '24x24dp Grid with 2px optical stroke',
    keyTokens: ['هوشمندسازی', 'خانه متصل', 'لوازم خانگی', 'اینترنت اشیا'],
    mockups: [
      {
        id: 'mockup-1',
        title: 'نمای کلی سیستم آیکون\u200Cها',
        description: 'مجموعه کامل آیکون\u200Cهای پیکتوگرام در قالب گرید',
        imageUrl: '/uploads/pictogram/daewoo/daewoo-pictogram.gif',
        tag: 'Grid Overview'
      },
      {
        id: 'mockup-2',
        title: 'کاور پروژه',
        description: 'تصویر کاور اصلی پروژه پیکتوگرام دوو',
        imageUrl: '/uploads/pictogram/daewoo/cover 2.webp',
        tag: 'Cover'
      }
    ],
    icons: [
      { id: 'icon-1', name: 'Third Door', nameFa: 'درب سوم', category: 'درها', svgUrl: '/uploads/pictogram/daewoo/icons/Third Door-2 (2).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Third Door-2 (2)@2x.png' },
      { id: 'icon-2', name: 'Steam Wash', nameFa: 'شستشوی بخار', category: 'شستشو', svgUrl: '/uploads/pictogram/daewoo/icons/Steam Wash (2).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Steam Wash (2)@2x.png' },
      { id: 'icon-3', name: 'Screen Mirroring', nameFa: 'آینه صفحه', category: 'اتصال', svgUrl: '/uploads/pictogram/daewoo/icons/Screen Mirroring (4).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Screen Mirroring (4)@2x.png' },
      { id: 'icon-4', name: 'Noise', nameFa: 'صدا', category: 'عملکرد', svgUrl: '/uploads/pictogram/daewoo/icons/Noise (10).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Noise (10)@2x.png' },
      { id: 'icon-5', name: 'Eco Body', nameFa: 'بدنه اکو', category: 'محیط زیست', svgUrl: '/uploads/pictogram/daewoo/icons/Eco body (2).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Eco body (2)@2x.png' },
      { id: 'icon-6', name: 'Easy Iron', nameFa: 'اتوی آسان', category: 'عملکرد', svgUrl: '/uploads/pictogram/daewoo/icons/Easy Iron (2).svg', pngUrl: '/uploads/pictogram/daewoo/icons/Easy Iron (2)@2x.png' }
    ],
    guidelines: ['استفاده از stroke 2px در تمام آیکون\u200Cها', 'رنگ اصلی: #0066FF', 'پس\u200Cزمینه: شفاف یا سفید']
  },
  {
    id: 'pictogram-snowa',
    slug: 'pictogram-snowa',
    titleFa: 'سیستم پیکتوگرام محصولات اسنوا',
    titleEn: 'Snowa Product Pictogram System',
    client: 'Snowa',
    clientFa: 'اسنوا',
    brand: 'Snowa',
    year: 1404,
    category: 'appliances',
    categoryFa: 'پیکتوگرام لوازم خانگی',
    descriptionFa: 'طراحی سیستم آیکونوگرافی اختصاصی برای لوازم خانگی اسنوا با تمرکز بر خوانایی، سادگی بصری و هویت برند.',
    cover: '/uploads/pictogram/snowa/cover.webp',
    accentColor: '#059669',
    iconCount: 6,
    gridSystem: '24x24dp Grid with 2px optical stroke',
    keyTokens: ['لوازم خانگی', 'اسنوا', 'سادگی', 'خوانایی', 'هویت برند'],
    mockups: [
      {
        id: 'mockup-1',
        title: 'کاور اصلی پروژه',
        description: 'نمای کلی سیستم پیکتوگرام اسنوا',
        imageUrl: '/uploads/pictogram/snowa/cover.webp',
        tag: 'Cover'
      },
      {
        id: 'mockup-2',
        title: 'کاور دوم',
        description: 'جزئیات بیشتر طراحی آیکون\u200Cها',
        imageUrl: '/uploads/pictogram/snowa/cover2.webp',
        tag: 'Detail'
      },
      {
        id: 'mockup-3',
        title: 'کاور سوم',
        description: 'نمای نزدیک پیکتوگرام\u200Cها',
        imageUrl: '/uploads/pictogram/snowa/cover3.webp',
        tag: 'Close-up'
      }
    ],
    icons: [
      { id: 'icon-1', name: 'Continuous Steam', nameFa: 'بخار مداوم', category: 'بخار', svgUrl: '/uploads/pictogram/snowa/icons/Continuous Steam.svg', pngUrl: '/uploads/pictogram/snowa/icons/Continuous Steam@2x.png' },
      { id: 'icon-2', name: 'Container Capacity', nameFa: 'ظرفیت مخزن', category: 'مخزن', svgUrl: '/uploads/pictogram/snowa/icons/Container Capacity 1.2L (2).svg', pngUrl: '/uploads/pictogram/snowa/icons/Container Capacity 1.2L (2)@2x.png' },
      { id: 'icon-3', name: 'Asset 887', nameFa: 'ویژگی ۸۸۷', category: 'عملکرد', svgUrl: '/uploads/pictogram/snowa/icons/Asset 887.svg', pngUrl: '/uploads/pictogram/snowa/icons/Asset 887@4x.png' },
      { id: 'icon-4', name: 'Asset 875', nameFa: 'ویژگی ۸۷۵', category: 'عملکرد', svgUrl: '/uploads/pictogram/snowa/icons/Asset 875.svg', pngUrl: '/uploads/pictogram/snowa/icons/Asset 875@4x.png' },
      { id: 'icon-5', name: 'Asset 1233', nameFa: 'ویژگی ۱۲۳۳', category: 'عملکرد', svgUrl: '/uploads/pictogram/snowa/icons/Asset 1233.svg', pngUrl: '/uploads/pictogram/snowa/icons/Asset 1233@2x.png' },
      { id: 'icon-6', name: 'Asset 1219', nameFa: 'ویژگی ۱۲۱۹', category: 'عملکرد', svgUrl: '/uploads/pictogram/snowa/icons/Asset 1219.svg', pngUrl: '/uploads/pictogram/snowa/icons/Asset 1219@2x.png' }
    ],
    guidelines: ['استفاده از stroke 2px در تمام آیکون\u200Cها', 'رنگ اصلی: #059669', 'سبک مینیمال و مدرن']
  },
  {
    id: 'pictogram-smalvic',
    slug: 'pictogram-smalvic',
    titleFa: 'سیستم پیکتوگرام اسمالویک',
    titleEn: 'Smalvic Appliance Pictogram System',
    client: 'Smalvic',
    clientFa: 'اسمالویک',
    brand: 'Smalvic',
    year: 1404,
    category: 'appliances',
    categoryFa: 'پیکتوگرام لوازم آشپزخانه',
    descriptionFa: 'طراحی سیستم آیکونوگرافی اختصاصی برای لوازم آشپزخانه اسمالویک با تمرکز بر خوانایی و سادگی بصری.',
    cover: '/uploads/pictogram/smalvic/cover.webp',
    accentColor: '#8B5CF6',
    iconCount: 6,
    gridSystem: '24x24dp Grid with 1.5px stroke',
    keyTokens: ['آشپزخانه', 'لوازم برقی', 'سادگی', 'خوانایی'],
    mockups: [
      {
        id: 'mockup-1',
        title: 'مرور کلی سیستم',
        description: '+۱۰۰ آیکون در ۷ دسته‌بندی مختلف',
        imageUrl: '/uploads/pictogram/smalvic/cover.webp',
        tag: 'Overview'
      },
      {
        id: 'mockup-2',
        title: 'مجموعه آیکون‌ها',
        description: 'نمای کلی پیکتوگرام\u200Cهای اسمالویک',
        imageUrl: '/uploads/pictogram/smalvic/icons.webp',
        tag: 'Icon Set'
      }
    ],
    icons: [
      { id: 'icon-1', name: 'Cool Vibe', nameFa: 'خنککننده ویبره', category: 'عملکرد', svgUrl: '/uploads/pictogram/smalvic/icons/Cool Vibe.svg', pngUrl: '/uploads/pictogram/smalvic/icons/Cool Vibe@2x.webp' },
      { id: 'icon-2', name: 'Fan Dryer', nameFa: 'خشک\u200Cکن فن', category: 'خشک\u200Cکن', svgUrl: '/uploads/pictogram/smalvic/icons/Fan Dryer.svg', pngUrl: '/uploads/pictogram/smalvic/icons/Fan Dryer@2x.webp' },
      { id: 'icon-3', name: 'IoT', nameFa: 'اینترنت اشیا', category: 'اتصال', svgUrl: '/uploads/pictogram/smalvic/icons/IoT.svg', pngUrl: '/uploads/pictogram/smalvic/icons/IoT@2x.webp' },
      { id: 'icon-4', name: 'Cotton', nameFa: 'پنبه', category: 'نخ', svgUrl: '/uploads/pictogram/smalvic/icons/Cotton(2).svg', pngUrl: '/uploads/pictogram/smalvic/icons/Cotton(2)@2x.webp' },
      { id: 'icon-5', name: 'Silent Wash', nameFa: 'شستشوی بی\u200Cصدا', category: 'عملکرد', svgUrl: '/uploads/pictogram/smalvic/icons/Silent Wash.svg', pngUrl: '/uploads/pictogram/smalvic/icons/Silent Wash@2x.webp' },
      { id: 'icon-6', name: 'Wool', nameFa: 'پشم', category: 'نخ', svgUrl: '/uploads/pictogram/smalvic/icons/Wool (2).svg', pngUrl: '/uploads/pictogram/smalvic/icons/Wool (2)@2x.webp' }
    ],
    guidelines: ['استفاده از stroke 1.5px', 'سبک مینیمال و مدرن', 'رنگ ثانویه: #8B5CF6']
  }
];
