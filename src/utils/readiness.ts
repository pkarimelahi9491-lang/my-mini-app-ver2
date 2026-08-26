import { Project, ContentStatus, AssetStatus, FeaturedReadiness, ProjectAsset } from '../types';

/**
 * Calculates the Case Study Readiness Score (0 - 100)
 * Project metadata: 15
 * Cover image: 10
 * Gallery: 15
 * UX material: 15
 * UI material: 15
 * Responsive material: 10
 * Project context: 5
 * Design decisions: 10
 * Project scale: 5
 */
export function calculateCaseStudyReadinessScore(p: Partial<Project>): number {
  let score = 0;

  // 1. Metadata (15 pts)
  let metaPoints = 0;
  if (p.name && p.name.trim().length > 0) metaPoints += 3;
  if (p.brand && p.brand !== 'Other') metaPoints += 3;
  if (p.year && p.year > 1000) metaPoints += 2;
  if (p.type && (Array.isArray(p.type) ? p.type.length > 0 : Boolean(p.type))) metaPoints += 2;
  if (p.platform && (Array.isArray(p.platform) ? p.platform.length > 0 : Boolean(p.platform))) metaPoints += 2;
  if (p.shortDescription || p.description) metaPoints += 3;
  score += Math.min(15, metaPoints);

  // 2. Cover image (10 pts)
  if (p.cover && p.cover.length > 5) {
    score += 10;
  }

  // 3. Gallery (15 pts)
  const galleryCount = p.gallery?.length || 0;
  const assetGalleryCount = p.assets?.filter(a => a.category === 'ui' || a.category === 'desktop').length || 0;
  const totalGallery = Math.max(galleryCount, assetGalleryCount);
  if (totalGallery >= 4) {
    score += 15;
  } else if (totalGallery >= 2) {
    score += 10;
  } else if (totalGallery >= 1) {
    score += 5;
  }

  // 4. UX material (15 pts)
  const hasUXArtifacts = (p.uxArtifacts && p.uxArtifacts.length > 0);
  const hasUXAssets = (p.uxAssets && p.uxAssets.length > 0) || 
                      (p.assets && p.assets.some(a => a.category === 'ux' || a.category === 'wireframe' || a.category === 'flow'));
  if (hasUXArtifacts && hasUXAssets) {
    score += 15;
  } else if (hasUXArtifacts || hasUXAssets) {
    score += 10;
  }

  // 5. UI material (15 pts)
  const hasUIAssets = (p.uiAssets && p.uiAssets.length > 0) ||
                      (p.desktopAssets && p.desktopAssets.length > 0) ||
                      (p.assets && p.assets.some(a => a.category === 'ui' || a.category === 'desktop' || a.category === 'hero'));
  if (hasUIAssets || (p.gallery && p.gallery.some(g => g.category === 'UI' || g.category === 'Desktop'))) {
    score += 15;
  }

  // 6. Responsive material (10 pts)
  const hasMobileAssets = (p.mobileAssets && p.mobileAssets.length > 0) ||
                          (p.tabletAssets && p.tabletAssets.length > 0) ||
                          (p.assets && p.assets.some(a => a.category === 'mobile' || a.category === 'tablet')) ||
                          (p.gallery && p.gallery.some(g => g.category === 'Mobile'));
  if (hasMobileAssets) {
    score += 10;
  } else if (typeof p.platform === 'string' && (p.platform.includes('Mobile') || p.platform.includes('Responsive'))) {
    score += 5;
  }

  // 7. Project Context / Challenge / Solution (5 pts)
  if ((p.context && p.context.length > 20) || (p.challenge && p.solution)) {
    score += 5;
  } else if (p.description && p.description.length > 40) {
    score += 3;
  }

  // 8. Design decisions (10 pts)
  if (p.designDecisions && p.designDecisions.length >= 2) {
    score += 10;
  } else if (p.designDecisions && p.designDecisions.length === 1) {
    score += 5;
  }

  // 9. Project scale & system (5 pts)
  if (p.projectScale || p.designSystem || p.impact) {
    score += 5;
  }

  return Math.min(100, score);
}

/**
 * Calculates asset completeness based on actual availability
 */
export function calculateAssetStatus(p: Partial<Project>): AssetStatus {
  const hasCover = Boolean(p.cover && p.cover.length > 5);
  const galleryCount = (p.gallery?.length || 0) + (p.assets?.length || 0);
  const hasUX = (p.uxArtifacts && p.uxArtifacts.length > 0) || (p.assets && p.assets.some(a => a.category === 'ux'));
  const hasDesktop = (p.desktopAssets && p.desktopAssets.length > 0) || (p.assets && p.assets.some(a => a.category === 'desktop' || a.category === 'hero'));
  const hasMobile = (p.mobileAssets && p.mobileAssets.length > 0) || (p.assets && p.assets.some(a => a.category === 'mobile'));

  if (!hasCover && galleryCount === 0) return 'none';
  if (hasCover && galleryCount === 0) return 'low';
  if (hasCover && galleryCount >= 1 && (!hasUX || !hasMobile)) return 'medium';
  if (hasCover && hasDesktop && hasMobile && hasUX && galleryCount >= 5) return 'complete';
  if (hasCover && (hasDesktop || galleryCount >= 3) && (hasMobile || hasUX)) return 'good';

  return 'medium';
}

/**
 * Calculates content lifecycle status
 */
export function calculateContentStatus(p: Partial<Project>, score: number): ContentStatus {
  const hasAssets = (p.gallery && p.gallery.length > 0) || (p.assets && p.assets.length > 0) || Boolean(p.cover);
  const hasNarrative = Boolean(p.description || p.context || p.challenge);

  if (p.featured && score >= 75) return 'featured-ready';
  if (score >= 65 && hasNarrative && hasAssets) return 'ready';
  if (hasAssets && !hasNarrative) return 'assets-only';
  if (score >= 30) return 'partial';
  return 'draft';
}

/**
 * Calculates featured readiness status
 */
export function calculateFeaturedReadiness(score: number, p: Partial<Project>): FeaturedReadiness {
  if (p.featured) return 'featured';
  if (score >= 80 && p.cover && (p.gallery?.length || 0) >= 3) return 'strong-candidate';
  if (score >= 60 && p.cover) return 'candidate';
  return 'not-ready';
}

/**
 * Validates a project against completeness and quality standards
 */
export interface ValidationResult {
  warnings: string[];
  errors: string[];
  missingFields: string[];
  completedCount: number;
  totalRecommendedCount: number;
  qualityGatePassed: boolean;
}

export function validateProject(p: Partial<Project>): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const missingFields: string[] = [];

  // Mandatory checks
  if (!p.id || !p.id.trim()) errors.push('شناسه یکتای پروژه الزامی است (ID Missing)');
  if (!p.slug || !p.slug.trim()) errors.push('نامک پروژه الزامی است (Slug Missing)');
  if (!p.name || !p.name.trim()) errors.push('نام اصلی پروژه الزامی است (Name Missing)');

  // Recommended fields inspection
  let completedCount = 0;
  const recommended = [
    { field: 'brand', label: 'برند پروژه', check: Boolean(p.brand && p.brand !== 'Other') },
    { field: 'year', label: 'سال انجام', check: Boolean(p.year) },
    { field: 'cover', label: 'تصویر کاور', check: Boolean(p.cover) },
    { field: 'shortDescription', label: 'توضیح کوتاه', check: Boolean(p.shortDescription || p.description) },
    { field: 'services', label: 'سرویس‌ها و اسکوپ', check: Boolean(p.services && p.services.length > 0) },
    { field: 'gallery', label: 'گالری و اسکرین‌ها', check: Boolean((p.gallery && p.gallery.length > 0) || (p.assets && p.assets.length > 0)) },
    { field: 'mobileAssets', label: 'اسکرین‌های موبایل', check: Boolean(p.mobileAssets?.length || p.assets?.some(a => a.category === 'mobile') || p.gallery?.some(g => g.category === 'Mobile')) },
    { field: 'uxArtifacts', label: 'مستندات UX و وایرفریم', check: Boolean(p.uxArtifacts?.length || p.uxAssets?.length || p.assets?.some(a => a.category === 'ux')) },
    { field: 'figmaUrl', label: 'لینک فایل فیگما', check: Boolean(p.figmaUrl) },
    { field: 'designDecisions', label: 'تصمیمات دیزاین', check: Boolean(p.designDecisions && p.designDecisions.length > 0) },
    { field: 'projectScale', label: 'مقیاس و کامپوننت‌ها', check: Boolean(p.projectScale) },
    { field: 'context', label: 'شرح مسئله و کانتکست', check: Boolean(p.context || p.challenge) }
  ];

  recommended.forEach(item => {
    if (item.check) {
      completedCount++;
    } else {
      missingFields.push(item.label);
    }
  });

  // Internal Quality Warnings
  if (!p.cover) warnings.push('تصویر کاور برای این پروژه تنظیم نشده است.');
  if (!p.description && !p.shortDescription) warnings.push('توضیح متنی یا خلاصه پروژه درج نشده است.');
  if (!p.figmaUrl) warnings.push('لینک فایل منبع Figma ثبت نشده است.');
  if (!p.mobileAssets?.length && !p.assets?.some(a => a.category === 'mobile') && !p.gallery?.some(g => g.category === 'Mobile')) {
    warnings.push('هیچ پیش‌نمایش موبایلی ثبت نشده است.');
  }

  // Quality gate for featured
  const score = calculateCaseStudyReadinessScore(p);
  const qualityGatePassed = Boolean(
    p.cover &&
    p.name &&
    p.brand &&
    p.year &&
    score >= 70 &&
    (p.gallery?.length || 0) >= 2
  );

  return {
    warnings,
    errors,
    missingFields,
    completedCount,
    totalRecommendedCount: recommended.length,
    qualityGatePassed
  };
}

/**
 * Detects possible duplicate projects across the dataset
 */
export interface DuplicatePair {
  original: Project;
  duplicate: Project;
  similarity: number;
  reason: string;
}

export function detectDuplicates(projects: Project[]): DuplicatePair[] {
  const duplicates: DuplicatePair[] = [];

  for (let i = 0; i < projects.length; i++) {
    for (let j = i + 1; j < projects.length; j++) {
      const p1 = projects[i];
      const p2 = projects[j];

      // Exact name match
      if (p1.name.toLowerCase().trim() === p2.name.toLowerCase().trim()) {
        duplicates.push({
          original: p1,
          duplicate: p2,
          similarity: 1.0,
          reason: `نام دقیقاً یکسان: "${p1.name}"`
        });
        continue;
      }

      // Normalized strip match (e.g. Daewoo I Love Daewoo Landing)
      const clean1 = p1.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const clean2 = p2.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean1.length > 5 && clean1 === clean2) {
        duplicates.push({
          original: p1,
          duplicate: p2,
          similarity: 0.95,
          reason: `تطابق نزدیک در ساختار کاراکتری: "${p1.name}" و "${p2.name}"`
        });
        continue;
      }

      // Slug duplicate
      if (p1.slug.toLowerCase() === p2.slug.toLowerCase()) {
        duplicates.push({
          original: p1,
          duplicate: p2,
          similarity: 0.9,
          reason: `اسلاگ مشترک: "${p1.slug}"`
        });
      }
    }
  }

  return duplicates;
}
