export type NormalizedProjectType = 
  | 'website' 
  | 'landing-page' 
  | 'mobile-app' 
  | 'campaign' 
  | 'product' 
  | 'ecommerce' 
  | 'internal-tool' 
  | 'design-system' 
  | 'uiux' 
  | 'other';

export type NormalizedPlatform =
  | 'desktop'
  | 'mobile'
  | 'tablet'
  | 'responsive'
  | 'web'
  | 'ios'
  | 'android'
  | 'smart-tv'
  | 'other';

export type DisciplineType = 
  | 'ux-design'
  | 'ui-design'
  | 'product-design'
  | 'interaction-design'
  | 'visual-design'
  | 'design-system'
  | 'content'
  | 'art-direction'
  | 'graphic-design'
  | 'motion'
  | 'responsive-design';

export type ServiceType = 
  | 'research'
  | 'strategy'
  | 'information-architecture'
  | 'user-flow'
  | 'wireframing'
  | 'prototyping'
  | 'ui-design'
  | 'responsive-design'
  | 'design-system'
  | 'interaction'
  | 'content'
  | 'visual-direction'
  | 'campaign'
  | 'art-direction';

export type ContentStatus = 
  | 'draft' 
  | 'assets-only' 
  | 'partial' 
  | 'ready' 
  | 'featured-ready';

export type AssetStatus = 
  | 'none' 
  | 'low' 
  | 'medium' 
  | 'good' 
  | 'complete';

export type FeaturedReadiness = 
  | 'not-ready' 
  | 'candidate' 
  | 'strong-candidate' 
  | 'featured';

export type AssetCategory = 
  | 'cover'
  | 'hero'
  | 'ux'
  | 'wireframe'
  | 'flow'
  | 'ui'
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'component'
  | 'design-system'
  | 'campaign'
  | 'detail'
  | 'other';

export type AssetType = 'image' | 'video' | 'gif' | 'embed';

export interface ProjectAsset {
  id: string;
  projectId: string;
  type: AssetType;
  category: AssetCategory;
  title?: string;
  caption?: string;
  src: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  alt?: string;
  order: number;
  featured?: boolean;
}

export type SectionType = 
  | 'hero'
  | 'text'
  | 'metrics'
  | 'ux-flow'
  | 'wireframe'
  | 'image-grid'
  | 'full-width-image'
  | 'split-image'
  | 'device-showcase'
  | 'before-after'
  | 'design-system'
  | 'components'
  | 'gallery'
  | 'quote'
  | 'project-scale'
  | 'impact'
  | 'related-projects';

export interface ProjectSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  content?: string;
  assets?: ProjectAsset[];
  layout?: string;
  order: number;
  visible: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'UX' | 'UI' | 'Desktop' | 'Mobile' | 'Design System' | 'Components' | 'Campaign';
  caption: string;
  image: string;
  imageUrl?: string;
  aspectRatio?: string;
  subcategories?: string[];
}

export interface UXArtifact {
  title: string;
  type: 'sitemap' | 'userflow' | 'wireframe' | 'navigation' | 'architecture';
  description: string;
  preview: string;
  nodes?: string[];
}

export interface DesignDecision {
  number: string;
  title: string;
  decision: string;
  rationale: string;
  impactArea?: string;
}

export interface DesignSystemToken {
  colors: Array<{ name: string; hex: string; role: string; textColor?: string }>;
  typography: {
    primaryFont: string;
    displayFont: string;
    scale: string[];
  };
  componentsSummary: string[];
}

export interface ProjectScale {
  screens: number;
  components: number;
  platforms: string;
  variants?: number;
  pages?: number;
  breakpoints?: number;
}

export interface Brand {
  id: string;
  name: string;
  nameFa: string;
  slug: string;
  logo?: string;
  description?: string;
  color: string;
  projectCount?: number;
  isRecognized: boolean;
}

export interface WebsitePageItem {
  id: string;
  title: string;
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

export interface WebsiteLanguageGroup {
  code: string;
  label: string;
  pages: WebsitePageItem[];
}

export interface Project {
  // 1. Mandatory Identity
  id: string;
  slug: string;
  name: string;
  
  // 2. Names & Labels
  originalName?: string;
  displayNameFa?: string;
  displayNameEn?: string;
  nameEn?: string;
  
  // 3. Brand & Context
  client: string;
  clientFa: string;
  brand: string;
  year: number | null;
  
  // 4. Status & Readiness
  contentStatus: ContentStatus;
  assetStatus: AssetStatus;
  caseStudyReadinessScore: number; // 0..100
  featured: boolean;
  featuredScore: number;
  featuredReadiness: FeaturedReadiness;
  featuredRank?: number;
  
  // 5. Taxonomy
  type: NormalizedProjectType[] | string;
  typeFa: string;
  platform: NormalizedPlatform[] | string;
  platformFa: string;
  family?: string;
  familyNameFa?: string;
  familyRole?: string;
  
  // 6. Narrative
  shortDescription?: string;
  description?: string;
  context?: string;
  challenge?: string;
  approach?: string;
  solution?: string;
  
  // 7. Scope & Team
  scope: string[];
  services: ServiceType[] | string[];
  disciplines?: DisciplineType[] | string[];
  tags: string[];
  team?: string;
  role?: string;
  duration?: string;
  
  // 8. External Links
  figmaUrl?: string;
  liveUrl?: string;
  pdfUrl?: string;

  // 8.5 Multi-page website structure (per language, per device)
  websitePages?: WebsiteLanguageGroup[];
  
  // 9. Primary Imagery & Assets
  cover?: string;
  hero?: string;
  tablet?: string;
  mobile?: string;
  thumbnail?: string;
  coverGradient?: string;
  accentColor?: string;
  badge?: string;
  mockupType?: 'browser' | 'mobile' | 'dual' | 'editorial' | 'isometric';
  
  assets?: ProjectAsset[];
  gallery: GalleryItem[];
  uxAssets?: ProjectAsset[];
  uiAssets?: ProjectAsset[];
  desktopAssets?: ProjectAsset[];
  tabletAssets?: ProjectAsset[];
  mobileAssets?: ProjectAsset[];
  componentAssets?: ProjectAsset[];
  designSystemAssets?: ProjectAsset[];
  campaignAssets?: ProjectAsset[];
  otherAssets?: ProjectAsset[];
  
  // 10. Deep UX / Design Artifacts
  uxArtifacts?: UXArtifact[];
  designDecisions?: DesignDecision[];
  designSystem?: DesignSystemToken;
  projectScale?: ProjectScale;
  impact?: string;
  
  // 11. Flexible Section System
  sections?: ProjectSection[];
  
  // 12. Relations
  relatedProjects?: string[];
  parentProjectId?: string;
  childProjectIds?: string[];
  nextProject?: string;
  previousProject?: string;
  
  // 13. Metadata & SEO
  seoTitle?: string;
  seoDescription?: string;
  notes?: string;
  internalNotes?: string;
}

export interface ProjectFamily {
  id: string;
  name: string;
  client: string;
  description: string;
  projectIds: string[];
  leadProjectId: string;
}

export interface MetricSummary {
  totalProjects: number;
  yearsActive: number;
  brandsCount: number;
  websitesCount: number;
  landingPagesCount: number;
  mobileExperiencesCount: number;
  productInterfacesCount: number;
  campaignCount: number;
  pictogramsCount?: number;
  catalogsCount?: number;
}

// -------------------------------------------------------------
// Brand Pictogram & Iconography System Types
// -------------------------------------------------------------
export type PictogramCategory = 
  | 'smart-home' 
  | 'app-icons' 
  | 'system-icons' 
  | 'feature-symbols' 
  | 'appliances';

export interface PictogramIconItem {
  id: string;
  name: string;
  nameFa: string;
  category: string;
  svgPath?: string; // Optional custom SVG path
  svgUrl?: string; // URL to SVG file
  pngUrl?: string; // URL to PNG file
  iconName?: string; // Lucide icon name fallback
  tags?: string[];
}

export interface BrandPictogramProject {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  client: string;
  clientFa: string;
  brand: string;
  year: number;
  category: PictogramCategory;
  categoryFa: string;
  descriptionFa: string;
  cover: string;
  accentColor: string;
  iconCount: number;
  gridSystem: string; // e.g. "24x24dp Grid with 2px optical stroke"
  keyTokens: string[];
  mockups: {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    tag?: string;
  }[];
  icons: PictogramIconItem[];
  downloadVectorUrl?: string;
  guidelines?: string[];
}

// -------------------------------------------------------------
// Digital Catalog & Mobile-Optimized Interactive PDF Types
// -------------------------------------------------------------
export type CatalogCategory = 
  | 'mobile-catalog' 
  | 'product-brochure' 
  | 'brand-guideline' 
  | 'annual-handbook' 
  | 'campaign-lookbook';

export interface CatalogPage {
  pageNumber: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  summaryBullets?: string[];
}

export interface DigitalCatalogProject {
  id: string;
  slug: string;
  titleFa: string;
  titleEn: string;
  client: string;
  clientFa: string;
  brand: string;
  year: number;
  category: CatalogCategory;
  categoryFa: string;
  descriptionFa: string;
  cover: string;
  pdfUrl?: string;
  fileSizeMb?: number;
  pageCount: number;
  aspectRatio: 'mobile-portrait' | 'tablet-vertical' | 'standard-a4'; // mobile (9:16 or 9:19.5), A4, etc.
  accentColor: string;
  isMobileOptimized: boolean;
  pages: CatalogPage[];
  highlights: string[];
}

// -------------------------------------------------------------
// Global Site & Sections Settings Types (Full CMS Control)
// -------------------------------------------------------------
export interface SiteHeroSettings {
  badgeText: string;
  title: string;
  description: string;
  ctaPrimaryText: string;
  ctaSecondaryText: string;
  ctaArchiveText: string;
}

export interface SiteKpiCard {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  accentColor: string; // e.g. '#0066FF', '#06b6d4', '#6366f1', '#10b981'
  icon: string; // e.g. 'FolderArchive', 'Globe', 'Monitor', 'Layers'
}

export interface SiteSectionVisibility {
  showHero: boolean;
  showKpis: boolean;
  showTop10: boolean;
  showPictograms: boolean;
  showCatalogs: boolean;
  top10SectionTitle: string;
  top10SectionSubtitle: string;
  pictogramsSectionTitle: string;
  pictogramsSectionSubtitle: string;
  catalogsSectionTitle: string;
  catalogsSectionSubtitle: string;
}

export interface SiteProfileSettings {
  siteName: string;
  brandTitle: string;
  tagline: string;
  headerBadge: string;
  footerArchiveYears: string;
  footerNote: string;
  contactEmail?: string;
  telegramUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface SitePresentationSettings {
  introBadge: string;
  introTitle: string;
  introDescription: string;
  introStat1Value: string;
  introStat1Label: string;
  introStat2Value: string;
  introStat2Label: string;
  introStat3Value: string;
  introStat3Label: string;
  introButtonText: string;
  closingBadge: string;
  closingTitle: string;
  closingDescription: string;
  closingButtonText: string;
}

export interface SiteSettings {
  hero: SiteHeroSettings;
  kpis: SiteKpiCard[];
  sections: SiteSectionVisibility;
  profile: SiteProfileSettings;
  presentation: SitePresentationSettings;
}
