import Link from 'next/link';
import Image from 'next/image';

const NAV = [
  ['Home', '/'],
  ['About Us', '/about'],
  ['Car', '/fleet'],
  ['Price', '/pricing'],
  ['Gallery', '/gallery'],
  ['Contact Us', '/contact'],
];

export function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.5 2 2 6.4 2 11.8c0 1.9.55 3.7 1.5 5.2L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.4 10-9.9S17.5 2 12 2zm4.9 13.9c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.5-2.6-1.1-4.3-3.8-4.4-3.9-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9.9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4.2.5.7 1.8.8 1.9.1.1.1.3 0 .5-.1.2-.2.3-.3.5l-.5.5c-.2.2-.3.4-.1.7.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l.9-1c.2-.3.4-.2.7-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z" />
    </svg>
  );
}

export function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" />
    </svg>
  );
}

export function Navbar({ c, active }) {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link href="/" className="brand" style={{ color: 'inherit' }} aria-label="Trip Sarthi — home">
          <Image src="/logo.png" alt="Trip Sarthi logo" width={48} height={48} priority />
          <div style={{ lineHeight: 1 }}>
            <div className="brand-name">Trip <span>Sarthi</span></div>
            <div className="brand-sub">Cab &amp; Taxi Service</div>
          </div>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={active === href ? 'active' : ''}
              aria-current={active === href ? 'page' : undefined}>{label}</Link>
          ))}
          <a href={c.wa} target="_blank" rel="noopener" className="btn nav-cta">Book Now</a>
        </nav>
      </div>
    </header>
  );
}

export function PageBanner({ kicker, title, sub }) {
  return (
    <section className="banner">
      <div className="wrap banner-inner">
        {kicker && <div className="kicker">{kicker}</div>}
        <h1>{title}</h1>
        {sub && <p>{sub}</p>}
      </div>
    </section>
  );
}

export function OfferBand({ c }) {
  return (
    <section className="wrap offer-band">
      <div className="offer-inner">
        <div>
          <h2>{c.t.offer_title}</h2>
          <a href={c.wa} target="_blank" rel="noopener" className="btn dark">{c.t.offer_cta}</a>
        </div>
        <div className="offer-right">
          <a href={c.wa} target="_blank" rel="noopener" className="wa-btn">
            <WaIcon />
            <span>Whatsapp<span className="sub">Chat with us now</span></span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function FloatingContact({ c }) {
  return (
    <div className="float-contact">
      <a href={c.tel} className="fc-call" aria-label={`Call ${c.phone}`}><CallIcon /></a>
      <a href={c.wa} target="_blank" rel="noopener" className="fc-wa" aria-label="Chat on WhatsApp"><WaIcon /></a>
    </div>
  );
}

export function Footer({ c }) {
  return (
    <footer className="footer2">
      <div className="footer2-grid">
        <div>
          <div className="f-h">Trip Sarthi</div>
          <p className="f-blurb">{c.t.footer_blurb}</p>
        </div>
        <div>
          <div className="f-h">Quick Links</div>
          <div className="f-links">
            {NAV.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </div>
        <div>
          <div className="f-h">Head Office</div>
          <div className="f-office">
            <div><span className="oc">◉</span>{c.address}</div>
            <div><span className="oc">✆</span><a href={c.tel}>{c.phone}</a></div>
            <div><span className="oc">✉</span><a href={c.mailto} style={{ wordBreak: 'break-all' }}>{c.email}</a></div>
          </div>
        </div>
        <div>
          <div className="f-h">Payment Options</div>
          <div className="pay-chips">
            <span>BHIM</span><span>PhonePe</span><span>Paytm</span><span>G Pay</span>
          </div>
        </div>
      </div>
      <div className="f-legal">{c.t.footer_legal}</div>
      <div className="f-bottom">© {new Date().getFullYear()} Trip Sarthi. All Rights Reserved.</div>
    </footer>
  );
}

export function Shell({ c, active, children }) {
  return (
    <div className="page-shell">
      <Navbar c={c} active={active} />
      <main>{children}</main>
      <Footer c={c} />
      <FloatingContact c={c} />
    </div>
  );
}
