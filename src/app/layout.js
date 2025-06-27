import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from '../components/Header.jsx';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import Head from 'next/head';
import { Suspense } from 'react';
import AnalyticsProvider from '../components/AnalyticsProvider';
import StructuredData from '../components/StructuredData';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fiduam - Cabinet Fiduciaire & Comptable à Agadir | Services Juridiques & Comptables",
  description: "Fiduam, cabinet fiduciaire et comptable à Agadir. Services juridiques, comptables et sociaux pour entreprises. Création d'entreprise, comptabilité, fiscalité. Contactez-nous au +212 5 28 22 04 03",
  keywords: "fiduam, cabinet fiduciaire agadir, comptable agadir, services juridiques maroc, création entreprise agadir, comptabilité maroc, fiscalité maroc, fiduciaire agadir, expert comptable agadir",
  authors: [{ name: "Fiduam" }],
  creator: "Fiduam",
  publisher: "Fiduam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://fiduam.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Fiduam - Cabinet Fiduciaire & Comptable à Agadir",
    description: "Cabinet fiduciaire et comptable à Agadir. Services juridiques, comptables et sociaux pour entreprises. Création d'entreprise, comptabilité, fiscalité.",
    url: 'https://fiduam.com',
    siteName: 'Fiduam',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Fiduam - Cabinet Fiduciaire Agadir',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fiduam - Cabinet Fiduciaire & Comptable à Agadir",
    description: "Cabinet fiduciaire et comptable à Agadir. Services juridiques, comptables et sociaux pour entreprises.",
    images: ['/hero.png'],
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
  verification: {
    google: 'zMcdG1ZQ59Ux96pa7TCUrn4MX5-LGbsQNWbcO198ed0',
  },
  icons: {
    icon: './elevate.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <Head>
        {/* Google Analytics tracking is handled by react-ga4 */}
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StructuredData />
        <Suspense fallback={null}>
          <AnalyticsProvider />
        </Suspense>
        <Header />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
