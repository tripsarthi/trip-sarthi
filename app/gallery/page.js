import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';

export const revalidate = 0;
export const metadata = { title: 'Gallery — Trip Sarthi' };

export default async function Gallery() {
  const c = await getContent();
  return (
    <Shell c={c} active="/gallery">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">Gallery</div>
            <h1>Moments from the road</h1>
            <p>Trips, fleet and destinations — a glimpse of journeys with Trip Sarthi.</p>
          </div>
        </section>

        <section className="wrap" style={{ paddingTop: 64, paddingBottom: 64 }}>
          <div className="gallery-grid">
            {c.gallery.map((g) => (
              <div key={g.id} className={`gallery-item ${g.span || ''}`}>
                <img src={g.image_url} alt={g.caption} />
                <div className="cap">{g.caption}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
