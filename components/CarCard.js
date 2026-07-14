import Img from '@/components/Img';

// Trip Sarthi car card: rounded, floating price pill, dot detail rows,
// pill Book/Call buttons.
export default function CarCard({ car, c }) {
  return (
    <div className="car3">
      <div className="car3-img">
        <Img src={car.image_url} alt={`${car.name} — ${car.model}`}
          sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
        {car.tag && <span className="car3-tag">{car.tag}</span>}
        <span className="car3-price">₹{car.rate}/KM</span>
      </div>
      <div className="car3-body">
        <h3>{car.name}</h3>
        <div className="model">{car.model}</div>
        <div className="row">{car.seats} Seats · {car.bags} Bags · AC</div>
        <div className="row">{c.t.car_line1}</div>
        <div className="row">{c.t.car_line2}</div>
        <div className="note">{c.t.car_note}</div>
      </div>
      <div className="car3-cta">
        <a href={c.wa} target="_blank" rel="noopener" className="book">Book Now</a>
        <a href={c.tel} className="call">Call Now</a>
      </div>
    </div>
  );
}
