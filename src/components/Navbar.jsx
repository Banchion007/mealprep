/* ===================================================
   Navbar — sticky top navigation with mobile menu
=================================================== */
import React, { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

function UserMenu({ user, isAdmin, signOut }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const close = () => setOpen(false)
  const displayName = user.user_metadata?.full_name || user.email || ''
  const initial = displayName[0].toUpperCase()

  return (
    <div className="navbar__user-menu-wrap" ref={ref}>
      <button
        className="navbar__user-avatar"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Account menu"
      >
        {initial}
      </button>

      {open && (
        <div className="navbar__user-dropdown">
          <div className="navbar__user-dropdown__header">
            <p className="navbar__user-dropdown__name">{displayName}</p>
            <p className="navbar__user-dropdown__email">{user.email}</p>
          </div>
          <div className="navbar__user-dropdown__divider" />
          <Link to="/account" className="navbar__user-dropdown__item" onClick={close}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Account
          </Link>
          {isAdmin && (
            <Link to="/dashboard" className="navbar__user-dropdown__item" onClick={close}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Admin Dashboard
            </Link>
          )}
          <div className="navbar__user-dropdown__divider" />
          <button className="navbar__user-dropdown__item navbar__user-dropdown__item--danger" onClick={signOut}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/meal-prep', label: 'Meal Prep' },
  { to: '/about',     label: 'About' },
  { to: '/contact',   label: 'Contact' },
]

const MENU_PDF_URL = '/HumbleChefMenu.pdf'

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
          <Link
            to="/menu"
            className="menu-dropdown__item"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>
            </svg>
            Browse Menu
          </Link>
          <a
            href={MENU_PDF_URL}
            download
            className="menu-dropdown__item"
            onClick={() => setOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 16V4M6 10l6 6 6-6"/><path d="M4 20h16"/>
            </svg>
            Download PDF
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
  const { user, isAdmin, signOut, setShowAuthModal } = useAuth()
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
          <Link
            to="/dashboard"
            className="btn btn-outline btn-sm navbar__cta"
            style={isAdmin ? undefined : { visibility: 'hidden', pointerEvents: 'none' }}
            tabIndex={isAdmin ? undefined : -1}
          >
            Dashboard
          </Link>
          {user ? (
            <UserMenu user={user} isAdmin={isAdmin} signOut={signOut} />
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => setShowAuthModal(true)}>
              Sign In
            </button>
          )}
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
        <Link to="/menu" className="navbar__mobile-link">
          Browse Menu
        </Link>
        <a href={MENU_PDF_URL} download className="navbar__mobile-link">
          Download Menu PDF
        </a>
        {user && (
          <Link to="/account" className="navbar__mobile-link">
            My Account
          </Link>
        )}
        <Link to="/meal-prep" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
          Order Meals
        </Link>
        {isAdmin && (
          <Link to="/dashboard" className="btn btn-outline" style={{ marginTop: '0.5rem' }}>
            Dashboard
          </Link>
        )}
      </div>
    </header>
  )
}
