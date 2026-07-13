import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';

export const revalidate = 0;
export const metadata = { title: 'Pricing — Trip Sarthi' };

export default async function Pricing() {
  const c = await getContent();
  return (
    <Shell c={c} active="/pricing">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">Pricing</div>
            <h1>Transparent fares, always</h1>
            <p>Sample rates below. Tolls, parking and state taxes may apply on outstation trips — all confirmed upfront in your quote.</p>
          </div>
        </section>

        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '72px 24px' }}>
          <h2 className="pricing-h2">Per-kilometre rates</h2>
          <div className="rate-table">
            <div className="rate-head">
              <div>Car type</div><div>Model</div><div>Seats</div><div>Rate/km</div><div />
            </div>
            {c.cars.map((car) => (
              <div key={car.id} className="rate-row">
                <div className="c-name">{car.name}</div>
                <div className="c-model">{car.model}</div>
                <div className="c-seats">{car.seats} seats</div>
                <div className="c-rate">₹{car.rate}/km</div>
                <div className="c-cta"><a href={c.wa} target="_blank" rel="noopener">Book</a></div>
              </div>
            ))}
          </div>

          <h2 className="pricing-h2 later">Popular outstation fares (one-way)</h2>
          <div className="cards-3" style={{ gap: 20 }}>
            {c.routes.map((r) => (
              <div key={r.id} className="fare-card">
                <div className="t">{r.title}</div>
                <div className="m">{r.meta}</div>
                <div className="foot">
                  <span className="price">{r.price}</span>
                  <a href={c.wa} target="_blank" rel="noopener" className="book">Book →</a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
