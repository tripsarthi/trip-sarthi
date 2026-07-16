// Single source of truth for the homepage's editable sections.
// The public page (app/page.js) and the admin Layout editor both use this.

export const HOME_SECTIONS = [
  { id: 'hero', label: 'Hero + booking form', locked: true },
  { id: 'intro', label: 'Intro + feature cards' },
  { id: 'offer1', label: 'Offer banner (upper)' },
  { id: 'services', label: 'What we offer (services)' },
  { id: 'how', label: 'How to book (steps)' },
  { id: 'why', label: 'Why choose us (values)' },
  { id: 'cars', label: 'Car classes & rates' },
  { id: 'places', label: 'Popular routes' },
  { id: 'estimate', label: 'Get estimate form' },
  { id: 'reviews', label: 'Testimonials' },
  { id: 'offer2', label: 'Offer banner (lower)' },
];

const KNOWN = new Set(HOME_SECTIONS.map((s) => s.id));

export function defaultLayout() {
  return HOME_SECTIONS.map((s) => ({ id: s.id, v: 1 }));
}

// Parse the stored JSON, tolerating bad data, and guarantee every known
// section is present exactly once (new sections append, unknown ones drop).
export function parseLayout(raw) {
  let rows = [];
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (Array.isArray(parsed)) rows = parsed;
  } catch { /* fall through to defaults */ }

  const seen = new Set();
  const out = [];
  for (const row of rows) {
    if (row && KNOWN.has(row.id) && !seen.has(row.id)) {
      seen.add(row.id);
      out.push({ id: row.id, v: row.v === 0 || row.v === false ? 0 : 1 });
    }
  }
  // append any known sections missing from stored layout (e.g. newly added)
  for (const s of HOME_SECTIONS) {
    if (!seen.has(s.id)) out.push({ id: s.id, v: 1 });
  }
  // hero is locked-on and always first
  const hero = out.find((r) => r.id === 'hero') || { id: 'hero', v: 1 };
  hero.v = 1;
  return [hero, ...out.filter((r) => r.id !== 'hero')];
}
