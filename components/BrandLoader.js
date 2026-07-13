// Branded full-screen loader.
// veil=true  → transition curtain: covers the page on every navigation, then
//              fades itself out (used in app/template.js, which remounts per route).
// veil=false → persistent loader shown while a route is actually fetching
//              (used in app/loading.js; unmounts when content is ready).
export default function BrandLoader({ veil = false }) {
  return (
    <div className={veil ? 'route-veil' : 'route-loader'} aria-hidden="true">
      <img src="/logo.png" alt="" className="veil-logo" width={64} height={64} />
      <div className="veil-brand">Trip <span>Sarthi</span></div>
      <div className="veil-bar"><span /></div>
    </div>
  );
}
