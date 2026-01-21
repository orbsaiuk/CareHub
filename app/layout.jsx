import { Tajawal } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import "./globals.css";
import { SanityLive } from "@/sanity/lib/live";
import { Toaster } from "@/components/ui/sonner";
import {
  generateWebsiteSchema,
  generateMainOrganizationSchema,
  generateSiteNavigationSchema,
} from "@/components/StructuredData";
import customArabic from "@/lib/clerkLocalization";
import ClarityProvider from "@/components/ClarityProvider";
import { BackToTopButton } from "@/components/layout/BackToTopButton";

import CookieConsent from "@/components/CookieConsent";

const tajawal = Tajawal({
  subsets: ["latin", "arabic"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CareHub — منصة الرعاية الصحية | احجز موعدك مع أفضل الأطباء",
    template: "%s | CareHub",
  },
  description:
    "منصة صحية متكاملة تجمع أفضل الأطباء والمستشفيات في المملكة. ابحث عن طبيبك المناسب، احجز موعدك بسهولة، واحصل على رعاية صحية متميزة.",
  authors: [{ name: "CareHub Team" }],
  creator: "CareHub",
  publisher: "CareHub",
  applicationName: "CareHub",
  category: "Healthcare",
  classification: "Healthcare Platform",
  alternates: {
    canonical: siteUrl,
    languages: {
      ar: "/",
      "x-default": "/",
    },
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "CareHub — منصة الرعاية الصحية",
    title: "CareHub — منصة الرعاية الصحية | احجز موعدك مع أفضل الأطباء",
    description:
      "منصة صحية متكاملة تجمع أفضل الأطباء والمستشفيات في المملكة. ابحث عن طبيبك المناسب، احجز موعدك بسهولة، واحصل على رعاية صحية متميزة.",
    locale: "ar",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  };
}

export default async function RootLayout({ children }) {
  const websiteSchema = generateWebsiteSchema();
  const organizationSchema = generateMainOrganizationSchema();
  const navSchema = generateSiteNavigationSchema(siteUrl);

  return (
    <ClerkProvider
      appearance={{
        layout: { unsafe_disableAnimations: false },
        variables: { colorPrimary: "#0ea5e9" },
      }}
      localization={customArabic}
    >
      <html lang="ar" dir="rtl">
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(organizationSchema),
            }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(navSchema),
            }}
          />
          <link rel="preconnect" href="https://cdn.sanity.io" />
          <link rel="dns-prefetch" href="https://images.unsplash.com" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        </head>
        <body
          className={`antialiased font-sans ${tajawal.variable}`}
        >
          <BackToTopButton />
          {children}
          <SanityLive />
          {(await draftMode()).isEnabled && <VisualEditing />}
          <div id="clerk-captcha" data-cl-size="flexible" />
          <Toaster richColors position="top-center" />
          <ClarityProvider />
          <CookieConsent />
        </body>
      </html>
    </ClerkProvider>
  );
}
