/**
 * GET /api/uploads/folders — lists folders/files in the "uploads" bucket.
 * Mirrors the legacy Express/PHP response shape consumed by AssetUploader.
 *
 * Author: Hamidreza Derhami
 */

import { createClient } from '@supabase/supabase-js';
import type { Req, Res } from '../_lib/http';
import { jsonOut, jsonError, getMethod } from '../_lib/http';

const BUCKET = 'uploads';

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'GET') {
    return jsonError(res, 'Method not allowed', 405);
  }

  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      return jsonOut(res, { folders: [] });
    }
    const sb = createClient(url, key, { auth: { persistSession: false } });

    const rootEntries = await sb.storage.from(BUCKET).list('', {
      limit: 200,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    });
    if (rootEntries.error) {
      console.error('folders list error:', rootEntries.error);
      return jsonOut(res, { folders: [] }); // graceful empty state
    }

    const folders = [];
    for (const entry of rootEntries.data) {
      if (!entry) continue;
      // In Supabase Storage listings, folders carry id === null while real
      // objects have a non-null id — we only want the folders here.
      if (entry.id !== null) continue;

      const filesResult = await sb.storage.from(BUCKET).list(entry.name, {
        limit: 500,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      const files = (filesResult.data ?? [])
        .filter(f => f && f.id) // only real objects
        .map(f => ({
          name: f.name,
          url: `${url}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(entry.name)}/${encodeURIComponent(f.name)}`
        }));

      folders.push({
        name: entry.name,
        fileCount: files.length,
        files
      });
    }

    jsonOut(res, { folders });
  } catch (err: any) {
    console.error('uploads/folders error:', err);
    jsonError(res, err?.message || 'Failed to list uploads', 500);
  }
}
