import Link from 'next/link';
import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import { SERVICES, FEATURES, STEPS } from '@/lib/defaults';

export const revalidate = 0;

export default async function Home() {
  const c = await getContent();
  const carsTop = c.cars.slice(1, 4);

  return (
    <Shell c={c} active="/">
      <div className="fade">

        {/* Hero */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <div className="hero-badge"><span className="dot" />Trusted by 12,000+ travellers</div>
              <h1>Reliable cabs for<br />every journey<br />across <span>India.</span></h1>
              <p className="hero-sub">Airport transfers, outstation trips and local rentals — booked in one message. Fixed fares, verified drivers, no surprises.</p>
              <div className="hero-ctas">
                <a href={c.wa} target="_blank" rel="noopener" className="btn-dark">Book on WhatsApp →</a>
                <a href={c.tel} className="btn-outline">Call {c.phone}</a>
              </div>
              <div className="hero-stats">
                <div><div className="v">4.9<span>★</span></div><div className="l">Avg. rating</div></div>
                <div className="div" />
                <div><div className="v">12k+</div><div className="l">Trips completed</div></div>
                <div className="div" />
                <div><div className="v">24×7</div><div className="l">Support</div></div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-img"><img src={c.settings.hero_image} alt="Trip Sarthi cab on the road" /></div>
              <div className="hero-float">
                <div className="icon">₹</div>
                <div><div className="t">Fixed, upfront fares</div><div className="s">Know the price before you ride</div></div>
              </div>
            </div>
          </div>

          {/* Quote bar */}
          <div className="quote-wrap">
            <div className="quote-bar">
              <div><div className="lbl">Pickup</div><div className="field">New Delhi</div></div>
              <div><div className="lbl">Drop</div><div className="field ph">Where to?</div></div>
              <div><div className="lbl">Trip type</div><div className="field">Outstation · One-way</div></div>
              <a href={c.wa} target="_blank" rel="noopener" className="btn-yellow">Check fare</a>
            </div>
            <div className="quote-note">No app, no login — just message us your route and we&apos;ll send a fixed quote.</div>
          </div>
        </section>

        {/* Trust features */}
        <section className="features">
          <div className="wrap features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature">
                <span className="check">✓</span>
                <div><div className="t">{f.title}</div><div className="s">{f.sub}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="wrap section">
          <div className="section-head">
            <div className="kicker">What we offer</div>
            <h2 className="h2">Every kind of ride, sorted</h2>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <div key={s.num} className="service-card">
                <div className="num">{s.num}</div>
                <div className="t">{s.title}</div>
                <div className="d">{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Fleet preview */}
        <section className="band">
          <div className="wrap section">
            <div className="fleet-head">
              <div>
                <div className="kicker">Our fleet</div>
                <h2 className="h2">Pick the ride that fits</h2>
              </div>
              <Link href="/fleet" className="link-under">View all cars →</Link>
            </div>
            <div className="cards-3">
              {carsTop.map((car) => (
                <div key={car.id} className="car-card">
                  <div className="car-img">
                    <img src={car.image_url} alt={car.name} />
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
            <div className="kicker">Popular routes</div>
            <h2 className="h2">Loved journeys from Delhi</h2>
          </div>
          <div className="cards-3">
            {c.routes.map((r) => (
              <a key={r.id} href={c.wa} target="_blank" rel="noopener" className="route-card">
                <img src={r.image_url} alt={r.title} />
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
              <div className="kicker on-dark">How it works</div>
              <h2 className="h2">Booked in four easy steps</h2>
            </div>
            <div className="grid-4">
              {STEPS.map((st) => (
                <div key={st.num} className="dark-card">
                  <div className="num">{st.num}</div>
                  <div className="t">{st.title}</div>
                  <div className="d">{st.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Offer banner */}
        <section className="wrap" style={{ paddingTop: 80, paddingBottom: 80 }}>
          <div className="offer">
            <div>
              <div className="kick">Limited period offer</div>
              <div className="head">Up to 30% off on round trips</div>
              <div className="sub">Book a return outstation journey this month and save on your total fare.</div>
            </div>
            <a href={c.wa} target="_blank" rel="noopener" className="btn-dark">Claim offer →</a>
          </div>
        </section>

        {/* Testimonials */}
        <section className="band" style={{ borderBottom: 'none' }}>
          <div className="wrap section">
            <div className="section-head">
              <div className="kicker">Reviews</div>
              <h2 className="h2">What riders say</h2>
            </div>
            <div className="cards-3">
              {c.testimonials.map((t) => (
                <div key={t.id} className="testi-card">
                  <div className="stars">{'★'.repeat(t.stars)}</div>
                  <p>{t.quote}</p>
                  <div className="testi-foot">
                    <div className="avatar">{t.name[0]}</div>
                    <div><div className="n">{t.name}</div><div className="m">{t.meta}</div></div>
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
