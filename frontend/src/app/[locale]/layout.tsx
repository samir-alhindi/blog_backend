import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  Playfair_Display,
  Merriweather,
  Public_Sans,
  Amiri,
  IBM_Plex_Sans_Arabic,
} from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast";
import TopNav from "@/components/TopNav";
import Footer from "@/components/Footer";
import MobileNav from "@/components/MobileNav";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Arabic counterparts: Amiri (elegant Naskh serif) for display/article, and
// IBM Plex Sans Arabic (clean, modern) for UI. globals.css swaps to these when
// <html lang="ar">.
const amiri = Amiri({
  variable: "--font-arabic-display",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic-body",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_DESCRIPTION =
  "The Modern Atelier — a blogging platform for writers and readers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Folio — The Modern Atelier",
    template: "%s · Folio",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Folio",
  openGraph: {
    title: "Folio — The Modern Atelier",
    description: SITE_DESCRIPTION,
    siteName: "Folio",
    type: "website",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Folio — The Modern Atelier",
    description: SITE_DESCRIPTION,
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${playfair.variable} ${merriweather.variable} ${publicSans.variable} ${amiri.variable} ${plexArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-on-background">
        <NextIntlClientProvider>
          <ToastProvider>
            <AuthProvider>
              <TopNav />
              <main className="flex-grow flex flex-col pb-16 md:pb-0">
                {children}
              </main>
              <Footer />
              <MobileNav />
            </AuthProvider>
          </ToastProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
