import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import Img from '@/components/Img';

export const revalidate = 3600;
export const metadata = {
  title: 'About',
  description: 'Trip Sarthi — honest, fixed-fare cab service across 150+ Indian cities. Verified drivers, 24×7 support, 12,000+ happy riders.',
};

export default async function About() {
  const c = await getContent();
  const t = c.t;
  const stats = [1, 2, 3, 4].map((i) => [t[`about_stat${i}_v`], t[`about_stat${i}_l`]]);

  return (
    <Shell c={c} active="/about">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">{t.about_kicker}</div>
            <h1 className="no-sub" style={{ maxWidth: 820 }}>{t.about_h1}</h1>
          </div>
        </section>

        <section className="wrap about-grid">
          <div className="about-img">
            <Img src={c.settings.about_image} alt="Trip Sarthi on the road" sizes="(max-width: 1000px) 100vw, 50vw" />
          </div>
          <div>
            <h2>{t.about_h2}</h2>
            <p>{t.about_p1}</p>
            <p>{t.about_p2}</p>
            <div className="about-stats">
              {stats.map(([v, l]) => (
                <div key={l} className="about-stat"><div className="v">{v}</div><div className="l">{l}</div></div>
              ))}
            </div>
          </div>
        </section>

        <section className="dark-band">
          <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="h2" style={{ fontSize: 38, textAlign: 'center', marginBottom: 44 }}>{t.values_title}</h2>
            <div className="grid-3">
              {c.values.map((v) => (
                <div key={v.id} className="dark-card">
                  <div className="num-sm">{v.num}</div>
                  <div className="t-lg">{v.title}</div>
                  <div className="d" style={{ fontSize: '14.5px' }}>{v.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
