/**
 * SHADOW / DESIGN REVIEW — Serverless API · Postgres (Supabase) client
 *
 * Uses postgres.js against the Supabase connection pooler.
 * Env var required: DATABASE_URL  (Project Settings → Database → Connection string)
 * Use the "Transaction" pooler URI and keep ?pgbouncer=true&sslmode=require
 * parameters; prepare:false below is required for transaction pooling.
 *
 * Author: Hamidreza Derhami
 */

import postgres from 'postgres';

declare global {
  // eslint-disable-next-line no-var
  var __shadowSql: postgres.Sql | undefined;
}

function createClient(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables.');
  }
  return postgres(url, {
    prepare: false, // required for Supabase transaction-mode pooler
    max: 3,
    idle_timeout: 20,
    connect_timeout: 10
  });
}

const sql: postgres.Sql = globalThis.__shadowSql ?? createClient();
globalThis.__shadowSql = sql;

export default sql;

// -------------------------------------------------------------
// Collection helpers (rows stored as JSONB in `data` column)
// -------------------------------------------------------------

export const COLLECTIONS = ['projects', 'pictograms', 'catalogs', 'brands'] as const;
export type CollectionName = (typeof COLLECTIONS)[number];

export function isCollection(name: string): name is CollectionName {
  return (COLLECTIONS as readonly string[]).includes(name);
}

export async function loadCollection(name: CollectionName): Promise<Record<string, any>[]> {
  const rows = await sql`select data from ${sql(name)} order by sort_order asc, id asc`;
  return rows.map(r => r.data as Record<string, any>);
}

export interface UpsertInput {
  id: string;
  slug?: string | null;
  label?: string | null;
  featured?: boolean;
  sortOrder?: number;
  data: unknown;
}

function tableColumns(name: CollectionName, input: UpsertInput) {
  switch (name) {
    case 'projects':
      return { slug: input.slug ?? input.id, label: input.label ?? null, featured: Boolean(input.featured) };
    case 'pictograms':
    case 'catalogs':
      return { slug: input.slug ?? input.id, label: input.label ?? null, featured: false };
    default:
      return { slug: input.slug ?? input.id, label: input.label ?? null, featured: false };
  }
}

/**
 * Insert or update one record. When sortOrder is omitted the existing
 * position is preserved for existing rows, otherwise the record is appended.
 */
export async function upsertRecord(name: CollectionName, input: UpsertInput): Promise<void> {
  if (!input.id || typeof input.id !== 'string') {
    throw new Error('Record must have a string "id"');
  }

  let sortOrder = input.sortOrder;
  if (sortOrder === undefined || sortOrder === null) {
    const existing = await sql`
      select sort_order from ${sql(name)} where id = ${input.id} limit 1
    `;
    if (existing.length > 0) {
      sortOrder = Number(existing[0].sort_order);
    } else {
      const maxRow = await sql`select coalesce(max(sort_order), -1) + 1 as next from ${sql(name)}`;
      sortOrder = Number(maxRow[0].next);
    }
  }

  const cols = tableColumns(name, input);

  await sql`
    insert into ${sql(name)} (id, slug, name, featured, sort_order, data)
    values (${input.id}, ${cols.slug}, ${cols.label}, ${cols.featured}, ${sortOrder}, ${sql.json(input.data as any)})
    on conflict (id) do update set
      slug       = excluded.slug,
      name       = excluded.name,
      featured   = excluded.featured,
      sort_order = excluded.sort_order,
      data       = excluded.data,
      updated_at = now()
  `;
}

export async function deleteRecord(name: CollectionName, id: string): Promise<void> {
  await sql`delete from ${sql(name)} where id = ${id}`;
}
export async function getSiteSettings(): Promise<Record<string, any> | null> {
  const rows = await sql`select data from site_settings where id = 1 limit 1`;
  return rows.length > 0 ? (rows[0].data as Record<string, any>) : null;
}

export async function saveSiteSettings(settings: unknown): Promise<void> {
  await sql`
    insert into site_settings (id, data)
    values (1, ${sql.json(settings as any)})
    on conflict (id) do update set data = excluded.data, updated_at = now()
  `;
}
