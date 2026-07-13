import { getContent } from '@/lib/db';
import { Shell } from '@/components/SiteChrome';
import ContactForm from '@/components/ContactForm';

export const revalidate = 3600;
export const metadata = {
  title: 'Contact',
  description: 'Book a cab with Trip Sarthi — WhatsApp, call or send a quote request. Fastest reply on WhatsApp, 24×7.',
};

export default async function Contact() {
  const c = await getContent();
  return (
    <Shell c={c} active="/contact">
      <div className="fade">
        <section className="page-hero">
          <div className="wrap page-hero-inner">
            <div className="kicker">{c.t.contact_kicker}</div>
            <h1>{c.t.contact_h1}</h1>
            <p>{c.t.contact_sub}</p>
          </div>
        </section>

        <section className="wrap contact-grid">
          <div className="contact-cards">
            <a href={c.wa} target="_blank" rel="noopener" className="contact-card">
              <span className="icon dark">WA</span>
              <div><div className="t">WhatsApp</div><div className="s">{c.phone} — tap to chat</div></div>
            </a>
            <a href={c.tel} className="contact-card">
              <span className="icon soft">☎</span>
              <div><div className="t">Call us</div><div className="s">{c.phone}</div></div>
            </a>
            <a href={c.mailto} className="contact-card">
              <span className="icon soft">@</span>
              <div><div className="t">Email</div><div className="s">{c.email}</div></div>
            </a>
            <div className="contact-card">
              <span className="icon soft">◉</span>
              <div><div className="t">Office</div><div className="s">{c.address}</div></div>
            </div>
          </div>

          <ContactForm waNumber={c.settings.phone_e164} title={c.t.form_title} sub={c.t.form_sub} />
        </section>
      </div>
    </Shell>
  );
}
