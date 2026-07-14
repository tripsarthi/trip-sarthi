import Img from '@/components/Img';

// Reference-style car card: photo, name, rate rows, angled Book/Call buttons.
export default function CarCard({ car, c }) {
  return (
    <div className="car2">
      <div className="car2-img">
        <Img src={car.image_url} alt={`${car.name} — ${car.model}`}
          sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 33vw" />
        {car.tag && <span className="car2-tag">{car.tag}</span>}
      </div>
      <div className="car2-body">
        <h3>{car.name}</h3>
        <div className="row">Price: <b>₹{car.rate} / KM</b></div>
        <div className="row">{c.t.car_line1}</div>
        <div className="row">{c.t.car_line2}</div>
        <div className="row">{car.seats} Seats · {car.bags} Bags · AC</div>
        <div className="note">{c.t.car_note}</div>
      </div>
      <div className="car2-cta">
        <a href={c.wa} target="_blank" rel="noopener" className="book">Book Now</a>
        <a href={c.tel} className="call">Call Now</a>
      </div>
    </div>
  );
}
