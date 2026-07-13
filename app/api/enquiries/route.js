import { NextResponse } from 'next/server';
import { serviceClient } from '@/lib/db';

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const name = String(body.name || '').trim().slice(0, 120);
  const phone = String(body.phone || '').trim().slice(0, 30);
  const from_city = String(body.from_city || '').trim().slice(0, 120);
  const to_city = String(body.to_city || '').trim().slice(0, 120);
  const message = String(body.message || '').trim().slice(0, 2000);

  if (!name || !phone) {
    return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
  }

  const { error } = await serviceClient()
    .from('enquiries')
    .insert({ name, phone, from_city, to_city, message, status: 'new' });

  if (error) {
    return NextResponse.json(
      { error: 'Could not save your enquiry right now. Please use WhatsApp or call us.' },
      { status: 500 }
    );
  }
  return NextResponse.json({ ok: true });
}
