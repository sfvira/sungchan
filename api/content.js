import { put, list } from '@vercel/blob';
import { isAdmin } from './_auth.js';

const KEY = 'content.json';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') {
    const { blobs } = await list({ prefix: KEY });
    const b = blobs.find((x) => x.pathname === KEY);
    if (!b) return res.status(200).json({});
    const r = await fetch(`${b.url}?v=${new Date(b.uploadedAt).getTime()}`);
    return res.status(200).json(await r.json());
  }
  if (req.method === 'POST') {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const data = {
      profile: body.profile ?? null,
      journey: body.journey ?? null,
      journeyAdds: body.journeyAdds || [],
      news: body.news || [],
      gallery: body.gallery || {},
    };
    await put(KEY, JSON.stringify(data), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });
    return res.status(200).json({ ok: true });
  }
  res.status(405).end();
}
