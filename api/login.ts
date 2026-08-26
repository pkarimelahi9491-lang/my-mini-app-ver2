/**
 * POST /api/login — { username, password }
 * Sets an HttpOnly signed-session cookie on success.
 *
 * Author: Hamidreza Derhami
 */

import bcrypt from 'bcryptjs';
import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { setSessionCookie } from './_lib/auth';
import sql from './_lib/db';

// In-memory throttle per lambda instance (best-effort brute-force slowdown)
const attempts = new Map<string, { count: number; ts: number }>();

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'POST') {
    return jsonError(res, 'Method not allowed', 405);
  }

  const body = await readBodyJson(req);
  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  if (!username || !password) {
    return jsonError(res, 'نام کاربری و رمز عبور الزامی است.', 422);
  }

  const key = username.toLowerCase();
  const now = Date.now();
  const record = attempts.get(key);
  if (record && now - record.ts < 10 * 60 * 1000 && record.count >= 5) {
    return jsonError(res, 'تلاش‌های ناموفق زیاد است. ۱۰ دقیقه دیگر دوباره امتحان کنید.', 429);
  }
  if (!record || now - record.ts >= 10 * 60 * 1000) {
    attempts.set(key, { count: 0, ts: now });
  }

  try {
    const rows = await sql`
      select password_hash from admin_users where username = ${username} limit 1
    `;
    const ok = rows.length > 0 && bcrypt.compareSync(password, String(rows[0].password_hash));

    if (!ok) {
      const r = attempts.get(key)!;
      r.count += 1;
      await new Promise(resolve => setTimeout(resolve, 350));
      return jsonError(res, 'نام کاربری یا رمز عبور اشتباه است.', 401);
    }

    attempts.delete(key);
    setSessionCookie(res, username);
    jsonOut(res, { authenticated: true, username });
  } catch (err: any) {
    console.error('login error:', err);
    jsonError(res, 'Login failed', 500);
  }
}
