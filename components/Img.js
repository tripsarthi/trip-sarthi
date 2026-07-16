import Image from 'next/image';

// A neutral cream blur shown while the real image loads (masks slow fetches).
const BLUR =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyMCcgaGVpZ2h0PScxMic+PHJlY3Qgd2lkdGg9JzEwMCUnIGhlaWdodD0nMTAwJScgZmlsbD0nI2U5ZTRkOCcvPjwvc3ZnPg==';

// Content image that fills its (position:relative) container.
// Served through Next.js image optimization: AVIF/WebP, resized per device,
// lazy-loaded (unless priority), with a blur-up placeholder for perceived speed.
export default function Img({ src, alt, sizes, priority = false, quality = 70 }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt || ''}
      fill
      sizes={sizes}
      priority={priority}
      quality={quality}
      placeholder="blur"
      blurDataURL={BLUR}
      style={{ objectFit: 'cover' }}
    />
  );
}
