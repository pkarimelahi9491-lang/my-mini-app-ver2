/**
 * SHADOW / DESIGN REVIEW — Serverless API · auth helpers
 *
 * Stateless admin sessions on serverless: an HMAC-signed token stored in an
 * HttpOnly cookie. Passwords are bcrypt-hashed in the admin_users table.
 *
 * Env vars required:
 *   AUTH_SECRET  — long random string (e.g. `openssl rand -hex 32`)
 *
 * Author: Hamidreza Derhami
 */

import crypto from 'crypto';
import type { Req, Res } from './http';
import { jsonError } from './http';

export const COOKIE_NAME = 'shadow_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14; // 14 days

interface SessionPayload {
  u: string;
  exp: number;
}

function secret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    throw new Error('AUTH_SECRET is not set. Add it in Vercel → Settings → Environment Variables.');
  }
  return s;
}

function sign(data: string): string {
  return crypto.createHmac('sha256', secret()).update(data).digest('base64url');
}

export function createToken(username: string): string {
  const payload: SessionPayload = {
    u: username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function verifyToken(token: string | undefined | null): SessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const dotIndex = token.indexOf('.');
  if (dotIndex <= 0) return null;
  const body = token.slice(0, dotIndex);
  const sig = token.slice(dotIndex + 1);

  const expected = sign(body);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
    if (!payload?.u || typeof payload.exp !== 'number') return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(req: Req): Record<string, string> {
  const header = req.headers?.cookie;
  const out: Record<string, string> = {};
  if (typeof header !== 'string') return out;
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx > 0) {
      out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

export function currentAdmin(req: Req): SessionPayload | null {
  return verifyToken(parseCookies(req)[COOKIE_NAME]);
}

/** Sends a 401 and returns false when there is no valid admin session. */
export function requireAdmin(req: Req, res: Res): boolean {
  const session = currentAdmin(req);
  if (!session) {
    jsonError(res, 'Unauthorized. Please log in at /admin.', 401);
    return false;
  }
  return true;
}

export function setSessionCookie(res: Res, username: string): void {
  const token = createToken(username);
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}` +
      ((process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production') ? '; Secure' : '')
  );
}

export function clearSessionCookie(res: Res): void {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}
