/* ===================================================
   App — root router, layout wrapper
=================================================== */
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import Navbar         from './components/Navbar'
import Footer         from './components/Footer'
import Landing        from './pages/Landing'
import About          from './pages/About'
import Contact        from './pages/Contact'
import Menu           from './pages/Menu'
import MealPrep       from './pages/MealPrep/index'
import UnderConstruction from './pages/UnderConstruction'
import DashboardLayout from './pages/Dashboard/index'
import Account         from './pages/Account'
import PrivacyPolicy   from './pages/PrivacyPolicy'
import TermsOfService  from './pages/TermsOfService'
import EULA            from './pages/EULA'
import DMCA            from './pages/DMCA'
import { AuthProvider } from './contexts/AuthContext'
import { useMealPrepSetting } from './hooks/useMealPrepSetting'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function MealPrepRoute() {
  const { mealPrepEnabled } = useMealPrepSetting()

  return mealPrepEnabled ? <MealPrep /> : <UnderConstruction />
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
          <Route path="/menu"         element={<Menu />} />
          <Route path="/meal-prep"    element={<MealPrepRoute />} />
          <Route path="/under-construction" element={<UnderConstruction />} />
          <Route path="/account"      element={<Account />} />
          <Route path="/privacy"      element={<PrivacyPolicy />} />
          <Route path="/terms"        element={<TermsOfService />} />
          <Route path="/eula"         element={<EULA />} />
          <Route path="/dmca"         element={<DMCA />} />
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
