import type {Metadata} from 'next';
import { Vazirmatn, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '700', '900'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'آکادمی آزمون‌های امنیت سایبری | Security+, CEH, SOC',
  description: 'کامل‌ترین شبیه‌ساز آزمون‌های بین‌المللی امنیت سایبری با ۱۰۰ سوال از آسان به سخت و ارزیابی هوشمند با هوش مصنوعی',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-[#0A0B0E] text-slate-300 font-sans min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

