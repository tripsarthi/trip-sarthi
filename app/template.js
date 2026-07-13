import BrandLoader from '@/components/BrandLoader';

// Remounts on every route change, so the veil replays on each navigation,
// hiding the new page while it paints, then fading out (pure CSS).
export default function Template({ children }) {
  return (
    <>
      <BrandLoader veil />
      {children}
    </>
  );
}
