import { getContent } from '@/lib/db';
import { Shell, PageBanner, OfferBand } from '@/components/SiteChrome';

export const revalidate = 3600;
export const metadata = {
  title: 'Price',
  description: 'Transparent per-kilometre cab rates and fixed one-way fares from Delhi to Agra, Jaipur, Manali and more. No surge, no hidden charges.',
};

export default async function Pricing() {
  const c = await getContent();
  const t = c.t;
  return (
    <Shell c={c} active="/pricing">
      <div className="fade">
        <PageBanner title={t.pricing_h1} sub={t.pricing_sub} />

        <section style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px' }}>
          <h2 className="pricing-h2">{t.pricing_rates_title}</h2>
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

          <h2 className="pricing-h2 later">{t.pricing_fares_title}</h2>
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

        <OfferBand c={c} />
      </div>
    </Shell>
  );
}
