'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { DEFAULT_CONTENT } from '@/lib/defaults';
import { HOME_SECTIONS, parseLayout, defaultLayout } from '@/lib/homeLayout';

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: '◈' },
  { key: 'enquiries', label: 'Enquiries', icon: '✉' },
  { key: 'appearance', label: 'Appearance', icon: '◐' },
  { key: 'text', label: 'Website Text', icon: '✎' },
  { key: 'cars', label: 'Fleet & Rates', icon: '⛟' },
  { key: 'routes', label: 'Routes', icon: '➤' },
  { key: 'sections', label: 'Page Sections', icon: '▤' },
  { key: 'testimonials', label: 'Testimonials', icon: '★' },
  { key: 'gallery', label: 'Himachal Photos', icon: '▲' },
  { key: 'settings', label: 'Site Settings', icon: '⚙' },
];

const COLUMNS = {
  cars: [
    ['name', 'Name'], ['model', 'Model'], ['seats', 'Seats', 'number'], ['bags', 'Bags'],
    ['rate', '₹/km', 'number'], ['tag', 'Tag'], ['description', 'Description', 'textarea'],
    ['image_url', 'Image', 'image'], ['sort', 'Order', 'number'],
  ],
  routes: [
    ['title', 'Title'], ['meta', 'Distance / time'], ['price', 'Price label'],
    ['image_url', 'Image', 'image'], ['sort', 'Order', 'number'],
  ],
  testimonials: [
    ['name', 'Name'], ['meta', 'City'], ['stars', 'Stars (1–5)', 'number'],
    ['quote', 'Quote', 'textarea'], ['sort', 'Order', 'number'],
  ],
  gallery: [
    ['caption', 'Caption'], ['image_url', 'Image', 'image'], ['span', 'Size (blank / feature / wide / tall)'],
    ['sort', 'Order', 'number'],
  ],
  services: [
    ['num', 'No.'], ['title', 'Title'], ['description', 'Description', 'textarea'], ['sort', 'Order', 'number'],
  ],
  features: [
    ['title', 'Title'], ['sub', 'Subtitle'], ['sort', 'Order', 'number'],
  ],
  steps: [
    ['num', 'No.'], ['title', 'Title'], ['description', 'Description', 'textarea'], ['sort', 'Order', 'number'],
  ],
  brand_values: [
    ['num', 'No.'], ['title', 'Title'], ['description', 'Description', 'textarea'], ['sort', 'Order', 'number'],
  ],
};

const NEW_ROW = {
  cars: { name: 'New car', model: '', seats: 4, bags: '2', rate: 12, tag: '', description: '', image_url: '', sort: 99 },
  routes: { title: 'Delhi → ', meta: '', price: 'from ₹', image_url: '', sort: 99 },
  testimonials: { name: '', meta: '', stars: 5, quote: '', sort: 99 },
  gallery: { caption: '', image_url: '', span: '', sort: 99 },
  services: { num: '05', title: 'New service', description: '', sort: 99 },
  features: { title: 'New feature', sub: '', sort: 99 },
  steps: { num: '05', title: 'New step', description: '', sort: 99 },
  brand_values: { num: '04', title: 'New value', description: '', sort: 99 },
};

// Grouped, human-labelled view of every text block on the site.
const TEXT_GROUPS = [
  { name: 'Home — Hero banner', keys: [
    ['home_h1', 'Headline', 'textarea'], ['home_sub', 'Subtitle', 'textarea'],
    ['home_cta', 'Orange button label'], ['quoteform_title', 'Booking form — title'],
  ]},
  { name: 'Home — Intro section', keys: [
    ['intro_h2', 'Heading'], ['intro_p1', 'Paragraph 1', 'textarea'], ['intro_p2', 'Paragraph 2', 'textarea'],
  ]},
  { name: 'Offer band (orange strip)', keys: [
    ['offer_title', 'Title'], ['offer_cta', 'Button label'],
  ]},
  { name: 'Home — Section headings', keys: [
    ['services_kicker', 'Services — small heading'], ['services_title', 'Services — title'],
    ['cars_kicker', 'Cars — small heading'], ['cars_title', 'Cars — title'],
    ['reviews_kicker', 'Reviews — small heading'], ['reviews_title', 'Reviews — title'],
    ['places_title', 'Popular places — column heading'], ['estimate_title', 'Estimate band — title'],
  ]},
  { name: 'Home — How to book', keys: [
    ['how_title', 'Heading'], ['how_intro', 'Intro paragraph', 'textarea'],
  ]},
  { name: 'Home — Why us', keys: [
    ['why_title', 'Heading'], ['why_intro', 'Intro paragraph', 'textarea'],
  ]},
  { name: 'Car cards', keys: [
    ['car_line1', 'Line 1 (e.g. Limit: 250 KM / Day)'], ['car_line2', 'Line 2 (e.g. Driver: ₹400 / Day)'],
    ['car_note', 'Bottom note'],
  ]},
  { name: 'About page', keys: [
    ['about_h2', 'Story — heading'],
    ['about_p1', 'Story — paragraph 1', 'textarea'], ['about_p2', 'Story — paragraph 2', 'textarea'],
    ['about_stat1_v', 'Stat 1 — value'], ['about_stat1_l', 'Stat 1 — label'],
    ['about_stat2_v', 'Stat 2 — value'], ['about_stat2_l', 'Stat 2 — label'],
    ['about_stat3_v', 'Stat 3 — value'], ['about_stat3_l', 'Stat 3 — label'],
    ['about_stat4_v', 'Stat 4 — value'], ['about_stat4_l', 'Stat 4 — label'],
    ['values_title', 'Values section — title'],
  ]},
  { name: 'Car page', keys: [
    ['fleetpage_h1', 'Banner title'], ['fleetpage_sub', 'Banner subtitle', 'textarea'],
  ]},
  { name: 'Price page', keys: [
    ['pricing_h1', 'Banner title'], ['pricing_sub', 'Banner subtitle', 'textarea'],
    ['pricing_rates_title', 'Rates table — heading'], ['pricing_fares_title', 'Fares grid — heading'],
  ]},
  { name: 'Himachal page', keys: [
    ['himachal_h1', 'Hero title'], ['himachal_sub', 'Hero subtitle', 'textarea'],
    ['himachal_intro_h2', 'Intro — heading'],
    ['himachal_p1', 'Intro — paragraph 1', 'textarea'], ['himachal_p2', 'Intro — paragraph 2', 'textarea'],
    ['himachal_dest_title', 'Destinations — heading'], ['himachal_gallery_title', 'Photo section — heading'],
  ]},
  { name: 'Contact page', keys: [
    ['contact_h1', 'Banner title'], ['contact_sub', 'Banner subtitle', 'textarea'],
    ['form_title', 'Form — title'], ['form_sub', 'Form — subtitle', 'textarea'],
  ]},
  { name: 'Footer', keys: [
    ['footer_blurb', 'About blurb', 'textarea'], ['footer_legal', 'Legal line'],
  ]},
];

export default function Admin() {
  const sb = supabaseBrowser();
  const [session, setSession] = useState(undefined); // undefined = loading
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (session === undefined) return <div className="login-wrap"><div className="admin-note">Loading…</div></div>;
  if (!session) return <Login sb={sb} />;
  return <Dashboard sb={sb} session={session} tab={tab} setTab={setTab} />;
}

function Login({ sb }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (error) setErr(error.message);
    setBusy(false);
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 22 }}>
          <img src="/logo.png" alt="Trip Sarthi" style={{ height: 46, width: 46, borderRadius: 12 }} />
          <div>
            <div className="brand-name">Trip <span>Sarthi</span></div>
            <div className="brand-sub">Admin Dashboard</div>
          </div>
        </div>
        <form className="form-grid" onSubmit={submit}>
          <div className="form-field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {err && <div className="form-msg err">{err}</div>}
          <button className="btn-yellow" style={{ padding: 14, border: 'none', fontSize: 15 }} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ sb, session, tab, setTab }) {
  const [counts, setCounts] = useState({});

  const api = useCallback(async (payload) => {
    const res = await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Request failed');
    return json;
  }, [session.access_token]);

  // Uploads a JPG/PNG/WebP to Supabase Storage, returns its public URL.
  const upload = useCallback(async (file) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: form,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Upload failed');
    return json.url;
  }, [session.access_token]);

  useEffect(() => {
    (async () => {
      try {
        const tables = ['enquiries', 'cars', 'routes', 'testimonials', 'gallery'];
        const results = await Promise.all(tables.map((t) => api({ action: 'list', table: t })));
        const c = {};
        tables.forEach((t, i) => { c[t] = results[i].data.length; });
        c.newEnquiries = results[0].data.filter((e) => e.status === 'new').length;
        setCounts(c);
      } catch { /* schema may not exist yet */ }
    })();
  }, [api]);

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand">
          <img src="/logo.png" alt="" />
          <div>
            <div className="brand-name" style={{ color: '#fff' }}>Trip <span>Sarthi</span></div>
            <div className="brand-sub">Admin</div>
          </div>
        </div>
        {SECTIONS.map((s) => (
          <button key={s.key} className={`admin-nav-btn ${tab === s.key ? 'active' : ''}`} onClick={() => setTab(s.key)}>
            <span>{s.icon}</span>{s.label}
            {s.key === 'enquiries' && counts.newEnquiries > 0 && <span className="badge">{counts.newEnquiries}</span>}
          </button>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button className="admin-nav-btn" onClick={() => sb.auth.signOut()}>⇥ Sign out</button>
        </div>
      </aside>
      <main className="admin-main">
        {tab === 'overview' && <Overview counts={counts} setTab={setTab} />}
        {tab === 'enquiries' && <Enquiries api={api} />}
        {tab === 'appearance' && <AppearanceEditor api={api} setTab={setTab} upload={upload} />}
        {tab === 'text' && <ContentEditor api={api} />}
        {['cars', 'routes', 'testimonials', 'gallery'].includes(tab) && <TableEditor key={tab} table={tab} api={api} upload={upload} />}
        {tab === 'sections' && (
          <>
            <h1 className="admin-title">Page Sections</h1>
            <p className="admin-sub">The four list sections: services & trust points (home), booking steps (home), and company values (about).</p>
            <TableEditor table="services" api={api} compact />
            <TableEditor table="features" api={api} compact />
            <TableEditor table="steps" api={api} compact />
            <TableEditor table="brand_values" api={api} compact />
          </>
        )}
        {tab === 'settings' && <Settings api={api} upload={upload} />}
      </main>
    </div>
  );
}

function Overview({ counts, setTab }) {
  return (
    <>
      <h1 className="admin-title">Overview</h1>
      <p className="admin-sub">Everything on the website is editable from here — changes go live instantly.</p>
      <div className="stat-tiles">
        <div className="stat-tile"><div className="v">{counts.newEnquiries ?? '—'}</div><div className="l">New enquiries</div></div>
        <div className="stat-tile"><div className="v">{counts.cars ?? '—'}</div><div className="l">Cars in fleet</div></div>
        <div className="stat-tile"><div className="v">{counts.routes ?? '—'}</div><div className="l">Routes listed</div></div>
        <div className="stat-tile"><div className="v">{counts.gallery ?? '—'}</div><div className="l">Gallery photos</div></div>
      </div>
      <div className="admin-card">
        <div style={{ font: '700 16px var(--sora)', color: 'var(--ink)', marginBottom: 8 }}>Quick actions</div>
        <div className="admin-toolbar" style={{ marginBottom: 0 }}>
          <button className="admin-btn" onClick={() => setTab('enquiries')}>View enquiries</button>
          <button className="admin-btn ghost" onClick={() => setTab('cars')}>Edit fleet & rates</button>
          <button className="admin-btn ghost" onClick={() => setTab('settings')}>Update contact details</button>
          <a className="admin-btn dark" href="/" target="_blank" style={{ textDecoration: 'none' }}>Open website ↗</a>
        </div>
      </div>
    </>
  );
}

function Enquiries({ api }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api({ action: 'list', table: 'enquiries' });
      setRows(data);
    } catch (e) { setErr(e.message); }
  }, [api]);

  useEffect(() => { load(); }, [load]);

  async function setStatus(row, status) {
    await api({ action: 'upsert', table: 'enquiries', rows: { ...row, status } });
    load();
  }
  async function remove(id) {
    await api({ action: 'delete', table: 'enquiries', id });
    load();
  }

  if (err) return <SchemaHint title="Enquiries" err={err} />;
  if (!rows) return <p className="admin-note">Loading…</p>;

  return (
    <>
      <h1 className="admin-title">Enquiries</h1>
      <p className="admin-sub">Quote requests submitted from the contact form.</p>
      {rows.length === 0 && <div className="admin-card admin-note">No enquiries yet.</div>}
      {rows.map((r) => (
        <div key={r.id} className={`enquiry-item ${r.status === 'new' ? 'new' : ''}`}>
          <div className="head">
            <span className="who">{r.name} · {r.phone}</span>
            <span className="when">{new Date(r.created_at).toLocaleString('en-IN')} · {r.status}</span>
          </div>
          <div className="route">{r.from_city || '—'} → {r.to_city || '—'}</div>
          {r.message && <div className="msg">{r.message}</div>}
          <div className="admin-toolbar" style={{ marginBottom: 0 }}>
            {r.status === 'new'
              ? <button className="admin-btn" onClick={() => setStatus(r, 'handled')}>Mark handled</button>
              : <button className="admin-btn ghost" onClick={() => setStatus(r, 'new')}>Mark new</button>}
            <a className="admin-btn dark" style={{ textDecoration: 'none' }}
               href={`https://wa.me/${r.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener">Reply on WhatsApp</a>
            <button className="admin-btn danger" onClick={() => { if (confirm('Delete this enquiry?')) remove(r.id); }}>Delete</button>
          </div>
        </div>
      ))}
    </>
  );
}

// Image field: thumbnail preview + JPG upload to Supabase Storage + URL fallback.
function ImageField({ value, onChange, upload, small }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function pick(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !upload) return;
    setBusy(true); setErr(null);
    try {
      const url = await upload(file);
      onChange(url);
    } catch (ex) { setErr(ex.message); }
    setBusy(false);
  }

  return (
    <div className="img-cell" style={small ? undefined : { minWidth: 240 }}>
      {value
        ? <img src={value} alt="" className="img-thumb" />
        : <span className="img-thumb empty">—</span>}
      <div className="img-actions">
        <label className={`admin-btn ghost img-upload ${busy ? 'busy' : ''}`}>
          {busy ? 'Uploading…' : '⬆ Upload image'}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pick} disabled={busy} hidden />
        </label>
        <input className="admin-input" placeholder="…or paste an image URL"
          value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
        {err && <span className="admin-note err">{err}</span>}
      </div>
    </div>
  );
}

function TableEditor({ table, api, compact, upload }) {
  const cols = COLUMNS[table];
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await api({ action: 'list', table });
      setRows(data);
      setErr(null);
    } catch (e) { setErr(e.message); }
  }, [api, table]);

  useEffect(() => { load(); }, [load]);

  function edit(i, key, val) {
    setRows(rows.map((r, idx) => (idx === i ? { ...r, [key]: val, _dirty: true } : r)));
  }

  async function saveAll() {
    const dirty = rows.filter((r) => r._dirty);
    if (dirty.length === 0) { setNote({ ok: true, text: 'Nothing to save.' }); return; }
    setBusy(true); setNote(null);
    try {
      await api({ action: 'upsert', table, rows: dirty });
      setNote({ ok: true, text: `Saved ${dirty.length} row(s). Live on the site now.` });
      load();
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  async function addRow() {
    setBusy(true); setNote(null);
    try {
      await api({ action: 'upsert', table, rows: NEW_ROW[table] });
      load();
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  async function remove(id) {
    if (!confirm('Delete this row?')) return;
    try {
      await api({ action: 'delete', table, id });
      load();
    } catch (e) { setNote({ ok: false, text: e.message }); }
  }

  const titles = {
    cars: 'Fleet & Rates', routes: 'Routes', testimonials: 'Testimonials', gallery: 'Himachal Photos',
    services: 'Services (home)', features: 'Trust points (home)', steps: 'How it works (home)', brand_values: 'Values (about)',
  };

  if (err) return <SchemaHint title={titles[table]} err={err} />;
  if (!rows) return <p className="admin-note">Loading…</p>;

  return (
    <>
      {compact
        ? <h2 style={{ font: '800 19px var(--sora)', color: 'var(--ink)', margin: '26px 0 12px' }}>{titles[table]}</h2>
        : <>
            <h1 className="admin-title">{titles[table]}</h1>
            <p className="admin-sub">Edit cells, then hit Save. Order controls position on the site.</p>
          </>}
      <div className="admin-toolbar">
        <button className="admin-btn" onClick={saveAll} disabled={busy}>Save changes</button>
        <button className="admin-btn ghost" onClick={addRow} disabled={busy}>+ Add row</button>
        {note && <span className={`admin-note ${note.ok ? 'ok' : 'err'}`}>{note.text}</span>}
      </div>
      <div className="admin-card" style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>{cols.map(([k, label]) => <th key={k}>{label}</th>)}<th /></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id}>
                {cols.map(([k, , type]) => (
                  <td key={k} style={{ minWidth: type === 'textarea' ? 220 : type === 'image' ? 250 : 90 }}>
                    {type === 'image'
                      ? <ImageField value={r[k]} onChange={(v) => edit(i, k, v)} upload={upload} />
                      : type === 'textarea'
                        ? <textarea className="admin-textarea" value={r[k] ?? ''} onChange={(e) => edit(i, k, e.target.value)} />
                        : <input className="admin-input" type={type || 'text'} value={r[k] ?? ''}
                            onChange={(e) => edit(i, k, type === 'number' ? Number(e.target.value) : e.target.value)} />}
                  </td>
                ))}
                <td><button className="admin-btn danger" onClick={() => remove(r.id)}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Settings({ api, upload }) {
  const [row, setRow] = useState(null);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api({ action: 'list', table: 'settings' })
      .then(({ data }) => setRow(data[0] || { id: 1 }))
      .catch((e) => setErr(e.message));
  }, [api]);

  if (err) return <SchemaHint title="Site Settings" err={err} />;
  if (!row) return <p className="admin-note">Loading…</p>;

  const FIELDS = [
    ['phone_display', 'Phone (as shown, e.g. +91 98765 43210)'],
    ['phone_e164', 'Phone for links (e.g. +919876543210)'],
    ['email', 'Email'],
    ['address', 'Office address'],
    ['whatsapp_message', 'Default WhatsApp message'],
    ['hero_image', 'Homepage hero background image', 'image'],
    ['about_image', 'About page image', 'image'],
  ];

  async function save() {
    setBusy(true); setNote(null);
    try {
      await api({ action: 'upsert', table: 'settings', rows: { ...row, id: 1 } });
      setNote({ ok: true, text: 'Saved. Live on the site now.' });
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  return (
    <>
      <h1 className="admin-title">Site Settings</h1>
      <p className="admin-sub">Contact details and key images used across every page.</p>
      <div className="admin-card" style={{ maxWidth: 640 }}>
        <div className="form-grid">
          {FIELDS.map(([k, label, type]) => (
            <div key={k} className="form-field">
              <label>{label}</label>
              {type === 'image'
                ? <div style={{ marginTop: 7 }}>
                    <ImageField value={row[k]} onChange={(v) => setRow({ ...row, [k]: v })} upload={upload} small />
                  </div>
                : <input className="admin-input" style={{ marginTop: 7, padding: '11px 13px' }}
                    value={row[k] ?? ''} onChange={(e) => setRow({ ...row, [k]: e.target.value })} />}
            </div>
          ))}
          <div className="admin-toolbar" style={{ marginBottom: 0 }}>
            <button className="admin-btn" onClick={save} disabled={busy}>Save settings</button>
            {note && <span className={`admin-note ${note.ok ? 'ok' : 'err'}`}>{note.text}</span>}
          </div>
        </div>
      </div>
    </>
  );
}

function ContentEditor({ api }) {
  const [vals, setVals] = useState(null); // key -> value
  const [dirty, setDirty] = useState({}); // key -> true
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api({ action: 'list', table: 'content' })
      .then(({ data }) => {
        const merged = { ...DEFAULT_CONTENT };
        for (const row of data) merged[row.key] = row.value;
        setVals(merged);
      })
      .catch((e) => setErr(e.message));
  }, [api]);

  if (err) return <SchemaHint title="Website Text" err={err} />;
  if (!vals) return <p className="admin-note">Loading…</p>;

  function edit(key, value) {
    setVals({ ...vals, [key]: value });
    setDirty({ ...dirty, [key]: true });
  }

  async function save() {
    const rows = Object.keys(dirty).map((key) => ({ key, value: vals[key] }));
    if (rows.length === 0) { setNote({ ok: true, text: 'Nothing to save.' }); return; }
    setBusy(true); setNote(null);
    try {
      await api({ action: 'upsert', table: 'content', rows });
      setDirty({});
      setNote({ ok: true, text: `Saved ${rows.length} text block(s). Live on the site now.` });
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  const dirtyCount = Object.keys(dirty).length;

  return (
    <>
      <h1 className="admin-title">Website Text</h1>
      <p className="admin-sub">Every heading, paragraph and label on the site — edit and save.</p>
      <div className="admin-toolbar" style={{ position: 'sticky', top: 0, zIndex: 5, background: '#f6f4ee', padding: '8px 0' }}>
        <button className="admin-btn" onClick={save} disabled={busy}>
          {busy ? 'Saving…' : `Save changes${dirtyCount ? ` (${dirtyCount})` : ''}`}
        </button>
        {note && <span className={`admin-note ${note.ok ? 'ok' : 'err'}`}>{note.text}</span>}
      </div>
      {TEXT_GROUPS.map((g) => (
        <div key={g.name} className="admin-card">
          <div style={{ font: '800 15px var(--sora)', color: 'var(--ink)', marginBottom: 14 }}>{g.name}</div>
          <div className="form-grid" style={{ gap: 12 }}>
            {g.keys.map(([key, label, type]) => (
              <div key={key} className="form-field">
                <label>{label}</label>
                {type === 'textarea'
                  ? <textarea className="admin-textarea" style={{ marginTop: 6 }} value={vals[key] ?? ''} onChange={(e) => edit(key, e.target.value)} />
                  : <input className="admin-input" style={{ marginTop: 6 }} value={vals[key] ?? ''} onChange={(e) => edit(key, e.target.value)} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const THEME_KEYS = [
  'theme_brand', 'theme_brand_deep', 'theme_cream',
  'theme_btn_shape', 'theme_btn_size', 'theme_card_radius', 'theme_section_pad',
  'theme_hero_height', 'theme_hero_overlay', 'theme_hero_form', 'theme_float_pos',
];
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// What each homepage section exposes when you click it in the preview:
// its own text/content, image, background and a jump to its list data.
const SECTION_PANELS = {
  hero: {
    title: 'Hero + booking form', image: 'hero_image', imageLabel: 'Background photo',
    fields: [['home_h1', 'Headline', 'textarea'], ['home_sub', 'Subtitle', 'textarea'], ['home_cta', 'Orange button label'], ['quoteform_title', 'Booking form title']],
    heroOpts: true,
  },
  intro: {
    title: 'Intro + feature cards', bg: true,
    fields: [['intro_h2', 'Heading'], ['intro_p1', 'Paragraph 1', 'textarea'], ['intro_p2', 'Paragraph 2', 'textarea']],
    manage: { tab: 'sections', label: 'Manage feature cards' },
  },
  offer1: { title: 'Offer banner (upper)', shared: 'Both offer banners share this text.', fields: [['offer_title', 'Title'], ['offer_cta', 'Button label']] },
  services: {
    title: 'What we offer', bg: true,
    fields: [['services_kicker', 'Small heading'], ['services_title', 'Title']],
    manage: { tab: 'sections', label: 'Manage service items' },
  },
  how: {
    title: 'How to book', fields: [['how_title', 'Heading'], ['how_intro', 'Intro text', 'textarea']],
    manage: { tab: 'sections', label: 'Manage steps' },
  },
  why: {
    title: 'Why choose us', bg: true, fields: [['why_title', 'Heading'], ['why_intro', 'Intro text', 'textarea']],
    manage: { tab: 'sections', label: 'Manage value points' },
  },
  cars: {
    title: 'Car classes & rates', bg: true,
    fields: [['cars_kicker', 'Small heading'], ['cars_title', 'Title'], ['car_line1', 'Card line 1'], ['car_line2', 'Card line 2'], ['car_note', 'Card note']],
    manage: { tab: 'cars', label: 'Manage cars & rates' },
  },
  places: {
    title: 'Popular routes', bg: true, fields: [['places_title', 'Heading (city added after)']],
    manage: { tab: 'routes', label: 'Manage routes' },
  },
  estimate: { title: 'Get estimate form', bg: true, fields: [['estimate_title', 'Heading']] },
  reviews: {
    title: 'Testimonials', bg: true, fields: [['reviews_kicker', 'Small heading'], ['reviews_title', 'Title']],
    manage: { tab: 'testimonials', label: 'Manage testimonials' },
  },
  offer2: { title: 'Offer banner (lower)', shared: 'Both offer banners share this text.', fields: [['offer_title', 'Title'], ['offer_cta', 'Button label']] },
};

// The contextual settings panel shown when a section is being edited.
function SectionPanel({ id, content, setC, settings, setS, layoutRow, sectionBg, meta, upload, setTab, onBack }) {
  const p = SECTION_PANELS[id];
  const m = meta(id);
  if (!p) return <div className="admin-card"><button className="admin-btn ghost" onClick={onBack}>← Sections</button></div>;
  const bgNow = layoutRow?.bg || m.bg;
  return (
    <div className="admin-card">
      <div className="sp-head">
        <button className="admin-btn ghost sp-back" onClick={onBack}>← Sections</button>
        <div className="ap-h" style={{ margin: 0 }}>{p.title}</div>
      </div>
      {p.shared && <div className="ap-hint">{p.shared}</div>}

      {p.image && (
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>{p.imageLabel || 'Image'}</label>
          <div style={{ marginTop: 7 }}>
            <ImageField value={settings?.[p.image]} onChange={(v) => setS(p.image, v)} upload={upload} small />
          </div>
        </div>
      )}

      <div className="form-grid" style={{ gap: 12 }}>
        {p.fields.map(([key, label, type]) => (
          <div key={key} className="form-field">
            <label>{label}</label>
            {type === 'textarea'
              ? <textarea className="admin-textarea" style={{ marginTop: 6 }} value={content[key] ?? ''} onChange={(e) => setC(key, e.target.value)} />
              : <input className="admin-input" style={{ marginTop: 6 }} value={content[key] ?? ''} onChange={(e) => setC(key, e.target.value)} />}
          </div>
        ))}
      </div>

      {p.bg && (
        <div className="sec-settings" style={{ marginTop: 14 }}>
          <label>Background</label>
          <div className="seg">
            <button className={bgNow === 'white' ? 'on' : ''} onClick={() => sectionBg(id, 'white')}>White</button>
            <button className={bgNow === 'cream' ? 'on' : ''} onClick={() => sectionBg(id, 'cream')}>Cream</button>
          </div>
        </div>
      )}

      {p.heroOpts && (
        <div className="form-grid ap-two" style={{ marginTop: 14 }}>
          <div className="form-field"><label>Hero height</label>
            <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_height} onChange={(e) => setC('theme_hero_height', e.target.value)}>
              <option value="standard">Standard</option><option value="tall">Tall</option></select></div>
          <div className="form-field"><label>Photo tint</label>
            <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_overlay} onChange={(e) => setC('theme_hero_overlay', e.target.value)}>
              <option value="light">Light</option><option value="medium">Medium</option><option value="dark">Dark</option></select></div>
          <div className="form-field"><label>Booking form side</label>
            <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_form} onChange={(e) => setC('theme_hero_form', e.target.value)}>
              <option value="right">Right</option><option value="left">Left</option></select></div>
        </div>
      )}

      {p.manage && (
        <button className="admin-btn ghost" style={{ marginTop: 16 }} onClick={() => setTab(p.manage.tab)}>{p.manage.label} →</button>
      )}
    </div>
  );
}

function AppearanceEditor({ api, setTab, upload }) {
  const [content, setContent] = useState(null); // all content keys except home_layout
  const [settings, setSettings] = useState(null); // for hero/about images
  const [layout, setLayout] = useState(null);
  const [dirty, setDirty] = useState({}); // content keys changed
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [err, setErr] = useState(null);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [device, setDevice] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [dragId, setDragId] = useState(null);
  const [scale, setScale] = useState(1);
  const [selectedSec, setSelectedSec] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingSec, setEditingSec] = useState(null);
  const dragRef = useRef(null);
  const roRef = useRef(null);
  const iframeRef = useRef(null);
  const editModeRef = useRef(false);
  editModeRef.current = editMode;

  // Scale the desktop (1280px) preview down to fit the column width.
  const setWrap = useCallback((node) => {
    if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
    if (!node) return;
    const compute = () => setScale(device === 'mobile' ? 1 : Math.min(1, node.clientWidth / 1280));
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(node);
    roRef.current = ro;
  }, [device]);

  // Click a section in the preview → select it (edit mode → open its panel).
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type !== 'ts-select-section') return;
      const id = e.data.id;
      setSelectedSec(id);
      iframeRef.current?.contentWindow?.postMessage({ type: 'ts-highlight', id }, '*');
      if (editModeRef.current) {
        setEditingSec(id);
        document.querySelector('.appearance-cols')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        document.querySelector(`[data-secrow="${id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    Promise.all([
      api({ action: 'list', table: 'content' }),
      api({ action: 'list', table: 'settings' }),
    ])
      .then(([cRes, sRes]) => {
        const merged = { ...DEFAULT_CONTENT };
        let rawLayout = DEFAULT_CONTENT.home_layout;
        for (const row of cRes.data) {
          merged[row.key] = row.value;
          if (row.key === 'home_layout') rawLayout = row.value;
        }
        delete merged.home_layout;
        setContent(merged);
        setLayout(parseLayout(rawLayout));
        setSettings(sRes.data?.[0] || { id: 1 });
      })
      .catch((e) => setErr(e.message));
  }, [api]);

  if (err) return <SchemaHint title="Appearance" err={err} />;
  if (!content || !layout || !settings) return <p className="admin-note">Loading…</p>;

  const setC = (key, val) => { setContent((c) => ({ ...c, [key]: val })); setDirty((d) => ({ ...d, [key]: true })); };
  const set = (k) => (e) => setC(k, e.target.value);
  const setS = (key, val) => { setSettings((s) => ({ ...s, [key]: val })); setSettingsDirty(true); };
  const meta = (id) => HOME_SECTIONS.find((s) => s.id === id) || { label: id };

  function toggle(id) {
    if (meta(id).locked) return;
    setLayout(layout.map((r) => (r.id === id ? { ...r, v: r.v ? 0 : 1 } : r)));
  }
  function setBg(id, bg) {
    setLayout(layout.map((r) => (r.id === id ? { ...r, bg } : r)));
  }
  function openSection(id) {
    setSelectedSec(id);
    iframeRef.current?.contentWindow?.postMessage({ type: 'ts-highlight', id }, '*');
    if (editMode) setEditingSec(id);
  }
  function toggleEditMode() {
    const n = !editMode;
    setEditMode(n);
    if (!n) setEditingSec(null);
  }
  function move(index, dir) {
    const to = index + dir;
    if (index === 0 || to < 1 || to >= layout.length) return; // hero pinned at top
    const next = [...layout];
    [next[index], next[to]] = [next[to], next[index]];
    setLayout(next);
  }
  function onDrop(targetId) {
    const from = layout.findIndex((r) => r.id === dragRef.current);
    const to = layout.findIndex((r) => r.id === targetId);
    setDragId(null); dragRef.current = null;
    if (from < 1 || to < 1 || from === to) return; // hero stays first
    const next = [...layout];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setLayout(next);
  }

  async function save() {
    if (!HEX_RE.test(content.theme_brand) || !HEX_RE.test(content.theme_brand_deep) || !HEX_RE.test(content.theme_cream || '#faf8f3')) {
      setNote({ ok: false, text: 'Colors must be valid hex values like #F5B301.' });
      return;
    }
    setBusy(true); setNote(null);
    try {
      const rows = Object.keys(dirty).map((key) => ({ key, value: String(content[key] ?? '') }));
      rows.push({ key: 'home_layout', value: JSON.stringify(layout) });
      await api({ action: 'upsert', table: 'content', rows });
      if (settingsDirty) await api({ action: 'upsert', table: 'settings', rows: { ...settings, id: 1 } });
      setDirty({}); setSettingsDirty(false);
      setNote({ ok: true, text: 'Saved — preview updated.' });
      setPreviewKey((k) => k + 1); // reload the iframe (cache purged on save)
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  function reset() {
    setContent((c) => { const n = { ...c }; for (const k of THEME_KEYS) n[k] = DEFAULT_CONTENT[k]; return n; });
    setDirty((d) => { const n = { ...d }; for (const k of THEME_KEYS) n[k] = true; return n; });
    setLayout(defaultLayout());
    setNote({ ok: true, text: 'Reset styling to defaults — hit Save to apply.' });
  }

  const radius = content.theme_btn_shape === 'rounded' ? 12 : 999;
  const isMobile = device === 'mobile';
  const frameScale = isMobile ? 1 : scale;
  const editingRow = editingSec ? layout.find((r) => r.id === editingSec) : null;

  return (
    <>
      <h1 className="admin-title">Appearance</h1>
      <p className="admin-sub">Turn on <b>Edit website</b>, then click any section in the preview to edit its content, images &amp; colours — just like a page builder.</p>

      <div className="admin-toolbar" style={{ position: 'sticky', top: 0, zIndex: 5, background: '#f6f4ee', padding: '8px 0' }}>
        <button className="admin-btn" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save & publish'}</button>
        <button className="admin-btn ghost" onClick={reset} disabled={busy}>Reset styling</button>
        {note && <span className={`admin-note ${note.ok ? 'ok' : 'err'}`}>{note.text}</span>}
      </div>

      <div className="appearance-cols">
        {/* ---- Left: controls ---- */}
        <div>
          {editingSec ? (
            <SectionPanel
              id={editingSec}
              content={content}
              setC={setC}
              settings={settings}
              setS={setS}
              layoutRow={editingRow}
              sectionBg={setBg}
              meta={meta}
              upload={upload}
              setTab={setTab}
              onBack={() => setEditingSec(null)}
            />
          ) : (
            <>
              {editMode && (
                <div className="edit-hint">👆 Click a section in the preview to edit it, or pick one below.</div>
              )}
              <div className="admin-card">
                <div className="ap-h">Homepage sections</div>
                <div className="ap-hint">Drag to reorder or use the arrows; eye toggles show / hide. In <b>Edit website</b> mode, click a name to edit that section.</div>
                <div className="sec-list">
                  {layout.map((row, i) => {
                    const m = meta(row.id);
                    const open = selectedSec === row.id;
                    return (
                      <div
                        key={row.id}
                        data-secrow={row.id}
                        className={`sec-row ${row.v ? '' : 'hidden'} ${dragId === row.id ? 'dragging' : ''} ${m.locked ? 'locked' : ''} ${open ? 'selected' : ''}`}
                        draggable={!m.locked}
                        onDragStart={() => { setDragId(row.id); dragRef.current = row.id; }}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={() => onDrop(row.id)}
                        onDragEnd={() => { setDragId(null); dragRef.current = null; }}
                      >
                        <div className="sec-main">
                          <span className="sec-handle" aria-hidden="true">{m.locked ? '★' : '⋮⋮'}</span>
                          <button className="sec-label" onClick={() => openSection(row.id)} title="Select / edit this section">
                            {m.label}{m.locked && <em> · fixed</em>}
                          </button>
                          <span className="sec-tools">
                            {SECTION_PANELS[row.id] && <button className="sec-btn edit" onClick={() => { setEditMode(true); openSection(row.id); setEditingSec(row.id); }} aria-label="Edit section" title="Edit this section">✎</button>}
                            <button className="sec-btn" onClick={() => move(i, -1)} disabled={i <= 1} aria-label="Move up">↑</button>
                            <button className="sec-btn" onClick={() => move(i, 1)} disabled={i === 0 || i === layout.length - 1} aria-label="Move down">↓</button>
                            <button
                              className={`sec-eye ${row.v ? 'on' : 'off'}`}
                              onClick={() => toggle(row.id)}
                              disabled={m.locked}
                              aria-label={row.v ? 'Hide section' : 'Show section'}
                              title={m.locked ? 'Always shown' : row.v ? 'Visible — click to hide' : 'Hidden — click to show'}
                            >{row.v ? '👁' : '🚫'}</button>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-card">
                <div className="ap-h">Colors</div>
                <div className="form-grid">
                  <div className="form-field">
                    <label>Primary color (buttons, highlights, accents)</label>
                    <div className="swatch-row" style={{ marginTop: 7 }}>
                      <input type="color" value={HEX_RE.test(content.theme_brand) ? content.theme_brand : '#F5B301'}
                        onChange={set('theme_brand')} aria-label="Primary color picker" />
                      <input className="admin-input" style={{ maxWidth: 130 }} value={content.theme_brand} onChange={set('theme_brand')} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Dark accent (links, prices, small headings)</label>
                    <div className="swatch-row" style={{ marginTop: 7 }}>
                      <input type="color" value={HEX_RE.test(content.theme_brand_deep) ? content.theme_brand_deep : '#C98A00'}
                        onChange={set('theme_brand_deep')} aria-label="Dark accent color picker" />
                      <input className="admin-input" style={{ maxWidth: 130 }} value={content.theme_brand_deep} onChange={set('theme_brand_deep')} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Light section background (tinted bands)</label>
                    <div className="swatch-row" style={{ marginTop: 7 }}>
                      <input type="color" value={HEX_RE.test(content.theme_cream) ? content.theme_cream : '#faf8f3'}
                        onChange={set('theme_cream')} aria-label="Light section background picker" />
                      <input className="admin-input" style={{ maxWidth: 130 }} value={content.theme_cream} onChange={set('theme_cream')} />
                    </div>
                  </div>
                  <div className="theme-preview" style={{ background: content.theme_cream }}>
                    <span style={{ display: 'inline-block', padding: '12px 24px', borderRadius: radius, background: content.theme_brand, color: '#14110a', font: '700 13px var(--sora)' }}>Book Now</span>
                    <span style={{ display: 'inline-block', padding: '12px 24px', borderRadius: radius, background: '#14110a', color: '#fff', font: '700 13px var(--sora)' }}>Call Us</span>
                    <span style={{ font: '800 15px var(--sora)', color: content.theme_brand_deep }}>₹13/KM</span>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="ap-h">Buttons &amp; cards</div>
                <div className="form-grid ap-two">
                  <div className="form-field">
                    <label>Button shape</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_btn_shape} onChange={set('theme_btn_shape')}>
                      <option value="pill">Pill (fully rounded)</option>
                      <option value="rounded">Rounded rectangle</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Button size</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_btn_size} onChange={set('theme_btn_size')}>
                      <option value="normal">Normal</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Card corners</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_card_radius} onChange={set('theme_card_radius')}>
                      <option value="sharp">Sharp</option>
                      <option value="soft">Soft (default)</option>
                      <option value="round">Very round</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Section spacing</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_section_pad} onChange={set('theme_section_pad')}>
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="roomy">Roomy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="admin-card">
                <div className="ap-h">Hero &amp; placement</div>
                <div className="form-grid ap-two">
                  <div className="form-field">
                    <label>Hero height</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_hero_height} onChange={set('theme_hero_height')}>
                      <option value="standard">Standard</option>
                      <option value="tall">Tall</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Hero photo tint</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_hero_overlay} onChange={set('theme_hero_overlay')}>
                      <option value="light">Light</option>
                      <option value="medium">Medium</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Hero — booking form side</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_hero_form} onChange={set('theme_hero_form')}>
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Floating call / WhatsApp</label>
                    <select className="admin-input" style={{ marginTop: 7 }} value={content.theme_float_pos} onChange={set('theme_float_pos')}>
                      <option value="right">Bottom right</option>
                      <option value="left">Bottom left</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ---- Right: live preview ---- */}
        <div className="ap-preview-col">
          <div className="ap-preview-bar">
            <span className="ap-h" style={{ margin: 0 }}>Live preview</span>
            <span className="ap-device">
              <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')}>🖥 Desktop</button>
              <button className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')}>📱 Mobile</button>
              <button className={editMode ? 'edit-on' : ''} onClick={toggleEditMode} title="Click sections in the preview to edit them">✎ Edit website</button>
              <button onClick={() => setPreviewKey((k) => k + 1)} title="Reload preview">⟳</button>
            </span>
          </div>
          <div className="ap-hint" style={{ marginBottom: 10 }}>
            {editMode
              ? 'Edit mode on — click any section in the preview to edit its content. Save to publish.'
              : 'Turn on “Edit website”, then click a section in the preview to edit it. Save to publish.'}
          </div>
          <div className={`ap-frame-wrap ${editMode ? 'editing' : ''}`} ref={setWrap}>
            <div
              className="ap-frame"
              style={{ width: (isMobile ? 390 : 1280) * frameScale, height: 1600 * frameScale }}
            >
              <iframe
                ref={iframeRef}
                key={previewKey}
                title="Website preview"
                src="/?admin-preview=1"
                style={{
                  width: isMobile ? 390 : 1280, height: 1600, border: 0,
                  transform: `scale(${frameScale})`, transformOrigin: 'top left',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SchemaHint({ title, err }) {
  return (
    <>
      <h1 className="admin-title">{title}</h1>
      <div className="admin-card">
        <div className="admin-note err" style={{ marginBottom: 8 }}>Could not load data: {err}</div>
        <div className="admin-note">
          If this says a table does not exist, run <b>scripts/schema.sql</b> in the Supabase SQL Editor once, then run <b>npm run seed</b>.
        </div>
      </div>
    </>
  );
}
