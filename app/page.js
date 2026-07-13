import Link from 'next/link';
import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import Img from '@/components/Img';

// Pages are statically cached; the admin API purges the cache on every save,
// so edits still go live instantly.
export const revalidate = 3600;

// Renders "4.9★" with the star in brand yellow, like the design.
function Stat({ v }) {
  const star = v.endsWith('★');
  return star ? <>{v.slice(0, -1)}<span>★</span></> : v;
}

export default async function Home() {
  const c = await getContent();
  const t = c.t;
  const carsTop = c.cars.slice(1, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    name: 'Trip Sarthi',
    description: t.home_sub,
    telephone: c.settings.phone_e164,
    email: c.email,
    address: { '@type': 'PostalAddress', streetAddress: c.address, addressCountry: 'IN' },
    areaServed: 'India',
    url: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  };

  return (
    <Shell c={c} active="/">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fade">

        {/* Hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="hero-badge"><span className="dot" />{t.home_badge}</div>
              <h1 style={{ whiteSpace: 'pre-line' }}>{t.home_h1} <span>{t.home_h1_accent}</span></h1>
              <p className="hero-sub">{t.home_sub}</p>
              <div className="hero-ctas">
                <a href={c.wa} target="_blank" rel="noopener" className="btn-dark">{t.home_cta_wa}</a>
                <a href={c.tel} className="btn-outline">Call {c.phone}</a>
              </div>
              <div className="hero-stats">
                <div><div className="v"><Stat v={t.home_stat1_v} /></div><div className="l">{t.home_stat1_l}</div></div>
                <div className="div" />
                <div><div className="v"><Stat v={t.home_stat2_v} /></div><div className="l">{t.home_stat2_l}</div></div>
                <div className="div" />
                <div><div className="v"><Stat v={t.home_stat3_v} /></div><div className="l">{t.home_stat3_l}</div></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-img">
                <Img src={c.settings.hero_image} alt="Trip Sarthi cab on the road" priority
                  sizes="(max-width: 1000px) 100vw, 48vw" />
              </div>
              <div className="hero-float">
                <div className="icon">₹</div>
                <div><div className="t">{t.home_float_t}</div><div className="s">{t.home_float_s}</div></div>
              </div>
            </div>
          </div>

          {/* Quote bar */}
          <div className="quote-wrap">
            <div className="quote-bar">
              <div><div className="lbl">Pickup</div><div className="field">{t.quote_pickup}</div></div>
              <div><div className="lbl">Drop</div><div className="field ph">{t.quote_drop}</div></div>
              <div><div className="lbl">Trip type</div><div className="field">{t.quote_trip}</div></div>
              <a href={c.wa} target="_blank" rel="noopener" className="btn-yellow">{t.quote_cta}</a>
            </div>
            <div className="quote-note">{t.quote_note}</div>
          </div>
        </section>

        {/* Trust features */}
        <section className="features">
          <div className="wrap features-grid">
            {c.features.map((f) => (
              <div key={f.id} className="feature">
                <span className="check">✓</span>
                <div><div className="t">{f.title}</div><div className="s">{f.sub}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="wrap section">
          <div className="section-head">
            <div className="kicker">{t.services_kicker}</div>
            <h2 className="h2">{t.services_title}</h2>
          </div>
          <div className="services-grid">
            {c.services.map((s) => (
              <div key={s.id} className="service-card">
                <div className="num">{s.num}</div>
                <div className="t">{s.title}</div>
                <div className="d">{s.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet preview */}
        <section className="band">
          <div className="wrap section">
            <div className="fleet-head">
              <div>
                <div className="kicker">{t.fleet_kicker}</div>
                <h2 className="h2">{t.fleet_title}</h2>
              </div>
              <Link href="/fleet" className="link-under">{t.fleet_link}</Link>
            </div>
            <div className="cards-3">
              {carsTop.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-img">
                    <Img src={car.image_url} alt={`${car.name} — ${car.model}`}
                      sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                    <span className="car-tag">{car.tag}</span>
                  </div>
                  <div className="car-body">
                    <div className="car-row">
                      <div className="car-name">{car.name}</div>
                      <div className="car-rate">₹{car.rate}/km</div>
                    </div>
                    <div className="car-model">{car.model}</div>
                    <div className="car-specs">{car.seats} seats · {car.bags} bags · AC</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular routes */}
        <section className="wrap section">
          <div className="section-head">
            <div className="kicker">{t.routes_kicker}</div>
            <h2 className="h2">{t.routes_title}</h2>
          </div>
          <div className="cards-3">
            {c.routes.map((r) => (
              <a key={r.id} href={c.wa} target="_blank" rel="noopener" className="route-card">
                <Img src={r.image_url} alt={r.title}
                  sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                <div className="shade" />
                <div className="info">
                  <div className="t">{r.title}</div>
                  <div className="m">{r.meta}</div>
                  <div className="p">{r.price}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="dark-band">
          <div className="wrap section">
            <div className="section-head">
              <div className="kicker on-dark">{t.how_kicker}</div>
              <h2 className="h2">{t.how_title}</h2>
            </div>
            <div className="grid-4">
              {c.steps.map((st) => (
                <div key={st.id} className="dark-card">
                  <div className="num">{st.num}</div>
                  <div className="t">{st.title}</div>
                  <div className="d">{st.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offer banner */}
        <section className="wrap" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="offer">
            <div>
              <div className="kick">{t.offer_kicker}</div>
              <div className="head">{t.offer_title}</div>
              <div className="sub">{t.offer_sub}</div>
            </div>
            <a href={c.wa} target="_blank" rel="noopener" className="btn-dark">{t.offer_cta}</a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="band" style={{ borderBottom: 'none' }}>
          <div className="wrap section">
            <div className="section-head">
              <div className="kicker">{t.reviews_kicker}</div>
              <h2 className="h2">{t.reviews_title}</h2>
            </div>
            <div className="cards-3">
              {c.testimonials.map((tm) => (
                <div key={tm.id} className="testi-card">
                  <div className="stars">{'★'.repeat(tm.stars)}</div>
                  <p>{tm.quote}</p>
                  <div className="testi-foot">
                    <div className="avatar">{tm.name[0]}</div>
                    <div><div className="n">{tm.name}</div><div className="m">{tm.meta}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Shell>
  );
}
