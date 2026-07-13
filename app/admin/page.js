'use client';
import { useEffect, useState, useCallback } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

const SECTIONS = [
  { key: 'overview', label: 'Overview', icon: '◈' },
  { key: 'enquiries', label: 'Enquiries', icon: '✉' },
  { key: 'cars', label: 'Fleet & Rates', icon: '⛟' },
  { key: 'routes', label: 'Routes', icon: '➤' },
  { key: 'testimonials', label: 'Testimonials', icon: '★' },
  { key: 'gallery', label: 'Gallery', icon: '▣' },
  { key: 'settings', label: 'Site Settings', icon: '⚙' },
];

const COLUMNS = {
  cars: [
    ['name', 'Name'], ['model', 'Model'], ['seats', 'Seats', 'number'], ['bags', 'Bags'],
    ['rate', '₹/km', 'number'], ['tag', 'Tag'], ['description', 'Description', 'textarea'],
    ['image_url', 'Image URL'], ['sort', 'Order', 'number'],
  ],
  routes: [
    ['title', 'Title'], ['meta', 'Distance / time'], ['price', 'Price label'],
    ['image_url', 'Image URL'], ['sort', 'Order', 'number'],
  ],
  testimonials: [
    ['name', 'Name'], ['meta', 'City'], ['stars', 'Stars (1–5)', 'number'],
    ['quote', 'Quote', 'textarea'], ['sort', 'Order', 'number'],
  ],
  gallery: [
    ['caption', 'Caption'], ['image_url', 'Image URL'], ['span', 'Size (blank / feature / wide / tall)'],
    ['sort', 'Order', 'number'],
  ],
};

const NEW_ROW = {
  cars: { name: 'New car', model: '', seats: 4, bags: '2', rate: 12, tag: '', description: '', image_url: '', sort: 99 },
  routes: { title: 'Delhi → ', meta: '', price: 'from ₹', image_url: '', sort: 99 },
  testimonials: { name: '', meta: '', stars: 5, quote: '', sort: 99 },
  gallery: { caption: '', image_url: '', span: '', sort: 99 },
};

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

  useEffect(() => {
    (async () => {
      try {
        const c = {};
        for (const t of ['enquiries', 'cars', 'routes', 'testimonials', 'gallery']) {
          const { data } = await api({ action: 'list', table: t });
          c[t] = data.length;
          if (t === 'enquiries') c.newEnquiries = data.filter((e) => e.status === 'new').length;
        }
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
        {['cars', 'routes', 'testimonials', 'gallery'].includes(tab) && <TableEditor key={tab} table={tab} api={api} />}
        {tab === 'settings' && <Settings api={api} />}
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

function TableEditor({ table, api }) {
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

  const titles = { cars: 'Fleet & Rates', routes: 'Routes', testimonials: 'Testimonials', gallery: 'Gallery' };

  if (err) return <SchemaHint title={titles[table]} err={err} />;
  if (!rows) return <p className="admin-note">Loading…</p>;

  return (
    <>
      <h1 className="admin-title">{titles[table]}</h1>
      <p className="admin-sub">Edit cells, then hit Save. Order controls position on the site.</p>
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
                  <td key={k} style={{ minWidth: type === 'textarea' ? 220 : k === 'image_url' ? 200 : 90 }}>
                    {type === 'textarea'
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

function Settings({ api }) {
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
    ['hero_image', 'Homepage hero image URL'],
    ['about_image', 'About page image URL'],
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
          {FIELDS.map(([k, label]) => (
            <div key={k} className="form-field">
              <label>{label}</label>
              <input className="admin-input" style={{ marginTop: 7, padding: '11px 13px' }}
                value={row[k] ?? ''} onChange={(e) => setRow({ ...row, [k]: e.target.value })} />
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
