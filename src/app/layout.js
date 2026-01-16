import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from 'next/script';
import BlogHeader from '@/components/BlogHeader';
import BlogFooter from '@/components/BlogFooter';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fiduam - Delicious Cooking Recipes | International & Homemade",
  description: "Discover hundreds of delicious and easy-to-make recipes. International cuisine, desserts, main dishes and more. Recipes with photos and detailed instructions.",
  keywords: "recipes, cooking, easy recipes, homemade food, desserts, main dishes, starters, quick recipes, food blog",
  authors: [{ name: "Fiduam" }],
  creator: "Fiduam",
  publisher: "Fiduam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://fiduam.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Fiduam - Delicious Cooking Recipes",
    description: "Discover hundreds of delicious and easy-to-make recipes. International cuisine, desserts and more.",
    url: process.env.NEXTAUTH_URL || 'https://fiduam.com',
    siteName: 'Fiduam',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fiduam - Recipe Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fiduam - Delicious Cooking Recipes",
    description: "Discover hundreds of delicious and easy-to-make recipes.",
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({ children }) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  
  return (
    <html lang="fr">
      <head>
        {/* Google AdSense Script */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        <BlogHeader />
        <main className="min-h-screen">
          {children}
        </main>
        <BlogFooter />
      </body>
    </html>
  );
}
