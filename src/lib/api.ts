/**
 * SHADOW / DESIGN REVIEW — API client
 * Talks to the PHP/MySQL backend deployed under /api on the host.
 *
 * Author: Hamidreza Derhami
 * SPDX-License-Identifier: Apache-2.0
 */

import { Brand, BrandPictogramProject, DigitalCatalogProject, Project, SiteSettings } from '../types';

export type CollectionKey = 'projects' | 'pictograms' | 'catalogs' | 'brands';

export interface ContentBundle {
  projects: Project[];
  pictogramProjects: BrandPictogramProject[];
  catalogProjects: DigitalCatalogProject[];
  brands: Brand[];
  siteSettings: SiteSettings | null;
}

const JSON_HEADERS: Record<string, string> = { 'Content-Type': 'application/json' };

async function handle<T = any>(res: Response): Promise<T> {
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    // non-JSON error page (e.g. hosting error) — fall through
  }
  if (!res.ok) {
    throw new Error(data?.error || `درخواست ناموفق بود (کد ${res.status})`);
  }
  return data as T;
}

export const api = {
  /** Public — full site content */
  getContent(): Promise<ContentBundle> {
    return fetch('/api/content').then(handle<ContentBundle>);
  },

  /** Admin — upsert one record into a collection */
  upsertRecord(collection: CollectionKey, record: unknown): Promise<any> {
    return fetch(`/api/${collection}`, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(record)
    }).then(handle);
  },

  /** Admin — delete one record from a collection */
  deleteRecord(collection: CollectionKey, id: string): Promise<any> {
    return fetch(`/api/${collection}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).then(handle);
  },

  /** Admin — save the whole SiteSettings object */
  saveSettings(settings: SiteSettings): Promise<any> {
    return fetch('/api/settings', {
      method: 'PUT',
      headers: JSON_HEADERS,
      body: JSON.stringify(settings)
    }).then(handle);
  },

  /** Admin — atomically replace collections with a full backup bundle */
  importBundle(bundle: object): Promise<any> {
    return fetch('/api/import', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(bundle)
    }).then(handle);
  },

  // ----- Auth -----
  login(username: string, password: string): Promise<{ authenticated: boolean; username?: string }> {
    return fetch('/api/login', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ username, password })
    }).then(handle);
  },

  logout(): Promise<any> {
    return fetch('/api/logout', { method: 'POST' }).then(handle);
  },

  session(): Promise<{ authenticated: boolean; username?: string }> {
    return fetch('/api/session').then(handle);
  },

  changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return fetch('/api/change-password', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ currentPassword, newPassword })
    }).then(handle);
  }
};
