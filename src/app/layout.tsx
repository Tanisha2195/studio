
import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { QuestaLogo } from '@/components/QuestaLogo';
import { Home, FileText, History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Questa - Intelligent Document Analysis',
  description: 'Upload documents, extract key information, and get answers to your questions with Questa.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <header className="w-full py-3 px-4 md:px-8 bg-card shadow-md sticky top-0 z-50">
          <div className="max-w-6xl flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <QuestaLogo />
            </Link>
            <nav className="space-x-3 sm:space-x-6 flex items-center">
              <Link href="/" className="flex items-center text-sm sm:text-base text-primary hover:text-primary/80 font-medium group">
                <Home className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" /> Home
              </Link>
              <Link href="/app" className="flex items-center text-sm sm:text-base text-primary hover:text-primary/80 font-medium group">
                <FileText className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" /> App
              </Link>
              <Link href="/history" className="flex items-center text-sm sm:text-base text-primary hover:text-primary/80 font-medium group">
                <History className="mr-1 h-4 w-4 group-hover:scale-110 transition-transform" /> History
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-grow w-full">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
