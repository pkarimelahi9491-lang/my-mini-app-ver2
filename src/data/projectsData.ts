import { Project, ProjectFamily, MetricSummary } from '../types';
import { initialProjectsList, initialExecutiveMetrics } from './initialProjects';

export interface TimelineItem {
  year: number;
  badge: string;
  title: string;
  focus: string;
  keyDeliverables: string[];
  deliverablesCount?: string | number;
  keyProjects?: string[];
}

export const executiveTimeline: TimelineItem[] = [];

export const projectFamilies: ProjectFamily[] = [];

export const allProjects: Project[] = initialProjectsList;
export const executiveMetrics: MetricSummary = initialExecutiveMetrics;
