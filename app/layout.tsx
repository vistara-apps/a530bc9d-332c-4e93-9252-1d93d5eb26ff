import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { ThemeProvider } from './components/ThemeProvider';
import { AnalyticsProvider } from './components/AnalyticsProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KRYCE Navigator',
  description: 'Your rights, your crypto, your knowledge. Empowered.',
  openGraph: {
    title: 'KRYCE Navigator',
    description: 'Your rights, your crypto, your knowledge. Empowered.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider>
            <AnalyticsProvider>
              <ToastProvider>
                <Providers>
                  {children}
                </Providers>
              </ToastProvider>
            </AnalyticsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
