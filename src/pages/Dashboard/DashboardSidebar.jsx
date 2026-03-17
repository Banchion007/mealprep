/* ===================================================
   DashboardSidebar — left navigation for admin
=================================================== */
import React from 'react'
import { NavLink } from 'react-router-dom'
import { resetMockData } from './mockData'

const NAV = [
  {
    to: '/dashboard',
    label: 'Overview',
    end: true,
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/orders',
    label: 'Orders',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/><line x1="9" y1="12" x2="15" y2="12"/>
        <line x1="9" y1="16" x2="13" y2="16"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/customers',
    label: 'Customers',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/recipes',
    label: 'Recipe Library',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/weekly-menu',
    label: 'Weekly Menu',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
  },
  {
    to: '/dashboard/grocery-list',
    label: 'Grocery List',
    icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
    ),
  },
]

export default function DashboardSidebar({ mobileOpen, onClose }) {
  const handleReset = () => {
    if (window.confirm('Reset all demo data? This will regenerate orders, subscribers, and recipes.')) {
      resetMockData()
      window.location.reload()
    }
  }

  return (
    <aside className={`dash-sidebar${mobileOpen ? ' dash-sidebar--open' : ''}`}>
      {/* Logo */}
      <div className="dash-sidebar__logo">
        <img src="/hc-logo-long.png" alt="Humble Chef" className="dash-sidebar__logo-img" />
      </div>

      <p className="dash-sidebar__label">Admin Panel</p>

      {/* Nav links */}
      <nav className="dash-sidebar__nav">
        {NAV.map(({ to, label, end, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `dash-sidebar__link${isActive ? ' dash-sidebar__link--active' : ''}`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="dash-sidebar__footer">
        <NavLink
          to="/"
          className="dash-sidebar__link"
          style={{ fontSize: '0.8rem' }}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Site
        </NavLink>
        <button className="dash-sidebar__reset-btn" onClick={handleReset}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.43"/>
          </svg>
          Reset Demo Data
        </button>
      </div>
    </aside>
  )
}
