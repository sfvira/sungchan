import { put } from '@vercel/blob';
import { isAdmin } from './_auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
  const type = req.headers['content-type'] || '';
  if (!type.startsWith('image/')) return res.status(400).json({ error: 'image only' });
  const body = Buffer.isBuffer(req.body) ? req.body : req;
  const blob = await put('gallery/photo.jpg', body, {
    access: 'public',
    addRandomSuffix: true,
    contentType: type,
  });
  res.status(200).json({ url: blob.url });
}
