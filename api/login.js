import { isAdmin } from './_auth.js';
export default function handler(req, res) {
  res.status(isAdmin(req) ? 200 : 401).json({ ok: isAdmin(req) });
}
