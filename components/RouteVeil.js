'use client';
import { useEffect, useState } from 'react';
import BrandLoader from './BrandLoader';

// The page-transition veil — but suppressed when the page is shown inside the
// admin Appearance preview (?admin-preview=1), so the editor's live preview
// doesn't flash a loader on every reload.
export default function RouteVeil() {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    setHide(new URLSearchParams(window.location.search).get('admin-preview') === '1');
  }, []);
  if (hide) return null;
  return <BrandLoader veil />;
}
