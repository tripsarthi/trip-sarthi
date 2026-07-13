import Image from 'next/image';

// Content image that fills its (position:relative) container.
// Served through Next.js image optimization: AVIF/WebP, resized per device,
// lazy-loaded unless priority is set.
export default function Img({ src, alt, sizes, priority = false }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt || ''}
      fill
      sizes={sizes}
      priority={priority}
      style={{ objectFit: 'cover' }}
    />
  );
}
