import type { Metadata } from "next";
import { Inter, Outfit, IBM_Plex_Sans, Abhaya_Libre } from "next/font/google";
import "./globals.css";

// 1. Configure Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const ibmPlex = IBM_Plex_Sans({ 
  weight: ['300', '400', '500', '600'],
  subsets: ["latin"], 
  variable: "--font-ibm-plex" 
});
const abhayaLibre = Abhaya_Libre({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ["sinhala", "latin"],
  variable: "--font-abhaya"
});

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { FloatingChatBot } from "../components/FloatingChatBot";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "../components/AuthModal";

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
    <html lang="en" className="light">
      <body className={`${inter.variable} ${outfit.variable} ${ibmPlex.variable} ${abhayaLibre.variable} font-sans bg-slate-50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400`}>
        
        <AuthProvider>
          <Header />

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 min-h-screen">
            {children}
          </main>

          <Footer />
          <FloatingChatBot />
          <AuthModal />
        </AuthProvider>

      </body>
    </html>
  );
}