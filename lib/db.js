import { createClient } from '@supabase/supabase-js';
import {
  DEFAULT_SETTINGS, DEFAULT_CARS, DEFAULT_ROUTES,
  DEFAULT_TESTIMONIALS, DEFAULT_GALLERY,
  DEFAULT_SERVICES, DEFAULT_FEATURES, DEFAULT_STEPS, DEFAULT_VALUES,
  DEFAULT_CONTENT,
} from './defaults';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export function serviceClient() {
  return createClient(URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function anonClient() {
  return createClient(URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function fetchTable(sb, table, fallback, order = 'sort') {
  try {
    const { data, error } = await sb.from(table).select('*').order(order, { ascending: true });
    if (error || !data || data.length === 0) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

// All public-site content in one call. Falls back to defaults per-table so the
// site renders even before the Supabase schema is created.
export async function getContent() {
  const sb = anonClient();
  let settings = DEFAULT_SETTINGS;
  try {
    const { data } = await sb.from('settings').select('*').eq('id', 1).maybeSingle();
    if (data) settings = { ...DEFAULT_SETTINGS, ...data };
  } catch { /* fall back */ }

  const [cars, routes, testimonials, gallery, services, features, steps, values] = await Promise.all([
    fetchTable(sb, 'cars', DEFAULT_CARS),
    fetchTable(sb, 'routes', DEFAULT_ROUTES),
    fetchTable(sb, 'testimonials', DEFAULT_TESTIMONIALS),
    fetchTable(sb, 'gallery', DEFAULT_GALLERY),
    fetchTable(sb, 'services', DEFAULT_SERVICES),
    fetchTable(sb, 'features', DEFAULT_FEATURES),
    fetchTable(sb, 'steps', DEFAULT_STEPS),
    fetchTable(sb, 'brand_values', DEFAULT_VALUES),
  ]);

  // Text blocks: DB rows override the defaults key-by-key.
  const t = { ...DEFAULT_CONTENT };
  try {
    const { data } = await sb.from('content').select('key,value');
    if (data) for (const row of data) t[row.key] = row.value;
  } catch { /* fall back */ }

  const waNumber = settings.phone_e164.replace(/[^0-9]/g, '');
  // Build a wa.me link with a context-specific message (see lib/waMessages.js).
  // Falls back to the admin's default message when none is given.
  const waFor = (message) =>
    `https://wa.me/${waNumber}?text=${encodeURIComponent(message || settings.whatsapp_message)}`;
  const wa = waFor(settings.whatsapp_message);
  return {
    settings, t,
    cars, routes, testimonials, gallery, services, features, steps, values,
    phone: settings.phone_display,
    tel: `tel:${settings.phone_e164}`,
    wa, waFor, waNumber,
    email: settings.email,
    mailto: `mailto:${settings.email}?subject=${encodeURIComponent('Cab booking enquiry')}`,
    address: settings.address,
  };
}
