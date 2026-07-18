'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Car-card "Book Now": opens a booking modal pre-filled with this specific car
// and submits a real enquiry (POST /api/enquiries), instead of jumping to
// WhatsApp. A WhatsApp link is kept as a secondary option. The modal is
// portaled to <body> because the car card uses overflow:hidden.
export default function BookButton({ car, waNumber }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ from_city: '', to_city: '', date: '', name: '', phone: '' });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const openModal = () => { setStatus(null); setOpen(true); };
  const close = () => setOpen(false);

  async function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setStatus({ ok: false, text: 'Please fill in your name and phone number.' });
      return;
    }
    setBusy(true); setStatus(null);
    const message = [
      `Car: ${car.name}${car.model ? ` (${car.model})` : ''}`,
      car.rate ? `Rate: ₹${car.rate}/km` : '',
      form.date ? `Travel date: ${form.date}` : '',
      'Booking request from website',
    ].filter(Boolean).join(' · ');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, phone: form.phone, from_city: form.from_city, to_city: form.to_city, message }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Something went wrong');
      setStatus({ ok: true, text: 'Booking request sent! We’ll call you back shortly to confirm.' });
      setForm({ from_city: '', to_city: '', date: '', name: '', phone: '' });
    } catch (err) {
      setStatus({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  }

  const waText = encodeURIComponent(
    `Hi Trip Sarthi, I'd like to book the ${car.name}${car.model ? ` (${car.model})` : ''}.`
  );
  const waLink = `https://wa.me/${(waNumber || '').replace(/[^0-9]/g, '')}?text=${waText}`;

  const modal = (
    <div className="bm-overlay" onClick={close}>
      <div className="bm-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Book ${car.name}`}>
        <button className="bm-close" onClick={close} aria-label="Close">✕</button>
        <div className="bm-head">
          <div className="bm-kicker">Book your ride</div>
          <h3>{car.name}</h3>
          <div className="bm-sub">{car.model}{car.rate ? ` · ₹${car.rate}/km` : ''}</div>
        </div>
        <form className="bm-form" onSubmit={submit}>
          <div className="form-2col">
            <div className="form-field">
              <label htmlFor={`bm-from-${car.id}`}>From</label>
              <input id={`bm-from-${car.id}`} value={form.from_city} onChange={set('from_city')} placeholder="Pickup city" />
            </div>
            <div className="form-field">
              <label htmlFor={`bm-to-${car.id}`}>To</label>
              <input id={`bm-to-${car.id}`} value={form.to_city} onChange={set('to_city')} placeholder="Destination" />
            </div>
          </div>
          <div className="form-2col">
            <div className="form-field">
              <label htmlFor={`bm-date-${car.id}`}>Travel date</label>
              <input id={`bm-date-${car.id}`} type="date" value={form.date} onChange={set('date')} />
            </div>
            <div className="form-field">
              <label htmlFor={`bm-phone-${car.id}`}>Phone</label>
              <input id={`bm-phone-${car.id}`} type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="Your phone" />
            </div>
          </div>
          <div className="form-field">
            <label htmlFor={`bm-name-${car.id}`}>Full name</label>
            <input id={`bm-name-${car.id}`} autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your name" />
          </div>
          {status && <div className={`form-msg ${status.ok ? 'ok' : 'err'}`}>{status.text}</div>}
          <button type="submit" className="btn bm-submit" disabled={busy}>{busy ? 'Sending…' : 'Request booking'}</button>
          <a href={waLink} target="_blank" rel="noopener" className="bm-wa">or book on WhatsApp →</a>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button type="button" className="book" onClick={openModal}>Book Now</button>
      {mounted && open && createPortal(modal, document.body)}
    </>
  );
}
