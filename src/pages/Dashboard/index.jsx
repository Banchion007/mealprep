/* ===================================================
   Dashboard Layout — wraps all admin pages
=================================================== */
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import Overview     from './Overview'
import Orders       from './Orders'
import Customers    from './Customers'
import Recipes      from './Recipes'
import GroceryList  from './GroceryList'
import WeeklyMenuBuilder from './WeeklyMenuBuilder'
import { seedMockData } from './mockData'
import { useAuth } from '../../contexts/AuthContext'
import './Dashboard.css'

/* ── Admin allowlist (set VITE_ADMIN_EMAILS in .env.local) ── */
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS || '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
const isAdmin = (user) => user && ADMIN_EMAILS.includes(user.email?.toLowerCase())

export default function DashboardLayout() {
  const { user, loading } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  // All hooks must be called before any early returns (Rules of Hooks)
  useEffect(() => { seedMockData() }, [])

  // Auth guard — wait for session, then check admin status
  if (loading) {
    return (
      <div className="dash-auth-loading">
        <span className="dash-auth-spinner" />
      </div>
    )
  }
  if (!user || !isAdmin(user)) return <Navigate to="/" replace />

  const closeSidebar = () => setMobileOpen(false)

  return (
    <div className="dash-layout">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: 'fixed', inset: 0, background: 'oklch(0.1 0.05 280 / 0.45)',
            zIndex: 399,
          }}
        />
      )}

      <DashboardSidebar mobileOpen={mobileOpen} onClose={closeSidebar} />

      <div className="dash-main">
        <Routes>
          <Route index           element={<Overview />} />
          <Route path="orders"       element={<Orders />} />
          <Route path="customers"    element={<Customers />} />
          <Route path="recipes"      element={<Recipes />} />
          <Route path="grocery-list" element={<GroceryList />} />
          <Route path="weekly-menu" element={<WeeklyMenuBuilder />} />
          <Route path="*"            element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>

      {/* Mobile hamburger FAB */}
      <button
        className="dash-mobile-toggle"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? '✕' : '☰'}
      </button>
    </div>
  )
}
