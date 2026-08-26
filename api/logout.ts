/**
 * POST /api/logout — clears the admin session cookie.
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut } from './_lib/http';
import { clearSessionCookie } from './_lib/auth';

export default async function handler(_req: Req, res: Res) {
  clearSessionCookie(res);
  jsonOut(res, { authenticated: false });
}
