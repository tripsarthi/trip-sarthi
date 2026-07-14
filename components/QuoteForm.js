'use client';
import { useState } from 'react';

// White booking card shown inside the home hero.
export default function QuoteForm({ title }) {
  const [form, setForm] = useState({ from_city: '', to_city: '', name: '', phone: '' });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ ok: false, text: 'Please fill in your name and phone number.' });
      return;
    }
    setBusy(true); setStatus(null);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus({ ok: true, text: 'Thanks! We received your request and will call you back shortly.' });
      setForm({ from_city: '', to_city: '', name: '', phone: '' });
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="qcard" onSubmit={submit}>
      <h3>{title}</h3>
      <div className="qgrid">
        <div>
          <label htmlFor="q-from">From</label>
          <input id="q-from" value={form.from_city} onChange={set('from_city')} placeholder="Pickup city" />
        </div>
        <div>
          <label htmlFor="q-to">To</label>
          <input id="q-to" value={form.to_city} onChange={set('to_city')} placeholder="Destination" />
        </div>
        <div>
          <label htmlFor="q-name">Full Name</label>
          <input id="q-name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="q-phone">Phone Number</label>
          <input id="q-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="Enter your phone number" />
        </div>
        {status && <div className={`form-msg ${status.ok ? 'ok' : 'err'}`}>{status.text}</div>}
        <button type="submit" className="btn" disabled={busy}>{busy ? 'Sending…' : 'Submit'}</button>
      </div>
    </form>
  );
}
