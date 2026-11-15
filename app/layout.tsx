import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHEAP STOCK | Quality Drinks. Wholesale Prices.',
  description: 'Shop drinks at competitive retail and wholesale prices. CHEAP STOCK Uganda.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
