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

export const DEFAULT_SERVICES = [
  { id: 1, num: '01', title: 'Airport Transfers', description: 'On-time pickups and drops with live flight tracking, day or night.', sort: 1 },
  { id: 2, num: '02', title: 'Outstation Trips', description: 'One-way and round trips to any city in India at fixed fares.', sort: 2 },
  { id: 3, num: '03', title: 'Local Rentals', description: 'Hourly packages (8h / 80km) for meetings, shopping and errands.', sort: 3 },
  { id: 4, num: '04', title: 'Corporate Travel', description: 'Managed employee and guest transport with monthly billing.', sort: 4 },
];

export const DEFAULT_FEATURES = [
  { id: 1, title: 'Fixed fares', sub: 'No surge, ever', sort: 1 },
  { id: 2, title: 'No hidden charges', sub: 'What you see, you pay', sort: 2 },
  { id: 3, title: 'Verified drivers', sub: 'Trained & background-checked', sort: 3 },
  { id: 4, title: '24×7 support', sub: 'Always a call away', sort: 4 },
];

export const DEFAULT_STEPS = [
  { id: 1, num: '01', title: 'Pick your ride', description: 'Choose a car and tell us your route and travel date.', sort: 1 },
  { id: 2, num: '02', title: 'Message us', description: 'Send the details on WhatsApp or give us a call.', sort: 2 },
  { id: 3, num: '03', title: 'Get a quote', description: 'Receive a fixed, all-inclusive fare within minutes.', sort: 3 },
  { id: 4, num: '04', title: 'Enjoy the ride', description: 'Your verified driver arrives on time — you relax.', sort: 4 },
];

export const DEFAULT_VALUES = [
  { id: 1, num: '01', title: 'Honest pricing', description: 'The fare you’re quoted is the fare you pay. No surge, no last-minute add-ons.', sort: 1 },
  { id: 2, num: '02', title: 'Safety first', description: 'Every driver is verified and trained; every car is sanitised and well-maintained.', sort: 2 },
  { id: 3, num: '03', title: 'Always there', description: 'On-call 24×7 across 150+ cities, so help is never more than a message away.', sort: 3 },
];

// Every editable text block on the site, keyed. The admin "Website Text"
// section edits these; anything missing in the DB falls back to this map.
export const DEFAULT_CONTENT = {
  // Announcement bar + navbar
  ann_1: '24×7 on-call booking across India',
  ann_2: 'Fixed fares — no surge pricing',
  nav_cta: 'Book Now',
  // Home — hero
  home_badge: 'Trusted by 12,000+ travellers',
  home_h1: 'Reliable cabs for\nevery journey\nacross',
  home_h1_accent: 'India.',
  home_sub: 'Airport transfers, outstation trips and local rentals — booked in one message. Fixed fares, verified drivers, no surprises.',
  home_cta_wa: 'Book on WhatsApp →',
  home_stat1_v: '4.9★', home_stat1_l: 'Avg. rating',
  home_stat2_v: '12k+', home_stat2_l: 'Trips completed',
  home_stat3_v: '24×7', home_stat3_l: 'Support',
  home_float_t: 'Fixed, upfront fares',
  home_float_s: 'Know the price before you ride',
  // Home — quote bar
  quote_pickup: 'New Delhi',
  quote_drop: 'Where to?',
  quote_trip: 'Outstation · One-way',
  quote_cta: 'Check fare',
  quote_note: "No app, no login — just message us your route and we'll send a fixed quote.",
  // Home — section headings
  services_kicker: 'What we offer', services_title: 'Every kind of ride, sorted',
  fleet_kicker: 'Our fleet', fleet_title: 'Pick the ride that fits', fleet_link: 'View all cars →',
  routes_kicker: 'Popular routes', routes_title: 'Loved journeys from Delhi',
  how_kicker: 'How it works', how_title: 'Booked in four easy steps',
  reviews_kicker: 'Reviews', reviews_title: 'What riders say',
  // Home — offer banner
  offer_kicker: 'Limited period offer',
  offer_title: 'Up to 30% off on round trips',
  offer_sub: 'Book a return outstation journey this month and save on your total fare.',
  offer_cta: 'Claim offer →',
  // About page
  about_kicker: 'About Trip Sarthi',
  about_h1: 'Your trusted co-pilot for every mile, across India.',
  about_h2: 'Travel, made simple and honest',
  about_p1: "Trip Sarthi began with a simple idea — booking a cab should be as easy as sending a message, and the price you're quoted should be the price you pay. No apps, no surge, no fine print.",
  about_p2: 'From quick airport runs to multi-day outstation tours, our fleet and verified drivers get you there in comfort. We\'re on the road 24×7 so you always have a "sarthi" to count on.',
  about_stat1_v: '12k+', about_stat1_l: 'Happy riders',
  about_stat2_v: '150+', about_stat2_l: 'Cities covered',
  about_stat3_v: '50+', about_stat3_l: 'Cars in fleet',
  about_stat4_v: '4.9★', about_stat4_l: 'Avg. rating',
  values_title: 'What we stand for',
  // Fleet page
  fleetpage_kicker: 'Our fleet',
  fleetpage_h1: 'Clean, comfortable cars for every trip',
  fleetpage_sub: 'Per-kilometre rates are indicative — send us your route on WhatsApp for a fixed, all-inclusive quote.',
  // Pricing page
  pricing_kicker: 'Pricing',
  pricing_h1: 'Transparent fares, always',
  pricing_sub: 'Sample rates below. Tolls, parking and state taxes may apply on outstation trips — all confirmed upfront in your quote.',
  pricing_rates_title: 'Per-kilometre rates',
  pricing_fares_title: 'Popular outstation fares (one-way)',
  // Gallery page
  gallerypage_kicker: 'Gallery',
  gallerypage_h1: 'Moments from the road',
  gallerypage_sub: 'Trips, fleet and destinations — a glimpse of journeys with Trip Sarthi.',
  // Contact page
  contact_kicker: 'Contact',
  contact_h1: "Let's plan your trip",
  contact_sub: 'Reach out any time — we reply fastest on WhatsApp. Tell us your route and travel date for an instant quote.',
  form_title: 'Request a quote',
  form_sub: "Fill in your details — we'll receive your enquiry instantly. You can also send it straight to WhatsApp.",
  // Footer
  footer_blurb: 'Reliable cabs and taxi service across India. Fixed fares, verified drivers, on the road 24×7.',
  footer_legal: 'Privacy · Terms · Refund Policy',
};
