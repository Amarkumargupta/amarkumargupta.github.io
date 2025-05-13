import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ThemeTransition } from '@/components/theme/ThemeTransition';
import { ThemeChanger } from '@/components/theme/ThemeChanger';
import Script from 'next/script';

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://your-domain.com'),
  title: {
    default: 'Amar Kumar Gupta | Cloud & DevOps Engineer',
    template: '%s | Amar Kumar Gupta'
  },
  description: 'Cloud & DevOps Engineer specializing in AWS LAMP stack development, Kubernetes, and Infrastructure as Code',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    siteName: 'Amar Kumar Gupta - Portfolio',
    images: [
      {
        url: 'https://your-domain.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Amar Kumar Gupta - Cloud & DevOps Engineer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amar Kumar Gupta - Cloud & DevOps Engineer',
    description: 'Cloud & DevOps Engineer specializing in AWS LAMP stack development, Kubernetes, and Infrastructure as Code',
    images: ['https://your-domain.com/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${jetbrainsMono.variable} font-mono`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <ThemeTransition />
          <ThemeChanger />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}