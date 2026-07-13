// Creates (or updates the password of) the admin dashboard user.
// Usage: node scripts/create-admin.mjs <email> <password>
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage: node scripts/create-admin.mjs <email> <password>');
  process.exit(1);
}

const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
if (error) {
  if (/already/i.test(error.message)) {
    const { data: list } = await sb.auth.admin.listUsers();
    const user = list.users.find((u) => u.email === email);
    if (user) {
      const { error: updErr } = await sb.auth.admin.updateUserById(user.id, { password });
      if (updErr) { console.error('Failed to update password:', updErr.message); process.exit(1); }
      console.log(`Updated password for existing user ${email}`);
      process.exit(0);
    }
  }
  console.error('Failed:', error.message);
  process.exit(1);
}
console.log(`Created admin user ${data.user.email} — sign in at /admin`);
