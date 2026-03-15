/* ===================================================
   App — root router, layout wrapper
=================================================== */
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar         from './components/Navbar'
import Footer         from './components/Footer'
import Landing        from './pages/Landing'
import About          from './pages/About'
import Contact        from './pages/Contact'
import MealPrep       from './pages/MealPrep/index'
import DashboardLayout from './pages/Dashboard/index'
import { AuthProvider } from './contexts/AuthContext'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function Layout() {
  const { pathname } = useLocation()
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <>
      <ScrollToTop />
      {!isDashboard && <Navbar />}
      <main style={isDashboard ? { minHeight: '100vh' } : undefined}>
        <Routes>
          <Route path="/"             element={<Landing />} />
          <Route path="/about"        element={<About />} />
          <Route path="/contact"      element={<Contact />} />
          <Route path="/meal-prep"    element={<MealPrep />} />
          <Route path="/dashboard/*"  element={<DashboardLayout />} />
          {/* Catch-all → home */}
          <Route path="*"             element={<Landing />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  )
}
