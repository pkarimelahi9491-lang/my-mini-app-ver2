/**
 * /api/settings — site settings
 *   GET (admin) -> current settings row (or null when never saved)
 *   PUT (admin) { ...SiteSettings } -> save
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { requireAdmin } from './_lib/auth';
import { getSiteSettings, saveSiteSettings } from './_lib/db';

export default async function handler(req: Req, res: Res) {
  const method = getMethod(req);

  try {
    if (method === 'GET') {
      if (!requireAdmin(req, res)) return;
      return jsonOut(res, { settings: await getSiteSettings() });
    }

    if (method === 'PUT' || method === 'POST') {
      if (!requireAdmin(req, res)) return;
      const settings = await readBodyJson(req);
      if (!settings.hero || !settings.sections) {
        return jsonError(res, 'Invalid settings payload', 422);
      }
      await saveSiteSettings(settings);
      return jsonOut(res, { success: true });
    }

    jsonError(res, 'Method not allowed', 405);
  } catch (err: any) {
    console.error('settings error:', err);
    jsonError(res, err?.message || 'Operation failed', 500);
  }
}
