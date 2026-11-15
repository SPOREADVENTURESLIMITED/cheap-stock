import type { Metadata } from 'next';
import './globals.css';
import DesignerCredit from '@/components/designer-credit';

export const metadata: Metadata = {
  title: 'CHEAP STOCK | Quality Drinks. Wholesale Prices.',
  description: 'Shop drinks at competitive retail and wholesale prices. CHEAP STOCK Uganda.',
  manifest: '/manifest.webmanifest',
  applicationName: 'CHEAP STOCK',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'CHEAP STOCK' },
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<DesignerCredit /></body></html>;
}
