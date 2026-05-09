import Link from "next/link";

// Full site footer used across all HP2-redesigned pages.
export function HP2Footer() {
  return (
    <footer className="hp2-footer">
      <div className="hp2-container">
        <div className="hp2-footer__top">
          <div>
            <div className="hp2-footer__brand-mark">
              <span className="hp2-footer__brand-inner" />
            </div>
            <p className="hp2-footer__brand-name">Rasaswadaya</p>
            <p className="hp2-footer__tagline">
              Sri Lanka&apos;s home for music, dance, theatre, visual arts and craft.
              Discover, support, celebrate.
            </p>
            <div className="hp2-footer__social">
              <Link href="https://instagram.com" className="hp2-footer__social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">Ig</Link>
              <Link href="https://facebook.com"  className="hp2-footer__social-link" aria-label="Facebook"  target="_blank" rel="noopener noreferrer">Fb</Link>
              <Link href="https://youtube.com"   className="hp2-footer__social-link" aria-label="YouTube"   target="_blank" rel="noopener noreferrer">Yt</Link>
              <Link href="https://twitter.com"   className="hp2-footer__social-link" aria-label="X / Twitter" target="_blank" rel="noopener noreferrer">X</Link>
            </div>
          </div>

          <div>
            <p className="hp2-footer__col-title">Discover</p>
            <ul className="hp2-footer__links">
              <li><Link href="/events"                  className="hp2-footer__link">All Events</Link></li>
              <li><Link href="/events?category=music"   className="hp2-footer__link">Music</Link></li>
              <li><Link href="/events?category=dance"   className="hp2-footer__link">Dance</Link></li>
              <li><Link href="/events?category=drama"   className="hp2-footer__link">Drama</Link></li>
              <li><Link href="/artists"                 className="hp2-footer__link">Artists</Link></li>
              <li><Link href="/academies"               className="hp2-footer__link">Academies</Link></li>
            </ul>
          </div>

          <div>
            <p className="hp2-footer__col-title">Platform</p>
            <ul className="hp2-footer__links">
              <li><Link href="/marketplace"             className="hp2-footer__link">Marketplace</Link></li>
              <li><Link href="/profile"                 className="hp2-footer__link">My Profile</Link></li>
              <li><Link href="/auth?tab=signup"         className="hp2-footer__link">Create Account</Link></li>
              <li><Link href="/auth?tab=login"          className="hp2-footer__link">Sign In</Link></li>
              <li><Link href="/dashboard"               className="hp2-footer__link">Artist Dashboard</Link></li>
              <li><Link href="/admin"                   className="hp2-footer__link">Admin</Link></li>
            </ul>
          </div>

          <div>
            <p className="hp2-footer__col-title">Company</p>
            <ul className="hp2-footer__links">
              <li><Link href="/about"                   className="hp2-footer__link">About Us</Link></li>
              <li><Link href="/about#mission"           className="hp2-footer__link">Our Mission</Link></li>
              <li><Link href="/about#team"              className="hp2-footer__link">The Team</Link></li>
              <li><Link href="/contact"                 className="hp2-footer__link">Contact</Link></li>
              <li><Link href="/blog"                    className="hp2-footer__link">Blog</Link></li>
              <li><Link href="/press"                   className="hp2-footer__link">Press Kit</Link></li>
            </ul>
          </div>
        </div>

        <div className="hp2-footer__bottom">
          <p className="hp2-footer__legal">
            &copy; {new Date().getFullYear()} Rasaswadaya. All rights reserved.
          </p>
          <p className="hp2-footer__legal">
            <Link href="/privacy">Privacy Policy</Link>
            {" · "}
            <Link href="/terms">Terms of Use</Link>
            {" · "}
            <Link href="/cookies">Cookie Settings</Link>
          </p>
          <p className="hp2-footer__locale">🇱🇰 Sri Lanka · English</p>
        </div>
      </div>
    </footer>
  );
}
