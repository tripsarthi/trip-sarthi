'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';

// Mobile-only hamburger + slide-in drawer. The button lives in the topbar; the
// overlay + panel are portaled to <body> so the topbar's backdrop-filter (which
// makes it a containing block for fixed children) doesn't trap/clip the drawer.
export default function MobileMenu({ nav, active, waHref }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setOpen(false);

  const drawer = (
    <>
      <div className={`mnav-overlay ${open ? 'show' : ''}`} onClick={close} aria-hidden="true" />
      <nav className={`mnav-panel ${open ? 'open' : ''}`} aria-label="Mobile navigation" aria-hidden={!open}>
        <button className="mnav-close" aria-label="Close menu" onClick={close}>✕</button>
        {nav.map(([label, href]) => (
          <Link key={href} href={href} className={active === href ? 'active' : ''} onClick={close}>{label}</Link>
        ))}
        <a href={waHref} target="_blank" rel="noopener" className="btn mnav-cta" onClick={close}>Book Now</a>
      </nav>
    </>
  );

  return (
    <div className="mobile-nav">
      <button
        className={`hamburger ${open ? 'open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span /><span /><span />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </div>
  );
}
