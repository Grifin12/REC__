import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import GlobalRobot from '@/components/GlobalRobot';
export const metadata: Metadata = {
  title: {
    template: '%s | RECON',
    default: 'RECON - Modern Sinematik Film Keşif Platformu',
  },
  description: 'Yapay zeka destekli doğal dil aramasıyla ruh haline en uygun filmi bul. Arkadaşlarınla paylaş, kendi sinematik kütüphaneni oluştur.',
  keywords: ['film', 'sinema', 'keşfet', 'sosyal', 'recon', 'movie', 'letterboxd'],
  openGraph: {
    title: 'RECON - Modern Sinematik Film Keşif',
    description: 'Ruh haline en uygun filmi bul ve kendi sinematik kütüphaneni oluştur.',
    url: 'https://recon-app.vercel.app',
    siteName: 'RECON',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RECON - Modern Sinematik Film Keşif',
    description: 'Ruh haline en uygun filmi bul.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-[#0b0c10] text-white">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <GlobalRobot />
      </body>
    </html>
  );
}
