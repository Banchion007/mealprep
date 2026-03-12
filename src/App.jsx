/* ===================================================
   App — root router, layout wrapper
=================================================== */
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Landing from './pages/Landing'
import About   from './pages/About'
import Contact from './pages/Contact'
import MealPrep from './pages/MealPrep/index'

/* Scroll to top on route change */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [pathname])
  return null
}

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"          element={<Landing />} />
<Route path="/about"     element={<About />} />
          <Route path="/contact"   element={<Contact />} />
          <Route path="/meal-prep" element={<MealPrep />} />
          {/* Catch-all → home */}
          <Route path="*" element={<Landing />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}
