import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNavigation from "@/components/BottomNavigation";
import TopNavigation from "@/components/TopNavigation";
import { Viewport } from "next";
import { ThemeProvider } from './providers/ThemeProvider';
import { LanguageProvider } from './providers/LanguageProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Diary",
  description: "A special diary app powered by AI",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'AI Diary',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'AI Diary',
    title: 'AI Diary',
    description: 'Turn precious moments into beautiful memories with AI',
  },
  twitter: {
    card: 'summary',
    title: 'AI Diary',
    description: 'Turn precious moments into beautiful memories with AI',
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
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider>
            <div className="min-h-screen">
              <TopNavigation />
              <main className="pb-20 sm:pt-20">{children}</main>
              <BottomNavigation />
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
