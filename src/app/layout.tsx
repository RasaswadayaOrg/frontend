import type { Metadata } from "next";
import { Inter, Outfit, IBM_Plex_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

// 1. Configure Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const ibmPlex = IBM_Plex_Sans({ 
  weight: ['300', '400', '500', '600'],
  subsets: ["latin"], 
  variable: "--font-ibm-plex" 
});
const abhayaLibre = Playfair_Display({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["latin"],
  variable: "--font-abhaya"
});

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SiteLayout } from "../components/SiteLayout";
import { FloatingCartButton } from "../components/FloatingCartButton";
import { ThemeProvider } from "next-themes";
import AuthModal from "../components/AuthModal";
import { AuthGate } from "../components/AuthGate";

const SITE_URL = "https://rasaswadaya.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rasaswadaya | Arts & Culture Hub",
    template: "%s | Rasaswadaya",
  },
  description:
    "Sri Lanka's premier cultural platform. Discover music, dance, theatre, visual arts, and creative makers. Book events, follow artists, shop local.",
  keywords: ["Sri Lanka", "arts", "culture", "events", "music", "dance", "theatre", "artists"],
  authors: [{ name: "Rasaswadaya", url: SITE_URL }],
  creator: "Rasaswadaya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Rasaswadaya",
    title: "Rasaswadaya — Sri Lanka's Home for Arts & Culture",
    description:
      "Discover music, dance, theatre, visual arts and craft from Sri Lanka. Book events, follow artists, shop from local makers.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rasaswadaya — Sri Lanka's Home for Arts & Culture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasaswadaya — Sri Lanka's Home for Arts & Culture",
    description:
      "Discover music, dance, theatre, visual arts and craft from Sri Lanka.",
    images: ["/twitter-image"],
    creator: "@rasaswadaya",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${ibmPlex.variable} ${abhayaLibre.variable} font-sans bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <SiteLayout>
                <AuthGate>{children}</AuthGate>
              </SiteLayout>
              <FloatingCartButton />
              <AuthModal />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}