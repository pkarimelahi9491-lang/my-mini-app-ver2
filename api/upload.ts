/**
 * POST /api/upload — saves an uploaded asset to Supabase Storage.
 *
 * Body: { folderName?, fileName, fileData (base64 / data URI), category? }
 * Returns the same JSON shape as the legacy Express/PHP endpoints so the
 * CMS components keep working unchanged.
 *
 * NOTE: Vercel serverless request bodies are limited to ~4.5 MB — files
 * larger than that must be uploaded via the Supabase Dashboard (Storage).
 *
 * Env vars required:
 *   SUPABASE_URL             — Project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service_role key (server-side only!)
 * A public bucket named "uploads" must exist (see vercel/schema.sql).
 *
 * Author: Hamidreza Derhami
 */

import { createClient } from '@supabase/supabase-js';
import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { requireAdmin } from './_lib/auth';

const MAX_BYTES = 3 * 1024 * 1024; // stay safely under Vercel's 4.5MB body limit
const ALLOWED_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'pdf'];

const CONTENT_TYPES: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf'
};

function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'POST') {
    return jsonError(res, 'Method not allowed', 405);
  }
  if (!requireAdmin(req, res)) return;

  try {
    const body = await readBodyJson(req);
    const fileName = String(body.fileName ?? '');
    const fileData = String(body.fileData ?? '');
    const folderName = body.folderName ? String(body.folderName) : 'Custom Uploads';
    const category = body.category ? String(body.category) : 'general';

    if (!fileName || !fileData) {
      return jsonError(res, 'fileName and fileData are required', 400);
    }

    const dotIndex = fileName.lastIndexOf('.');
    const ext = dotIndex >= 0 ? fileName.slice(dotIndex + 1).toLowerCase() : '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return jsonError(res, `File type not allowed. Permitted: .${ALLOWED_EXTENSIONS.join(', .')}`, 400);
    }

    // Strip data URI prefix when present
    let base64 = fileData;
    const commaIndex = fileData.indexOf(',');
    if (/^data:[a-zA-Z0-9/+.-]+;base64,/.test(fileData) && commaIndex > 0) {
      base64 = fileData.slice(commaIndex + 1);
    }
    const buffer = Buffer.from(base64, 'base64');
    if (buffer.length === 0) {
      return jsonError(res, 'Invalid base64 file data', 400);
    }
    if (buffer.length > MAX_BYTES) {
      return jsonError(
        res,
        `فایل بزرگ‌تر از حد مجاز سرورلس است (${Math.round(buffer.length / 1024)}KB). فایل‌های حجیم را از داشبورد Supabase → Storage آپلود کنید.`,
        413
      );
    }

    // Sanitize path-unsafe characters (mirrors the legacy implementation)
    const cleanFolder = (folderName.replace(/[/\\?%*:|"<>\x00-\x1F]/g, '-').replace(/^[.\s]+|[.\s]+$/g, '') || 'uploads');
    const cleanFile = (fileName.replace(/[/\\?%*:|"<>\x00-\x1F]/g, '-').replace(/^[.\s]+|[.\s]+$/g, '')) || `file.${ext}`;
    const objectPath = `${cleanFolder}/${cleanFile}`;

    const sb = supabase();
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';
    const { error } = await sb.storage
      .from('uploads')
      .upload(objectPath, buffer, { contentType, upsert: true });

    if (error) {
      console.error('storage upload error:', error);
      return jsonError(res, 'Storage upload failed: ' + error.message, 500);
    }

    const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/uploads/${encodeURIComponent(cleanFolder)}/${encodeURIComponent(cleanFile)}`;

    jsonOut(res, {
      success: true,
      url: publicUrl,
      folderName: cleanFolder,
      fileName: cleanFile,
      category
    });
  } catch (err: any) {
    console.error('upload error:', err);
    jsonError(res, err?.message || 'Upload failed', 500);
  }
}
