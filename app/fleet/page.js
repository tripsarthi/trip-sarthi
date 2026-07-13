import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import Img from '@/components/Img';

export const revalidate = 3600;
export const metadata = {
  title: 'Our Fleet',
  description: 'Hatchbacks, sedans, SUVs, Innova Crysta and Tempo Travellers with verified drivers. Clean, AC cars for every trip at fixed per-km rates.',
};

export default async function Fleet() {
  const c = await getContent();
  return (
    <Shell c={c} active="/fleet">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">{c.t.fleetpage_kicker}</div>
            <h1>{c.t.fleetpage_h1}</h1>
            <p>{c.t.fleetpage_sub}</p>
          </div>
        </section>

        <section className="wrap" style={{ paddingTop: 72, paddingBottom: 72 }}>
          <div className="cards-3">
            {c.cars.map((car) => (
              <div key={car.id} className="car-card">
                <div className="car-img tall">
                  <Img src={car.image_url} alt={`${car.name} — ${car.model}`}
                    sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
                  <span className="car-tag">{car.tag}</span>
                </div>
                <div className="car-body" style={{ padding: 24 }}>
                  <div className="car-row">
                    <div className="car-name" style={{ fontSize: 22 }}>{car.name}</div>
                    <div className="car-rate" style={{ fontSize: 18 }}>₹{car.rate}/km</div>
                  </div>
                  <div className="car-model" style={{ marginBottom: 12 }}>{car.model}</div>
                  <div style={{ font: '600 13.5px var(--manrope)', color: 'var(--mut)' }}>{car.seats} seats · {car.bags} bags · AC</div>
                  <p className="car-desc">{car.description}</p>
                  <div className="car-actions">
                    <a href={c.wa} target="_blank" rel="noopener" className="a-book">Book</a>
                    <a href={c.tel} className="a-call">Call</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
