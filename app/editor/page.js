'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { DEFAULT_CONTENT } from '@/lib/defaults';
import { HOME_SECTIONS, parseLayout, defaultLayout } from '@/lib/homeLayout';
import { SECTION_PANELS } from '@/lib/sectionPanels';
import AdminImageField from '@/components/AdminImageField';

const THEME_KEYS = [
  'theme_brand', 'theme_brand_deep', 'theme_cream',
  'theme_btn_shape', 'theme_btn_size', 'theme_card_radius', 'theme_section_pad',
  'theme_hero_height', 'theme_hero_overlay', 'theme_hero_form', 'theme_float_pos',
];
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

export default function EditorPage() {
  const sb = supabaseBrowser();
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSession(data.session ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (session === undefined) return <div className="ed-loading">Loading editor…</div>;
  if (!session) {
    if (typeof window !== 'undefined') window.location.replace('/admin');
    return <div className="ed-loading">Please sign in — redirecting…</div>;
  }
  return <Editor session={session} />;
}

function Editor({ session }) {
  const [content, setContent] = useState(null);
  const [settings, setSettings] = useState(null);
  const [layout, setLayout] = useState(null);
  const [dirty, setDirty] = useState({});
  const [settingsDirty, setSettingsDirty] = useState(false);
  const [selected, setSelected] = useState('theme'); // 'theme' or a section id
  const [device, setDevice] = useState('desktop');
  const [previewKey, setPreviewKey] = useState(0);
  const [scale, setScale] = useState(1);
  const [frameH, setFrameH] = useState(3200);
  const [dragId, setDragId] = useState(null);
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const dragRef = useRef(null);
  const roRef = useRef(null);
  const iframeRef = useRef(null);

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

  const setWrap = useCallback((node) => {
    if (roRef.current) { roRef.current.disconnect(); roRef.current = null; }
    if (!node) return;
    const compute = () => setScale(device === 'mobile' ? 1 : Math.min(1, (node.clientWidth - 48) / 1280));
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(node);
    roRef.current = ro;
  }, [device]);

  // preselect a section from ?sec=
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('sec');
    if (q && SECTION_PANELS[q]) setSelected(q);
  }, []);

  // click a section in the preview → open its settings
  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type !== 'ts-select-section') return;
      const id = e.data.id;
      setSelected(SECTION_PANELS[id] ? id : 'theme');
      iframeRef.current?.contentWindow?.postMessage({ type: 'ts-highlight', id }, '*');
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    Promise.all([api({ action: 'list', table: 'content' }), api({ action: 'list', table: 'settings' })])
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

  if (err) return <div className="ed-loading">Could not load editor: {err} · <Link href="/admin">Back to dashboard</Link></div>;
  if (!content || !layout || !settings) return <div className="ed-loading">Loading editor…</div>;

  const setC = (key, val) => { setContent((c) => ({ ...c, [key]: val })); setDirty((d) => ({ ...d, [key]: true })); };
  const set = (k) => (e) => setC(k, e.target.value);
  const setS = (key, val) => { setSettings((s) => ({ ...s, [key]: val })); setSettingsDirty(true); };
  const meta = (id) => HOME_SECTIONS.find((s) => s.id === id) || { label: id };

  function selectSection(id) {
    setSelected(id);
    iframeRef.current?.contentWindow?.postMessage({ type: 'ts-highlight', id: SECTION_PANELS[id] ? id : null }, '*');
  }
  function toggle(id) {
    if (meta(id).locked) return;
    setLayout(layout.map((r) => (r.id === id ? { ...r, v: r.v ? 0 : 1 } : r)));
  }
  function setBg(id, bg) { setLayout(layout.map((r) => (r.id === id ? { ...r, bg } : r))); }
  function move(index, dir) {
    const to = index + dir;
    if (index === 0 || to < 1 || to >= layout.length) return;
    const next = [...layout];
    [next[index], next[to]] = [next[to], next[index]];
    setLayout(next);
  }
  function onDrop(targetId) {
    const from = layout.findIndex((r) => r.id === dragRef.current);
    const to = layout.findIndex((r) => r.id === targetId);
    setDragId(null); dragRef.current = null;
    if (from < 1 || to < 1 || from === to) return;
    const next = [...layout];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setLayout(next);
  }
  function measure() {
    try {
      const h = iframeRef.current?.contentDocument?.documentElement?.scrollHeight;
      if (h && h > 800) setFrameH(h + 40);
    } catch { /* cross-frame throttled */ }
  }

  async function save() {
    if (!HEX_RE.test(content.theme_brand) || !HEX_RE.test(content.theme_brand_deep) || !HEX_RE.test(content.theme_cream || '#faf8f3')) {
      setNote({ ok: false, text: 'Colours must be valid hex like #F5B301.' });
      return;
    }
    setBusy(true); setNote(null);
    try {
      const rows = Object.keys(dirty).map((key) => ({ key, value: String(content[key] ?? '') }));
      rows.push({ key: 'home_layout', value: JSON.stringify(layout) });
      await api({ action: 'upsert', table: 'content', rows });
      if (settingsDirty) await api({ action: 'upsert', table: 'settings', rows: { ...settings, id: 1 } });
      setDirty({}); setSettingsDirty(false);
      setNote({ ok: true, text: 'Published ✓' });
      setPreviewKey((k) => k + 1);
    } catch (e) { setNote({ ok: false, text: e.message }); }
    setBusy(false);
  }

  const isMobile = device === 'mobile';
  const frameScale = isMobile ? 1 : scale;

  return (
    <div className="editor">
      <header className="ed-top">
        <Link href="/admin" className="ed-exit" title="Back to dashboard">←</Link>
        <div className="ed-brand">
          <img src="/logo.png" alt="" />
          <span>Trip <b>Sarthi</b> · Website editor</span>
        </div>
        <div className="ed-top-right">
          <span className="ed-device">
            <button className={device === 'desktop' ? 'on' : ''} onClick={() => setDevice('desktop')} title="Desktop">🖥</button>
            <button className={device === 'mobile' ? 'on' : ''} onClick={() => setDevice('mobile')} title="Mobile">📱</button>
            <button onClick={() => setPreviewKey((k) => k + 1)} title="Reload preview">⟳</button>
          </span>
          {note && <span className={`ed-note ${note.ok ? 'ok' : 'err'}`}>{note.text}</span>}
          <button className="ed-save" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save & publish'}</button>
        </div>
      </header>

      <div className="ed-body">
        {/* Left: section navigator */}
        <aside className="ed-left">
          <div className="ed-side-h">Sections</div>
          <div className="ed-seclist">
            {layout.map((row, i) => {
              const m = meta(row.id);
              return (
                <div
                  key={row.id}
                  className={`ed-secrow ${selected === row.id ? 'sel' : ''} ${row.v ? '' : 'hidden'} ${dragId === row.id ? 'dragging' : ''}`}
                  draggable={!m.locked}
                  onDragStart={() => { setDragId(row.id); dragRef.current = row.id; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(row.id)}
                  onDragEnd={() => { setDragId(null); dragRef.current = null; }}
                >
                  <span className="ed-handle">{m.locked ? '★' : '⋮⋮'}</span>
                  <button className="ed-seclabel" onClick={() => selectSection(row.id)}>{m.label}</button>
                  <span className="ed-sectools">
                    <button onClick={() => move(i, -1)} disabled={i <= 1} aria-label="Move up">↑</button>
                    <button onClick={() => move(i, 1)} disabled={i === 0 || i === layout.length - 1} aria-label="Move down">↓</button>
                    <button className={row.v ? '' : 'off'} onClick={() => toggle(row.id)} disabled={m.locked} aria-label="Show/hide">{row.v ? '👁' : '🚫'}</button>
                  </span>
                </div>
              );
            })}
          </div>
          <button className={`ed-theme-btn ${selected === 'theme' ? 'on' : ''}`} onClick={() => selectSection('theme')}>⚙ Theme settings</button>
        </aside>

        {/* Center: live preview */}
        <main className="ed-canvas" ref={setWrap}>
          <div className={`ed-frame ${isMobile ? 'mobile' : ''}`} style={{ width: (isMobile ? 390 : 1280) * frameScale, height: frameH * frameScale }}>
            <iframe
              ref={iframeRef}
              key={previewKey}
              title="Website preview"
              src="/?admin-preview=1"
              onLoad={measure}
              style={{ width: isMobile ? 390 : 1280, height: frameH, border: 0, transform: `scale(${frameScale})`, transformOrigin: 'top left' }}
            />
          </div>
        </main>

        {/* Right: contextual settings */}
        <aside className="ed-right">
          {selected === 'theme'
            ? <ThemePanel content={content} set={set} />
            : <SectionSettings id={selected} content={content} setC={setC} settings={settings} setS={setS}
                layoutRow={layout.find((r) => r.id === selected)} setBg={setBg} meta={meta} upload={upload} />}
        </aside>
      </div>
    </div>
  );
}

function SectionSettings({ id, content, setC, settings, setS, layoutRow, setBg, meta, upload }) {
  const p = SECTION_PANELS[id];
  const m = meta(id);
  if (!p) return <div className="ed-panel"><div className="ed-panel-h">{m.label}</div><p className="ap-hint">This section follows the global theme. Use ⚙ Theme settings.</p></div>;
  const bgNow = layoutRow?.bg || m.bg;
  return (
    <div className="ed-panel">
      <div className="ed-panel-h">{p.title}</div>
      {p.shared && <div className="ap-hint">{p.shared}</div>}

      {p.image && (
        <div className="form-field" style={{ marginBottom: 14 }}>
          <label>{p.imageLabel || 'Image'}</label>
          <div style={{ marginTop: 7 }}>
            <AdminImageField value={settings?.[p.image]} onChange={(v) => setS(p.image, v)} upload={upload} small />
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
            <button className={bgNow === 'white' ? 'on' : ''} onClick={() => setBg(id, 'white')}>White</button>
            <button className={bgNow === 'cream' ? 'on' : ''} onClick={() => setBg(id, 'cream')}>Cream</button>
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
        <Link className="admin-btn ghost" style={{ marginTop: 16, display: 'inline-block' }} href="/admin">{p.manage.label} →</Link>
      )}
    </div>
  );
}

function ThemePanel({ content, set }) {
  const radius = content.theme_btn_shape === 'rounded' ? 12 : 999;
  return (
    <div className="ed-panel">
      <div className="ed-panel-h">Theme settings</div>

      <div className="ed-group">Colours</div>
      <div className="form-grid">
        <div className="form-field">
          <label>Primary color</label>
          <div className="swatch-row" style={{ marginTop: 7 }}>
            <input type="color" value={HEX_RE.test(content.theme_brand) ? content.theme_brand : '#F5B301'} onChange={set('theme_brand')} aria-label="Primary" />
            <input className="admin-input" style={{ maxWidth: 120 }} value={content.theme_brand} onChange={set('theme_brand')} />
          </div>
        </div>
        <div className="form-field">
          <label>Dark accent</label>
          <div className="swatch-row" style={{ marginTop: 7 }}>
            <input type="color" value={HEX_RE.test(content.theme_brand_deep) ? content.theme_brand_deep : '#C98A00'} onChange={set('theme_brand_deep')} aria-label="Accent" />
            <input className="admin-input" style={{ maxWidth: 120 }} value={content.theme_brand_deep} onChange={set('theme_brand_deep')} />
          </div>
        </div>
        <div className="form-field">
          <label>Light section background</label>
          <div className="swatch-row" style={{ marginTop: 7 }}>
            <input type="color" value={HEX_RE.test(content.theme_cream) ? content.theme_cream : '#faf8f3'} onChange={set('theme_cream')} aria-label="Section bg" />
            <input className="admin-input" style={{ maxWidth: 120 }} value={content.theme_cream} onChange={set('theme_cream')} />
          </div>
        </div>
        <div className="theme-preview" style={{ background: content.theme_cream }}>
          <span style={{ display: 'inline-block', padding: '11px 22px', borderRadius: radius, background: content.theme_brand, color: '#14110a', font: '700 13px var(--sora)' }}>Book Now</span>
          <span style={{ font: '800 15px var(--sora)', color: content.theme_brand_deep }}>₹13/KM</span>
        </div>
      </div>

      <div className="ed-group">Buttons &amp; cards</div>
      <div className="form-grid ap-two">
        <div className="form-field"><label>Button shape</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_btn_shape} onChange={set('theme_btn_shape')}>
            <option value="pill">Pill</option><option value="rounded">Rounded</option></select></div>
        <div className="form-field"><label>Button size</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_btn_size} onChange={set('theme_btn_size')}>
            <option value="normal">Normal</option><option value="large">Large</option></select></div>
        <div className="form-field"><label>Card corners</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_card_radius} onChange={set('theme_card_radius')}>
            <option value="sharp">Sharp</option><option value="soft">Soft</option><option value="round">Very round</option></select></div>
        <div className="form-field"><label>Section spacing</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_section_pad} onChange={set('theme_section_pad')}>
            <option value="compact">Compact</option><option value="normal">Normal</option><option value="roomy">Roomy</option></select></div>
      </div>

      <div className="ed-group">Hero &amp; placement</div>
      <div className="form-grid ap-two">
        <div className="form-field"><label>Hero height</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_height} onChange={set('theme_hero_height')}>
            <option value="standard">Standard</option><option value="tall">Tall</option></select></div>
        <div className="form-field"><label>Hero photo tint</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_overlay} onChange={set('theme_hero_overlay')}>
            <option value="light">Light</option><option value="medium">Medium</option><option value="dark">Dark</option></select></div>
        <div className="form-field"><label>Booking form side</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_hero_form} onChange={set('theme_hero_form')}>
            <option value="right">Right</option><option value="left">Left</option></select></div>
        <div className="form-field"><label>Floating buttons</label>
          <select className="admin-input" style={{ marginTop: 6 }} value={content.theme_float_pos} onChange={set('theme_float_pos')}>
            <option value="right">Bottom right</option><option value="left">Bottom left</option></select></div>
      </div>
    </div>
  );
}
