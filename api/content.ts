/**
 * GET /api/content — public site content from Postgres.
 * Empty collections return []; settings returns null when never saved.
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, getMethod } from './_lib/http';
import { loadCollection, getSiteSettings } from './_lib/db';

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'GET') {
    return jsonError(res, 'Method not allowed', 405);
  }
  try {
    const [projects, pictogramProjects, catalogProjects, brands, siteSettings] = await Promise.all([
      loadCollection('projects'),
      loadCollection('pictograms'),
      loadCollection('catalogs'),
      loadCollection('brands'),
      getSiteSettings()
    ]);
    jsonOut(res, { projects, pictogramProjects, catalogProjects, brands, siteSettings });
  } catch (err: any) {
    console.error('content error:', err);
    jsonError(res, 'Failed to load content', 500);
  }
}
