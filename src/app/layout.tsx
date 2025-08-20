import '~/styles/globals.css';

import type { Metadata } from 'next';
import { Geist } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';

export const metadata: Metadata = {
  title: 'MDT-RR Digester',
  description: 'VBT inc. application for digesting race results',
  icons: [{ rel: 'icon', url: '/favicon.ico' }]
};

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans'
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <TRPCReactProvider>
        <body className="flex min-h-screen flex-col bg-gray-100 p-2 text-black">{children}</body>
      </TRPCReactProvider>
    </html>
  );
}
