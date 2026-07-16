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
  { id: 1, caption: 'Starlit peaks, Spiti', image_url: U('1519681393784-d120267933ba', 1400), span: 'feature', sort: 1 },
  { id: 2, caption: 'Snowline above Manali', image_url: U('1506905925346-21bda4d32df4'), span: '', sort: 2 },
  { id: 3, caption: 'Himalayan ridgelines', image_url: U('1464822759023-fed622ff2c3b'), span: '', sort: 3 },
  { id: 4, caption: 'Lakeside pause, Prashar', image_url: U('1501785888041-af3ef285b470'), span: 'tall', sort: 4 },
  { id: 5, caption: 'Sunrise over the Dhauladhars', image_url: U('1477346611705-65d1883cee1e'), span: '', sort: 5 },
  { id: 6, caption: 'Deodar forests, Jibhi', image_url: U('1441974231531-c6227db76b6e'), span: '', sort: 6 },
  { id: 7, caption: 'Golden hour in the valley', image_url: U('1469474968028-56623f02e42e'), span: '', sort: 7 },
  { id: 8, caption: 'On the high passes', image_url: U('1483728642387-6c3bdd6c93e5'), span: 'wide', sort: 8 },
  { id: 9, caption: 'Mist over Kufri', image_url: U('1454496522488-7a8e488e8606'), span: '', sort: 9 },
  { id: 10, caption: 'Pine trails, Kasauli', image_url: U('1447752875215-b2761acb3c5d'), span: '', sort: 10 },
  { id: 11, caption: 'Trek to Triund', image_url: U('1508672019048-805c876b67e2'), span: '', sort: 11 },
  { id: 12, caption: 'River day, Tattapani', image_url: U('1476514525535-07fb3b4ae5f1'), span: '', sort: 12 },
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
  // Home — hero banner + quote form
  home_h1: 'Book Your Cabs & Taxis Across India With Trip Sarthi',
  home_sub: 'Finding a taxi in your area has become easy with Trip Sarthi. Hire a cab for local sightseeing or an outstation trip at a budget-friendly rate — with assured comfort and convenience.',
  home_cta: 'Get Estimate',
  quoteform_title: 'Get a Free Quote',
  // Home — intro
  intro_h2: 'Book Your Cab and Taxi Service from Trip Sarthi',
  intro_p1: 'Booking a cab should be as easy as sending a message — and the price you are quoted should be the price you pay. With Trip Sarthi you can book a reliable cab anywhere in India, with fixed fares and no surprises.',
  intro_p2: 'We aim that everybody should get the benefits of affordable and inclusive cab booking services via our travel portal. We understand the multiple demands of travel, which is why our booking network has spread across major cities in India.',
  // Offer band
  offer_title: 'Up To 30% Off On Your First Booking',
  offer_cta: 'Book Your Ride Now',
  // Services
  services_kicker: 'What we offer', services_title: 'Every kind of ride, sorted',
  // How to book (long-form)
  how_title: 'How to Book a Taxi with Trip Sarthi',
  how_intro: 'Trip Sarthi is a reliable taxi booking service that offers maximum perks to every customer, with round-the-clock assistance. Booking your cab takes just a few minutes:',
  // Why us (long-form)
  why_title: 'Why Trip Sarthi is a Leading Taxi Service?',
  why_intro: 'As a trusted cab booking company, our priority is to provide real benefits to our customers. Some of the perks you get are:',
  // Cars
  cars_kicker: 'Car classes and rates',
  cars_title: 'Choose Your Car',
  car_line1: 'Limit: 250 KM / Day',
  car_line2: 'Driver: ₹400 / Day',
  car_note: 'Toll Tax & Parking not included',
  // Popular places
  places_title: 'Popular Places To Visit From',
  // Estimate band
  estimate_title: 'Get Estimate Now',
  // Reviews
  reviews_kicker: 'Reviews', reviews_title: 'What riders say',
  // About page
  about_h2: 'Travel, made simple and honest',
  about_p1: "Trip Sarthi began with a simple idea — booking a cab should be as easy as sending a message, and the price you're quoted should be the price you pay. No apps, no surge, no fine print.",
  about_p2: `From quick airport runs to multi-day outstation tours, our fleet and verified drivers get you there in comfort. We're on the road 24×7 so you always have a "sarthi" to count on.`,
  about_stat1_v: '12k+', about_stat1_l: 'Happy riders',
  about_stat2_v: '150+', about_stat2_l: 'Cities covered',
  about_stat3_v: '50+', about_stat3_l: 'Cars in fleet',
  about_stat4_v: '4.9★', about_stat4_l: 'Avg. rating',
  values_title: 'What we stand for',
  // Fleet page
  fleetpage_h1: 'Our Cars',
  fleetpage_sub: 'Per-kilometre rates are indicative — send us your route on WhatsApp for a fixed, all-inclusive quote.',
  // Pricing page
  pricing_h1: 'Price',
  pricing_sub: 'Sample rates below. Tolls, parking and state taxes may apply on outstation trips — all confirmed upfront in your quote.',
  pricing_rates_title: 'Per-kilometre rates',
  pricing_fares_title: 'Popular outstation fares (one-way)',
  // Himachal page
  himachal_h1: 'Himachal, by road',
  himachal_sub: 'Snow peaks, deodar valleys and mountain temples — one cab from your doorstep to the Himalayas.',
  himachal_intro_h2: 'Your Himachal trip, the Trip Sarthi way',
  himachal_p1: 'From the snow line above Manali to the monasteries of Spiti and the sunset points of Dharamshala — Himachal is best done by road, and best done unhurried. Our hill-trained drivers know every hairpin, dhaba and viewpoint on the way up.',
  himachal_p2: 'Tell us your dates and the places you want to cover. We plan the route, you get one fixed fare for the whole circuit — fuel, driver and mountain confidence included.',
  himachal_dest_title: 'Where in the hills do you want to go?',
  himachal_gallery_title: 'Moments from the mountains',
  // Contact page
  contact_h1: 'Contact Us',
  contact_sub: 'Reach out any time — we reply fastest on WhatsApp. Tell us your route and travel date for an instant quote.',
  form_title: 'Request a quote',
  form_sub: "Fill in your details — we'll receive your enquiry instantly. You can also send it straight to WhatsApp.",
  // Footer
  footer_blurb: 'Get door-to-door pickups across India. Our expert drivers handle the driving bit — you sit back, relax and enjoy your journey. Fixed fares, on the road 24×7.',
  footer_legal: 'Privacy Policy  |  Cancellation Policies  |  Refund Policy',
  // Homepage section order & visibility (edited visually in admin Appearance)
  home_layout: JSON.stringify([
    { id: 'hero', v: 1 }, { id: 'intro', v: 1 }, { id: 'offer1', v: 1 }, { id: 'services', v: 1 },
    { id: 'how', v: 1 }, { id: 'why', v: 1 }, { id: 'cars', v: 1 }, { id: 'places', v: 1 },
    { id: 'estimate', v: 1 }, { id: 'reviews', v: 1 }, { id: 'offer2', v: 1 },
  ]),
  // Appearance (edited from the admin "Appearance" tab)
  theme_brand: '#F5B301',
  theme_brand_deep: '#C98A00',
  theme_btn_shape: 'pill',
  theme_hero_form: 'right',
  theme_float_pos: 'right',
};
