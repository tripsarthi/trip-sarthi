import { getContent } from '@/lib/db';
import { Shell, OfferBand } from '@/components/SiteChrome';
import Img from '@/components/Img';
import { waMsg } from '@/lib/waMessages';

export const revalidate = 3600;
export const metadata = {
  title: 'Himachal Trips',
  description: 'Himachal by cab — Manali, Shimla, Kasol, Dharamshala, Dalhousie and Spiti with hill-trained drivers at one fixed fare. Book your mountain trip with Trip Sarthi.',
};

const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

// Curated Himachal circuits (photos are temp Unsplash placeholders).
const DESTINATIONS = [
  { name: 'Manali', meta: '537 km · snow, cafés & adventure sports', price: 'from ₹6,499', img: U('1483728642387-6c3bdd6c93e5') },
  { name: 'Shimla', meta: '343 km · ridge walks & colonial charm', price: 'from ₹4,999', img: U('1454496522488-7a8e488e8606') },
  { name: 'Kasol & Manikaran', meta: '518 km · Parvati valley & hot springs', price: 'from ₹5,999', img: U('1441974231531-c6227db76b6e') },
  { name: 'Dharamshala & McLeodganj', meta: '475 km · monasteries & Dhauladhar views', price: 'from ₹5,499', img: U('1477346611705-65d1883cee1e') },
  { name: 'Dalhousie & Khajjiar', meta: '560 km · meadows, the “Mini Switzerland”', price: 'from ₹6,999', img: U('1447752875215-b2761acb3c5d') },
  { name: 'Spiti Valley', meta: '730 km · high passes & cold desert', price: 'from ₹12,999', img: U('1508672019048-805c876b67e2') },
];

export default async function Himachal() {
  const c = await getContent();
  const t = c.t;

  return (
    <Shell c={c} active="/himachal">
      <div className="fade">

        {/* Full-bleed mountain hero */}
        <section className="dest-hero">
          <div className="dest-hero-bg">
            <Img src={U('1464822759023-fed622ff2c3b', 1800)} alt="Himalayan ridgelines in Himachal" priority sizes="100vw" />
          </div>
          <div className="dest-hero-shade" />
          <div className="wrap dest-hero-content">
            <div className="kicker">Trip Sarthi · Mountain Special</div>
            <h1>{t.himachal_h1}</h1>
            <p>{t.himachal_sub}</p>
            <div className="dest-hero-ctas">
              <a href={c.waFor(waMsg.himachalPlan)} target="_blank" rel="noopener" className="btn">Plan my Himachal trip</a>
              <a href={c.tel} className="btn ghost">Call {c.phone}</a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="wrap section2" style={{ maxWidth: 880 }}>
          <div className="kick2">The mountains are calling</div>
          <h2 className="h-orange">{t.himachal_intro_h2}</h2>
          <p className="p-body">{t.himachal_p1}</p>
          <p className="p-body">{t.himachal_p2}</p>
        </section>

        {/* Destination cards */}
        <section className="cream">
          <div className="wrap section2">
            <div className="center-head">
              <div className="kick2">Pick your hill station</div>
              <h2 className="title2">{t.himachal_dest_title}</h2>
            </div>
            <div className="dest-grid">
              {DESTINATIONS.map((d) => (
                <a key={d.name} href={c.waFor(waMsg.himachalDest(d))} target="_blank" rel="noopener" className="dest-card">
                  <Img src={d.img} alt={d.name} sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                  <div className="shade" />
                  <div className="info">
                    <div className="n">{d.name}</div>
                    <div className="m">{d.meta}</div>
                    <span className="price">{d.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Photo mosaic (managed from admin → Himachal Photos) */}
        <section className="wrap section2">
          <div className="center-head">
            <div className="kick2">Straight from our trips</div>
            <h2 className="title2">{t.himachal_gallery_title}</h2>
          </div>
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
