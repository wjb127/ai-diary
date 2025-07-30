import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import { Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI 일기장",
  description: "AI가 도와주는 특별한 일기장",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI 일기장',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'AI 일기장',
    title: 'AI 일기장',
    description: 'AI와 함께 만드는 아름다운 추억 일기장',
  },
  twitter: {
    card: 'summary',
    title: 'AI 일기장',
    description: 'AI와 함께 만드는 아름다운 추억 일기장',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <div className="min-h-screen">
          <main className="pb-20">{children}</main>
          <BottomNavigation />
        </div>
      </body>
    </html>
  );
}
