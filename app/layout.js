import { Sora, Manrope } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sora', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Trip Sarthi — Cab & Taxi Service Across India',
    template: '%s | Trip Sarthi',
  },
  description:
    'Reliable cabs for every journey across India. Airport transfers, outstation trips and local rentals at fixed fares with verified drivers. Book on WhatsApp — 24×7.',
  keywords: ['cab service', 'taxi service India', 'outstation cab', 'airport transfer Delhi', 'car rental with driver', 'Trip Sarthi'],
  icons: { icon: '/logo.png', apple: '/logo.png' },
  openGraph: {
    type: 'website',
    siteName: 'Trip Sarthi',
    title: 'Trip Sarthi — Cab & Taxi Service Across India',
    description: 'Airport transfers, outstation trips and local rentals at fixed fares. Verified drivers, 24×7 support, no surge pricing.',
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Trip Sarthi' }],
  },
  twitter: {
    card: 'summary',
    title: 'Trip Sarthi — Cab & Taxi Service Across India',
    description: 'Fixed fares, verified drivers, 24×7. Book on WhatsApp.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#F5B301',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
