import Link from 'next/link';

const NAV = [
  ['Home', '/'],
  ['About', '/about'],
  ['Fleet', '/fleet'],
  ['Pricing', '/pricing'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
];

export function Announce({ c }) {
  return (
    <div className="announce">
      <span className="dot-item"><span className="dot" />24×7 on-call booking across India</span>
      <span className="sep">•</span>
      <span>Fixed fares — no surge pricing</span>
      <span className="sep">•</span>
      <a href={c.tel}>Call {c.phone}</a>
    </div>
  );
}

export function Navbar({ c, active }) {
  return (
    <header className="navbar">
      <div className="wrap navbar-inner">
        <Link href="/" className="brand" style={{ color: 'inherit' }}>
          <img src="/logo.png" alt="Trip Sarthi" />
          <div style={{ lineHeight: 1 }}>
            <div className="brand-name">Trip <span>Sarthi</span></div>
            <div className="brand-sub">Cab &amp; Taxi Service</div>
          </div>
        </Link>
        <nav className="nav-links">
          {NAV.map(([label, href]) => (
            <Link key={href} href={href} className={active === href ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <a href={c.wa} target="_blank" rel="noopener" className="btn-book">Book Now</a>
      </div>
    </header>
  );
}

export function Footer({ c }) {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="brand" style={{ marginBottom: 18 }}>
            <img src="/logo.png" alt="Trip Sarthi" />
            <div className="brand-name">Trip <span>Sarthi</span></div>
          </div>
          <p className="footer-about">Reliable cabs and taxi service across India. Fixed fares, verified drivers, on the road 24×7.</p>
        </div>
        <div>
          <div className="footer-h">Pages</div>
          <div className="footer-links">
            {NAV.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
          </div>
        </div>
        <div>
          <div className="footer-h">Services</div>
          <div className="footer-links">
            <div>Airport Transfers</div><div>Outstation Trips</div><div>Local Rentals</div><div>Corporate Travel</div>
          </div>
        </div>
        <div>
          <div className="footer-h">Get in touch</div>
          <div className="footer-links">
            <a href={c.tel}>{c.phone}</a>
            <a href={c.mailto} style={{ wordBreak: 'break-all' }}>{c.email}</a>
            <div>{c.address}</div>
            <a href={c.wa} target="_blank" rel="noopener" className="btn-wa">Book on WhatsApp</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <div>© {new Date().getFullYear()} Trip Sarthi. All rights reserved.</div>
          <div>Privacy · Terms · Refund Policy</div>
        </div>
      </div>
    </footer>
  );
}

export function Shell({ c, active, children }) {
  return (
    <div className="page-shell">
      <Announce c={c} />
      <Navbar c={c} active={active} />
      <main>{children}</main>
      <Footer c={c} />
    </div>
  );
}
