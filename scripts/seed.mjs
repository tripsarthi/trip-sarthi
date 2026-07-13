// Seeds Supabase with the default site content. Idempotent-ish: skips tables
// that already have rows (except settings, which is upserted).
// Usage: npm run seed
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

// load .env.local manually (no dotenv dependency)
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { DEFAULT_SETTINGS, DEFAULT_CARS, DEFAULT_ROUTES, DEFAULT_TESTIMONIALS, DEFAULT_GALLERY } =
  await import('../lib/defaults.js');

async function seedTable(table, rows) {
  const { data, error } = await sb.from(table).select('id').limit(1);
  if (error) throw new Error(`${table}: ${error.message} — did you run scripts/schema.sql in the SQL Editor?`);
  if (data.length > 0) {
    console.log(`~ ${table}: already has data, skipping`);
    return;
  }
  const clean = rows.map(({ id, ...r }) => r);
  const { error: insErr } = await sb.from(table).insert(clean);
  if (insErr) throw new Error(`${table}: ${insErr.message}`);
  console.log(`+ ${table}: seeded ${clean.length} rows`);
}

const { error: setErr } = await sb.from('settings').upsert(DEFAULT_SETTINGS);
if (setErr) throw new Error(`settings: ${setErr.message} — did you run scripts/schema.sql in the SQL Editor?`);
console.log('+ settings: upserted');

await seedTable('cars', DEFAULT_CARS);
await seedTable('routes', DEFAULT_ROUTES);
await seedTable('testimonials', DEFAULT_TESTIMONIALS);
await seedTable('gallery', DEFAULT_GALLERY);

console.log('\nDone. The site now serves content from Supabase.');
