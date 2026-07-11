import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { accent } from "@/content/brand.config";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

// Display face — Clash Display (Fontshare), self-hosted as a single variable
// font file. Big, confident, geometric — see globals.css for how it's wired
// onto the `font-serif` utility.
const clashDisplay = localFont({
  src: "./fonts/ClashDisplay-Variable.woff2",
  variable: "--font-clash-display",
  weight: "200 700",
  display: "swap",
});

// Body/UI face — General Sans (Fontshare), self-hosted as a single variable
// font file.
const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "200 700",
  display: "swap",
});

// Eyebrows, labels, and stat units — a mono face, uppercase, gold.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "nonprofit marketing",
    "community organization branding",
    "content calendar",
    "Instagram insights",
    "local business marketing",
  ],
  openGraph: {
    type: "website",
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
    siteName: site.name,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.positioning,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: site.name,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  // Keep in sync with --color-paper in globals.css — Next's metadata API
  // needs a literal string here, it can't read the CSS token.
  themeColor: "#0B0B0C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${clashDisplay.variable} ${generalSans.variable} ${jetbrainsMono.variable} h-full`}
      style={
        {
          // Mirrors brand.config.ts's accent onto the tokens declared in
          // globals.css — inline style wins the cascade, so this is the
          // actual runtime source of truth for the accent color. Edit
          // brand.config.ts, not this file, to rebrand.
          "--color-forest": accent.base,
          "--color-forest-300": accent.hover,
          "--color-gold": accent.base,
          "--color-gold-soft": accent.hover,
          "--color-gold-text": accent.base,
        } as React.CSSProperties
      }
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
