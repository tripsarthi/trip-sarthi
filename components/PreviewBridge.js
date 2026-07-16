'use client';
import { useEffect } from 'react';

// Only active when the homepage is shown inside the admin Appearance preview
// (loaded as /?admin-preview=1). Lets the admin click a section in the preview
// to select it, and highlights the section the admin is editing.
export default function PreviewBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin-preview') !== '1') return;

    document.body.classList.add('ts-preview');

    const sel = (id) => {
      document.querySelectorAll('[data-sec].ts-sel').forEach((el) => el.classList.remove('ts-sel'));
      if (!id) return;
      const el = document.querySelector(`[data-sec="${id}"]`);
      if (el) {
        el.classList.add('ts-sel');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    const onClick = (e) => {
      const sec = e.target.closest('[data-sec]');
      if (!sec) return;
      e.preventDefault();
      e.stopPropagation();
      const id = sec.getAttribute('data-sec');
      sel(id);
      window.parent?.postMessage({ type: 'ts-select-section', id }, '*');
    };

    const onMsg = (e) => {
      if (e.data?.type === 'ts-highlight') sel(e.data.id);
    };

    // capture phase so it beats the section's own links/buttons
    document.addEventListener('click', onClick, true);
    window.addEventListener('message', onMsg);
    window.parent?.postMessage({ type: 'ts-preview-ready' }, '*');

    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('message', onMsg);
      document.body.classList.remove('ts-preview');
    };
  }, []);

  return null;
}
