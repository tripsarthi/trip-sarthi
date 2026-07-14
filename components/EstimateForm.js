'use client';
import { useState } from 'react';

// Inline estimate form used in the grey/orange "Get Estimate Now" band.
export default function EstimateForm({ carNames = [] }) {
  const empty = { from_city: '', to_city: '', date: '', time: '', car: '', phone: '', name: '' };
  const [form, setForm] = useState(empty);
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
    const message = [
      form.date && `Date of journey: ${form.date}`,
      form.time && `Journey time: ${form.time}`,
      form.car && `Car: ${form.car}`,
      'Estimate request from website',
    ].filter(Boolean).join(' · ');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, from_city: form.from_city, to_city: form.to_city, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus({ ok: true, text: 'Request received! We will send your estimate shortly.' });
      setForm(empty);
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="est-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="e-from">From</label>
        <input id="e-from" value={form.from_city} onChange={set('from_city')} placeholder="From" />
      </div>
      <div className="field">
        <label htmlFor="e-to">To</label>
        <input id="e-to" value={form.to_city} onChange={set('to_city')} placeholder="To" />
      </div>
      <div className="field">
        <label htmlFor="e-date">Date of Journey</label>
        <input id="e-date" type="date" value={form.date} onChange={set('date')} />
      </div>
      <div className="field">
        <label htmlFor="e-time">Journey Time</label>
        <input id="e-time" type="time" value={form.time} onChange={set('time')} />
      </div>
      <div className="field">
        <label htmlFor="e-car">Select Car</label>
        <select id="e-car" value={form.car} onChange={set('car')}>
          <option value="">Any car</option>
          {carNames.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="e-phone">Phone No</label>
        <input id="e-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="Phone no" />
      </div>
      <div className="field">
        <label htmlFor="e-name">Full Name</label>
        <input id="e-name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Full name" />
      </div>
      <button type="submit" className="btn black" disabled={busy}>{busy ? 'Sending…' : 'Get Estimate'}</button>
      {status && <div className={`form-msg est-msg ${status.ok ? 'ok' : 'err'}`}>{status.text}</div>}
    </form>
  );
}
