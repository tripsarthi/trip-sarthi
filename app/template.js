import RouteVeil from '@/components/RouteVeil';

// Remounts on every route change, so the veil replays on each navigation,
// hiding the new page while it paints, then fading out (pure CSS).
// RouteVeil suppresses itself inside the admin Appearance preview iframe.
export default function Template({ children }) {
  return (
    <>
      <RouteVeil />
      {children}
    </>
  );
}
