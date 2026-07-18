import { getContent } from '@/lib/db';
import { Shell, PageBanner } from '@/components/SiteChrome';
import ContactForm from '@/components/ContactForm';
import { waMsg } from '@/lib/waMessages';

export const revalidate = 3600;
export const metadata = {
  title: 'Contact Us',
  description: 'Book a cab with Trip Sarthi — WhatsApp, call or send a quote request. Fastest reply on WhatsApp, 24×7.',
};

export default async function Contact() {
  const c = await getContent();
  const t = c.t;
  return (
    <Shell c={c} active="/contact">
      <div className="fade">
        <PageBanner kicker="Get in touch" title={t.contact_h1} sub={t.contact_sub} />

        <section className="wrap contact-grid">
          <div className="contact-cards">
            <a href={c.waFor(waMsg.contactCard)} target="_blank" rel="noopener" className="contact-card">
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
              <div><div className="t">Head Office</div><div className="s">{c.address}</div></div>
            </div>
          </div>

          <ContactForm waNumber={c.settings.phone_e164} title={t.form_title} sub={t.form_sub} />
        </section>
      </div>
    </Shell>
  );
}
