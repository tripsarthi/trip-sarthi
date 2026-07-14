import { getContent } from '@/lib/db';
import { Shell, PageBanner, OfferBand } from '@/components/SiteChrome';
import Img from '@/components/Img';

export const revalidate = 3600;
export const metadata = {
  title: 'About Us',
  description: 'Trip Sarthi — honest, fixed-fare cab service across 150+ Indian cities. Verified drivers, 24×7 support, 12,000+ happy riders.',
};

const FEATURE_ICONS = ['₹', '✓', '◈', '➤'];

export default async function About() {
  const c = await getContent();
  const t = c.t;
  const stats = [1, 2, 3, 4].map((i) => [t[`about_stat${i}_v`], t[`about_stat${i}_l`]]);

  return (
    <Shell c={c} active="/about">
      <div className="fade">
        <PageBanner kicker="Who we are" title="About Us" />

        <section className="wrap about-grid">
          <div>
            <div className="kick2">Our story</div>
            <h2 className="h-orange">{t.about_h2}</h2>
            <p className="p-body">{t.about_p1}</p>
            <p className="p-body">{t.about_p2}</p>
            <div className="about-stats">
              {stats.map(([v, l]) => (
                <div key={l} className="about-stat"><div className="v">{v}</div><div className="l">{l}</div></div>
              ))}
            </div>
          </div>
          <div>
            <div className="about-img" style={{ marginBottom: 18 }}>
              <Img src={c.settings.about_image} alt="Trip Sarthi on the road" sizes="(max-width: 1000px) 100vw, 50vw" />
            </div>
            <div className="icards">
              {c.features.map((f, i) => (
                <div key={f.id} className="icard">
                  <div className="ic">{FEATURE_ICONS[i % FEATURE_ICONS.length]}</div>
                  <div className="t">{f.title}</div>
                  <div className="d">{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="cream">
          <div className="wrap section2">
            <div className="center-head">
              <div className="kick2">Our promise</div>
              <h2 className="title2">{t.values_title}</h2>
            </div>
            <div className="why-grid">
              {c.values.map((v) => (
                <div key={v.id} className="why-card">
                  <span className="check">✓</span>
                  <div>
                    <div className="t">{v.title}</div>
                    <div className="d">{v.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <OfferBand c={c} />
      </div>
    </Shell>
  );
}
