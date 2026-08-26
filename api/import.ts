/**
 * POST /api/import — atomically replace collections from a full CMS backup
 * bundle: { projects?, pictogramProjects?, catalogProjects?, brands?, siteSettings? }
 * Only provided array keys are replaced. Requires an admin session.
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { requireAdmin } from './_lib/auth';
import sql, { UpsertInput } from './_lib/db';

const BUNDLE_MAP: Record<string, 'projects' | 'pictograms' | 'catalogs' | 'brands'> = {
  projects: 'projects',
  pictogramProjects: 'pictograms',
  catalogProjects: 'catalogs',
  brands: 'brands'
};

function labelOf(table: string, item: Record<string, any>): string | null {
  if (table === 'pictograms' || table === 'catalogs') return typeof item.titleFa === 'string' ? item.titleFa : null;
  return typeof item.name === 'string' ? item.name : null;
}

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'POST') {
    return jsonError(res, 'Method not allowed', 405);
  }
  if (!requireAdmin(req, res)) return;

  const bundle = await readBodyJson(req);
  const counts: Record<string, number> = {};

  try {
    await sql.begin(async tx => {
      for (const [bundleKey, table] of Object.entries(BUNDLE_MAP)) {
        const items = bundle[bundleKey];
        if (!Array.isArray(items)) continue;

        await tx`delete from ${sql(table)}`;
        const list = items as Record<string, any>[];
        for (let i = 0; i < list.length; i++) {
          const item = list[i];
          if (!item || typeof item !== 'object' || !item.id) continue;
          const input: UpsertInput = {
            id: String(item.id),
            slug: typeof item.slug === 'string' ? item.slug : null,
            label: labelOf(table, item),
            featured: Boolean(item.featured),
            sortOrder: i,
            data: item
          };
          // Use the same upsert logic but inside the transaction:
          await upsertWithin(tx, table, input);
        }
        counts[bundleKey] = list.length;
      }

      if (bundle.siteSettings && typeof bundle.siteSettings === 'object') {
        await tx`
          insert into site_settings (id, data)
          values (1, ${sql.json(bundle.siteSettings)})
          on conflict (id) do update set data = excluded.data, updated_at = now()
        `;
        counts.siteSettings = 1;
      }
    });

    jsonOut(res, { success: true, imported: counts });
  } catch (err: any) {
    console.error('import error:', err);
    jsonError(res, 'Import failed: ' + (err?.message || ''), 500);
  }
}

/**
 * Upsert executed with a caller-provided transaction client.
 * Mirrors _lib/db.upsertRecord.
 */
async function upsertWithin(
  tx: any,
  table: 'projects' | 'pictograms' | 'catalogs' | 'brands',
  input: UpsertInput
): Promise<void> {
  let sortOrder = input.sortOrder;
  if (sortOrder === undefined || sortOrder === null) {
    sortOrder = 0;
  }
  const slug = input.slug ?? input.id;
  const isProject = table === 'projects';
  const featured = isProject ? Boolean(input.featured) : false;
  const label = input.label ?? null;

  await tx`
    insert into ${sql(table)} (id, slug, name, featured, sort_order, data)
    values (${input.id}, ${slug}, ${label}, ${featured}, ${sortOrder}, ${sql.json(input.data as any)})
    on conflict (id) do update set
      slug       = excluded.slug,
      name       = excluded.name,
      featured   = excluded.featured,
      sort_order = excluded.sort_order,
      data       = excluded.data,
      updated_at = now()
  `;
}
