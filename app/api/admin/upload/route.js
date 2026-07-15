import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/db';
import { requireUser } from '@/lib/adminAuth';

const BUCKET = 'site-images';
const ALLOWED = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(req) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let form;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload' }, { status: 400 });
  }

  const file = form.get('file');
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file received' }, { status: 400 });
  }
  const ext = ALLOWED[file.type];
  if (!ext) return NextResponse.json({ error: 'Only JPG, PNG or WebP images are allowed.' }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Image is too large (max 5 MB).' }, { status: 400 });

  const name = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());

  const sb = serviceClient();
  const { error } = await sb.storage.from(BUCKET).upload(name, buf, { contentType: file.type, upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = sb.storage.from(BUCKET).getPublicUrl(name);
  return NextResponse.json({ url: data.publicUrl });
}
