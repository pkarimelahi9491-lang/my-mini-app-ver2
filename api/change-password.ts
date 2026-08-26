/**
 * POST /api/change-password — { currentPassword, newPassword }
 * Requires a valid admin session.
 *
 * Author: Hamidreza Derhami
 */

import bcrypt from 'bcryptjs';
import type { Req, Res } from './_lib/http';
import { jsonOut, jsonError, readBodyJson, getMethod } from './_lib/http';
import { requireAdmin, currentAdmin } from './_lib/auth';
import sql from './_lib/db';

export default async function handler(req: Req, res: Res) {
  if (getMethod(req) !== 'POST') {
    return jsonError(res, 'Method not allowed', 405);
  }
  if (!requireAdmin(req, res)) return;

  const body = await readBodyJson(req);
  const currentPassword = String(body.currentPassword ?? '');
  const newPassword = String(body.newPassword ?? '');

  if (newPassword.length < 8) {
    return jsonError(res, 'رمز جدید باید حداقل ۸ کاراکتر باشد.', 422);
  }

  try {
    const username = currentAdmin(req)?.u ?? '';
    const rows = await sql`
      select password_hash from admin_users where username = ${username} limit 1
    `;
    if (rows.length === 0 || !bcrypt.compareSync(currentPassword, String(rows[0].password_hash))) {
      return jsonError(res, 'رمز فعلی اشتباه است.', 401);
    }

    const hash = bcrypt.hashSync(newPassword, 10);
    await sql`update admin_users set password_hash = ${hash} where username = ${username}`;
    jsonOut(res, { success: true });
  } catch (err: any) {
    console.error('change-password error:', err);
    jsonError(res, 'Change password failed', 500);
  }
}
