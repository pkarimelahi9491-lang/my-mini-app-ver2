/**
 * SHADOW / DESIGN REVIEW — Serverless API · shared HTTP helpers
 * Runs on Vercel Node runtime (@vercel/node).
 *
 * Author: Hamidreza Derhami
 */

export type Req = any; // VercelRequest (typed loosely — project has no @vercel/node types dep)
export type Res = any; // VercelResponse

export function jsonOut(res: Res, data: unknown, status = 200): void {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

export function jsonError(res: Res, message: string, status = 400): void {
  jsonOut(res, { error: message }, status);
}

export async function readBodyJson(req: Req): Promise<Record<string, any>> {
  // @vercel/node already parses JSON bodies into req.body when the
  // Content-Type is application/json; fall back to manual parse otherwise.
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, any>;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON body');
  }
}

export function getMethod(req: Req): string {
  return String(req.method || 'GET').toUpperCase();
}
