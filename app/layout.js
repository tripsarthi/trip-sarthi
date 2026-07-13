import { Sora, Manrope } from 'next/font/google';
import './globals.css';

const sora = Sora({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sora' });
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope' });

export const metadata = {
  title: 'Trip Sarthi — Cab & Taxi Service Across India',
  description:
    'Reliable cabs for every journey across India. Airport transfers, outstation trips and local rentals at fixed fares with verified drivers. Book on WhatsApp — 24×7.',
  icons: { icon: '/logo.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
