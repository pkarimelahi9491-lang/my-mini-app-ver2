/**
 * /api/pictograms — admin CRUD for pictogram systems
 *   POST   { ...full pictogram record }  -> upsert
 *   DELETE ?id=                          -> delete
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { requireAdmin } from './_lib/auth';
import { upsertRecord, deleteRecord, UpsertInput } from './_lib/db';

function recordToUpsert(record: Record<string, any>): UpsertInput {
  return {
    id: String(record.id),
    slug: typeof record.slug === 'string' ? record.slug : null,
    label: typeof record.titleFa === 'string' ? record.titleFa : null,
    data: record
  };
}

export default async function handler(req: Req, res: Res) {
  if (!requireAdmin(req, res)) return;

  try {
    const method = getMethod(req);

    if (method === 'POST') {
      const record = await readBodyJson(req);
      await upsertRecord('pictograms', recordToUpsert(record));
      return jsonOut(res, { success: true, id: record.id });
    }

    if (method === 'DELETE') {
      const id = String(req.query?.id ?? '').trim();
      if (!id) return jsonError(res, 'Missing id', 422);
      await deleteRecord('pictograms', id);
      return jsonOut(res, { success: true });
    }

    jsonError(res, 'Method not allowed', 405);
  } catch (err: any) {
    console.error('pictograms error:', err);
    jsonError(res, err?.message || 'Operation failed', 500);
  }
}
