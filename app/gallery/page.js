import { getContent } from '@/lib/db';
import { Shell, PageBanner, OfferBand } from '@/components/SiteChrome';
import Img from '@/components/Img';

export const revalidate = 3600;
export const metadata = {
  title: 'Gallery',
  description: 'Trips, fleet and destinations — moments from the road with Trip Sarthi.',
};

export default async function Gallery() {
  const c = await getContent();
  const t = c.t;
  return (
    <Shell c={c} active="/gallery">
      <div className="fade">
        <PageBanner title={t.gallerypage_h1} sub={t.gallerypage_sub} />

        <section className="wrap" style={{ paddingTop: 56, paddingBottom: 56 }}>
          <div className="gallery-grid">
            {c.gallery.map((g) => (
              <div key={g.id} className={`gallery-item ${g.span || ''}`}>
                <Img src={g.image_url} alt={g.caption}
                  sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                <div className="cap">{g.caption}</div>
              </div>
            ))}
          </div>
        </section>

        <OfferBand c={c} />
      </div>
    </Shell>
  );
}
