import { Brand } from '../types';

export const initialBrands: Brand[] = [];

export function detectBrandFromProjectName(projectName: string): { brandName: string; brandFa: string } {
  const lower = projectName.toLowerCase();
  
  if (lower.includes('daewoo') || lower.includes('دوو')) {
    return { brandName: 'Daewoo', brandFa: 'دوو' };
  }
  if (lower.includes('snowa') || lower.includes('اسنوا')) {
    return { brandName: 'Snowa', brandFa: 'اسنوا' };
  }
  if (lower.includes('ardesia') || lower.includes('آردزیا')) {
    return { brandName: 'Ardesia', brandFa: 'آردزیا' };
  }
  if (lower.includes('smalvic') || lower.includes('اسمالویک')) {
    return { brandName: 'Smalvic', brandFa: 'اسمالویک' };
  }
  if (lower.includes('tecnogas') || lower.includes('تکنوگاز')) {
    return { brandName: 'Tecnogas', brandFa: 'تکنوگاز' };
  }
  if (lower.includes('shadow') || lower.includes('شدو') || lower.includes('سایه')) {
    return { brandName: 'Shadow', brandFa: 'سایه' };
  }
  if (lower.includes('entekhab') || lower.includes('انتخاب')) {
    return { brandName: 'Entekhab', brandFa: 'انتخاب' };
  }
  if (lower.includes('digisun') || lower.includes('دیجی‌سان')) {
    return { brandName: 'Digisun', brandFa: 'دیجی‌سان' };
  }
  if (lower.includes('metrino') || lower.includes('مترینو')) {
    return { brandName: 'Metrino', brandFa: 'مترینو' };
  }
  if (lower.includes('soroush') || lower.includes('سروش')) {
    return { brandName: 'Soroush Sehat', brandFa: 'سروش صحت' };
  }
  if (lower.includes('barani') || lower.includes('بارانی')) {
    return { brandName: 'Barani Silver', brandFa: 'نقره بارانی' };
  }
  if (lower.includes('macsa') || lower.includes('مکسا')) {
    return { brandName: 'Macsa', brandFa: 'مکسا' };
  }
  if (lower.includes('mkrefrigeration') || lower.includes('mk')) {
    return { brandName: 'MK Refrigeration', brandFa: 'ام‌کی ریفریجریشن' };
  }

  return { brandName: 'Other', brandFa: 'سایر برندها' };
}
