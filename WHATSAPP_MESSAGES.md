# WhatsApp messages — audit & mapping

Every place on the site that opens WhatsApp (`wa.me`), the context it's clicked
from, and the pre-filled message it now sends. All contextual messages live in
one place — [lib/waMessages.js](lib/waMessages.js) — so they're easy to edit.

## How it works

- `lib/db.js` exposes `c.waFor(message)` — builds `https://wa.me/<number>?text=<message>` using the phone number from **Site Settings**. `c.wa` remains the generic default (uses the admin's "Default WhatsApp message").
- Static messages and per-item builders are keyed in `lib/waMessages.js` as `waMsg`.
- The phone number is still admin-editable (Site Settings → "Phone for links"); only the **message text** is contextual/code-defined.

## Every WhatsApp entry point

| # | Where (file) | Trigger the user clicks | `waMsg` key | Message (summary) |
|---|---|---|---|---|
| 1 | `components/SiteChrome.js` — Navbar | "Book Now" (top nav, every page) | `navBook` | General booking intent |
| 2 | `components/MobileMenu.js` (via `waHref`) | "Book Now" (mobile drawer) | `navBook` | Same as nav |
| 3 | `components/SiteChrome.js` — OfferBand | "Book Your Ride Now" (offer strip) | `offerClaim` | Claim the up-to-30%-off first-booking offer |
| 4 | `components/SiteChrome.js` — OfferBand | "Whatsapp · Chat with us now" (green) | `offerChat` | Chat about booking & offers |
| 5 | `components/SiteChrome.js` — FloatingContact | Floating WhatsApp button (every page) | `floatingChat` | General question / chat |
| 6 | `app/page.js` — hero | "Get Estimate" (home hero CTA) | `homeEstimate` | Request a free fixed-fare estimate |
| 7 | `app/page.js` — Popular routes | Each route pill (e.g. Delhi → Agra) | `route(r)` | Book that **specific route** + its distance/fare |
| 8 | `app/himachal/page.js` — hero | "Plan my Himachal trip" | `himachalPlan` | Plan a Himachal trip (route + quote) |
| 9 | `app/himachal/page.js` — destinations | Each destination card (Manali, Shimla…) | `himachalDest(d)` | Trip to that **specific hill station** + km/fare |
| 10 | `app/pricing/page.js` — rate table | "Book" per car row | `pricingCar(car)` | Book that **car class** at its ₹/km |
| 11 | `app/pricing/page.js` — fares grid | "Book →" per outstation fare | `pricingFare(r)` | Book that **specific outstation trip** + fare |
| 12 | `app/contact/page.js` — contact cards | "WhatsApp" card | `contactCard` | General booking enquiry |
| 13 | `components/BookButton.js` — car modal | "or book on WhatsApp →" (booking modal) | `car(car)` | Book the **specific car** (name · model · ₹/km) |
| 14 | `components/ContactForm.js` — contact form | "Send on WhatsApp →" | `contactForm(f)` | Full message built from the **form fields** (name, phone, from, to, message) |

### Internal (not a customer-facing preset)

| Where | Trigger | Note |
|---|---|---|
| `app/admin/page.js` | "Reply on WhatsApp" (per enquiry) | Opens `wa.me/<customer phone>` with **no** preset text — the admin types the reply. Left as-is. |

## Editing the messages

Open [lib/waMessages.js](lib/waMessages.js). Static strings (e.g. `navBook`) are plain
text; per-item entries (e.g. `route`, `pricingCar`) are functions that receive the
row and return the message. WhatsApp renders `*asterisks*` as **bold**. Changing the
phone number is done in the admin **Site Settings**, not here.
