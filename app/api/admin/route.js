import { NextResponse } from 'next/server';
import { serviceClient, anonClient } from '@/lib/db';

const TABLES = {
  settings: { order: 'id' },
  cars: { order: 'sort' },
  routes: { order: 'sort' },
  testimonials: { order: 'sort' },
  gallery: { order: 'sort' },
  services: { order: 'sort' },
  features: { order: 'sort' },
  steps: { order: 'sort' },
  brand_values: { order: 'sort' },
  content: { order: 'key', pk: 'key' },
  enquiries: { order: 'created_at', desc: true },
};

async function requireUser(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const { data, error } = await anonClient().auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}

export async function POST(req) {
  const user = await requireUser(req);
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const { action, table } = body;
  const cfg = TABLES[table];
  if (!cfg) return NextResponse.json({ error: 'Unknown table' }, { status: 400 });

  const sb = serviceClient();

  if (action === 'list') {
    const { data, error } = await sb
      .from(table)
      .select('*')
      .order(cfg.order, { ascending: !cfg.desc });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'upsert') {
    const rows = Array.isArray(body.rows) ? body.rows : [body.rows];
    // strip client-only fields
    const clean = rows.map(({ _dirty, _new, ...r }) => r);
    const { data, error } = await sb.from(table).upsert(clean).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  if (action === 'delete') {
    const { error } = await sb.from(table).delete().eq(cfg.pk || 'id', body.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
