// Single source of truth for the homepage's editable sections.
// The public page (app/page.js) and the admin Layout editor both use this.
// `bg` (when present) lets that section switch between a plain white and a
// tinted "cream" background — only offered for sections where both are legible.

export const HOME_SECTIONS = [
  { id: 'hero', label: 'Hero + booking form', locked: true },
  { id: 'intro', label: 'Intro + feature cards', bg: 'white' },
  { id: 'offer1', label: 'Offer banner (upper)' },
  { id: 'services', label: 'What we offer (services)', bg: 'cream' },
  { id: 'how', label: 'How to book (steps)' },
  { id: 'why', label: 'Why choose us (values)', bg: 'white' },
  { id: 'cars', label: 'Car classes & rates', bg: 'cream' },
  { id: 'places', label: 'Popular routes', bg: 'white' },
  { id: 'estimate', label: 'Get estimate form', bg: 'cream' },
  { id: 'reviews', label: 'Testimonials', bg: 'white' },
  { id: 'offer2', label: 'Offer banner (lower)' },
];

const META = new Map(HOME_SECTIONS.map((s) => [s.id, s]));
const KNOWN = new Set(HOME_SECTIONS.map((s) => s.id));

export function sectionMeta(id) {
  return META.get(id) || { id, label: id };
}

export function defaultLayout() {
  return HOME_SECTIONS.map((s) => ({ id: s.id, v: 1, ...(s.bg ? { bg: s.bg } : {}) }));
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
  const norm = (id, row) => {
    const m = META.get(id);
    const entry = { id, v: row?.v === 0 || row?.v === false ? 0 : 1 };
    if (m?.bg) entry.bg = row?.bg === 'cream' || row?.bg === 'white' ? row.bg : m.bg;
    return entry;
  };

  for (const row of rows) {
    if (row && KNOWN.has(row.id) && !seen.has(row.id)) {
      seen.add(row.id);
      out.push(norm(row.id, row));
    }
  }
  for (const s of HOME_SECTIONS) {
    if (!seen.has(s.id)) out.push(norm(s.id, s));
  }
  // hero is locked-on and always first
  const hero = out.find((r) => r.id === 'hero') || { id: 'hero', v: 1 };
  hero.v = 1;
  return [hero, ...out.filter((r) => r.id !== 'hero')];
}
