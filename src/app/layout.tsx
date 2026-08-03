import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Premium False Ceiling, PVC & WPC Panels, Interior Materials`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "false ceiling materials",
    "PVC ceiling panels",
    "WPC wall panels",
    "gypsum boards",
    "ceiling channels",
    "PVC louvers",
    "3D wall panels",
    "interior decorative materials",
    "ceiling hardware",
    "Paras Enterprises",
    "false ceiling price India",
  ],
  applicationName: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} — Premium Ceiling & Interior Materials`,
    description: SITE.description,
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Premium Ceiling & Interior Materials`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0e12" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${display.variable} ${inter.variable} antialiased`}>
        <Providers>
          <JsonLd data={organizationJsonLd()} />
          <SiteChrome>{children}</SiteChrome>
        </Providers>
      </body>
    </html>
  );
}
