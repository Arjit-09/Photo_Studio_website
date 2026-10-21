import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://frame-by-frame-studio-arjit.sappychord9.chatgpt.site'),
  title: 'Frame by Frame — Stories that stay',
  description: 'Honest moments. Artfully kept. A cinematic wedding, couples and portrait photography studio. Explore our stories, frame by frame.',
  openGraph: { title: 'Frame by Frame — Stories that stay', description: 'Some moments stay forever. Wedding, couples and portrait photography.', images: [{ url: '/images/couple.jpg', width: 2000, height: 1333 }], type: 'website' },
  twitter: { card: 'summary_large_image' },
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: '#33392c' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
