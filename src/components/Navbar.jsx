/* ===================================================
   Navbar — sticky top navigation with mobile menu
=================================================== */
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/meal-prep', label: 'Meal Prep' },
  { to: '/about',     label: 'About' },
  { to: '/contact',   label: 'Contact' },
]

/* PDF served from the backend — just replace /menu.pdf when you update */
const MENU_PDF_URL = '/menu.pdf'

function MenuDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="menu-dropdown" ref={ref}>
      <button
        className="navbar__link menu-dropdown__trigger"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Menu
        <svg className={`menu-dropdown__caret${open ? ' open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <div className="menu-dropdown__panel">
          <a
            href={MENU_PDF_URL}
            download
            className="menu-dropdown__item"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M6 10l6 6 6-6"/><path d="M4 20h16"/>
            </svg>
            Download Menu PDF
          </a>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  // Add shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <img src="/hc-logo-long.png" alt="Humble Chef" className="navbar__logo-img" />
        </Link>

        {/* Desktop nav */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `navbar__link${isActive ? ' navbar__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
          <MenuDropdown />
        </nav>

        {/* CTA */}
        <div className="navbar__actions">
          <Link to="/meal-prep" className="btn btn-primary btn-sm navbar__cta">
            Order Meals
          </Link>
          {/* Hamburger */}
          <button
            className={`navbar__burger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__mobile${menuOpen ? ' navbar__mobile--open' : ''}`}>
        {NAV_LINKS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
            }
          >
            {label}
          </NavLink>
        ))}
        <a href={MENU_PDF_URL} download className="navbar__mobile-link">
          Menu (Download PDF)
        </a>
        <Link to="/meal-prep" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Order Meals
        </Link>
      </div>
    </header>
  )
}
