import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-brand-100/80 py-12 border-t border-brand-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Rasaswadaya"
                width={192}
                height={108}
                className="h-14 w-auto"
                unoptimized
              />
              <span className="text-white font-bold text-2xl font-sinhala">රසාස්වාදය</span>
            </Link>
            <p className="text-sm leading-relaxed">
              The premier cultural hub for Sri Lankan arts, events, and creative marketplace. Discover the rhythm of the island.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-white transition-colors">Events</Link></li>
              <li><Link href="/artists" className="hover:text-white transition-colors">Artists</Link></li>
              <li><Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">For Creators</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth?tab=signup&type=artist" className="hover:text-white transition-colors">Become an Artist</Link></li>
              <li><Link href="/auth?tab=signup&type=seller" className="hover:text-white transition-colors">List your Store</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Creator Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">Stay updated with the latest cultural events.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-brand-900/50 text-white placeholder:text-brand-300/50 border border-brand-800 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <button className="bg-brand-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-brand-500 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-brand-200/60">© 2025 <span className="font-sinhala">රසාස්වාදය</span>. All rights reserved.</p>
          <div className="flex gap-1 text-brand-200/80">
            <a href="#" aria-label="Facebook" className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-900/60 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-900/60 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" aria-label="Instagram" className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-900/60 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="YouTube" className="inline-flex items-center justify-center w-11 h-11 rounded-full hover:bg-brand-900/60 hover:text-white transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
