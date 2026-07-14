import { getContent } from '@/lib/db';
import { Shell, PageBanner, OfferBand } from '@/components/SiteChrome';
import CarCard from '@/components/CarCard';

export const revalidate = 3600;
export const metadata = {
  title: 'Car',
  description: 'Hatchbacks, sedans, SUVs, Innova Crysta and Tempo Travellers with verified drivers. Clean, AC cars for every trip at fixed per-km rates.',
};

export default async function Fleet() {
  const c = await getContent();
  const t = c.t;
  return (
    <Shell c={c} active="/fleet">
      <div className="fade">
        <PageBanner kicker="Our fleet" title={t.fleetpage_h1} sub={t.fleetpage_sub} />

        <section className="wrap section2">
          <div className="center-head">
            <div className="kick2">{t.cars_kicker}</div>
            <h2 className="title2">{t.cars_title}</h2>
          </div>
          <div className="car-grid">
            {c.cars.map((car) => <CarCard key={car.id} car={car} c={c} />)}
          </div>
        </section>

        <OfferBand c={c} />
      </div>
    </Shell>
  );
}
