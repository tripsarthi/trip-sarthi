import { anonClient } from './db';

// Validates the admin dashboard's Supabase session token from the
// Authorization header. Returns the user, or null.
export async function requireUser(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  const { data, error } = await anonClient().auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}
