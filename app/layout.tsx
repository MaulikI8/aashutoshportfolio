import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Aashutosh Basnet — Web Developer',
  description: 'Web developer based in Nepal, focused on building modern, high-performance websites and web applications. Passionate about technology and social change.',
  keywords: ['Aashutosh Basnet', 'Web Developer', 'Nepal', 'Full Stack', 'JavaScript', 'React', 'Next.js', 'Portfolio'],
  authors: [{ name: 'Aashutosh Basnet' }],
  creator: 'Aashutosh Basnet',
  publisher: 'Aashutosh Basnet',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aashutoshbasnet.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Aashutosh Basnet — Web Developer',
    description: 'Web developer based in Nepal, building modern, high-performance websites and applications.',
    url: 'https://aashutoshbasnet.dev',
    siteName: 'Aashutosh Basnet',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aashutosh Basnet — Web Developer',
    description: 'Web developer based in Nepal, building modern, high-performance websites and applications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  )
}
