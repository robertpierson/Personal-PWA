import type { Metadata, Viewport } from "next";
import { Public_Sans, Zilla_Slab, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

// Body face — the U.S. Web Design System's typeface for government digital
// services. On-theme for a civic/local/trustworthy brand, legible, and not
// a common AI-site default.
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display face — a slab serif built for Mozilla's civic-tech work. Reads as
// "record/form," not "boutique editorial magazine."
const zillaSlab = Zilla_Slab({
  variable: "--font-zilla-slab",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

// Reserved for numbers that are claims — prices, stats — so they read as
// measured figures, not decorative type.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
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
    statusBarStyle: "default",
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
  // Keep in sync with --color-forest in globals.css — Next's metadata API
  // needs a literal string here, it can't read the CSS token.
  themeColor: "#2451d6",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${publicSans.variable} ${zillaSlab.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
