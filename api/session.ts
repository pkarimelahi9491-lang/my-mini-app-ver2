/**
 * GET /api/session — check whether a valid admin session cookie exists.
 *
 * Author: Hamidreza Derhami
 */

import type { Req, Res } from './_lib/http';
import { jsonOut } from './_lib/http';
import { currentAdmin } from './_lib/auth';

export default async function handler(req: Req, res: Res) {
  const session = currentAdmin(req);
  jsonOut(res, session ? { authenticated: true, username: session.u } : { authenticated: false });
}
