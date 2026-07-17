'use client';
import { useState } from 'react';

// Image field for the admin/editor: thumbnail preview + JPG/PNG/WebP upload to
// Supabase Storage (via the `upload` prop) with a URL-paste fallback.
export default function AdminImageField({ value, onChange, upload, small }) {
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
