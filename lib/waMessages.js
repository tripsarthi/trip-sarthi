// Single source of truth for every pre-filled WhatsApp message on the site.
// Static entries are strings; per-item entries are builders that take the row
// (route / car / destination / form) and return a tailored message.
// See WHATSAPP_MESSAGES.md for where each one is used.
// WhatsApp renders *asterisks* as bold.

const HI = 'Hi Trip Sarthi,';

export const waMsg = {
  // --- Global (site chrome) ---
  navBook: `${HI} I'd like to book a cab. Please help me with the booking details.`,
  floatingChat: `${HI} I have a question about your cab service and would like to chat.`,
  offerClaim: `${HI} I'd like to claim the *Up to 30% off* first-booking offer. Please help me book my ride.`,
  offerChat: `${HI} I'd like to chat about booking a cab and any current offers.`,

  // --- Home ---
  homeEstimate: `${HI} I'd like a free, fixed-fare estimate. My trip details are — pickup city, destination and travel date:`,
  route: (r) =>
    `${HI} I'd like to book a cab for the *${r.title}* route (${[r.meta, r.price].filter(Boolean).join(', ')}). Please share availability and the exact fare.`,

  // --- Himachal ---
  himachalPlan: `${HI} I'd like to plan a Himachal trip by cab. Please help me with a route, itinerary and a fixed quote.`,
  himachalDest: (d) =>
    `${HI} I'm interested in a Himachal trip to *${d.name}* (${[d.meta, d.price].filter(Boolean).join(', ')}). Please share the itinerary and fare.`,

  // --- Pricing ---
  pricingCar: (car) =>
    `${HI} I'd like to book a *${car.name}*${car.model ? ` (${car.model})` : ''}${car.rate ? ` at ₹${car.rate}/km` : ''}. Please share availability and a fixed quote.`,
  pricingFare: (r) =>
    `${HI} I'd like to book the *${r.title}* outstation trip (${[r.meta, r.price].filter(Boolean).join(', ')}). Please confirm the all-inclusive fare.`,

  // --- Car cards (booking modal WhatsApp fallback) ---
  car: (car) =>
    `${HI} I'd like to book the *${car.name}*${car.model ? ` (${car.model})` : ''}${car.rate ? ` at ₹${car.rate}/km` : ''}. Please share availability and a fixed quote.`,

  // --- Contact ---
  contactCard: `${HI} I'd like to enquire about booking a cab. Please share the details.`,
  contactForm: (f) =>
    `${HI} I'd like a quote.\nName: ${f.name}\nPhone: ${f.phone}\nFrom: ${f.from_city}\nTo: ${f.to_city}${f.message ? `\nDetails: ${f.message}` : ''}`,
};
