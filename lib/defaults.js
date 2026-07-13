// Fallback content — used when Supabase tables don't exist yet or are empty.
// Mirrors scripts/seed.mjs so the site renders identically before/after seeding.

const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`;

export const DEFAULT_SETTINGS = {
  id: 1,
  phone_display: '+91 98765 43210',
  phone_e164: '+919876543210',
  email: 'priyanshusharma42v@gmail.com',
  address: 'Connaught Place, New Delhi 110001',
  whatsapp_message: "Hi Trip Sarthi, I'd like to book a cab.",
  hero_image: U('1449965408869-eaa3f722e40d', 1600),
  about_image: U('1469854523086-cc02fe5d8800', 1200),
};

export const DEFAULT_CARS = [
  { id: 1, name: 'Hatchback', model: 'WagonR / Celerio', seats: 4, bags: '2', rate: 11, tag: 'City rides', description: 'Nippy and economical — perfect for short city hops and solo travel.', image_url: U('1502877338535-766e1452684a'), sort: 1 },
  { id: 2, name: 'Sedan', model: 'Swift Dzire / Etios', seats: 4, bags: '2', rate: 13, tag: 'Most popular', description: 'Comfortable seating with boot space — the go-to for airport runs.', image_url: U('1550355291-bbee04a92027'), sort: 2 },
  { id: 3, name: 'SUV', model: 'Ertiga / Marazzo', seats: 6, bags: '3', rate: 16, tag: 'Family trips', description: 'Roomy 6-seater for families and small groups on the move.', image_url: U('1533473359331-0135ef1b58bf'), sort: 3 },
  { id: 4, name: 'Premium SUV', model: 'Innova Crysta', seats: 7, bags: '4', rate: 20, tag: 'Outstation', description: 'Premium ride quality built for long outstation journeys.', image_url: U('1519641471654-76ce0107ad1b'), sort: 4 },
  { id: 5, name: 'Luxury MPV', model: 'Innova Hycross', seats: 7, bags: '4', rate: 24, tag: 'Business', description: 'Top-tier comfort for executives and special occasions.', image_url: U('1549317661-bd32c8ce0db2'), sort: 5 },
  { id: 6, name: 'Tempo Traveller', model: '12 / 17 Seater', seats: 12, bags: '10+', rate: 28, tag: 'Group tours', description: 'Spacious coach for large groups, weddings and pilgrimages.', image_url: U('1570125909232-eb263c188f7e'), sort: 6 },
];

export const DEFAULT_ROUTES = [
  { id: 1, title: 'Delhi → Agra', meta: '233 km · ~4 hrs', price: 'from ₹2,499', image_url: U('1564507592333-c60657eea523'), sort: 1 },
  { id: 2, title: 'Delhi → Jaipur', meta: '281 km · ~5 hrs', price: 'from ₹2,999', image_url: U('1477587458883-47145ed94245'), sort: 2 },
  { id: 3, title: 'Delhi → Manali', meta: '537 km · ~12 hrs', price: 'from ₹6,499', image_url: U('1506905925346-21bda4d32df4'), sort: 3 },
  { id: 4, title: 'Delhi → Rishikesh', meta: '242 km · ~5 hrs', price: 'from ₹2,899', image_url: U('1544735716-392fe2489ffa'), sort: 4 },
  { id: 5, title: 'Delhi → Chandigarh', meta: '245 km · ~4.5 hrs', price: 'from ₹2,799', image_url: U('1470071459604-3b5ec3a7fe05'), sort: 5 },
  { id: 6, title: 'Delhi → Nainital', meta: '305 km · ~6.5 hrs', price: 'from ₹3,499', image_url: U('1506744038136-46273834b3fb'), sort: 6 },
];

export const DEFAULT_TESTIMONIALS = [
  { id: 1, name: 'Ananya Verma', meta: 'Gurugram', stars: 5, quote: 'Booked a Delhi–Jaipur round trip. Driver was punctual, car spotless, and the fare was exactly what they quoted. Will use again.', sort: 1 },
  { id: 2, name: 'Rohit Malhotra', meta: 'Noida', stars: 5, quote: 'Used them for airport pickups for our office guests. Reliable every single time — the billing is clean and hassle-free.', sort: 2 },
  { id: 3, name: 'Sneha Kapoor', meta: 'New Delhi', stars: 5, quote: 'Our family trip to Manali was smooth thanks to the Innova and a very courteous driver. Highly recommend Trip Sarthi.', sort: 3 },
];

export const DEFAULT_GALLERY = [
  { id: 1, caption: 'On the open road', image_url: U('1449965408869-eaa3f722e40d', 1400), span: 'feature', sort: 1 },
  { id: 2, caption: 'Fleet shot', image_url: U('1493238792000-8113da705763'), span: '', sort: 2 },
  { id: 3, caption: 'Taj Mahal, Agra', image_url: U('1564507592333-c60657eea523'), span: '', sort: 3 },
  { id: 4, caption: 'Destination photo', image_url: U('1506905925346-21bda4d32df4'), span: 'tall', sort: 4 },
  { id: 5, caption: 'Happy customers', image_url: U('1502920917128-1aa500764cbd'), span: '', sort: 5 },
  { id: 6, caption: 'City drive', image_url: U('1489824904134-891ab64532f1'), span: '', sort: 6 },
  { id: 7, caption: 'Hill station', image_url: U('1470071459604-3b5ec3a7fe05'), span: '', sort: 7 },
  { id: 8, caption: 'Wedding fleet', image_url: U('1549317661-bd32c8ce0db2'), span: '', sort: 8 },
  { id: 9, caption: 'Airport pickup', image_url: U('1550355291-bbee04a92027'), span: '', sort: 9 },
  { id: 10, caption: 'Road trip', image_url: U('1469854523086-cc02fe5d8800'), span: '', sort: 10 },
];

// Static content (edit in code — rarely changes)
export const SERVICES = [
  { num: '01', title: 'Airport Transfers', desc: 'On-time pickups and drops with live flight tracking, day or night.' },
  { num: '02', title: 'Outstation Trips', desc: 'One-way and round trips to any city in India at fixed fares.' },
  { num: '03', title: 'Local Rentals', desc: 'Hourly packages (8h / 80km) for meetings, shopping and errands.' },
  { num: '04', title: 'Corporate Travel', desc: 'Managed employee and guest transport with monthly billing.' },
];

export const FEATURES = [
  { title: 'Fixed fares', sub: 'No surge, ever' },
  { title: 'No hidden charges', sub: 'What you see, you pay' },
  { title: 'Verified drivers', sub: 'Trained & background-checked' },
  { title: '24×7 support', sub: 'Always a call away' },
];

export const STEPS = [
  { num: '01', title: 'Pick your ride', desc: 'Choose a car and tell us your route and travel date.' },
  { num: '02', title: 'Message us', desc: 'Send the details on WhatsApp or give us a call.' },
  { num: '03', title: 'Get a quote', desc: 'Receive a fixed, all-inclusive fare within minutes.' },
  { num: '04', title: 'Enjoy the ride', desc: 'Your verified driver arrives on time — you relax.' },
];

export const VALUES = [
  { num: '01', title: 'Honest pricing', desc: 'The fare you’re quoted is the fare you pay. No surge, no last-minute add-ons.' },
  { num: '02', title: 'Safety first', desc: 'Every driver is verified and trained; every car is sanitised and well-maintained.' },
  { num: '03', title: 'Always there', desc: 'On-call 24×7 across 150+ cities, so help is never more than a message away.' },
];
