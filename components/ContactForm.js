'use client';
import { useState } from 'react';

export default function ContactForm({ waNumber }) {
  const [form, setForm] = useState({ name: '', phone: '', from_city: 'New Delhi', to_city: '', message: '' });
  const [status, setStatus] = useState(null); // {ok, text}
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const waText = encodeURIComponent(
    `Hi Trip Sarthi, I'd like a quote.\nName: ${form.name}\nPhone: ${form.phone}\nFrom: ${form.from_city}\nTo: ${form.to_city}\n${form.message}`
  );
  const waLink = `https://wa.me/${(waNumber || '').replace(/[^0-9]/g, '')}?text=${waText}`;

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ ok: false, text: 'Please fill in your name and phone number.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus({ ok: true, text: 'Enquiry sent! We will get back to you shortly — or tap "Send on WhatsApp" for an instant reply.' });
      setForm({ name: '', phone: '', from_city: 'New Delhi', to_city: '', message: '' });
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="enquiry-panel">
      <h2>Request a quote</h2>
      <p className="sub">Fill in your details — we&apos;ll receive your enquiry instantly. You can also send it straight to WhatsApp.</p>
      <form className="form-grid" onSubmit={submit}>
        <div className="form-2col">
          <div className="form-field">
            <label>Name</label>
            <input value={form.name} onChange={set('name')} placeholder="Your name" />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+91" />
          </div>
        </div>
        <div className="form-2col">
          <div className="form-field">
            <label>From</label>
            <input value={form.from_city} onChange={set('from_city')} placeholder="New Delhi" />
          </div>
          <div className="form-field">
            <label>To</label>
            <input value={form.to_city} onChange={set('to_city')} placeholder="Destination" />
          </div>
        </div>
        <div className="form-field">
          <label>Message</label>
          <textarea value={form.message} onChange={set('message')} placeholder="Travel date, passengers, car preference…" />
        </div>
        {status && <div className={`form-msg ${status.ok ? 'ok' : 'err'}`}>{status.text}</div>}
        <button type="submit" disabled={busy} className="btn-yellow" style={{ padding: 16, fontSize: 16, border: 'none' }}>
          {busy ? 'Sending…' : 'Send enquiry'}
        </button>
        <a href={waLink} target="_blank" rel="noopener" className="btn-dark" style={{ justifyContent: 'center', padding: 15 }}>
          Send on WhatsApp →
        </a>
      </form>
    </div>
  );
}
