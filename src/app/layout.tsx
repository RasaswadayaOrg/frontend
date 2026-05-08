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

export const metadata: Metadata = {
  title: "Rasaswadaya | Arts & Culture Hub",
  description: "Discover Sri Lankan events and artists.",
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
                {children}
              </SiteLayout>
              <FloatingCartButton />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}