import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { Headers } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'JavaScript Near Me - Find Local JavaScript Events',
  description: 'Discover JavaScript workshops, meetups, and events in your area. Connect with other developers and level up your skills.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Headers />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
