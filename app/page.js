import { getContent } from '@/lib/db';
import { Shell, OfferBand, CallIcon } from '@/components/SiteChrome';
import QuoteForm from '@/components/QuoteForm';
import EstimateForm from '@/components/EstimateForm';
import CarCard from '@/components/CarCard';
import Img from '@/components/Img';

// Pages are statically cached; the admin API purges the cache on every save,
// so edits still go live instantly.
export const revalidate = 3600;

const FEATURE_ICONS = ['₹', '✓', '◈', '➤'];

export default async function Home() {
  const c = await getContent();
  const t = c.t;

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

  // Highlight the last two words of the hero headline in gold
  const h1Words = t.home_h1.split(' ');
  const h1Main = h1Words.slice(0, -2).join(' ');
  const h1Accent = h1Words.slice(-2).join(' ');

  return (
    <Shell c={c} active="/">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fade">

        {/* Hero — dark with gold, booking card */}
        <section className="hero3">
          <div className="hero3-bg"><Img src={c.settings.hero_image} alt="" priority sizes="100vw" /></div>
          <div className="hero3-fade" />
          <div className="wrap hero3-grid">
            <div>
              <div className="kicker">24×7 Cab &amp; Taxi Service</div>
              <h1>{h1Main} <span>{h1Accent}</span></h1>
              <p className="sub">{t.home_sub}</p>
              <a href={c.tel} className="phone-pill">
                <span className="ic"><CallIcon /></span>{c.phone}
              </a>
              <div className="hero3-ctas">
                <a href={c.wa} target="_blank" rel="noopener" className="btn">{t.home_cta}</a>
                <a href={c.tel} className="btn ghost">Call Us</a>
              </div>
              <div className="stat-chips">
                <span className="chip"><b>4.9★</b> Avg. rating</span>
                <span className="chip"><b>12k+</b> Trips done</span>
                <span className="chip"><b>150+</b> Cities</span>
              </div>
            </div>
            <QuoteForm title={t.quoteform_title} />
          </div>
        </section>

        {/* Intro + feature cards */}
        <section className="wrap section2">
          <div className="intro-grid">
            <div>
              <div className="kick2">About the service</div>
              <h2 className="h-orange">{t.intro_h2}</h2>
              <p className="p-body">{t.intro_p1}</p>
              <p className="p-body">{t.intro_p2}</p>
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

        <OfferBand c={c} />

        {/* What we offer */}
        <section className="cream">
          <div className="wrap section2">
            <div className="center-head">
              <div className="kick2">{t.services_kicker}</div>
              <h2 className="title2">{t.services_title}</h2>
            </div>
            <div className="svc-grid">
              {c.services.map((s) => (
                <div key={s.id} className="svc">
                  <div className="ic">{s.num}</div>
                  <div className="t">{s.title}</div>
                  <div className="d">{s.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to book — dark band with numbered cards */}
        <section className="dark-band">
          <div className="wrap section2">
            <div className="center-head" style={{ marginBottom: 18 }}>
              <div className="kick2" style={{ color: 'var(--brand)' }}>Simple &amp; fast</div>
              <h2 className="title2 on-dark">{t.how_title}</h2>
            </div>
            <p className="lead">{t.how_intro}</p>
            <div className="step-grid">
              {c.steps.map((st) => (
                <div key={st.id} className="step-card">
                  <div className="num">{st.num}</div>
                  <div className="t">{st.title}</div>
                  <div className="d">{st.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why us — check cards */}
        <section className="wrap section2">
          <div className="center-head" style={{ marginBottom: 18 }}>
            <div className="kick2">Our promise</div>
            <h2 className="title2">{t.why_title}</h2>
          </div>
          <p className="why-lead">{t.why_intro}</p>
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
        </section>

        {/* Car classes and rates */}
        <section className="cream">
          <div className="wrap section2">
            <div className="center-head">
              <div className="kick2">{t.cars_kicker}</div>
              <h2 className="title2">{t.cars_title}</h2>
            </div>
            <div className="car-grid">
              {c.cars.map((car) => <CarCard key={car.id} car={car} c={c} />)}
            </div>
          </div>
        </section>

        {/* Popular places — pill chips */}
        <section className="wrap section2">
          <div className="center-head">
            <div className="kick2">Outstation favourites</div>
            <h2 className="title2">{t.places_title} Delhi</h2>
          </div>
          <div className="place-pills">
            {c.routes.map((r) => (
              <a key={r.id} href={c.wa} target="_blank" rel="noopener" className="place-pill">
                {r.title.replace('→', 'to')}
                <span className="price">{r.price}</span>
                <span className="arrow">→</span>
              </a>
            ))}
          </div>
        </section>

        {/* Get estimate — dark rounded card */}
        <section className="cream">
          <div className="wrap" style={{ paddingTop: 64, paddingBottom: 64 }}>
            <div className="est-card">
              <div>
                <h2>{t.estimate_title.split(' ').slice(0, -1).join(' ')} <span>{t.estimate_title.split(' ').slice(-1)}</span></h2>
                <div className="estimate-car">
                  <Img src={c.cars[1]?.image_url} alt="Cab" sizes="300px" />
                </div>
              </div>
              <EstimateForm carNames={c.cars.map((car) => car.name)} />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="wrap section2">
          <div className="center-head">
            <div className="kick2">{t.reviews_kicker}</div>
            <h2 className="title2">{t.reviews_title}</h2>
          </div>
          <div className="testi-grid">
            {c.testimonials.map((tm) => (
              <div key={tm.id} className="testi2">
                <div className="stars">{'★'.repeat(tm.stars)}</div>
                <p>{tm.quote}</p>
                <div className="who">
                  <div className="avatar">{tm.name[0]}</div>
                  <div><div className="n">{tm.name}</div><div className="m">{tm.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <OfferBand c={c} />

      </div>
    </Shell>
  );
}
