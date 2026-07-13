import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import { VALUES } from '@/lib/defaults';

export const revalidate = 0;
export const metadata = { title: 'About — Trip Sarthi' };

export default async function About() {
  const c = await getContent();
  return (
    <Shell c={c} active="/about">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">About Trip Sarthi</div>
            <h1 className="no-sub" style={{ maxWidth: 820 }}>Your trusted co-pilot for every mile, across India.</h1>
          </div>
        </section>

        <section className="wrap about-grid">
          <div className="about-img"><img src={c.settings.about_image} alt="Trip Sarthi on the road" /></div>
          <div>
            <h2>Travel, made simple and honest</h2>
            <p>Trip Sarthi began with a simple idea — booking a cab should be as easy as sending a message, and the price you&apos;re quoted should be the price you pay. No apps, no surge, no fine print.</p>
            <p>From quick airport runs to multi-day outstation tours, our fleet and verified drivers get you there in comfort. We&apos;re on the road 24×7 so you always have a &quot;sarthi&quot; to count on.</p>
            <div className="about-stats">
              <div className="about-stat"><div className="v">12k+</div><div className="l">Happy riders</div></div>
              <div className="about-stat"><div className="v">150+</div><div className="l">Cities covered</div></div>
              <div className="about-stat"><div className="v">50+</div><div className="l">Cars in fleet</div></div>
              <div className="about-stat"><div className="v">4.9★</div><div className="l">Avg. rating</div></div>
            </div>
          </div>
        </section>

        <section className="dark-band">
          <div className="wrap" style={{ paddingTop: 80, paddingBottom: 80 }}>
            <h2 className="h2" style={{ fontSize: 38, textAlign: 'center', marginBottom: 44 }}>What we stand for</h2>
            <div className="grid-3">
              {VALUES.map((v) => (
                <div key={v.num} className="dark-card">
                  <div className="num-sm">{v.num}</div>
                  <div className="t-lg">{v.title}</div>
                  <div className="d" style={{ fontSize: '14.5px' }}>{v.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Shell>
  );
}
