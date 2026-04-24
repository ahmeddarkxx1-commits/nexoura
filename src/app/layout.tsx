import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Nexoura — Building Digital Experiences That Sell",
    template: "%s | Nexoura"
  },
  description:
    "Nexoura is a premium digital agency specializing in custom websites, high-end applications, and conversion-optimized digital solutions. Elevate your brand with cinematic design and cutting-edge technology.",
  keywords: ["digital agency", "web design Egypt", "custom web development", "Nexoura", "interactive UI", "Three.js websites", "premium templates", "SaaS development"],
  authors: [{ name: "Ahmed Mahmoud", url: "https://nexoura.com" }],
  creator: "Nexoura Team",
  publisher: "Nexoura",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nexoura.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Nexoura — Building Digital Experiences That Sell",
    description: "Premium websites, apps, and ready-made digital solutions. Transform your digital presence today.",
    url: 'https://nexoura.com',
    siteName: 'Nexoura',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Nexoura Digital Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Nexoura Digital Agency',
    description: 'Building the future of the web with cinematic experiences.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

import NextAuthProvider from "@/components/NextAuthProvider";
import JsonLd from "@/components/JsonLd";
import ReferralTracker from "@/components/ReferralTracker";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextAuthProvider>
          <JsonLd />
          <Suspense fallback={null}>
            <ReferralTracker />
          </Suspense>
          <div className="noise" />
          <CustomCursor />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
