// What each homepage section exposes in the visual editor (/editor):
// its own text/content keys, image, background toggle, and a jump to its
// list data (cars, routes, testimonials, …). Shared by the editor and admin.
export const SECTION_PANELS = {
  hero: {
    title: 'Hero + booking form', image: 'hero_image', imageLabel: 'Background photo',
    fields: [['home_h1', 'Headline', 'textarea'], ['home_sub', 'Subtitle', 'textarea'], ['home_cta', 'Orange button label'], ['quoteform_title', 'Booking form title']],
    heroOpts: true,
  },
  intro: {
    title: 'Intro + feature cards', bg: true,
    fields: [['intro_h2', 'Heading'], ['intro_p1', 'Paragraph 1', 'textarea'], ['intro_p2', 'Paragraph 2', 'textarea']],
    manage: { tab: 'sections', label: 'Manage feature cards' },
  },
  offer1: { title: 'Offer banner (upper)', shared: 'Both offer banners share this text.', fields: [['offer_title', 'Title'], ['offer_cta', 'Button label']] },
  services: {
    title: 'What we offer', bg: true,
    fields: [['services_kicker', 'Small heading'], ['services_title', 'Title']],
    manage: { tab: 'sections', label: 'Manage service items' },
  },
  how: {
    title: 'How to book', fields: [['how_title', 'Heading'], ['how_intro', 'Intro text', 'textarea']],
    manage: { tab: 'sections', label: 'Manage steps' },
  },
  why: {
    title: 'Why choose us', bg: true, fields: [['why_title', 'Heading'], ['why_intro', 'Intro text', 'textarea']],
    manage: { tab: 'sections', label: 'Manage value points' },
  },
  cars: {
    title: 'Car classes & rates', bg: true,
    fields: [['cars_kicker', 'Small heading'], ['cars_title', 'Title'], ['car_line1', 'Card line 1'], ['car_line2', 'Card line 2'], ['car_note', 'Card note']],
    manage: { tab: 'cars', label: 'Manage cars & rates' },
  },
  places: {
    title: 'Popular routes', bg: true, fields: [['places_title', 'Heading (city added after)']],
    manage: { tab: 'routes', label: 'Manage routes' },
  },
  estimate: { title: 'Get estimate form', bg: true, fields: [['estimate_title', 'Heading']] },
  reviews: {
    title: 'Testimonials', bg: true, fields: [['reviews_kicker', 'Small heading'], ['reviews_title', 'Title']],
    manage: { tab: 'testimonials', label: 'Manage testimonials' },
  },
  offer2: { title: 'Offer banner (lower)', shared: 'Both offer banners share this text.', fields: [['offer_title', 'Title'], ['offer_cta', 'Button label']] },
};
