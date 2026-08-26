/**
 * POST /api/upload — saves an uploaded asset to Supabase Storage.
 * GET  /api/uploads/folders — lists folders/files in the "uploads" bucket.
 *
 * Both endpoints are handled by this single serverless function so the
 * project stays within Vercel Hobby's 12-function limit.
 */

import { createClient } from '@supabase/supabase-js';
import type { Req, Res } from './_lib/http';
import {
  jsonOut,
  jsonError,
  readBodyJson,
  getMethod
} from './_lib/http';
import { requireAdmin } from './_lib/auth';

const BUCKET = 'uploads';

const MAX_BYTES = 3 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
  'webp',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'pdf'
];

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
    throw new Error(
      'SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set.'
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

/**
 * GET /api/uploads/folders
 */
async function listFolders(res: Res) {
  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return jsonOut(res, { folders: [] });
    }

    const sb = createClient(url, key, {
      auth: { persistSession: false }
    });

    const rootEntries = await sb.storage.from(BUCKET).list('', {
      limit: 200,
      offset: 0,
      sortBy: {
        column: 'name',
        order: 'asc'
      }
    });

    if (rootEntries.error) {
      console.error('folders list error:', rootEntries.error);
      return jsonOut(res, { folders: [] });
    }

    const folders = [];

    for (const entry of rootEntries.data) {
      if (!entry) continue;

      // Supabase Storage folders have id === null.
      if (entry.id !== null) continue;

      const filesResult = await sb.storage
        .from(BUCKET)
        .list(entry.name, {
          limit: 500,
          offset: 0,
          sortBy: {
            column: 'name',
            order: 'asc'
          }
        });

      const files = (filesResult.data ?? [])
        .filter((f) => f && f.id)
        .map((f) => ({
          name: f.name,
          url:
            `${url}/storage/v1/object/public/${BUCKET}/` +
            `${encodeURIComponent(entry.name)}/` +
            `${encodeURIComponent(f.name)}`
        }));

      folders.push({
        name: entry.name,
        fileCount: files.length,
        files
      });
    }

    return jsonOut(res, { folders });
  } catch (err: any) {
    console.error('uploads/folders error:', err);

    return jsonError(
      res,
      err?.message || 'Failed to list uploads',
      500
    );
  }
}

/**
 * POST /api/upload
 */
async function uploadFile(req: Req, res: Res) {
  if (!requireAdmin(req, res)) return;

  try {
    const body = await readBodyJson(req);

    const fileName = String(body.fileName ?? '');
    const fileData = String(body.fileData ?? '');
    const folderName = body.folderName
      ? String(body.folderName)
      : 'Custom Uploads';

    const category = body.category
      ? String(body.category)
      : 'general';

    if (!fileName || !fileData) {
      return jsonError(
        res,
        'fileName and fileData are required',
        400
      );
    }

    const dotIndex = fileName.lastIndexOf('.');

    const ext =
      dotIndex >= 0
        ? fileName.slice(dotIndex + 1).toLowerCase()
        : '';

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return jsonError(
        res,
        `File type not allowed. Permitted: .${ALLOWED_EXTENSIONS.join(', .')}`,
        400
      );
    }

    // Strip data URI prefix when present.
    let base64 = fileData;

    const commaIndex = fileData.indexOf(',');

    if (
      /^data:[a-zA-Z0-9/+.-]+;base64,/.test(fileData) &&
      commaIndex > 0
    ) {
      base64 = fileData.slice(commaIndex + 1);
    }

    const buffer = Buffer.from(base64, 'base64');

    if (buffer.length === 0) {
      return jsonError(
        res,
        'Invalid base64 file data',
        400
      );
    }

    if (buffer.length > MAX_BYTES) {
      return jsonError(
        res,
        `فایل بزرگ‌تر از حد مجاز سرورلس است (${Math.round(
          buffer.length / 1024
        )}KB). فایل‌های حجیم را از داشبورد Supabase → Storage آپلود کنید.`,
        413
      );
    }

    const cleanFolder =
      (
        folderName
          .replace(
            /[/\\?%*:|"<>\x00-\x1F]/g,
            '-'
          )
          .replace(
            /^[.\s]+|[.\s]+$/g,
            ''
          )
      ) || 'uploads';

    const cleanFile =
      (
        fileName
          .replace(
            /[/\\?%*:|"<>\x00-\x1F]/g,
            '-'
          )
          .replace(
            /^[.\s]+|[.\s]+$/g,
            ''
          )
      ) || `file.${ext}`;

    const objectPath = `${cleanFolder}/${cleanFile}`;

    const sb = supabase();

    const contentType =
      CONTENT_TYPES[ext] ??
      'application/octet-stream';

    const { error } = await sb.storage
      .from(BUCKET)
      .upload(
        objectPath,
        buffer,
        {
          contentType,
          upsert: true
        }
      );

    if (error) {
      console.error(
        'storage upload error:',
        error
      );

      return jsonError(
        res,
        'Storage upload failed: ' +
          error.message,
        500
      );
    }

    const publicUrl =
      `${process.env.SUPABASE_URL}` +
      `/storage/v1/object/public/${BUCKET}/` +
      `${encodeURIComponent(cleanFolder)}/` +
      `${encodeURIComponent(cleanFile)}`;

    return jsonOut(res, {
      success: true,
      url: publicUrl,
      folderName: cleanFolder,
      fileName: cleanFile,
      category
    });
  } catch (err: any) {
    console.error(
      'upload error:',
      err
    );

    return jsonError(
      res,
      err?.message || 'Upload failed',
      500
    );
  }
}

/**
 * Main handler
 */
export default async function handler(
  req: Req,
  res: Res
) {
  const method = getMethod(req);

  /*
   * Vercel rewrite sends:
   *
   * /api/uploads/folders
   *       ↓
   * /api/upload?action=folders
   */
  let action = '';

  try {
    const parsedUrl = new URL(
      req.url || '',
      'http://localhost'
    );

    action =
      parsedUrl.searchParams.get('action') || '';
  } catch {
    action = '';
  }

  if (
    method === 'GET' &&
    action === 'folders'
  ) {
    return listFolders(res);
  }

  if (method === 'POST') {
    return uploadFile(req, res);
  }

  return jsonError(
    res,
    'Method not allowed',
    405
  );
}