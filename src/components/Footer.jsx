/* ===================================================
   Footer — links, social, contact info
=================================================== */
import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const FACEBOOK_URL = 'https://www.facebook.com/thehumblechefbj/'

export default function Footer() {
  const handleOpenMenu = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const trigger = document.querySelector('.menu-dropdown__trigger');
    if (trigger) {
      trigger.click();
    }
  };

  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <img src="/hc-logo-footer.png" alt="Humble Chef" className="footer__logo-img" />
          </Link>
          <p className="footer__tagline">
            Fresh, custom, and delivered with love. Catering for every occasion and weekly meal prep for every lifestyle.
          </p>
          <a
            href={FACEBOOK_URL}
            className="footer__social-bar"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
            <span>Follow us on Facebook</span>
          </a>
        </div>

        {/* Links */}
        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <nav className="footer__nav">
            <Link to="/">Home</Link>
            <a href="#menu" onClick={handleOpenMenu}>Our Menu</a>
            <Link to="/meal-prep">Meal Prep</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>

        {/* Services */}
        <div className="footer__col">
          <h4 className="footer__col-title">Services</h4>
          <nav className="footer__nav">
            <a href="#">Corporate Catering</a>
            <a href="#">Wedding Catering</a>
            <a href="#">Weekly Meal Prep</a>
            <a href="#">Private Events</a>
            <a href="#">Drop-Off Catering</a>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer__col">
          <h4 className="footer__col-title">Contact</h4>
          <address className="footer__contact">
            <span>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              3803 Ward Neal Rd, Bells, TX 75414
            </span>
            <span>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              (903) 484-4470
            </span>
            <span>
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              humblechefbrian@gmail.com
            </span>
          </address>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>&copy; {new Date().getFullYear()} Humble Chef. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
