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

  // "Delhi → Agra" → "Delhi to Agra Taxi"
  const placeLink = (r) => `${r.title.replace('→', 'to')} Taxi`;
  const placeCols = [c.routes.slice(0, 2), c.routes.slice(2, 4), c.routes.slice(4, 6)];

  return (
    <Shell c={c} active="/">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="fade">

        {/* Hero with booking form */}
        <section className="hero2">
          <div className="hero2-bg"><Img src={c.settings.hero_image} alt="" priority sizes="100vw" /></div>
          <div className="hero2-shade" />
          <div className="wrap hero2-grid">
            <div>
              <h1>{t.home_h1}</h1>
              <p className="sub">{t.home_sub}</p>
              <div className="hero2-phone">
                <span className="ic"><CallIcon /></span>{c.phone}
              </div>
              <div className="hero2-ctas">
                <a href={c.tel} className="btn">{t.home_cta}</a>
              </div>
            </div>
            <QuoteForm title={t.quoteform_title} />
          </div>
        </section>

        {/* Intro + feature cards */}
        <section className="wrap section2">
          <div className="intro-grid">
            <div>
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
        <section className="wrap section2">
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
        </section>

        {/* How to book (long-form) */}
        <section className="longform">
          <div className="longform-inner">
            <h2>{t.how_title}</h2>
            <p>{t.how_intro}</p>
            <ol>
              {c.steps.map((st) => (
                <li key={st.id}><b>{st.title}:</b> {st.description}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why us (long-form) */}
        <section className="longform white">
          <div className="longform-inner">
            <h2>{t.why_title}</h2>
            <p>{t.why_intro}</p>
            <ul>
              {c.values.map((v) => (
                <li key={v.id}><b>{v.title}:</b> {v.description}</li>
              ))}
            </ul>
          </div>
        </section>

        <OfferBand c={c} />

        {/* Car classes and rates */}
        <section className="wrap section2">
          <div className="center-head">
            <div className="kick2">{t.cars_kicker}</div>
            <h2 className="title2">{t.cars_title}</h2>
          </div>
          <div className="car-grid">
            {c.cars.map((car) => <CarCard key={car.id} car={car} c={c} />)}
          </div>
        </section>

        {/* Popular places */}
        <section className="longform">
          <div className="wrap" style={{ paddingTop: 56, paddingBottom: 56 }}>
            <div className="places-grid">
              {placeCols.map((col, i) => (
                <div key={i} className="places">
                  <h3>{t.places_title}</h3>
                  {col.map((r) => (
                    <a key={r.id} href={c.wa} target="_blank" rel="noopener">
                      <span className="pin">➤</span>{placeLink(r)}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get estimate band */}
        <section className="estimate">
          <div className="wrap estimate-inner">
            <div>
              <h2>{t.estimate_title}</h2>
              <div className="estimate-car">
                <Img src={c.cars[1]?.image_url} alt="Cab" sizes="300px" />
              </div>
            </div>
            <EstimateForm carNames={c.cars.map((car) => car.name)} />
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

      </div>
    </Shell>
  );
}
